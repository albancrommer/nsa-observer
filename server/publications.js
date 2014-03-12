// Meteor.publish definitions

// Users
Meteor.users.deny({
    update: function () { return true; },
    remove: function () { return true; }
});

Meteor.publish("userData", function () {
  return Meteor.users.find({_id: this.userId},
                           {fields: {'isAdmin': 1}});
});


// Items
Meteor.publish("items", function () {
  return Items.find(); // everything
});

Items.allow({ 
    insert:function() {
        if (Meteor.user().isAdmin) {  //e.g check if admin
            return true;
        }
        return false;
    },
    update: function() {
        if (Meteor.user().isAdmin) {  //e.g check if admin
            return true;
        }
        return false;
    },
    remove: function() {
        if (Meteor.user().isAdmin) {  //e.g check if admin
            return true;
        }
        return false;
    }
});

// Versions
Meteor.publish("versionsAndDrafts", function (options) {
    if( ! ("item" in options) || options.item === null){
        return [];
    }
    var user        = Meteor.users.findOne({_id:this.userId});
    if( ! user || ! ("isAdmin" in user) || ! user.isAdmin){
        return;
    }
    var currentItem = options.item;
    var _id         = currentItem._id;
    return [Versions.find({item_id:_id}),Drafts.find({item_id:_id})]; 
});

Versions.allow({
    insert:function() {
        if (Meteor.user().isAdmin) {  //e.g check if admin
            return true;
        }
        return false;
    },
    update: function() {
        if (Meteor.user().isAdmin) {  //e.g check if admin
            return true;
        }
        return false;
    },
    remove: function() {
        return false;
    }
    
})

Drafts.allow({
    insert:function() {
        return true;
    },
    update: function() {
        return false;
    },
    remove: function() {
        return false;
    }
    
})