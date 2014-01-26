
// page 
Template.page.itemListIsVisible = function(){
    return Session.get("itemListIsVisible");
}
Template.page.itemShowIsVisible = function(){
    return Session.get("itemShowIsVisible");
}
Template.page.rendered = function(){
    // esc
    $(document).keyup( function(e) {
        if (e.keyCode == 27) { 
            togglePanels(isHidden)  ;
        }   
    })


}
