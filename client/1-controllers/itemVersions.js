
/**
 * 
 * @param {type} text
 * @returns {@exp;textArray@call;join}
 */
var removeAnnotations = function(text){
    var textArray = text.split("\n");
    var matches = /<\$label.*\$isolate:.*>(===.*===)/.exec(textArray[0]);
    textArray[0] = matches[1];
    var count = textArray.length;
    delete(textArray[count-1]);
    return textArray.join("\n");
};

/**
 * 
 * @type object
 */
Template.itemVersions.events = {
    
    "click .show-version" : function(e){
        Session.set('currentVersion', this);
    },
    "click .versions-nav-diff" : function(e){
        Session.set('versionMode', "diff");
    },
    "click .versions-nav-raw" : function(e){
        Session.set('versionMode', "raw");
    },
    "click .versions-nav-rollback" : function(e){
        var versionItem = Session.get('currentVersion');
        var currentItem = Session.get('currentItem');
        if( ! versionItem){
            return;
        }
        currentItem  = ItemsStubs.stubToItem(versionItem,currentItem);
        ItemsMapper.save(currentItem);
        currentItem     = Items.findOne({_id:versionItem.item_id});
        Session.set('currentItem', currentItem);
        Session.set('mode', 'view')
    }

};


Template.itemVersions.isActive = function(a,b){
    return a === b;
}

/**
 * 
 * @returns {@exp;Session@call;equals}
 */
Template.itemVersions.isDiffMode = function(){
    return Session.equals('versionMode', "diff");
};




/**
 * 
 * @returns Array
 */
Template.itemVersions.versions = function(){
    return Versions.find({},{sort:{created_at:-1}}).fetch();
};

/**
 * 
 * @param {type} user
 * @returns {String}
 */
Template.itemVersions.getId = function(user){
    if( "emails" in user ){
        var emails = user.emails;
        var emailData = emails[0];
        return emailData["address"];
    }
    return "Invalid :"+JSON.stringify(user);
};

/**
 * 
 * @returns object
 */
Template.itemVersions.currentVersion = function (){
    return Session.get('currentVersion');
};

/**
 * 
 * @returns {String}
 */
Template.itemVersions.diff = function(){

    var currentItem = Session.get('currentItem');
    var currentVersion = Session.get('currentVersion');
    if( ! currentVersion){
        return "Choose a version to compare";
    }
    if( currentItem._id !== currentVersion.item_id){
        currentVersion = null;
    }
    var itemText = removeAnnotations(Template.itemWikiAtom(currentItem));
    var versionText = removeAnnotations(Template.itemWikiAtom(currentVersion));
    
    var diff = JsDiff.diffWords(itemText, versionText);
    var display = "";
    diff.forEach(function(part){
      // green for additions, red for deletions
      // grey for common parts
      var color = part.added ? 'green' : part.removed ? 'red' : 'grey';
      var span = '<span style="color:'+color+'">'+part.value+'</span>';
      display   += span;
    });
    return display;

};


/**
 * 
 * @returns {String|@exp;textArray@call;join}
 */
Template.itemVersions.raw= function(){
    var currentVersion = Session.get('currentVersion');
    if( ! currentVersion){
        return "Choose a version to compare";
    }

    return removeAnnotations(Template.itemWikiAtom(currentVersion));

};