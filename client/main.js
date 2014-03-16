isDisplayed = true;
isHidden = false;

if( Session.equals("itemListIsVisible",false ) ){
    togglePanels(isHidden,["itemListIsVisible"]);
}
if( Session.get("itemShowIsVisible",false ) ){
    togglePanels(isHidden,["itemShowIsVisible"]);
}


// Subscription
Meteor.subscribe("items","foo",{onReady:function(){}});
Meteor.subscribe("userData");
Deps.autorun(function () {
    Meteor.subscribe("versionsAndDrafts",{item:Session.get("currentItem")},{onReady:function(){}});
});
