ItemsStubs                              = {};
ItemsStubs.__proto__ = ItemsMapper;
/**
 * Returns the model properties
 * 
 * @returns {ItemsStubs.getPropertiesList.propertiesList}
 */
ItemsStubs.getPropertiesList = function(){
    var propertiesList                  = this.__proto__.getPropertiesList();
    propertiesList.push("item_id","created_at","user");
    return propertiesList;
}
/**
 * Converts an Item to a Stub
 * 
 * @param   object  item
 * @returns object
 */
ItemsStubs.itemToStub = function(item, _id){
    
    if( ! item ){
        throw ("No item provided");
    }
    var _id                             = item._id || _id || Session.get('currentItem')._id;
    var stubProperties                  = this.getPropertiesList();
    var itemProperties                  = this.__proto__.getPropertiesList();
    var stub                            = _.clone(item);
    delete(stub._id);
    stub.item_id                        = _id;
    stub.created_at                     = new Date();
    stub.user                           = Meteor.user();
    return stub;
    
}
/**
 * 
 * @param   object  stub
 * @param   object  (optional) item
 * @returns object
 */
ItemsStubs.stubToItem = function(stub,item){
    if( ! item ){
        item                            = {};
    }
    if( ! stub ){
        throw ("No stub provided");
    }
    var stubProperties                  = this.getPropertiesList();
    var itemProperties                  = this.__proto__.getPropertiesList();
    _.each(stubProperties, function(k){
       if (-1 !== itemProperties.indexOf(k) && k !== '_id'){
           item[k] = stub[k];
       } 
    });
    return item;
    
}
