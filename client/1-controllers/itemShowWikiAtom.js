
/**
 * 
 * @returns {String}
 */
Template.itemWikiAtom.editWikiExternalLink = function(item){
    var txt                             = "";
    if( ! item ){
        return "";
    }
    if( !("links" in item)){
        return "";
    }
    $(item.links).each(function(x,y){if (y) txt += "* ["+y[0]+"|"+y[1]+"]\n";});
    return txt;
}

/**
 * 
 * @param {type} l
 * @returns {String}
 */
Template.itemWikiAtom.editWikiInternalLinks = function(prop, item){
    var txt                             = "",
        item                            = this;
    if( ! prop in item){
        return txt;
    }
    $(item[prop]).each(function(x,y){
        if (y) {
            txt += y+" ";
        }
    });
    return txt;
}
