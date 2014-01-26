isDisplayed = true;
isHidden = false;

if( Session.equals("itemListIsVisible",false ) ){
    togglePanels(isHidden,["itemListIsVisible"]);
}
if( Session.get("itemShowIsVisible",false ) ){
    togglePanels(isHidden,["itemShowIsVisible"]);
}


// Subscription
Meteor.subscribe("items");
Meteor.subscribe("userData");
