var isDisplayed = true;
var isHidden = false;

var  transformWikiLinks = function(string) {
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
var Item = function(name){

        var instance = {};
	instance.name			= name;
	instance.category 		= "";
	instance.relatedItems           = [];
	instance.family			= "";
	instance.status			= "";
	instance.links			= [];
	instance.currentState	= null;
	
	instance.__construct = function( name ){
		instance.name = name;
	}
	instance.getInsertString = function(){
            str = 'Items.insert({name:"'+instance.get("name")+'",category:"'+instance.get("category")+'",family:"'+instance.get("family")+'",status:"'+instance.get("status")+'",description:"'+instance.get("description")+'",relatedItems:'+instance.get("relatedItems", TRUE)+',links:'+instance.get("links", TRUE)+'});';
            return str.replace("\n","","g")+"\n";
	}
	instance.get = function(name,json){
            if( json){
                return JSON.stringify(instance.name);
            }
            return addslashes(instance.name);
	}
        return instance;
}

var itemParser = function(){
    var 
        instance = {},
        itemList = [],
        currentItem = null
    ;
    instance.getItemList = function(){
        return itemList;
    }
    
    instance.read = function(row){
        
        var it = 0,
            regexp = null,
            callback = function(){},
            validator = function(){},
            tuple = [],
            res = [],
            expressions = [
            [/^== ([A-Z]) ==$/,function(r){
                instance.addItem()
            }],
            [/=== +(.+?) +===/,function(r){
                instance.addItem()
                currentItem = new Item(r[1]);
            }],
            [/""Short *?Description"" *?: *?(.*?) *?\n$/,function(r){
                currentItem.description = trim($matches[1]);	
                currentItem.currentState = "description";
            }],
            [/""Category"" *: *(.*?)$/,function(r){

			if( "" == r[1].trim()){
				r[1] = "program";
			};
			currentItem.category = r[1].trim();	
			currentItem.currentState = null;
            }],
            [/""Family"" *?: *?(.*?)$/,function(r){
                if( "" == r[1].trim()){
                                    r[1] = "collect";
                            };
                            currentItem.family = r[1].trim();	
                            currentItem.currentState = null;
            }],
            [/""Related items"" *?: *?(.*?)$/,function(r){
                currentItem.relatedItems = r[1].trim().split(" ");
                currentItem.currentState = null;
            }],
            [/""Status"" *?: *?(.*?)$/,function(r){
			if( "" == (r[1])){
				r[1] = "unknown";
			};
			currentItem.status = r[1].trim();	
			currentItem.currentState = null;                
            }],
            [/""Links"" :/,function(r){
                currentItem.currentState = "links";
            }],
            [/""Links"" :/,function(r){
                currentItem.currentState = "links";
            }],
            [/\[(.*)\|(.*)\]/,function(r){
                if( ! r[1] ){
                    instance.log( "[invalid url]"+ row);
                    return;
                }
                url 	= r[1];
                label	= r[2] ? r[2] : url;
                currentItem.links.push([url,label]); 
            },function(){currentItem.currentState == "links" ? true:false;}],
            [null,function(r){
                if( currentItem.currentState != "links" && "" != row && ! is_null(currentItem) && ! is_null(currentItem.currentState )){
                        currentItem[currentItem.currentState] += row;
                }
            }],
            [null,function(){
                instance.log( "[not parsed]"+ row);
            }]
        ];
        for (it = 0; it < expressions.length; it++) {
            tuple = expressions[it];
            regexp = tuple[0];
            callback = tuple[1];
            validator = tuple[2];
            if ( null === regexp) {
                if( ! validator ){
                    break;
                }
            }
            res = regexp.exec(row);
            if( res && res.length > 0){
                callback( res );
                return;
            }
        }
    }
    /**
     * 
     */
    instance.log = function(str){
        console.log(str);
    };
    
    /**
     * 
     */
    instance.addItem = function(){
        if( !currentItem){
            return;
        }
        var item = currentItem, name = currentItem.name, list = itemList;
        if( ! name ){
            // todo : log
            instance.log("[err] could not retrieve name for "+JSON.stringify(currentItem));
        }
        itemList.push(item);
        list = itemList;
    }
    
    /**
     * 
     * @param {type} doc
     * @returns {@exp;instance@call;getItemList}
     */
    instance.run = function(doc){
        var rowList = doc.split("\n");
        for(var i = 0; i < rowList.length; i++){
            var row = rowList[i].trim();
            if( row ){
                instance.read(row);
            }
        }
        instance.addItem();
        return itemList;
    }
    
    return instance;
    
}

window.itemParser = new itemParser();


var parseWikiItems = function(text){

    
}
var itemLinkShowList = function(event){
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
    Session.set("listName",listName)
    itemList    = Items.find(search,{sorted:{name:1}}).fetch();
    togglePanels(isDisplayed,["itemListIsVisible"]);
    Session.set("itemList",itemList)
    
}

var togglePanels = function (hideOrShow,panels){
    var iterator,
        state = hideOrShow || false,
        panels = panels || ["itemListIsVisible", "itemShowIsVisible"];
        for( iterator = 0; iterator < panels.length; iterator++ ){
            var panel = panels[iterator];
            Session.set(panel,state);
        }
}


if( ! (Session.get("itemList") instanceof Array) ){
    Session.set("itemList",[]);
}
if( ! (Session.get("currentItem") ) ){
    Session.set("currentItem",{});
}
if( ! (Session.get("itemListIsVisible") ) ){
    togglePanels(isHidden,["itemListIsVisible"]);
}
if( ! (Session.get("itemShowIsVisible") ) ){
    togglePanels(isHidden,["itemShowIsVisible"]);
}
if( ! (Session.get("listName") ) ){
    Session.set("listName","");
}
if( ! (Session.get("sliderRendered") ) ){
    Session.set("sliderRendered",false);
}
if( ! (Session.get("showNav") ) ){
    Session.set("showNav",false);
}
if( ! (Session.get("itemEdit") ) ){
    Session.set("itemEdit",false);
}

if( ! (Session.get("editModeType") ) ){
    Session.set("editModeType","wiki");
}



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

// itemList
Template.itemList.element= function () {
    return Session.get("itemList") || [];
};

Template.itemList.listName= function () {
    return Session.get("listName");
};

Template.itemList.events({
    'click .panel-close':function(event){
        togglePanels(isHidden);
    }
});

// item
Template.item.events({
  'click a': function () {
    Session.set("currentItem",this);
    togglePanels(isDisplayed,["itemShowIsVisible"]);
  }
});

// itemShow

Template.itemShow.currentItem = function(){
    var item = Session.get("currentItem");
    if( !Session.get("editMode")){
        item.relatedItems = $.map(item.relatedItems,function(x,y){return transformWikiLinks(x)})
        item.description = transformWikiLinks(item.description);
    }
    return item;
}

Template.itemShow.events({
 
     'click .panel-close':function(event){
        togglePanels(isHidden,["itemShowIsVisible"]);
    },
    'click .internal-link':function(event){
        event.preventDefault();
        var name = $(event.currentTarget).attr("rel");
        if( name ){
            currentItem = Items.findOne({name:name});
            if( currentItem){
                Session.set("currentItem",currentItem);
            }
        }
        return false;
    },
    'click .family-link':itemLinkShowList,
    'click .category-link':itemLinkShowList,
    'click .edit-mode':function(e){
        Session.set("editMode",true);
    },
    'click .view-mode':function(e){
        Session.set("editMode",false);
    },
    'click .item-save':function(e){
        var data
        if( Session.get('editModeType') === "wiki"){
            data = $(".wiki-item-container").html();
            console.log(data);
        }else{
            // @todo
            var elements = $(".item-data");
            console.log(elements.each(function(x,y){console.log( $(y).val())}))
        }
    }
});

Template.itemShow.canEdit= function(){
    return Meteor.user() || false;
}
Template.itemShow.inEditMode = function(){
    return Session.get("editMode");
}
Template.itemShow.externalLink = function(l){
    return '<li><a href="'+l[0]+'" target="_blank" class="item-show-link external-link">'+l[1]+'</a></li>';
}
Template.itemShow.inEditModeWiki = function() {
    return "wiki" === Session.get('editModeType');
}
Template.itemShow.editExternalLink = function(){
    var txt = "";
    $(Session.get("currentItem").externalLinks).each(function(x,y){txt += y[0]+"|"+y[1];});
    return txt;
}
Template.itemShow.editRelatedItems = function(l){
    var txt = "";
    $(Session.get("currentItem").relatedItems).each(function(x,y){txt += y+" ";});
    return txt;
}


// itemWiki

Template.itemWiki.editWikiRelatedItems = function(l){
    var txt = " ";
    $(Session.get("currentItem").relatedItems).each(function(x,y){if (y) txt += "[["+y+"]] ";});
    return txt;
}
Template.itemWiki.editWikiExternalLink = function(){
    var txt = "";
    console.log($(Session.get("currentItem").externalLinks))
    $(Session.get("currentItem").links).each(function(x,y){if (y) txt += "* ["+y[0]+"|"+y[1]+"]\n";});
    return txt;
}


// nav

Template.nav.showNav = function(){
    return Session.get("showNav");
}

Template.nav.events({
    'click a':itemLinkShowList,
    'click .menu-toggle':function(e){
        Session.set("showNav", ! Session.get("showNav"));
    },
    'keyup .search':function(e){
        var el = $(e.currentTarget),
            val = el.val(),
            itemList = [],
            regexp = new RegExp(val,'i');
       
       itemList = Items.find({name:regexp}).fetch();
       Session.set("listName","search:"+val);
       Session.set("itemList",itemList);
       togglePanels(isDisplayed,["itemListIsVisible"]);
       console.log(el, val,itemList,regexp)
    }
})

// Slider

Template.slider.events({
    'click a':itemLinkShowList,
    'click circle':itemLinkShowList,
})

Template.slider.num = function(){
    return Items.find().count();
}

Template.slider.programs_num = function(){
    return Items.find({category:"program"}).count();
}
Template.slider.attacks_num = function(){
    return Items.find({category:"attack vector"}).count();
}
Template.slider.compartments_num = function(){
    return Items.find({category:"compartment"}).count();
}
Template.slider.undefineds_num = function(){
    return Items.find({category:"undefined"}).count();
}
Template.slider.rendered = function(){
    
    var data;
    //    NodeList.drawGraph();
    data = [
//        {c:"undefineds",n:"undefined",q:Items.find({category:"undefined"}).count(),cat:"undefined"},
        {c:"programs",n:"programs",q:Items.find({category:"program"}).count(),cat:"program"}, 
        {c:"attacks",n:"attack vectors",q:Items.find({category:"attack vector"}).count(),cat:"attack vector"}, 
        {c:"compartments",n:"compartments",q:Items.find({category:"compartment"}).count(),cat:"compartment"}
    ];
    var catGraph = new CategoryGraph();
    catGraph.drawGraph("#categories-graph",data,600,100);
    
    data = [
        {c:"collect",n:"collect programs",q:Items.find({category:"program",family:"collect"}).count(),cat:"program",fam:"collect"},
        {c:"process",n:"process programs",q:Items.find({category:"program",family:"process"}).count(),cat:"program",fam:"process"}, 
        {c:"database",n:"database programs",q:Items.find({category:"program",family:"database"}).count(),cat:"program",fam:"database"}, 
        {c:"target",n:"target programs",q:Items.find({category:"program",family:"target"}).count(),cat:"program",fam:"target"}, 
        {c:"attack",n:"attack programs",q:Items.find({category:"program",family:"attack"}).count(),cat:"program",fam:"attack"}
    ];
    var programGraph = new CategoryGraph();
    programGraph.drawGraph("#programs-graph",data,600,200);
    
    data = [
        {c:"physical",n:"physical attack vectors",q:Items.find({category:"attack vector",family:"physical"}).count(),cat:"attack vector",fam:"physical"},
        {c:"software",n:"software attack vectors",q:Items.find({category:"attack vector",family:"software"}).count(),cat:"attack vector",fam:"software"}, 
        {c:"network",n:"network attack vectors",q:Items.find({category:"attack vector",family:"network"}).count(),cat:"attack vector",fam:"network"}, 
    ];
    var programGraph = new CategoryGraph();
    programGraph.drawGraph("#attack-graph",data,600,200);
    
    data = [
        {c:"eci",n:"Extremely Compartmented Information",q:Items.find({category:"compartiment",family:"ECI"}).count(),cat:"compartiment",fam:"ECI"},
    ];
    var programGraph = new CategoryGraph();
    programGraph.drawGraph("#compartment-graph",data,600,200);

}