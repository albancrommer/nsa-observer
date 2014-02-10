
/**
 * utility : sets autocomplete list on template
 * 
 * @param string property
 * @returns void
 */
var setPropertyValuesList = function(property){
        var valuesList                  = {}
        var allItems                    = Items.find().fetch();
        /**
         * Increments the counter for facets of a property
         * 
         * @param string index A facet of the collection item property
         * @returns void
         */
        function setValue(index){
            if( ! index || index === ""|| index === "undefined"){
                return;
            }            
            index = transformWikiLinks(index,false);
            if(  ! (index in valuesList) && ! valuesList[index] ){
                 valuesList[index] = 0;
                 return;
             }
             var currentValue            = valuesList[index];
             valuesList[index] = ( 1 + currentValue);    
        }
        // Goes through all items to find and set property facets
        _.each(allItems,function(item){
            if( property in item ){
                var value               = item[property];
                if( ! (value instanceof Array) ){
                    value           = [value];
                }
                _.each(value,function(index){
                    setValue(index);
                })
            }
        })
        // Sorts the resuting array by facets count DESC
        var sortable                    = [];
        _.each( valuesList, function(o,i){
            sortable.push([i,o])
        })
        sortable.sort(function(a, b) {return b[1] - a[1]})
        _.map(sortable,function(i,k){
            sortable[k] = i[0];
        })
        // Sets valuesList and property on the template
        Template.itemWiki.valuesList = sortable.sort();
        Template.itemWiki.property = property;
}


Template.itemWiki.rendered = function(){
    // Sets values by default for the first property in list
    var property = $(".item-property-list").find(":selected").val();
    setPropertyValuesList(property);
}

Template.itemWiki.events({
    "change .item-property-list" :function(e){
        var property                    = $(e.currentTarget).find(":selected").val()
        setPropertyValuesList(property);
    },
    "click .item-property-add":function(e){
        var property                    = $(".item-property-list").find(":selected").val(),
            value                       = $(".item-property-value").val();
        if( ! value){
            return;
        }
        var item                = Session.get('currentItem'),
            _id                 = item._id
        ;
        if( item && property ){
            if( ! ( property in item ) ){
                item[property]= [];
            }
            item[property].push('[['+value+']]');
            delete(item._id);
            Items.update(_id,{$set:item},function(err,num){
                // Failed
                if( err ){
                    alert(err);
                }
                // Success
                if( num){}
            });                
        }else{
            alert("Oops. Invalid procedure. Failed to save.");
        }
        
    },
    "keydown .item-property-value":function(e){
        var template = Template.itemWiki;
        if( ! template.property ){
            alert("Choose a category first"); 
        }
        $(e.currentTarget).autocomplete({
            source: template.valuesList,
            minLength:0,
            select : function(event,ui){
                var item                = Session.get('currentItem'),
                    _id                 = item._id
                ;
                if( item && template.property && ui.item){
                    item[template.property].push('[['+ui.item.value+']]');
                    delete(item._id);
                    Items.update(_id,{$set:item},function(err,num){
                        // Failed
                        if( err ){
                            alert(err);
                        }
                        // Success
                        if( num){}
                    });                
                }else{
                    alert("Oops. Invalid procedure. Failed to save.");
                }
            }
        })
    }
});

/**
 * 
 * @returns {String}
 */
Template.itemWiki.properties = function(){

    var arrayProperties                 = ["compartments","relatedItems","relatedItemsParents","relatedItemsChildren"],
        text                            = "";
    _.each(arrayProperties, function(p){
        text += '<option value="'+p+'">'+p+'</option>';
    });
    return text;
};



/**
 * 
 * @param {type} l
 * @returns {String}
 */
Template.itemWiki.editWikiRelatedItems = function(l){
    var txt                             = "",item = Session.get("currentItem");
    $(item.relatedItems).each(function(x,y){if (y) txt += y+" ";});
    return txt;
}

/**
 * 
 * @param {type} l
 * @returns {String}
 */
Template.itemWiki.editWikiInternalLinks = function(prop){
    var txt                             = "",
        item                            = Session.get("currentItem");
    if( ! prop in item){
        return txt;
    }
    $(item[prop]).each(function(x,y){
        if (y) {
            txt += y+" ";
        }
    });
    return txt;
}


/**
 * 
 * @returns {String}
 */
Template.itemWiki.editWikiExternalLink = function(){
    var txt                             = "",item = Session.get("currentItem");
    $(Session.get("currentItem").links).each(function(x,y){if (y) txt += "* ["+y[0]+"|"+y[1]+"]\n";});
    return txt;
}
