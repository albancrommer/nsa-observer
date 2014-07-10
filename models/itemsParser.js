/**
 * Converter wiki -> items list
 * 
 * @returns object
 */
ItemParser                              = function(){
    var 
        instance                        = {},
        itemList                        = [],
        currentItem                     = null
    ;
    /**
     * 
     * @returns {Array}
     */
    instance.getItemList                = function(){
        return itemList;
    }

    /**
     * 
     */
    instance.linkSplit                  = function (str){
        var re                          = /(\[\[[a-zA-Z0-9 ]*?\]\])/g,
            res                         = [],
            final                       = [];
        while( true ){
            res                         = re.exec(str)
            if( null === res) {
                break
            }
            final.push(res[1]);
        }
        return final;
    }

    /**
     * 
     * @param {type} row
     * @returns {unresolved}
     */
    instance.read                       = function(row){
        
        var it                          = 0,
            regexp                      = null,
            callback                    = function(){},
            validator                   = function(){},
            tuple                       = [],
            res                         = [],
            expressions                 = [
            [/^== ([A-Z]) ==$/i,function(r){
            }],
            [/=== *(.*?) *?===/i,function(r){
                instance.addItem()
                currentItem             = new Item(r[1]);
            }],
            [/""Short ?Description"" *?: *?(.*?) *?$/i,function(r){
                currentItem.description         = r[1].trim();    
                currentItem.currentState         = "description";
            }],
            [/""Category"" *: *(.*?)$/i,function(r){
                if( "" == r[1].trim()){
                        r[1] = "program";
                };
                currentItem.category         = r[1].trim();    
                currentItem.currentState         = null;
            }],
            [/""Family"" *?: *?(.*?)$/i,function(r){
                if( "" == r[1].trim()){
                                    r[1] = "collect";
                            };
                            currentItem.family         = r[1].trim();    
                            currentItem.currentState         = null;
            }],
            [/""Compartments"" *?: *?(.*?)$/i,function(r){
                currentItem.compartments         = instance.linkSplit(r[1])
                currentItem.currentState         = null;
            }],
            [/""Agency"" *: *(.*?)$/i,function(r){
                if( "" == r[1].trim()){
                        r[1] = "undefined";
                };
                currentItem.agency         = r[1].trim();    
                currentItem.currentState         = null;
            }],
            [/""Related items"" *?: *?(.*?)$/i,function(r){
                currentItem.relatedItems         = instance.linkSplit(r[1])
                currentItem.currentState         = null;
            }],
            [/""Related items \(parents\)"" *?: *?(.*?)$/i,function(r){
                currentItem.relatedItemsParents         = instance.linkSplit(r[1])
                currentItem.currentState         = null;
            }],
            [/""Related items \(children\)"" *?: *?(.*?)$/i,function(r){
                currentItem.relatedItemsChildren         = instance.linkSplit(r[1])
                currentItem.currentState         = null;
            }],
            [/""Tags"" *?: *?(.*?)$/i,function(r){
                currentItem.tags                 = instance.linkSplit(r[1])
                currentItem.currentState         = null;
            }],
            [/""Alias"" *?: *?(.*?)$/i,function(r){
                currentItem.alias                = instance.linkSplit(r[1])
                currentItem.currentState         = null;
            }],
            [/""Status"" *?: *?(.*?)$/i,function(r){
            if( "" == (r[1])){
                r[1] = "unknown";
            };
            currentItem.status          = r[1].trim();    
            currentItem.currentState         = null;                
            }],
            [/""Links"" :/i,function(r){
                currentItem.currentState         = "links";
            }],
            [/\[(.*)\|(.*)\]/i,function(r){
                if( ! r[1] ){
                    instance.log( "[invalid url]"+ row);
                    return;
                }
                url                     = r[1];
                label                   = r[2] ? r[2] : url;
                currentItem.links.push([url,label]); 
            },function(){currentItem.currentState == "links" ? true:false;}],
            [null,function(r){
                if( currentItem.currentState != "links" && "" != row && ! is_null(currentItem) && ! is_null(currentItem.currentState )){
                        currentItem[currentItem.currentState] += row;
                }
            }],
            [null,function(){
                instance.log( "[not parsed]"+ row);
            }]
        ];
        for (it = 0; it < expressions.length; it++) {
            tuple                       = expressions[it];
            regexp                      = tuple[0];
            callback                    = tuple[1];
            validator                   = tuple[2];
            if ( null === regexp) {
                if( ! validator ){
                    break;
                }
            }
            res                         = regexp.exec(row);
            if( res && res.length > 0){
                callback( res );
                return;
            }
        }
    }
    /**
     * 
     */
    instance.log                        = function(str){
        if (console && console.log ){
            console.log(str);
        }
    };
    
    /**
     * 
     */
    instance.addItem                    = function(){
        if( !currentItem){
            return;
        }
        var item                        = currentItem;
        if( ! "name" in item){
            // todo : log
            instance.log("[err] could not retrieve name for "+JSON.stringify(currentItem));
        }
        if( "currentState" in item){
            delete(item.currentState);
        }
        itemList.push(item);
    }
    
    /**
     * 
     * @param {type} doc
     * @returns {@exp;instance@call;getItemList}
     */
    instance.run                        = function(doc){
        var rowList                     = doc.split("\n");
        for(var i = 0; i < rowList.length; i++){
            var row                     = rowList[i].trim();
            if( row ){
                instance.read(row);
            }
        }
        instance.addItem();
        return itemList;
    }
    
    return instance;
    
}