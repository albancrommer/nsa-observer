
transformWikiLinks = function(string) {
  var re = /(?:\[\[([A-Z0-9\-_]+)(?:\]\]))/g,
      match,
      str_res = string
      ;

  while (match = re.exec(string)) {
    if( match.length > 1){    
        str_res = str_res.replace(match[0],'<a class="item-show-link internal-link" rel="'+match[1]+'">'+match[1]+'</a>');
    }
  }
  return str_res;
}

itemLinkShowList = function(listName){
    Session.set("listName",listName)
    togglePanels(isDisplayed,["itemListIsVisible"]);
//    Session.set("itemList",itemList)
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
        listName    = category+"s: "+family;
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
        panels = panels || ["itemListIsVisible", "itemShowIsVisible"];
        for( iterator = 0; iterator < panels.length; iterator++ ){
            var panel = panels[iterator];
            Session.set(panel,state);
        }
}

