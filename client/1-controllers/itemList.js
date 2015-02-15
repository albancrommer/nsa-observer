
// itemList
Template.itemList.element= function () {
    var search = Session.get("search");
    // When looking for a list based on name
    if( "name" in search){
        var regexp      = new RegExp(search.name,'i');
        delete search.name;
        search["$or"] = [{tags:regexp},{alias:regexp},{agency:regexp},{name:regexp},{description:regexp}];
    }
    var list =  Items.find(search,{sort:{name:1}}).fetch() || [];
    if( list.length >= 1 && ! Session.get("currentItem")){
        Session.set("currentItem",list[0]);
    }
    return list;
};

Template.itemList.listName= function () {
    var search      = Session.get("search"),
        category    = search.category,
        family      = search.family,
        tags        = search.tags,
        search      = {},
        listName    = Session.get("listName") || ""
    ;
    if( family ){
        listName    = category+"s > "+family;
    }else if (category){
        listName    = category+"s";
    }
    return listName;
};

Template.itemList.events({
    'click .panel-close':function(event){
        Router.go("home");
    }
});
