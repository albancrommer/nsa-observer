/**
 * Provides gateway for db operations on items
 * 
 * @type object
 * 
 */
ItemsMapper                 = {
    getPropertiesList: function(){
        return [
            "agency",
            "alias",
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
            "status",
            "tags"
        ];  
    },
    /**
     * 
     * @param   String  json_string
     * @returns Boolean
    */
    importJson: function(json_string){
        try {
           var itemList                 = JSON.parse(json_string);
        }catch (e){
            alert("An error occured : "+e);
            return false;
        }
        if ( ! itemList.length){
            alert("Nothing to import");
            return false;
        }
        // Truncates database
        ItemsMapper.truncate();
        _.each(itemList,function(item,key){
            Items.insert(item);
        });
        alert("Imported "+itemList.length+" items.");
        return true;

        
    },
    /**
     * 
     * @param   string  rows
     * @returns boolean
    */
    importWiki: function(rows){

        // Truncates Items db
        ItemsMapper.truncate();
        // Reads the data and attempts to insert
        var parser                          = new ItemParser();
        var itemList                        = parser.run(rows);
        var itemNames                       = [];
        if ( ! itemList.length){
            alert("Nothing to import");
            return false;
        }
        _.each( itemList, function(item){
            // Attempts to insert if not already in 
            if( itemNames.indexOf(item.name) === -1 ){
                itemNames.push(item.name)
                Items.insert(item);
            }
        });
        alert("Imported "+itemList.length+" items.");
        return true;
    },            
    /**
     * 
     * @param object optional newItem
     * @returns boolean
     */
    save : function(newItem){
            var data,
            currentItem                 = Session.get("currentItem"),
            _id                         = currentItem._id,
            newItem                     = newItem || null
        ;
        if( !newItem ){
            // Wiki style
            if( Session.equals('editModeType',"wiki") ){
                // Retrieves textarea
                data                    = $(".wiki-item-container").val();
                var parser              = new ItemParser(),
                    parsed              = parser.run(data),
                    newItem                = {};
                // Refuses wrong data
                if( parsed.length !== 1 ){
                    alert ("invalid data !");
                    return;
                }
                // Retrieves parsed item
                newItem                    = parsed[0];
            // If a standard form edit should exist, do it here 
            }else{
                // @todo
                var elements            = $(".item-data");
            }
        }else{
            if( "_id" in newItem){
                delete newItem["_id"];
            }
        }
        
        // @todo Check item validity
         // Attempts to save the item
         if( Meteor.user().isAdmin ){
             var backupVersion          = ItemsStubs.itemToStub(currentItem);
             // Updates
             Items.update({_id:_id},{$set:newItem},function(err,num){
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
             var draftVersion           = ItemsStubs.itemToStub(newItem, _id);
             // Keeps the backup
             Drafts.insert(draftVersion);
         }
         return true;
         
    },
    /**
     * Wipes the items DB
     *  
     * @returns boolean
     */
    truncate : function(){
        var itemList = Items.find({},{fields:{_id:true}}).fetch();
        _.each( itemList, function(item){
            Items.remove(item);
        });
        return true;

    }
    
}