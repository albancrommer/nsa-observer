ItemsStubs = {};
ItemsStubs.__proto__ = ItemsMapper;
ItemsStubs.getPropertiesList = function(){
    var propertiesList = this.__proto__.getPropertiesList();
    propertiesList.push("item_id","created_at","user");
    return propertiesList;
}
ItemsStubs.itemToStub = function(item){
    
}
ItemsStubs.stubToItem = function(stub,item){
    var stubProperties = this.getPropertiesList();
    var itemProperties = this.__proto__.getPropertiesList();
    _.each(stubProperties, function(k){
       if (-1 !== itemProperties.indexOf(k) && k !== '_id'){
           item[k] = stub[k];
       } 
    });
    return item;
    
}
