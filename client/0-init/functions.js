/**
 * 
 * @param {type} string
 * @param {type} html
 * @returns {unresolved}
 */
transformWikiLinks = function(string,html) {
  var re = /(?:\[\[([A-Z0-9\-_ ]+)(?:\]\]))/g,
      match,
      str_res = string,
      html = (undefined === html ? "true" : html)
      ;

  while (match = re.exec(string)) {
    if( match.length > 1){    
        if( html ){
            str_res = str_res.replace(match[0],'<a class="item-show-link internal-link" rel="'+match[1]+'">'+match[1]+'</a>');
        }else{
            str_res = match[1];
        }
    }
  }
  return str_res;
}

itemLinkShowList = function(listName){
    Session.set("listName",listName)
    togglePanels(isDisplayed,["itemListIsVisible"]);
}
itemLinkShowEvent = function(event){
        event.preventDefault();
        var name = $(event.currentTarget).attr("rel");
        if( name ){
            currentItem = Items.findOne({name:name});
            if( currentItem){
                Session.set("currentItem",currentItem);
            }
        }
        return false;
    }
itemLinkShowListEvent = function(event){
    var 
        element     = $(event.currentTarget),
        category    = element.attr("category"),
        family      = element.attr("family"),
        itemList    = [],
        search      = {},
        listName    = ""
    ;
    if( family ){
        search      = {category:category,family:family};
        listName    = category+"s > "+family;
    }else if (category){
        search      = {category:category};
        listName    = category+"s";
    }else{
        return;
    }
    Session.set("search", search);
    itemLinkShowList( listName);
}


togglePanels = function (hideOrShow,panels){
    var iterator,
        state = hideOrShow || false,
//        panels = panels || ["itemListIsVisible", "itemShowIsVisible"];
        panels = ["itemListIsVisible", "itemShowIsVisible"];
        for( iterator = 0; iterator < panels.length; iterator++ ){
            var panel = panels[iterator];
            Session.set(panel,state);
        }
}

