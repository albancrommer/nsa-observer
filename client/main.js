if( ! (Session.get("itemList") instanceof Array) ){
    Session.set("itemList",[]);
}
if( ! (Session.get("currentItem") ) ){
    Session.set("currentItem",{});
}
if( ! (Session.get("itemListIsVisible") ) ){
    Session.set("itemListIsVisible",false);
}
if( ! (Session.get("itemShowIsVisible") ) ){
    Session.set("itemShowIsVisible",false);
}

// page 
Template.page.itemListIsVisible = function(){
    console.log("call Template.page.itemListIsVisible",Session.get("itemListIsVisible"))
    return Session.get("itemListIsVisible") || false;
}
Template.page.itemShowIsVisible = function(){
    return Session.get("itemShowIsVisible");
}
// itemList
Template.itemList.element= function () {
    return Session.get("itemList") || [];
};

Template.itemList.events({
    'click .close':function(event){
        Session.set("itemListIsVisible",false);
        Session.set("itemShowIsVisible",false);
    }
});

// item
Template.item.events({
  'click a': function () {
    Session.set("currentItem",this);
    Session.set("itemShowIsVisible",true);
  }
});

// itemShow
Template.itemShow.currentItem = function(){
    return Session.get("currentItem");
}

Template.itemShow.events({
 
     'click .close':function(event){
        Session.set("itemShowIsVisible",false);
    },
    'click .internal-link':function(event){
        event.preventDefault();
        var href = $(event.currentTarget).attr("href"),
            matches = /\[\[(.*)\]\]/.exec(href),
            name = matches[1] || null,
            currentItem
            ;
        if( name ){
            currentItem = Items.findOne({name:name});
        }
        if( ! currentItem ){
            document.location.href = "http://wikipedia.org/en/"+name;
            return false;
        }
        Session.set("currentItem",currentItem);
        return false;
    },
    'click .family-link':function(event){
        
        event.preventDefault();
        var family = $(event.currentTarget).attr("family"),
            itemList
            ;
            console.log(family)
        if( ! family ){
            return;
        }
        itemList = Items.find({family:family}).fetch();
        Session.set("itemList",itemList);
        return false;
        
    },
    'click .category-link':function(event){
        
        event.preventDefault();
        var category = $(event.currentTarget).attr("category"),
            itemList
            ;
        if( ! category ){
            return;
        }
        itemList = Items.find({category:category}).fetch();
        Session.set("itemList",itemList);
        return false;
        
    },
});

// nav
Template.nav.events({
    'click a':function(event){
        var 
            element     = $(event.currentTarget),
            category    = element.attr("category"),
            family      = element.attr("family"),
            itemList    = []
        ;
        console.log(element,category,family)
        if( family ){
            itemList    = Items.find({family:family}).fetch();
        }else{
            itemList    = Items.find({category:category}).fetch();
        }
        Session.set("itemListIsVisible",true);
        Session.set("itemList",itemList)
    }
})
