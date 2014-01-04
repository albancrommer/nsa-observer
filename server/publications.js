// Meteor.publish definitions

Meteor.publish("items", function () {
  return Items.find(); // everything
});
