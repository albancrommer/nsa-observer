

// itemWiki

Template.itemWiki.editWikiRelatedItems = function(l){
    var txt = " ";
    $(Session.get("currentItem").relatedItems).each(function(x,y){if (y) txt += y+" ";});
    return txt;
}
Template.itemWiki.editWikiExternalLink = function(){
    var txt = "";
    $(Session.get("currentItem").links).each(function(x,y){if (y) txt += "* ["+y[0]+"|"+y[1]+"]\n";});
    return txt;
}
