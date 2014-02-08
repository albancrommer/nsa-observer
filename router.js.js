
Router.configure({
  layoutTemplate: 'layout'
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

