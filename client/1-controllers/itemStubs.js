

/**
 * 
 * @type object
 */
Template.itemStubs.events               = {
    
    "click .show-stub" : function(e){
        Session.set('currentStub', this);
    },
    "click .stub-nav-diff" : function(e){
        Session.set('stubMode', "diff");
    },
    "click .stub-nav-raw" : function(e){
        Session.set('stubMode', "raw");
    },
    "click .stub-nav-apply" : function(e){
        var stubItem                    = Session.get('currentStub');
        var currentItem                 = Session.get('currentItem');
        if( ! stubItem){
            return;
        }
        currentItem                     = ItemsStubs.stubToItem(stubItem,currentItem);
        ItemsMapper.save(currentItem);
        currentItem                     = Items.findOne({_id:stubItem.item_id});
        alert("Item saved.");
        Session.set('currentItem', currentItem);
        Session.set('mode', 'view')
    }

};


Template.itemStubs.isActive             = function(a,b){
    return a === b;
}

/**
 * 
 * @returns {@exp;Session@call;equals}
 */
Template.itemStubs.isDiffMode           = function(){
    return Session.equals('stubMode', "diff");
};


/**
 * 
 * @returns Array
 */
Template.itemStubs.stubs                = function(){
    if( Session.equals('mode',"drafts")){
        return Drafts.find({},{sort:{created_at:-1}}).fetch();
    }
    return Versions.find({},{sort:{created_at:-1}}).fetch();
};

/**
 * 
 * @param {type} user
 * @returns {String}
 */
Template.itemStubs.getId                = function(user){
    if( "emails" in user ){
        var emails                      = user.emails;
        var emailData                   = emails[0];
        return emailData["address"];
    }
    return "Invalid :"+JSON.stringify(user);
};

/**
 * 
 * @returns object
 */
Template.itemStubs.currentStub          = function (){
    return Session.get('currentStub');
};

/**
 * 
 * @returns {String}
 */
Template.itemStubs.diff                 = function(){

    var currentItem                     = Session.get('currentItem');
    var currentStub                     = Session.get('currentStub');
    if( ! currentStub){
        return "Choose a version to compare";
    }
    if( currentItem._id !== currentStub.item_id){
        currentStub                     = null;
    }
    var itemText                        = removeAnnotations(Template.itemWikiAtom(currentItem));
    var stubText                        = removeAnnotations(Template.itemWikiAtom(currentStub));
    
    var diff                            = JsDiff.diffWords(itemText, stubText);
    var display                         = "";
    diff.forEach(function(part){
      // green for additions, red for deletions
      // grey for common parts
      var color                         = part.added ? 'green' : part.removed ? 'red' : 'grey';
      var span                          = '<span style="color:'+color+'">'+part.value+'</span>';
      display   += span;
    });
    return display;

};


/**
 * 
 * @returns {String|@exp;textArray@call;join}
 */
Template.itemStubs.raw                  = function(){
    var currentStub                     = Session.get('currentStub');
    if( ! currentStub){
        return "Choose a version to compare";
    }
    return removeAnnotations(Template.itemWikiAtom(currentStub));

};