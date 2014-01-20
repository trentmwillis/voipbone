/*
Need to start new timer when calling voicemail while in another call
Record time to complete each action in task lsit
*/
$(function() {
    $("#satisfaction-slider").slider({
        value: 0,
        min: -3,
        max: 3,
        step: 1,
        slide: function(event, ui) {
            var val = ui.value,
            string;
            switch (val) {
                case -3 : string = "Very Dissatisfied";
                            break;
                case -2 : string = "Dissatisfied";
                            break;
                case -1 : string = "Somewhat Dissatisfied";
                            break;
                case 0  : string = "Niether Satisfied or Dissatisfied";
                            break;
                case 1  : string = "Somewhat Satisfied";
                            break;
                case 2  : string = "Satisfied";
                            break;
                case 3  : string = "Very Satisfied";
                            break;
            }
            $("#satisfaction").val(string);
        }
    });
    $("#eou-slider").slider({
        value: 0,
        min: -3,
        max: 3,
        step: 1,
        slide: function(event, ui) {
            var val = ui.value,
            string;
            switch (val) {
                case -3 : string = "Very Difficult to Use";
                            break;
                case -2 : string = "Difficult to Use";
                            break;
                case -1 : string = "Somewhat Difficult to Use";
                            break;
                case 0  : string = "Niether Easy or Difficult to Use";
                            break;
                case 1  : string = "Somewhat Easy to Use";
                            break;
                case 2  : string = "Easy to Use";
                            break;
                case 3  : string = "Very Easy to Use";
                            break;
            }
            $("#eou").val(string);
        }
    });
    $("#design-slider").slider({
        value: 0,
        min: -3,
        max: 3,
        step: 1,
        slide: function(event, ui) {
            var val = ui.value,
            string;
            switch (val) {
                case -3 : string = "Very Displeasing Appearance";
                            break;
                case -2 : string = "Displeasing Appearance";
                            break;
                case -1 : string = "Somewhat Displeasing Appearance";
                            break;
                case 0  : string = "Niether Pleasing or Displeasing Appearance";
                            break;
                case 1  : string = "Somewhat Pleasing Appearance";
                            break;
                case 2  : string = "Pleasing Appearance";
                            break;
                case 3  : string = "Very Pleasing Appearance";
                            break;
            }
            $("#design").val(string);
        }
    });

    $( "#satisfaction" ).val("Niether Satisfied or Dissatisfied");
    $( "#eou" ).val("Niether Easy or Difficult to Use");
    $( "#design" ).val("Niether Pleasing or Displeasing Appearance");
    
});


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
                    "date": "1/10/2014",
                    "time": "6:15 PM",
                    "type": "Incoming",
                    "duration": "0:53:20"
                },
                {
                    "callers": [3,4,5],
                    "date":"1/9/2014",
                    "time":"6:15 PM",
                    "type":"Outgoing",
                    "duration":"0:53:20"
                },
                {
                    "callers": [5,6],
                    "date":"1/6/2014",
                    "time":"6:15 PM",
                    "type":"Incoming",
                    "duration":"0:53:20"
                },
                {
                    "callers": [10],
                    "date":"1/5/2014",
                    "time":"6:15 PM",
                    "type":"Outgoing",
                    "duration":"0:53:20"
                },
                {
                    "callers": [12],
                    "date":"1/3/2014",
                    "time":"6:15 PM",
                    "type":"Incoming",
                    "duration":"0:53:20"
                },
                {
                    "callers": [1, 4],
                    "date":"1/1/2014",
                    "time":"6:15 PM",
                    "type":"Outgoing",
                    "duration":"0:53:20"
                }
            ],
            inCall = false,
            currentCall = null,
            selection = null,
            contactIDMaker = 0,
            app, evaluator;

    var Contact = Backbone.Model.extend({
        defaults: {
            status: "available",
            callHistory: [],
            contactID: contactIDMaker++
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
        initialize: function() {
            this.on("call","callContact");
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

                // Evaluation trigger
                evaluator.trigger('viewContactCallHistory');
            }
        },
        getContactHistory: function() {
            var contactID = this.model.attributes.contactID,
                history = _.filter(app.callHistoryPage.collection.models, function(call) {
                    return call.attributes.callers.indexOf(contactID) >= 0;
                }),
                $historyContainer = this.$('.contact-history');
                
            if (history.length) {
                $historyContainer.html("");
            } else {
                $historyContainer.html("<div class='contact-history-entry'>No call history with " + this.model.attributes.name + "</div>");
            }

            for (var i=0; i<history.length; i++) {
                $historyContainer.append(_.template($('#contactCallTemplate').html())(history[i].toJSON()));
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
                callers: [contactID],
                date: app.clock.getDate(),
                time: app.clock.getTime(),
                type: 'Outgoing'
            });

            app.timer.start();

            // Evaluation trigger
            evaluator.trigger('callContact');
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
                callers = this.model.attributes.callers,
                contact;
            this.model.attributes.callerNames = [];
            for (var i=0; i<callers.length; i++) {
                if (app) {
                    contact = _.find(app.contactPage.collection.models, function(contact) {
                        return contact.attributes.contactID === callers[i];
                    });
                    if (contact) {
                        this.model.attributes.callerNames.push(contact.attributes.name);
                    }
                }
            }
            if (this.model.attributes.callerNames.length === 0) {
                return false;
            }
            this.$el.html(tmpl(this.model.toJSON()));
            return this;
        },
        redial: function() {
            var that = this,
                caller = _.find(app.contactPage.collection.models, function(contact) {
                    return contact.attributes.contactID === that.model.attributes.callers[0];
                });

            _.find(app.contactPage.childViews, function(view) {
                return caller === view.model;
            }).callContact();

            // Add any additional contacts that were a part of the call
            if (this.model.attributes.callers.length > 1) {
                for (var i=1; i<this.model.attributes.callers.length; i++) {
                    selection = _.find(app.contactPage.childViews, function(view) {
                        return view.model.attributes.contactID === that.model.attributes.callers[i];
                    });
                    app.addCallerToCall();
                }
            }

            inCall = true;


            evaluator.trigger("redial");
        }
    });

    var ContactCollectionView = Backbone.View.extend({
        el: $('#info-table'),

        initialize: function() {
            this.collection = new ContactCollection(contacts);
            this.childViews = [];
            this.render();
        },

        render: function() {
            var that = this;
            this.$el.html("");
            _.each(this.collection.models, function(contact){
                that.renderContact(contact);
            }, this);

            $('.actions').html("<a class='action add'><i class='fa fa-plus'></i> add</a><a class='action delete'><i class='fa fa-minus'></i> delete</a>");
        },

        renderContact: function(contact) {
            var contactView = new ContactView({
                model: contact
            });
            this.childViews.push(contactView);
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
            "click #redial" : "redialLastCall",
            "click .action.add" : "showAddContact",
            "click #create-contact .fa-times-circle" : "hideAddContact"
        },
        initialize: function() {
            this.contactIDMaker = 12;
            this.model = new User();
            this.callHistoryPage = new CallCollectionView();
            this.contactPage = new ContactCollectionView();
            this.clock = new ClockView();
            this.timer = new TimerView();

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

            selection = null;
            $('.tab.active').removeClass('active');
            $this.addClass('active');
        },
        endCall: function() {
            var $call = $("#call-status");
            $call.removeClass("active");
            $call.children('.caller-id').children('small').html("Last call with");
            this.timer.stop();
            currentCall.attributes.duration = this.timer.getTime();
            this.callHistoryPage.collection.add(currentCall, {at: 0});
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

                // Evaluation trigger
                evaluator.trigger('changeStatus');
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

            // Evaluation trigger
            evaluator.trigger('callVoicemail');
        },
        renderVoicemails: function() {
            $('#voicemails').children('span').html(this.model.attributes.voicemails);
        },
        deleteContact: function() {
            if (selection && confirm("Warning: you are about to delete " + selection.model.attributes.name + " from you contact list. Proceed?")) {
                selection.$el.animate({"height":"0px"}, 500, function() {
                    selection.model.destroy();
                    app.contactPage.collection.remove(selection);
                    selection.remove();
                    selection = null;

                    // Evaluation trigger
                    evaluator.trigger('deleteContact');
                });
            } else if (!selection) {
                alert("Please select a contact to delete.");
            }
        },
        showAddContact: function() {
            $("#create-contact").animate({"top":"32px"}, 500);
        },
        hideAddContact: function() {
            $("#create-contact").animate({"top":"-168px"}, 500);
        },
        addContact: function(e) {
            e.preventDefault();

            var formData = {},
                completed = true;

            $("#create-contact").children("input").each(function (i, el) {
                if ($(el).val() !== "") {
                    formData[$(el).data('prop')] = $(el).val();
                } else {
                    alert("Please enter the contact " + $(el).data('prop'));
                    completed = false;
                    return false;
                }
            });
            if (!completed) {
                return;
            }

            formData['contactID'] = ++this.contactIDMaker;

            $("#create-contact").find("input").val("");
            this.contactPage.collection.add(new Contact(formData));
            this.contactPage.render();
            this.hideAddContact();

            // Evaluation trigger
            evaluator.trigger('createContact');
        },
        mute: function() {
            var $volumeIcons = $("#volume-actions");
            if ($volumeIcons.hasClass("muted")) {
                $volumeIcons.removeClass("muted");
            } else {
                $volumeIcons.addClass("muted");
            }

            // Evaluation trigger
            evaluator.trigger('mute');
        },
        addCallerToCall: function() {
            var $callArea;

            if (!selection) {
                alert("Please select a contact to add to the call");
                return;
            } else if (_.find(currentCall.attributes.callers, function(callerID) {
                return callerID === selection.model.attributes.contactID    
            })) {
                alert(selection.model.attributes.name + " is already a part of this call");
                return;
            }

            $callArea = $('#call-status');

            $callArea.children('.caller-id').append(", " + selection.model.attributes.name);
            currentCall.attributes.callers.push(selection.model.attributes.contactID);

            // Evaluation trigger
            evaluator.trigger('startThreeWay');
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
                return contact.attributes.contactID === currentCall.attributes.callers[0];
            }),
                previousCall = currentCall;

            _.find(this.contactPage.childViews, function(view) {
                return caller === view.model;
            }).callContact();

            // Add any additional contacts that were a part of the call
            if (previousCall.attributes.callers.length > 1) {
                for (var i=1; i<previousCall.attributes.callers.length; i++) {
                    selection = _.find(this.contactPage.childViews, function(view) {
                        return view.model.attributes.contactID === previousCall.attributes.callers[i];
                    });
                    this.addCallerToCall();
                }
            }

            inCall = true;

            // Evaluation trigger
            evaluator.trigger('redial');
        }
    });

    var Timer = Backbone.Model.extend({
        initialize: function() {
            this.start();
        },
        stop: function() {
            clearInterval(this.interval);
        },
        start: function() {
            var that = this;
            this.initTime = $.now();
            this.tick();
            this.interval = setInterval(function() { that.tick(); }, 1000);
        },
        // Updates the timer time, should be called each second
        tick: function() {
            this.currentTime = $.now();
            this.time = this.currentTime - this.initTime;
        },
        // Return a string of the current timer time
        getTime: function() {
            var hours = Math.floor(this.time / (60 * 60 * 1000)),
                minutes = Math.floor((this.time - (hours * 3600000)) / (60 * 1000)),
                seconds = Math.floor((this.time - (hours * 3600000) - (minutes * 60000)) / 1000),
                timeString;
                hours = (hours < 10) ? "0" + hours : hours;
                minutes = (minutes < 10) ? "0" + minutes : minutes;
                seconds = (seconds < 10) ? "0" + seconds : seconds;
                timeString = hours + ":" + minutes + ":" + seconds;

            return timeString;
        },
        // Returns a string of when the call started
        getStartTime: function() {
            return new Date(this.initTime).toString();
        }
    });

    var TimerView = Backbone.View.extend({
        el: $('#current-call-time'),
        render: function() {
            this.$el.html(this.model.getTime());
        },
        start: function() {
            var that = this;
            this.model = new Timer();
            this.render();
            this.interval = setInterval(function() { that.render(); }, 1000);
        },
        stop: function() {
            this.model.stop();
            clearInterval(this.interval);
        },
        getTime: function() {
            return this.model.getTime();
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
                this.hours = (this.hours > 12) ? this.hours - 12 : this.hours;
            }

            this.minutes = (this.minutesOffset) ? this.currentTime.getMinutes() + this.minutesOffset : this.currentTime.getMinutes();
            if (this.minutes > 59) {
                this.hours++;
                this.minutes -= 59;
            }
            this.minutes = (this.minutes < 10) ? "0" + this.minutes : this.minutes;

            this.marker = (this.currentTime.getHours() >= 12) ? "PM" : "AM";
            if (this.markerSwap) {
                this.marker = (this.marker === "PM") ? "AM" : "PM";
            }
        },
        resetClock: function() {
            this.hoursOffset = 0;
            this.minutesOffset = 0;
            this.markerSwap = 0;
            this.hours = (this.currentTime.getHours() > 12) ? this.currentTime.getHours() - 12 : this.currentTime.getHours()
            this.minutes = (this.currentTime.getMinutes() < 10) ? "0" + this.currentTime.getMinutes() : this.currentTime.getMinutes();
            this.marker = this.marker = (this.currentTime.getHours() >= 12) ? "PM" : "AM";
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
        getTime: function() {
            return this.model.hours + ":" + this.model.minutes + " " + this.model.marker;
        },
        getDate: function() {
            return this.model.currentTime.toLocaleDateString();
        },
        setClock: function() {
            var hours,
                minutes,
                marker;

            hours = prompt("Please enter the hour [1, 12]:");
            if (!hours || hours < 1 || hours > 12) {
                alert('Please enter a correct hour number between 1 and 12.');
                return;
            }

            minutes = prompt("Please enter the minutes [0,59]:");
            if (!minutes || minutes < 0 || minutes > 59) {
                alert('Please enter a correct minutes number between 0 and 59.');
                return;
            }

            marker = prompt("Please enter 'AM' or 'PM':");
            if (!marker || (marker !== 'AM' && marker !== 'PM')) {
                alert('Please enter a correct marker, either "AM" or "PM".');
                return;
            }

            this.model.resetClock();

            if (hours !== this.model.hours) {
                this.model.hoursOffset = hours - this.model.hours;
            }

            if (minutes !== this.model.minutes) {
                this.model.minutesOffset = minutes - this.model.minutes;
            }

            if (marker !== this.model.marker) {
                this.model.markerSwap = true;
            }

            // Evaluation trigger
            evaluator.trigger('changeClock');
        }
    });

    var Evaluation = Backbone.Model.extend({
        tasks: [
            "Call a contact",
            "Add a contact",
            "View the call history with a contact",
            "Change status of user",
            "Redial a number",
            "Start a three-way call",
            "Mute the phone",
            "Call voicemail",
            "Delete a contact",
            "Change the clock"
        ],
        taskTrigger: [
            "callContact",
            "createContact",
            "viewContactCallHistory",
            "changeStatus",
            "redial",
            "startThreeWay",
            "mute",
            "callVoicemail",
            "deleteContact",
            "changeClock"
        ]
    });

    var Evaluator = Backbone.View.extend({
        el: $('#evaluation-list'),
        initialize: function() {
            this.model = new Evaluation();
            this.timer = new TimerView({el: $('#evaluation-timer')});
            this.model.taskTimes = [];
            this.taskNum = 0;
            this.render();
        },
        render: function() {
            this.timer.start();
            this.$el.html("<li class='current-task'>" + this.model.tasks[0] + "</li>");
            this.on(this.model.taskTrigger[0], this.advanceTasks);
        },
        advanceTasks: function() {
            this.model.taskTimes.push(this.timer.getTime());
            this.taskNum++;
            $('.current-task').removeClass('current-task');

            if (this.model.tasks[this.taskNum]) {
                this.$el.append("<li class='current-task'>" + this.model.tasks[this.taskNum] + "</li>");
                this.off();
                this.on(this.model.taskTrigger[this.taskNum], this.advanceTasks);
            } else {
                this.finish();
            }
        },
        finish: function() {
            var that = this;
            this.off();
            this.timer.stop();
            this.finalTime = this.timer.getTime();

            $("#survey").removeClass('hide');

            $("#submit-survey").click(function() {
                var $completeScreen = $("#complete-screen"),
                    text = "<pre>VoIP Interface usage results:\n\n";

                for (var i=0; i<that.model.tasks.length; i++) {
                    text += that.model.tasks[i] + " " + that.model.taskTimes[i] + "\n";
                }

                text += "\nTotal time: " + that.finalTime + "\n";
                text += $("#eou").val() + "\n";
                text += $("#satisfaction").val() + "\n";
                text += $("#design").val() + "\n\n";
                text += $("#comments").val() + "</pre>";

                $completeScreen.find(".container").html(text);
                $completeScreen.removeClass('hide');
            });

        }
    });

    confirm("Welcome to the VoIP interface evaluation. There will be tasks listed in the bar on the left-hand side of the screen, as you complete each task a new one will be added and your time recorded. There are ten tasks total.");

    app = new PageView();
    evaluator = new Evaluator();


});
