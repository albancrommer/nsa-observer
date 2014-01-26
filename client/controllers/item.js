
// item
Template.item.events({
  'click a': function () {
    Session.set("currentItem",this);
    togglePanels(isDisplayed,["itemShowIsVisible"]);
  }
});