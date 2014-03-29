ItemsMapper = {
    getPropertiesList: function(){
        return [
            "agency",
            "category",
            "compartments",
            "description",
            "family",
            "item_id",
            "links",
            "name",
            "relatedItems",
            "relatedItemsChildren",
            "relatedItemsParents",
            "status"
        ];  
    },
    save : function(item){
            var data,
            currentItem                 = Session.get("currentItem"),
            _id                         = currentItem._id,
            item                        = item || null
        ;
        if( !item ){
            
            // Wiki style
            if( Session.equals('editModeType',"wiki") ){
                // Retrieves textarea
                data                        = $(".wiki-item-container").val();
                var parser                  = new itemParser(),
                    parsed                  = parser.run(data),
                    item                    = {};
                // Refuses wrong data
                if( parsed.length !== 1 ){
                    alert ("invalid data !");
                    return;
                }
                // Retrieves parsed item
                item                        = parsed[0];
            // If a standard form edit should exist, do it here 
            }else{
                // @todo
                var elements                = $(".item-data");
            }
        }else{
            if( "_id" in item){
                delete item["_id"];
            }
        }
        // @todo Check item validity
         // Attempts to save the item
         if( Meteor.user().isAdmin ){
             var backupVersion       = _.clone(item);
             delete(backupVersion._id);
             backupVersion.item_id   = _id;
             backupVersion.created_at = new Date();
             backupVersion.user =  Meteor.user();
             // Updates
             Items.update({_id:_id},{$set:item},function(err,num){
                 // Failed
                 if( err ){
                     alert(err);
                     return;
                 }
                 // Keeps the backup
                 Versions.insert(backupVersion);
             });
         // Saves a draft
         }else{
             var _id                     = currentItem._id;
             var draftVersion        = _.clone(item);
             delete(draftVersion._id);
             draftVersion.item_id    = _id;
             draftVersion.created_at = new Date();
             draftVersion.user =  Meteor.user();
             // Keeps the backup
             Drafts.insert(draftVersion);


         }
         
    }
    
}