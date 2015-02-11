
Template.content.rendered = function(){
    
    $("input.search").focus();
    
    // esc
    $(document).keyup( function(e) {
        if (e.keyCode === 27) { 
            Router.go("home");
        }   
    })
}
