
Router.configure({
    loadingTemplate: 'loading',
    layoutTemplate: 'content'
});

Router.addHook("before",function () {
    this.response.setHeader('access-control-allow-origin', '*');
})

Router.map(function () {
    this.route('home', {
        path: '/',
        template: 'empty',
        data: function () {
        }
    });
});

Router.map(function () {
    this.route('bigGraph', {
        path: '/bigGraph',
        template: 'bigGraph',
        waitOn: function () {
            return Meteor.subscribe("items");
        },
        data: function () {
            console.log("bug");
        }
    });
}),
        Router.map(function () {
            this.route('export', {
                path: '/export/:format?',
                data: function () {
                    var format = this.params.format || "wiki";
                    Session.set("exportType", format);
                }
            });
        });

Router.map(function () {
    this.route('import', {
        path: '/import',
        waitOn: function () {
            var itemName = this.params["name"];
            return Meteor.subscribe("userData", {isAdmin: 1});
        }
    });
});

Router.map(function () {
    this.route('category-family-name', {
        path: '/category/:category/family/:family/name/:name',
        template: 'db',
        data: function () {
            var category = this.params["category"];
            var family = this.params["family"];
            var name = this.params["name"];
            var search = {category: category, family: family};
            var currentItem = Items.findOne({name: name});
            Session.set('currentItem', currentItem);
            Session.set('search', search);
            return {search: search};
        }
    });
});

Router.map(function () {
    this.route('category-family', {
        path: '/category/:category/family/:family',
        template: 'db',
        data: function () {
            var category = this.params["category"];
            var family = this.params["family"];
            var search = {category: category, family: family};
            Session.set('search', search);
            return {search: search};
        }
    });
});

Router.map(function () {
    this.route('tags', {
        path: '/tags/:tags',
        template: 'db',
        data: function () {
            var tags = this.params["tags"];
            var search = {tags: {$regex: '.*' + tags + '.*', $options: 'i'}};
            Session.set('search', search);
            return {search: search};
        }
    });
});

Router.map(function () {
    this.route('category', {
        path: '/category/:category',
        template: 'db',
        data: function () {
            var category = this.params["category"];
            var search = {category: category};
            Session.set('search', search);
            return {search: search};
        }
    });
});

Router.map(function () {
    this.route('search', {
        path: '/search/:name',
        template: 'db',
        data: function () {
            var name = this.params["name"];
            var search = {name: name};
            Session.set('search', search);
            Session.set('listName', "Search: " + name);
            return {search: search};

        }
    });
});


Router.map(function () {
    this.route('itemPropose', {
        path: '/itemPropose',
        template: 'itemPropose',
        loadingTemplate: 'loading',
        data: function () {

        }
    });
});


/**
 * Loads programs : last route client side
 */
Router.map(function () {
    this.route('item', {
        path: '/:name',
        template: 'db',
        loadingTemplate: 'loading',
        waitOn: function () {
            var itemName = this.params["name"];
            return Meteor.subscribe("items", {name: itemName});
        },
        data: function () {
            var itemName = this.params["name"];
            var item = Items.findOne({name: itemName});
            if (!item || !("name" in item)) {
                return false;
            }
            var category = item.category;
            var family = item.family;
            Session.set('currentItem', item);
            Session.set('search', {category: category, family: family});
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

/**
 * Returns a list of items and tags
 */
Router.map(function () {
    this.route('api-list', {
        path: '/api/list',
        where: 'server',
        action: function () {
            var da = new DataAccessor();
            var itemList = _.pluck(Items.find({}, {}).fetch(), 'name');
            var tagList = _.pluck(da.getTagsList(), 'tags');
            this.response.writeHead(200, {'Content-Type': 'text/json'});
            this.response.end(JSON.stringify(itemList.concat(tagList)));
        }
    });
});

/**
 * 
 */
Router.map(function () {
    this.route('api-search', {
        path: '/api/search',
        where: 'server',
        action: function () {
            var query = this.request.query;
            var list = [];
            if ("q" in query) {
                list = (query.q);
                list = JSON.parse(list);
            }
            var search = {};
            var list = _.map(list, function (k) {
                return new RegExp(k);
            });
            search["$or"] = [{name: {"$in": list}}, {tags: {"$in": list}}]
            var itemList = Items.find(search).fetch();
            var tagList = {}
            _.each(itemList, function (item, key) {
                if ("tags" in item && item.tags.length) {
                    _.each(item.tags, function (raw_tag) {
                        var tagReg = /\[\[(.+)\]\]/;
                        var match = tagReg.exec(raw_tag);
                        var tag = match[1];
                        if (!(tag in tagList)) {
                            tagList[tag] = [];
                        }
                        tagList[tag].push(item.name);
                    })
                }
            })
            var namedItemList = {};
            _.each(itemList, function (item) {
                namedItemList[item.name] = item;
            })
            this.response.writeHead(200, {'Content-Type': 'text/json', 'Access-Control-Allow-Origin': '*'});
            this.response.end(JSON.stringify({itemList: namedItemList, tagList: tagList}));
        }
    });
});

