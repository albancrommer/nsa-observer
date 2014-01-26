

// itemShow

Template.itemShow.events({
 
     'click .panel-close':function(event){
        togglePanels(isHidden,["itemShowIsVisible"]);
    },
    'click .internal-link':function(event){
        event.preventDefault();
        var name = $(event.currentTarget).attr("rel");
        if( name ){
            currentItem = Items.findOne({name:name});
            if( currentItem){
                Session.set("currentItem",currentItem);
            }
        }
        return false;
    },
    'click .family-link':itemLinkShowListEvent,
    'click .category-link':itemLinkShowListEvent,
    'click .edit-mode':function(e){
        Session.set("editMode",true);
    },
    'click .view-mode':function(e){
        Session.set("editMode",false);
    },
    'click .item-save':function(e){
        var data,
            currentItem = Session.get("currentItem")
        ;
        // Wiki style
        if( Session.equals('editModeType',"wiki") ){
            // Retrieves textarea
            data = $(".wiki-item-container").val();
            var parser = new itemParser(),
                parsed = parser.run(data),
                item = {};
            // Refuses wrong data
            if( parsed.length !== 1 ){
                alert ("invalid data !")
                return;
            }
            // Retrieves parsed item
            item = parsed[0];
            // Checks item validity
            // @todo
            // Attempts to save the item
            var _id = currentItem._id;
            Items.update({_id:_id},{$set:item},function(err,num){
                
                // Failed
                if( err ){
                    alert(err);
                }
                // Success
                if( num ){
                }
            });
        // If a standard form edit should exist, do it here 
        }else{
            // @todo
            var elements = $(".item-data");
        }
    }
});

Template.itemShow.currentItem = function(){
    var item = Session.get("currentItem"),
        dbItem = Items.findOne({_id:item._id});
    if( Session.equals("editMode",false)){
        dbItem.relatedItems = $.map(dbItem.relatedItems,function(x,y){return transformWikiLinks(x)})
        dbItem.description = transformWikiLinks(dbItem.description);
    }
    Session.set("currentItem",dbItem);
    return dbItem;
}
Template.itemShow.canEdit= function(){
    var user = Meteor.user();
    if( user && user.isAdmin){
        return true;
    }
    return false;
}
Template.itemShow.inEditMode = function(){
    return Session.get("editMode");
}
Template.itemShow.showExternalLink = function(l){
    return '<li><a href="'+l[0]+'" target="_blank" class="external-link">'+l[1]+'</a></li>';
}
Template.itemShow.inEditModeWiki = function() {
    return Session.equals('editModeType',"wiki");
}
Template.itemShow.editExternalLink = function(){
    var txt = "";
    $(Session.get("currentItem").externalLinks).each(function(x,y){txt += y[0]+"|"+y[1];});
    return txt;
}
Template.itemShow.editRelatedItems = function(l){
    var txt = "";
    $(Session.get("currentItem").relatedItems).each(function(x,y){txt += y+" ";});
    return txt;
}