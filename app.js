/*
 * FINISHED: Call a contact, call voicemail, delete a contact, change status of the user, change status of the user, add a contact, change user name, start a three-way phone-call, mute the phone, View call history with a contact, redial a number 
 * TODO: Change the clock
 */

$(function() {

	var contacts = [
			{
				"name": "Elise Van Wie",
				"status": "available",
				"number": "123-456-7890",
				"contactID": 1
			},
			{
				"name":"Angela Niu",
				"status":"unavailable",
				"number":"123-444-5555",
				"contactID": 2
			},
			{
				"name":"Andres Hernandez",
				"status":"available",
				"number":"123-456-7890",
				"contactID": 3
			},
			{
				"name":"Morgan Freeman",
				"status":"available",
				"number":"123-456-7890",
				"contactID": 4
			},
			{
				"name":"Oli Sykes",
				"status":"available",
				"number":"123-456-7890",
				"contactID": 5
			},
			{
				"name":"Laura Turanchik",
				"status":"available",
				"number":"123-456-7890",
				"contactID": 6
			},
			{
				"name":"Daniel Rutledge",
				"status":"available",
				"number":"123-456-7890",
				"contactID": 7
			},
			{
				"name":"Kaitlyn Irvine",
				"status":"available",
				"number":"123-456-7890",
				"contactID": 8
			},
			{
				"name":"Dina-Marie Kolman",
				"status":"available",
				"number":"123-456-7890",
				"contactID": 9
			},
			{
				"name":"Daniel Esneul",
				"status":"available",
				"number":"123-456-7890",
				"contactID": 10
			},
			{
				"name":"Nicholas Bianco",
				"status":"available",
				"number":"123-456-7890",
				"contactID": 11
			},
			{
				"name":"Karl 'Max' Wallace",
				"status":"available",
				"number":"123-456-7890",
				"contactID": 12
			}
		],
		callHistory = [
				{
					"callers": [1,2],
					"date": "Friday, January 10th, 2014",
					"time": "6:15 PM",
					"type": "Incoming",
					"duration": "0:53:20"
				},
				{
					"callers": [3,4,5],
					"date":"Thursday, January 9th, 2014",
					"time":"6:15 PM",
					"type":"Outgoing",
					"duration":"0:53:20"
				},
				{
					"callers": [5,6],
					"date":"Monday, January 6th, 2014",
					"time":"6:15 PM",
					"type":"Incoming",
					"duration":"0:53:20"
				},
				{
					"callers": [10],
					"date":"Sunday, January 5th, 2014",
					"time":"6:15 PM",
					"type":"Outgoing",
					"duration":"0:53:20"
				},
				{
					"callers": [12],
					"date":"Friday, January 3rd, 2014",
					"time":"6:15 PM",
					"type":"Incoming",
					"duration":"0:53:20"
				},
				{
					"callers": [1, 4],
					"date":"Wednesday, January 1st, 2014",
					"time":"6:15 PM",
					"type":"Outgoing",
					"duration":"0:53:20"
				}
			],
			inCall = false,
			currentCall = null,
			selection = null,
			app;

	var Contact = Backbone.Model.extend({
		defaults: {
			status: "available",
			callHistory: []
		}
	});

	var Call = Backbone.Model.extend({ });
	var User = Backbone.Model.extend({
		defaults: {
			name: "No Name",
			status: "unavailable",
			voicemails: 3
		}
	});

	var ContactCollection = Backbone.Collection.extend({
		model: Contact
	});

	var CallCollection = Backbone.Collection.extend({
		model: Call
	});

	var ContactView = Backbone.View.extend({
		className: "contact-row",
		template: $("#contactTemplate").html(),
		events: {
			"click .view-contact-history" : "viewContactHistory",
			"click .call-contact" : "callContact",
			"click" : "activate"
		},
		render: function() {
			var tmpl = _.template(this.template);
			this.$el.html(tmpl(this.model.toJSON()));
			return this;
		},
		viewContactHistory: function() {
			var $history = this.$('.contact-history'),
				height;

			this.getContactHistory();

			if ($history.hasClass('open')) {
				$history.animate({"height":"0px"}, 500, function() {
					$(this).removeClass('open');
				});
			} else {
				$open = $('.contact-history.open');
				if ($open.length > 0) {
					$open.animate({"height":"0px"}, 500, function() {
						$(this).removeClass('open');
					});
				}
				height = $history.css('height','auto').css('height');
				$history.css('height','0px');
				$history.animate({'height':height}, 500, function() {
					$(this).addClass('open');
				});
			}
		},
		getContactHistory: function() {
			var contactID = this.model.attributes.contactID,
				history = _.filter(callHistory, function(call) {
					return call.callers.indexOf(contactID) >= 0;
				}),
				$historyContainer = this.$('.contact-history');
				
				if (history.length) {
					$historyContainer.html("");
				} else {
					$historyContainer.html("<div class='contact-history-entry'>No call history with " + this.model.attributes.name + "</div>");
				}
				

			for (var i=0; i<history.length; i++) {
				$historyContainer.append(_.template($('#contactCallTemplate').html())(history[i]));
			}
		},
		callContact: function() {
			var $callArea = $('#call-status'),
				contactID = this.model.attributes.contactID;
			if (inCall && !confirm("You are about to end your current call.")) {
				return;
			}

			if ($callArea.hasClass("no-calls")) { $callArea.removeClass("no-calls"); }

			$callArea.addClass('active');
			$callArea.children('.caller-id').html('<small>On the phone with</small><br>' + this.model.attributes.name);
			inCall = true;
			currentCall = new Call({
				callers: contactID
			});
		},
		activate: function() {
			$('.contact-row.active').removeClass('active');
			this.$el.addClass('active');
			selection = this;
		}
	});

	var CallView = Backbone.View.extend({
		template: $("#callTemplate").html(),
		events: {
			'click .redial' : 'redial'
		},
		render: function() {
			var tmpl = _.template(this.template),
				callers = this.model.attributes.callers;
			this.model.attributes.callerNames = [];
			for (var i=0; i<callers.length; i++) {
				if (app) {
					this.model.attributes.callerNames.push(_.find(app.contactPage.collection.models, function(contact) {
						return contact.attributes.contactID === callers[i];
					}).attributes.name);
				}
			}
			this.$el.html(tmpl(this.model.toJSON()));
			return this;
		},
		redial: function() {
			var that = this,
				caller = _.find(app.contactPage.collection.models, function(contact) {
					return contact.attributes.contactID === that.model.attributes.callers[0];
				});

			// Start the call
			new ContactView({
				model: caller
			}).callContact();

			// Add any additional contacts that were a part of the call
			if (this.model.attributes.callers.length > 1) {

			}
			currentCall = this;
			inCall = true;
		}
	});

	var ContactCollectionView = Backbone.View.extend({
		el: $('#info-table'),

		initialize: function() {
			this.collection = new ContactCollection(contacts);
			this.render();
		},

		render: function() {
			var that = this;
			this.$el.html("");
			_.each(this.collection.models, function(contact){
				that.renderContact(contact);
			}, this);

			$('.actions').html("<a class='action add'><i class='fa fa-plus'></i> add</a><a class='action delete'><i class='fa fa-minus'></i> delete</a>");
		
			$('.action.add').click(function() {
				$("#create-contact").animate({"top":"32px"}, 500);
			});
			$('#create-contact .fa-times-circle').click(function() {
				$("#create-contact").animate({"top":"-168px"}, 500);
			});
		},

		renderContact: function(contact) {
			var contactView = new ContactView({
				model: contact
			});
			this.$el.append(contactView.render().el);
		}
	});

	var CallCollectionView = Backbone.View.extend({
		el: $('#info-table'),

		initialize: function() {
			this.collection = new CallCollection(callHistory);
			this.render();
		},

		render: function() {
			var that = this;
			this.$el.html("");
			_.each(this.collection.models, function(call) {
				that.renderCall(call);
			});

			$('.actions').html("<a class='action remove'><i class='fa fa-minus'></i> remove</a>");
		},

		renderCall: function(call) {
			var callView = new CallView({
				model: call
			});
			this.$el.append(callView.render().el);
		}
	});

	var PageView = Backbone.View.extend({
		el: $('body'),
		events: {
			"click .tab" : "changePage",
			"click #end-call" : "endCall",
			"click #user-name" : "editUserProfile",
			"click #user-status" : "changeStatus",
			"click #voicemails" : "callVoicemail",
			"click .action.delete" : "deleteContact",
			"click #create-contact button" : "addContact",
			"click .fa-volume-off" : "mute",
			"click .fa-volume-up" : "volumeControl",
			"click .fa-volume-down" : "volumeControl",
			"click #three-way" : "addCallerToCall",
			"click #clock" : "setClock",
			"click #redial" : "redialLastCall"
		},
		initialize: function() {
			this.model = new User();
			this.callHistoryPage = new CallCollectionView();
			this.contactPage = new ContactCollectionView();
			this.clock = new ClockView();

			this.renderName();
			this.renderStatus();
			this.renderVoicemails();
		},
		changePage: function(e) {
			var $this = $(e.target),
				page = $this.data('page');
			if ($this.hasClass('active')) {
				return;
			}

			if (page === "contacts") {
				this.contactPage.render();
			} else {
				this.callHistoryPage.render();
			}

			$('.tab.active').removeClass('active');
			$this.addClass('active');
		},
		endCall: function() {
			var $call = $("#call-status");
			$call.removeClass("active");
			$call.children('.caller-id').children('small').html("Last call with");
			inCall = false;
		},
		editUserProfile: function() {
			var name = prompt("Enter a new user name.");
			if (name) {
				this.model.attributes.name = name;
				this.renderName();
			}	
		},
		renderName: function() {
			$('#user-name').html(this.model.attributes.name);
		},
		changeStatus: function(e) {
			var $target = $('#status-menu');
			if ($target.hasClass('active')) {
				$target.removeClass('active');
			} else {
				$target.addClass('active');
			}

			if (e.target.tagName === "LI") {
				this.model.attributes.status = $(e.target).html();
				this.renderStatus();
			}
		},
		renderStatus: function() {
			$('#user-status').children('span').html(this.model.attributes.status);
		},
		callVoicemail: function() {
			var $callArea = $('#call-status');
			if (inCall && !confirm("You are about to end your current call.")) {
				return;
			}

			$callArea.addClass('active');
			$callArea.children('.caller-id').html('<small>On the phone with</small><br>Voicemail');
			this.model.attributes.voicemails = 0;
			this.renderVoicemails();
			inCall = true;
		},
		renderVoicemails: function() {
			$('#voicemails').children('span').html(this.model.attributes.voicemails);
		},
		deleteContact: function() {
			if (selection && confirm("Warning: you are about to delete " + selection.model.attributes.name + " from you contact list. Proceed?")) {
				selection.$el.animate({"height":"0px"}, 500, function() {
					selection.model.destroy();
					selection.remove();
					selection = null;
				});
			} else if (!selection) {
				alert("Please select a contact to delete.");
			}
		},
		addContact: function(e) {
			e.preventDefault();

			var formData = {};
			$("#create-contact").children("input").each(function (i, el) {
				if ($(el).val() !== "") {
					formData[$(el).data('prop')] = $(el).val();
				} else {
					alert("Please enter the contact " + $(el).data('prop'));
					return false;
				}
			});
			$("#create-contact").find("input").val("");
			this.contactPage.collection.add(new Contact(formData));
			this.contactPage.render();
		},
		mute: function() {
			var $volumeIcons = $("#volume-actions");
			if ($volumeIcons.hasClass("muted")) {
				$volumeIcons.removeClass("muted");
			} else {
				$volumeIcons.addClass("muted");
			}
		},
		addCallerToCall: function() {
			var $callArea = $('#call-status');
			if (!selection) {
				alert("Please select a contact to add to the call");
				return;
			}

			$callArea.children('.caller-id').append(", " + selection.model.attributes.name);
		},
		volumeControl: function() {
			var $volumeIcons = $("#volume-actions");
			if ($volumeIcons.hasClass("muted")) {
				$volumeIcons.removeClass("muted");
			}
		},
		renderCallTime: function() {
			var startTime = new Date(currentCall.time).getTime(),
				timeNow = $.now(),
				seconds = timeNow - startTime,
				hours = Math.floor(seconds/3600),
				minutes, timeString;

				seconds -= hours*3600;
				minutes = seconds/60;
				seconds -= minutes*60;

				timeString = hours + ":" + minutes + ":" + seconds;

				$("#current-call-time").html(timeString);
				setTimeout(this.renderCallTime, 1000);
		},
		redialLastCall: function() {
			var caller = _.find(this.contactPage.collection.models, function(contact) {
				return contact.attributes.contactID === currentCall.attributes.callers;
			});
			new ContactView({
				model: caller
			}).callContact();
		}
	});

	var Clock = Backbone.Model.extend({
		initialize: function() {
			this.hoursOffset = 0;
			this.minutesOffset = 0;
			this.markerSwap = false;
			this.update();
		},
		update: function() {
			this.currentTime = new Date();
			this.hours = (this.currentTime.getHours() > 12) ? this.currentTime.getHours() - 12 : this.currentTime.getHours();
			if (this.hoursOffset) {
				this.hours = this.hours + this.hoursOffset;
				this.hours = (this.hours < 12) ? this.hours : this.hours - 12;
			}

			this.minutes = (this.currentTime.getMinutes() < 10) ? "0" + this.currentTime.getMinutes() : this.currentTime.getMinutes();
			this.minutes = this.minutes + this.minutesOffset;
			if (this.minutes > 59) {
				this.hours++;
				this.minutes -= 59;
			}

			this.marker = (this.currentTime.getHours() >= 12 && !this.markerSwap) ? "PM" : "AM";
		}
	});

	var ClockView = Backbone.View.extend({
		el: $('#clock'),
		events: {
			"click" : "setClock"
		},
		initialize: function() {
			var that = this;
			this.model = new Clock();
			this.render();
			setInterval(function() {that.render()}, 1000);
		},
		render: function() {
			this.model.update();
			this.$el.html(this.model.hours + ":" + this.model.minutes + " " + this.model.marker);
		},
		setClock: function() {
			var hours = prompt("Please enter the hour:"),
				minutes = prompt("Please enter the minutes:"),
				marker = prompt("Please enter 'AM' or 'PM':");

			if (hours !== this.model.hours) {
				this.model.hoursOffset = hours - this.model.hours;
			}

			if (minutes !== this.model.minutes) {
				this.model.minutesOffset = minutes - this.model.minutes;
			}

			if (marker !== this.model.marker) {
				this.model.markerSwap = true;
			}
		}
	});

	app = new PageView();
});
