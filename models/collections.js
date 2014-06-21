// declare collections
// this code should be included in both the client and the server
Items       = new Meteor.Collection("items");
Versions    = new Meteor.Collection("versions");
Drafts      = new Meteor.Collection("drafts");

/*
 * @todo : build lists when Items collection ready
distinct = function( options ){
  
  var field = options["field"],
      distinctList = options["distinctList"] || [],
      srcList      = options["srcList"] || [],
      idList       = options["idList"] || {}
      ;
  _.each(srcList,function(a,b){
    var f = a[field] 
    if ( f && distinctList.indexOf( f ) === -1 ) {
      distinctList.push(f);
      idList[f]     = [];
    }
    idList[f].push(a.name);    
  })
}
var categoryList = []
var categoryIdList = {}
var itemList = Items.find().fetch()
distinct( {

  field: "category",
  srcList: itemList,
  distinctList : categoryList,
  idList : categoryIdList  
})
*/