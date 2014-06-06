
// nav

Template.nav.events({
    'click a':itemLinkShowListEvent,
    'click .menu-toggle':function(e){
        Session.set("showNav", ! Session.get("showNav"));
    },
    'keyup .search':function(e){
        var el = $(e.currentTarget),
            val = el.val();
       
       Session.set("search",{name:val});
       Session.set("listName","Search: "+val);
    },
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
    'click .view-mode':function(e){
        Session.set("mode","view");
    },
    'click .item-save':function(e){
        ItemsMapper.save();
    }
            
})
Template.nav.canEdit= function(){
    var user                            = Meteor.user();
    if( user ){
        return true;
    }
    return false;
}
Template.nav.isAdmin= function(){
    var user                            = Meteor.user();
    if( ! user){
        return false;
    }
    return user.isAdmin;
}

Template.nav.showNav = function(){
    return Session.get("showNav");
}

Template.nav.mode = function(val){
    return Session.equals("mode",val);
}

Template.nav.draftsNum = function(){
    return Drafts.find().count();
}
Template.nav.versionsNum = function(){
    return Versions.find().count();
}