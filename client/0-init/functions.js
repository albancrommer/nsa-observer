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
            var name = match[1];
            var item = Items.findOne({name:name});
            var link = "/#";
            if (item) {
               link = Router.path("category-family-name",{
                   category:item.category,
                   family:item.family,
                   name:item.name
               }) 
            }1
            str_res = str_res.replace(match[0],'<a href="'+link+'" class="item-show-link internal-link" rel="'+match[1]+'">'+match[1]+'</a>');
        }else{
            str_res = match[1];
        }
    }
  }
  return str_res;
}
/**
 * 
 * @param {type} event
 * @returns {Boolean}
 */
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
/**
 * 
 * @param {type} event
 * @returns {unresolved}
 */
itemLinkShowListEvent = function(event){
    var 
        element     = $(event.currentTarget),
        category    = element.attr("category"),
        family      = element.attr("family"),
        route       = "",
        search      = {}
    ;
    if( family ){
        search      = {category:category,family:family};
        route       = "category-family";
    }else if (category){
        search      = {category:category};
        route       = "category";
    }else{
        return;
    }
    console.log("route",route,"search",search);
    Session.set("search", search);
    Router.go(route,search);
}

/**
 * 
 * @param {type} hideOrShow
 * @param {type} panels
 * @returns {undefined}
 */
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

