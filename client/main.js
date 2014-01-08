var isDisplayed = true;
var isHidden = false;

var itemLinkShowList = function(event){
    var 
        element     = $(event.currentTarget),
        category    = element.attr("category"),
        family      = element.attr("family"),
        itemList    = []
    ;
    if( family ){
        itemList    = Items.find({family:family}).fetch();
        Session.set("listName","Family : "+family)
    }else{
        itemList    = Items.find({category:category}).fetch();
        Session.set("listName","Category : "+category)
    }
    togglePanels(isDisplayed,["itemListIsVisible"]);
    Session.set("itemList",itemList)
    
}

var togglePanels = function (hideOrShow,panels){
    console.log(hideOrShow,panels)
    var iterator,
        state = hideOrShow || false,
        panels = panels || ["itemListIsVisible","itemShowIsVisible"];
        for( iterator = 0; iterator < panels.length; iterator++ ){
            Session.set(panels[iterator],state);
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
    'click .close':function(event){
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
    return Session.get("currentItem");
}

Template.itemShow.events({
 
     'click .close':function(event){

        togglePanels(isHidden,["itemShowIsVisible"]);
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
        itemList = Items.find({family:family},{sorted:{name:1}}).fetch();
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
        itemList = Items.find({category:category},{sorted:{name:1}}).fetch();
        Session.set("itemList",itemList);
        return false;
        
    },
});


// nav

Template.nav.rendered = function(){
    $('.nav-container').data("toggled",true);
}

Template.nav.events({
    'click a':itemLinkShowList,
    'click .menu-toggle':function(e){
        var el          = $(".nav-container"),
            key         = "toggled",
            orig        = "originalTranslate",
            transform   = "",
            toggled     = el.data(key);
        if( toggled ){
            transform = "translateX(0%)"
            el.data(orig,el.css("transform"));
        }else{
            transform = el.data(orig);
        }
        el.css("transform",transform)
        el.data(key,!toggled)
        console.log(el,toggled,transform,el.data(key))
    }
})


// Slider

Template.slider.events({
    'click a':itemLinkShowList
})

Template.slider.rendered = function(){
    $.jInvertScroll(['.scroll'],{onScroll:function(){
    }});
}