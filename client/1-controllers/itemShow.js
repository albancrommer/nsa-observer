

// itemShow

Template.itemShow.events({
 
     'click .panel-close':function(event){
         Router.go("home");
    },
    'click .internal-link':itemLinkShowEvent,
    'click .family-link':itemLinkShowListEvent,
    'click .category-link':itemLinkShowListEvent,
    'click .new' : function(){
        var item = Items.findOne( Items.insert({}) );
        Session.set('currentItem', item);
        Session.set("mode","edit");
        var d = new Date();
        Router.go("item",{name:d.getTime()})
    },
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
        ItemsMapper.save();
    }
});

Template.itemShow.draftsNum = function(){
    return Drafts.find().count();
}
Template.itemShow.versionsNum = function(){
    return Versions.find().count();
}

Template.itemShow.currentItem = function(){
    var item                            = Session.get("currentItem"),
        dbItem                          = {};
    if( ! item ){
        return {};
    }
    dbItem                              = Items.findOne({_id:item._id})
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
        relatedItems                    
    ;
    // Skips if invallid item
    if( ! currentItem){ return; }
    
    // Retrieves the current Item related items
    relatedItems                    = currentItem.relatedItems;
    
    // Exits if invalid relatedItems 
    if( ! relatedItems || ! relatedItems.length ){ return; }
    
        // Stores the full links list
    var linkList                        = [],
        // Stores a list of items to "dig"
        moreItemsList                   = [],
        // Stores the name of the item being searched
        pivot_name                      = "",
        // Always lower in alphabetical order
        keyA                            = "",
        // Always higher in alphabetical order
        keyB                            = "",
        // Stores keyA + keyB as a string
        key_couple                      = "",
        // Stores keyA.keyB couples to know already added links
        linksKeys                       = [],
        // This will contain a full list of items to know all their properties in the graph
        allItems                        = {}, 
        // A default for items not in the db
        defaultItem                     = {category:"",family:''}
        ;
    
    // Adds current Item to full item list 
    allItems[currentItem["name"]] = currentItem;
    
    // Sets the pivotName 
    pivot_name                          = currentItem["name"];

    // simple key comparison and assignment, returns the key couple
    var setKeys                         = function( a,b){
        keyA                            = a > b ? b : a;
        keyB                            = a > b ? a : b;
        return keyA+"/"+keyB;
    }
    // Retrieves and sets data for the immediately connex items
    _.each(relatedItems,function(item){
        if( item && item !== "undefined"){
            var name                    = transformWikiLinks(item, false);
            var item                    = Items.findOne({name:name});
            if( ! item){
                item                    = defaultItem;
            }
            ;
            key_couple                  = setKeys(name,pivot_name);
            // Exits if already in
            if( linksKeys.indexOf(key_couple) !== -1){
                return;
            }
            // Adds to key couples array
            linksKeys.push(key_couple);
            // Adds to the full node list
            allItems[name]              = item;
            // Adds to the next search list
            moreItemsList.push(item);
            // Adds to the links list
            linkList.push({source:keyA,target:keyB,category:item.category,family:item.family,type:"level1"});
        }
    })
    // Fetches n+1 items
    _.each(moreItemsList,function(parent){
        var relatedItems                = parent.relatedItems;
        pivot_name                      = parent.name;
        if( relatedItems ){
            _.each(relatedItems,function(child){
                if( child && child !== "undefined"){
                    var name            = transformWikiLinks(child, false);
                    var item            = Items.findOne({name:name});
                    if( ! item){
                        item            = defaultItem;
                    }
                    key_couple                  = setKeys(name,pivot_name);
                    // Exits if already in
                    if( linksKeys.indexOf(key_couple) !== -1){
                        return;
                    }
                    // Adds to key couples array
                    linksKeys.push(key_couple);
                    // Adds to the full node list
                    allItems[name]              = item;
                    // Adds to the links list
                    linkList.push({source:keyA,target:keyB,category:item.category,family:item.family,type:"level2"});
                }
            });
        }
    })
    // var data = DataAccessor(request);
    var itemGraph                       = new ItemGraph();
    itemGraph.drawGraph(".item-graph",linkList,allItems,600,450);
    
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
Template.itemShow.currentItemExists = function(){
    return Session.get('currentItem');
}
