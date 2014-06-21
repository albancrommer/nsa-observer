/**
 * New items constructor
 * 
 * @param   String  name
 * @returns object
 */
Item                                    = function(name){

    var instance                        = {};
    instance.agency                     = "";
    instance.alias                      = "";
    instance.category                   = "";
    instance.compartments               = [];
    instance.currentState               = null;
    instance.family                     = "";
    instance.links                      = [];
    instance.name                       = name;
    instance.relatedItemsParents        = [];
    instance.relatedItemsChildren       = [];
    instance.relatedItems               = [];
    instance.status                     = "";
    instance.tags                       = "";
    
    instance.__construct                = function( name ){
        instance.name                   = name;
    }
    instance.getInsertString            = function(){
            str                         = 'Items.insert({name:"'+instance.get("name")+'",category:"'+instance.get("category")+'",family:"'+instance.get("family")+'",status:"'+instance.get("status")+'",description:"'+instance.get("description")+'",relatedItems:'+instance.get("relatedItems", true)+',links:'+instance.get("links", true)+'});';
            return str.replace("\n","","g")+"\n";
    }
    instance.get                        = function(name,json){
            if( json){
                return JSON.stringify(instance.name);
            }
            return addslashes(instance.name);
    }
        return instance;
}