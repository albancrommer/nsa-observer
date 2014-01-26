
// nav

Template.nav.showNav = function(){
    return Session.get("showNav");
}

Template.nav.events({
    'click a':itemLinkShowListEvent,
    'click .menu-toggle':function(e){
        Session.set("showNav", ! Session.get("showNav"));
    },
    'keyup .search':function(e){
        var el = $(e.currentTarget),
            val = el.val();
       
       Session.set("search",{name:val});
       Session.set("listName","search: "+val);
       togglePanels(isDisplayed,["itemListIsVisible"]);
    }
})
