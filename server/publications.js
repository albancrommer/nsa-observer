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

Meteor.users.deny({
    update: function () { return true; },
    remove: function () { return true; }
});

Meteor.publish("userData", function () {
  return Meteor.users.find({_id: this.userId},
                           {fields: {'isAdmin': 1}});
});
