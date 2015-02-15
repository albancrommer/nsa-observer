

// Subscription
Meteor.subscribe("items",{},{onReady:function(){}});
Meteor.subscribe("userData");
Deps.autorun(function () {
    Meteor.subscribe("versionsAndDrafts",{item:Session.get("currentItem")},{onReady:function(){}});
});
