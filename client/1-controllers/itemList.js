
// itemList
Template.itemList.element= function () {
    var search = Session.get("search");
    if( "name" in search){
        var regexp      = new RegExp(search.name,'i');
        delete search.name;
        search["$or"] = [{tags:regexp},{name:regexp}];
    }
    console.log(search);
    return Items.find(search,{sort:{name:1}}).fetch() || [];
};

Template.itemList.listName= function () {
    var search      = Session.get("search"),
        category    = search.category,
        family      = search.family,
        search      = {},
        listName    = ""
    ;
    if( family ){
        listName    = category+"s > "+family;
    }else if (category){
        listName    = category+"s";
    }else{
        listName    = Session.get("listName")
    }
    return listName;
};

Template.itemList.events({
    'click .panel-close':function(event){
        Router.go("home");
    }
});
