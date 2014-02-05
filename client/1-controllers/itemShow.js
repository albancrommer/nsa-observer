

// itemShow

Template.itemShow.events({
 
     'click .panel-close':function(event){
        togglePanels(isHidden,["itemShowIsVisible"]);
    },
    'click .internal-link':itemLinkShowEvent,
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
            currentItem                 = Session.get("currentItem")
        ;
        // Wiki style
        if( Session.equals('editModeType',"wiki") ){
            // Retrieves textarea
            data                        = $(".wiki-item-container").val();
            var parser                  = new itemParser(),
                parsed                  = parser.run(data),
                item                    = {};
            // Refuses wrong data
            if( parsed.length !== 1 ){
                alert ("invalid data !")
                return;
            }
            // Retrieves parsed item
            item                        = parsed[0];
            // Checks item validity
            // @todo
            // Attempts to save the item
            var _id                     = currentItem._id;
            Items.update({_id:_id},{$set:item},function(err,num){
                
                // Failed
                if( err ){
                    alert(err);
                }
                // Success
                if( num){}
            });
        // If a standard form edit should exist, do it here 
        }else{
            // @todo
            var elements                = $(".item-data");
        }
    },
    'click circle':itemLinkShowListEvent,
    'click text' :itemLinkShowListEvent
});

Template.itemShow.currentItem = function(){
    var item                            = Session.get("currentItem"),
        dbItem                          = Items.findOne({_id:item._id});
    Session.set('currentItem', dbItem)
    return dbItem;
}

/**
 *  Graph renderer
 * @param {type} i
 * @returns {unresolved}
 */
Template.itemShow.rendered = function(i){
    
    
    // @todo : this should be a method of an accessor object
    var currentItem                     = Session.get('currentItem'),
        relatedItems                    = currentItem.relatedItems;
    if( ! relatedItems){
        return;
    }
    var links                           = [],
        moreItems                       = [],
        name                            = currentItem["name"],
        allItems                        = {},
        item                            = currentItem,
        defaultItem                     = {category:"",family:''}
        ;
        
    allItems[name] = item,

    _.each(relatedItems,function(item){
        if( item && item !== "undefined"){
            var name                    = transformWikiLinks(item, false);
            item                        = Items.findOne({name:name});
            if( ! item){
                item                    = defaultItem;
            }
            allItems[name] = item,
            moreItems.push(item);
//            links.push({source:currentItem.name,target:name,type:"level1"})
            links.push({source:currentItem.name,target:name,category:item.category,family:item.family,type:"level2"});
        }
    })
    // Fetches n+1 items
    _.each(moreItems,function(parent){
        var relatedItems                = parent.relatedItems;
        if( relatedItems ){
            _.each(relatedItems,function(child){
                if( child && child !== "undefined"){
                    var name            = transformWikiLinks(child, false);
                    item                = Items.findOne({name:name});
                    if( ! item){
                        item            = defaultItem;
                    }
                    allItems[name]      = item;
                    links.push({source:parent.name,target:name,category:item.category,family:item.family,type:"level2"});
                }
            });
        }
    })
    // var data = DataAccessor(request);
    var itemGraph                       = new ItemGraph();
    itemGraph.drawGraph(".item-graph",links,allItems,600,450);
    
}

Template.itemShow.canEdit= function(){
    var user                            = Meteor.user();
    if( user && user.isAdmin){
        return true;
    }
    return false;
}
Template.itemShow.inEditMode = function(){
    return Session.get("editMode");
}
Template.itemShow.showExternalLink = function(l){
    return '<li><a href="'+l[0]+'" target="_blank" class="external-link item-show-link">'+l[1]+'</a></li>';
}
Template.itemShow.inEditModeWiki = function() {
    return Session.equals('editModeType',"wiki");
}
Template.itemShow.wikiLinks = function(t){
    return transformWikiLinks(t);
};
Template.itemShow.editExternalLink = function(){
    var txt                             = "";
    $(Session.get("currentItem").externalLinks).each(function(x,y){txt += y[0]+"|"+y[1];});
    return txt;
};
Template.itemShow.editRelatedItems = function(l){
    var txt                             = "",item = Session.get("currentItem");
    $(item.relatedItems).each(function(x,y){txt += y+" ";});
    return txt;
};