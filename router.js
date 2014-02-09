
Router.map(function () {
  this.route('home', {
    path: '/',
    template: 'empty    ',
    data: function(){
    }
  });
});

Router.map(function () {
  this.route('category-family-name', {
    path: '/category/:category/family/:family/name/:name',
    template: 'db',
    data:function(){
        var category        = this.params["category"];
        var family          = this.params["family"];
        var name            = this.params["name"];
        var search          = {category:category,family:family};
        var currentItem     = Items.findOne({name:name});
        Session.set('currentItem', currentItem)
        Session.set('search', search);
        return {search:search};
    }
  });
});

Router.map(function () {
  this.route('category-family', {
    path: '/category/:category/family/:family',
    template: 'db',
    data:function(){
        var category        = this.params["category"];
        var family          = this.params["family"];
        var search          = {category:category,family:family};
        Session.set('search', search);
        return {search:search};
    }
  });
});


Router.map(function () {
  this.route('category', {
    path: '/category/:category',
    template: 'db',
    data:function(){
        var category        = this.params["category"];
        var search          = {category:category};
        Session.set('search', search);
        return {search:search};
    }
  });
});


Router.map(function () {
  this.route('export', {
    path: '/export',
    template: 'export',
    data: function(){
        Session.set('showExport', true)
    }
  });
})

/**
* Loads programs : last route client side
 */
Router.map(function () {
  this.route('item', {
    path: '/:name',
    template: 'db',
    loadingTemplate:'loading',
    waitOn: function () {
        var itemName = this.params["name"];
        return Meteor.subscribe("items",{name:itemName});
    },
    action: function(){
        var itemName = this.params["name"];
        var item = Items.findOne({name:itemName});
        if( ! item || ! ("name" in item)){
            return false;
        }
        togglePanels();
        var category = item.category;
        var family = item.family;
        Session.set('currentItem', item);
        Session.set('search', {category:category,family:family});
        Session.set("itemListIsVisible",true);
        Session.set("itemShowIsVisible",true);
    }
  });
});

Router.map(function () {
  this.route('api-export-json', {
    path: '/api/export/json',
    where: 'server',
    action: function () {
        /* @todo This should be in a dataAccessor
         * 
         */
        var itemList = Items.find().fetch();
        this.response.writeHead(200, {'Content-Type': 'text/json'});
        this.response.end(JSON.stringify(itemList));
    }
  });
});

