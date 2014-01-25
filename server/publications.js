// Meteor.publish definitions

Meteor.publish("items", function () {
  return Items.find(); // everything
});

Items.allow({ 
    insert:function(userId, document) {
        if (Meteor.user().isAdmin) {  //e.g check if admin
            return true;
        }
        return false;
    },
    update: function(userId,doc,fieldNames,modifier) {
        if (Meteor.user().isAdmin) {  //e.g check if admin
            return true;
        }
        return false;
    },
    remove: function(userId, doc) {
        if (Meteor.user().isAdmin) {  //e.g check if admin
            return true;
        }
        return false;
    }
});