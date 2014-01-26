

// itemWiki

Template.itemWiki.editWikiRelatedItems = function(l){
    var txt = "",item = Session.get("currentItem");
    $(item.relatedItems).each(function(x,y){if (y) txt += y+" ";});
    return txt;
}
Template.itemWiki.editWikiExternalLink = function(){
    var txt = "",item = Session.get("currentItem");
    $(Session.get("currentItem").links).each(function(x,y){if (y) txt += "* ["+y[0]+"|"+y[1]+"]\n";});
    return txt;
}
