Template.import.events({
    "click .close" : function(e){
        Session.set('importMode', false);
    },
    'click .import-wiki' : function(e){
        e.preventDefault();
        var rows = $(".import-wrapper textarea").val();
        Template.import.parse(rows);
    },
    'click .import-json' : function(e){
        e.preventDefault();
        console.log($(".import-wrapper textarea"));
    }
})
Template.import.parse = function(rows){
    
    var itemList = Items.find({},{fields:{_id:true}}).fetch();
    _.each( itemList, function(item){
        Items.remove(item);
    });
    var parser      = new itemParser();
    itemList        = parser.run(rows);
    _.each( itemList, function(item){
        Items.insert(item);
    });
}

Template.import.inImportMode = function(){
    return Session.equals('importMode', true);
}

