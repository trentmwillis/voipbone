/*
 * FINISHED: Call a contact, call voicemail, delete a contact, change status of the user, change status of the user, add a contact, change user name,
 * TODO: View call history with a contact, redial a number, start a three-way phone-call, mute the phone, change the clock
 */

$(function() {

	var contacts = [
			{
				"name":"Elise Van Wie",
				"status":"available",
				"number":"123-456-7890",
				"callHistory":[1,2,3]
			},
			{
				"name":"Angela Niu",
				"status":"unavailable",
				"number":"123-444-5555"
			},
			{
				"name":"Andres Hernandez",
				"status":"available",
				"number":"123-456-7890",
				"callHistory":[1,2,3]
			},
			{
				"name":"Morgan Freeman",
				"status":"available",
				"number":"123-456-7890",
				"callHistory":[1,2,3]
			},
			{
				"name":"Oli Sykes",
				"status":"available",
				"number":"123-456-7890",
				"callHistory":[1,2,3]
			},
			{
				"name":"Laura Turanchik",
				"status":"available",
				"number":"123-456-7890",
				"callHistory":[1,2,3]
			},
			{
				"name":"Daniel Rutledge",
				"status":"available",
				"number":"123-456-7890",
				"callHistory":[1,2,3]
			},
			{
				"name":"Kaitlyn Irvine",
				"status":"available",
				"number":"123-456-7890",
				"callHistory":[1,2,3]
			},
			{
				"name":"Dina-Marie Kolman",
				"status":"available",
				"number":"123-456-7890",
				"callHistory":[1,2,3]
			},
			{
				"name":"Daniel Esneul",
				"status":"available",
				"number":"123-456-7890",
				"callHistory":[1,2,3]
			},
			{
				"name":"Nicholas Bianco",
				"status":"available",
				"number":"123-456-7890",
				"callHistory":[1,2,3]
			},
			{
				"name":"Karl 'Max' Wallace",
				"status":"available",
				"number":"123-456-7890",
				"callHistory":[1,2,3]
			}
		],
		callHistory = [
				{
					"recipient":"Trent Willis",
					"date":"Thursday, January 9th, 2014",
					"time":"6:15 PM",
					"type":"Incoming",
					"duration":"0:53:20",
					"callID": 1
				},
				{
					"recipient":"Trent Willis",
					"date":"Thursday, January 9th, 2014",
					"time":"6:15 PM",
					"type":"Incoming",
					"duration":"0:53:20",
					"callID": 2
				},
				{
					"recipient":"Trent Willis",
					"date":"Thursday, January 9th, 2014",
					"time":"6:15 PM",
					"type":"Incoming",
					"duration":"0:53:20",
					"callID": 4
				},
				{
					"recipient":"Trent Willis",
					"date":"Thursday, January 9th, 2014",
					"time":"6:15 PM",
					"type":"Incoming",
					"duration":"0:53:20",
					"callID": 2
				},
				{
					"recipient":"Trent Willis",
					"date":"Thursday, January 9th, 2014",
					"time":"6:15 PM",
					"type":"Incoming",
					"duration":"0:53:20",
					"callID": 4
				}
			],
			inCall = false,
			selection = null;

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
		callContact: function() {
			var $callArea = $('#call-status');
			if (inCall && !confirm("You are about to end your current call.")) {
				return;
			}

			if ($callArea.hasClass("no-calls")) { $callArea.removeClass("no-calls"); }

			$callArea.addClass('active');
			$callArea.children('.caller-id').html('<small>On the phone with</small><br>' + this.model.attributes.name);
			inCall = true;
		},
		activate: function() {
			$('.contact-row.active').removeClass('active');
			this.$el.addClass('active');
			selection = this;
		}
	});

	var CallView = Backbone.View.extend({
		template: $("#callTemplate").html(),
		render: function() {
			var tmpl = _.template(this.template);
			this.$el.html(tmpl(this.model.toJSON()));
			return this;
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
			"click .fa-volume-off" : "mute"
		},
		initialize: function() {
			this.model = new User();
			this.callHistoryPage = new CallCollectionView();
			this.contactPage = new ContactCollectionView();

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
				selection.model.destroy();
				selection.remove();
				selection = null;
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
			
		}
	});

	var app = new PageView();
});
