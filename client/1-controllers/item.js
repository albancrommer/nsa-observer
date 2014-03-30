
// item
Template.item.events({
    'click a': function () {
        var name = this.name;
        // Activating the router has bad side effects : list changes and white flash of rendering
//        Router.go("item",{name:name});
        Session.set("currentItem",this);
    }
});