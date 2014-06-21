// In your server code: define a method that the client can call
Meteor.methods({
  sendEmail: function (from, subject, text) {
//    check([from, subject, text], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    // this.unblock();
     Email.send({
      to: "admin@nsa-observer.net",
      from: from,
      subject: subject,
      text: text
    });
  }
});
// Sets the environnement function
Meteor.startup(function () {
    process.env.MAIL_URL = "smtp://localhost"
});

