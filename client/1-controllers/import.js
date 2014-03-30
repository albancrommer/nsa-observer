Template.import.events({
    "click .import-close" : function(e){
        Router.go("home");
    },
    'click .import-wiki' : function(e){
        e.preventDefault();
        var rows                        = $(".import-wrapper textarea").val();
        if( ItemsMapper.importWiki(rows)){
            Router.go("home");
        }
    },
    'click .import-json' : function(e){
        e.preventDefault(); 
        var json_string                 = $(".import-wrapper textarea").val();
        if( ItemsMapper.importJson(json_string)){
            Router.go("home");
        }
    }
})


