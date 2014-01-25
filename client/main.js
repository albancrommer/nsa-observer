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
            [/""Short *?Description"" *?: *?(.*?) *?$/,function(r){
                currentItem.description = r[1].trim();	
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

var itemLinkShowList = function(listName){
    Session.set("listName",listName)
    togglePanels(isDisplayed,["itemListIsVisible"]);
//    Session.set("itemList",itemList)
}

var itemLinkShowListEvent = function(event){
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


var togglePanels = function (hideOrShow,panels){
    var iterator,
        state = hideOrShow || false,
        panels = panels || ["itemListIsVisible", "itemShowIsVisible"];
        for( iterator = 0; iterator < panels.length; iterator++ ){
            var panel = panels[iterator];
            Session.set(panel,state);
        }
}


Session.setDefault("itemList",[]);
Session.setDefault("currentItem",{});
Session.setDefault("itemListIsVisible",false);
Session.setDefault("itemShowIsVisible",false);
Session.setDefault("listName","");
Session.setDefault("sliderRendered",false);
Session.setDefault("showNav",true);
Session.setDefault("itemEdit",false);
Session.setDefault("editModeType","wiki");
Session.setDefault('showExport', false);
Session.setDefault('exportType', 'wiki');

if( Session.equals("itemListIsVisible",false ) ){
    togglePanels(isHidden,["itemListIsVisible"]);
}
if( Session.get("itemShowIsVisible",false ) ){
    togglePanels(isHidden,["itemShowIsVisible"]);
}


// Subscription
Meteor.subscribe("items");
Meteor.subscribe("userData");

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
    var search = Session.get("search");
    if( "name" in search){
        search.name = new RegExp(search.name,'i');
    }
    return Items.find(search,{sort:{name:1}}).fetch() || [];
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
    var item = Session.get("currentItem"),
        dbItem = Items.findOne({_id:item._id});
    if( Session.equals("editMode",false)){
        dbItem.relatedItems = $.map(dbItem.relatedItems,function(x,y){return transformWikiLinks(x)})
        dbItem.description = transformWikiLinks(dbItem.description);
    }
    Session.set("currentItem",dbItem);
    return dbItem;
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
    'click .family-link':itemLinkShowListEvent,
    'click .category-link':itemLinkShowListEvent,
    'click .edit-mode':function(e){
        Session.set("editMode",true);
    },
    'click .view-mode':function(e){
        Session.set("editMode",false);
    },
    'click .item-save':function(e){
        var data,
            currentItem = Session.get("currentItem")
        ;
        // Wiki style
        if( Session.equals('editModeType',"wiki") ){
            // Retrieves textarea
            data = $(".wiki-item-container").val();
            var parser = new itemParser(),
                parsed = parser.run(data),
                item = {};
            // Refuses wrong data
            if( parsed.length !== 1 ){
                alert ("invalid data !")
                return;
            }
            // Retrieves parsed item
            item = parsed[0];
            // Checks item validity
            // @todo
            // Attempts to save the item
            var _id = currentItem._id;
            Items.update({_id:_id},{$set:item},function(err,num){
                
                // Failed
                if( err ){
                    alert(err);
                }
                // Success
                if( num ){
                }
            });
        // If a standard form edit should exist, do it here 
        }else{
            // @todo
            var elements = $(".item-data");
        }
    }
});

Template.itemShow.canEdit= function(){
    var user = Meteor.user();
    if( user && user.isAdmin){
        return true;
    }
    return false;
}
Template.itemShow.inEditMode = function(){
    return Session.get("editMode");
}
Template.itemShow.externalLink = function(l){
    return '<li><a href="'+l[0]+'" target="_blank" class="item-show-link external-link">'+l[1]+'</a></li>';
}
Template.itemShow.inEditModeWiki = function() {
    return Session.equals('editModeType',"wiki");
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
    $(Session.get("currentItem").relatedItems).each(function(x,y){if (y) txt += y+" ";});
    return txt;
}
Template.itemWiki.editWikiExternalLink = function(){
    var txt = "";
    $(Session.get("currentItem").links).each(function(x,y){if (y) txt += "* ["+y[0]+"|"+y[1]+"]\n";});
    return txt;
}

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

// Slider


Template.slider.events({
    'click a':itemLinkShowListEvent,
    'click circle':itemLinkShowListEvent,
    'click .export-wiki':function(){
        Session.set('showExport', true);
        Session.set('exportType', 'wiki');
    },
    'click .export-json':function(){
        Session.set('showExport', true);
        Session.set('exportType', 'json');
    }
})

Template.slider.isAdmin = function(){
    var user = Meteor.user();
    if( user && user.isAdmin){
        return true;
    }
    return false;
}

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
        {c:"network",n:"network attack vectors",q:Items.find({category:"attack vector",family:"network"}).count(),cat:"attack vector",fam:"network"} 
    ];
    var programGraph = new CategoryGraph();
    programGraph.drawGraph("#attack-graph",data,600,200);
    
    data = [
        {c:"eci",n:"Extremely Compartmented Information",q:Items.find({category:"compartiment",family:"ECI"}).count(),cat:"compartiment",fam:"ECI"}
    ];
    var programGraph = new CategoryGraph();
    programGraph.drawGraph("#compartment-graph",data,600,200);

};


Template.export.showExport = function(){
    return Session.equals('showExport', true);
};
Template.export.itemList = function(){
    return  Items.find({},{order:{name:1}}).fetch();
};
Template.export.JSONitemList = function(){
    return  JSON.stringify(Items.find({},{order:{name:1}}).fetch());
};
Template.export.wikiType = function(){
    return Session.equals("exportType","wiki");
}
Template.export.events({
    "click .export-close":function(){
        Session.set('showExport', false);
    },
    'click .export-wiki':function(){
        Session.set('exportType', 'wiki');
    },
    'click .export-json':function(){
        Session.set('exportType', 'json');
    }
});
Template.export.rendered = function(){
    $('.visible-content')
    .html($(".export-content").html())
    .select();
};
