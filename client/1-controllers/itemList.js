
// itemList
Template.itemList.element= function () {
    var search = Session.get("search");
    if( "name" in search){
        search.name = new RegExp(search.name,'i');
    }
    return Items.find(search,{sort:{name:1}}).fetch() || [];
};

Template.itemList.listName= function () {
    return Session.get("listName");
};

Template.itemList.events({
    'click .panel-close':function(event){
        Router.go("home");
    }
});
