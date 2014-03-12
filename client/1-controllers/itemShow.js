

// itemShow

Template.itemShow.events({
 
     'click .panel-close':function(event){
        togglePanels(isHidden,["itemShowIsVisible"]);
    },
    'click .internal-link':itemLinkShowEvent,
    'click .family-link':itemLinkShowListEvent,
    'click .category-link':itemLinkShowListEvent,
    'click .edit-mode':function(e){
        Session.set("mode","edit");
    },
    'click .drafts-mode':function(e){
        Session.set("mode","drafts");
    },
    'click .versions-mode':function(e){
        Session.set("mode","versions");
    },
    'click .edit-mode':function(e){
        Session.set("mode","edit");
    },
    'click .view-mode':function(e){
        Session.set("mode","view");
    },
    'click .item-save':function(e){
        var data,
            currentItem                 = Session.get("currentItem"),
            _id                         = currentItem._id
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

            if( Meteor.user().isAdmin ){
                // Retrieves the old item version
                var previousVersion     = Items.findOne({_id:_id});
                var backupVersion       = _.clone(item);
                delete(backupVersion._id);
                backupVersion.item_id   = _id;
                backupVersion.created_at = new Date();
                backupVersion.user =  Meteor.user();
                // Updates
                Items.update({_id:_id},{$set:item},function(err,num){
                    // Failed
                    if( err ){
                        alert(err);
                        return;
                    }
                    // Keeps the backup
                    Versions.insert(backupVersion);
                });
            // Saves a draft
            }else{
                var _id                     = currentItem._id;
                var draftVersion        = _.clone(item);
                delete(draftVersion._id);
                draftVersion.item_id    = _id;
                draftVersion.created_at = new Date();
                draftVersion.user =  Meteor.user();
                // Keeps the backup
                Drafts.insert(draftVersion);
                
                
            }
        // If a standard form edit should exist, do it here 
        }else{
            // @todo
            var elements = $(".item-data");
        }
    },
    'click circle':itemLinkShowListEvent,
    'click text' :itemLinkShowListEvent
});

Template.itemShow.draftsNum = function(){
    return Drafts.find().count();
}
Template.itemShow.versionsNum = function(){
    return Versions.find().count();
}

Template.itemShow.currentItem = function(){
    var item = Session.get("currentItem"),
        dbItem = Items.findOne({_id:item._id});
    Session.set('currentItem', dbItem)
    return dbItem;
}

Template.itemShow.rendered = function(i){
    var currentItem     = Session.get('currentItem'),
        relatedItems    = currentItem.relatedItems;
    if( ! relatedItems){
        return;
    }
    var links = [],connexList = []
    _.each(relatedItems,function(item){
        if( item && item !== "undefined"){
            var name = transformWikiLinks(item, false);
            connexList.push(name)
            links.push({source:currentItem.name,target:name,type:"level1"})
        }
    })
    // Fetches n+1 items
    var moreItems = Items.find({name:{$in:connexList}}).fetch();
    _.each(moreItems,function(parent){
        var relatedItems = parent.relatedItems;
        if( relatedItems ){
            _.each(relatedItems,function(child){
                if( child && child !== "undefined"){
                    var name = transformWikiLinks(child, false);
                    links.push({source:parent.name,target:name,type:"level2"});
                }
            });
        }
    })
    var itemGraph = new ItemGraph();
    itemGraph.drawGraph(".item-graph",links,600,400);
    
}

Template.itemShow.canEdit= function(){
    var user                            = Meteor.user();
    if( user ){
        return true;
    }
    return false;
}
Template.itemShow.mode = function(val){
    return Session.equals("mode",val);
}
Template.itemShow.showExternalLink = function(l){
    return '<li><a href="'+l[0]+'" target="_blank" class="external-link">'+l[1]+'</a></li>';
}
Template.itemShow.inEditModeWiki = function() {
    return Session.equals('editModeType',"wiki");
}
Template.itemShow.wikiLinks = function(t){
    return transformWikiLinks(t);
};
Template.itemShow.editExternalLink = function(){
    var txt = "";
    $(Session.get("currentItem").externalLinks).each(function(x,y){txt += y[0]+"|"+y[1];});
    return txt;
};
Template.itemShow.editRelatedItems = function(l){
    var txt = "",item = Session.get("currentItem");
    $(item.relatedItems).each(function(x,y){txt += y+" ";});
    return txt;
};
