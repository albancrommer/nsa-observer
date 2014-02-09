
Template.content.rendered = function(){
    // esc
    $(document).keyup( function(e) {
        if (e.keyCode == 27) { 
            Router.go("home");
        }   
    })
}
