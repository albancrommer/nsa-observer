
// itemList
Template.itemList.element= function () {
    var search = this.search || Session.get("search");
    if( "name" in search){
        var regexp      = new RegExp(search.name,'i');
        delete search.name;
        search["$or"] = [{tags:regexp},{alias:regexp},{agency:regexp},{name:regexp},{description:regexp}];
    }
    return Items.find(search,{sort:{name:1}}).fetch() || [];
};

Template.itemList.listName= function () {
    var search      = this.search || Session.get("search"),
        category    = search.category,
        family      = search.family,
        tags        = search.tags,
        search      = {},
        listName    = ""
    ;
    if( family ){
        listName    = category+"s > "+family;
    }else if (category){
        listName    = category+"s";
    }else if (tags){
        if( "source" in tags){
            listName = tags.source;
        }else{
            listName = "tags";
        }
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
