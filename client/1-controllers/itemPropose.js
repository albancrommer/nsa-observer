Template.itemPropose.events = {
    "click .propose" : function(event){
        var content = $(".proposed-item").html();
        var email = Meteor.user().emails[0].address;

        // send email to admin team
        Meteor.call('sendEmail',
        email,
        'NSAOBS : new proposal by '+email,
        content
        );        
        alert("Your proposal has been sent to the admin team.");
        Router.go("home");
         
    }
}