
/**
 * 
 * @returns {String}
 */
Template.itemWikiAtom.editWikiExternalLink = function(item){
    var txt                             = "";
    $(item.links).each(function(x,y){if (y) txt += "* ["+y[0]+"|"+y[1]+"]\n";});
    return txt;
}
