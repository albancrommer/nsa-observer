
Item = function(name){

        var instance = {};
	instance.name			= name;
	instance.category 		= "";
	instance.relatedItems           = [];
	instance.family			= "";
	instance.status			= "";
	instance.links			= [];
	instance.currentState	= null;
	
	instance.__construct = function( name ){
		instance.name = name;
	}
	instance.getInsertString = function(){
            str = 'Items.insert({name:"'+instance.get("name")+'",category:"'+instance.get("category")+'",family:"'+instance.get("family")+'",status:"'+instance.get("status")+'",description:"'+instance.get("description")+'",relatedItems:'+instance.get("relatedItems", TRUE)+',links:'+instance.get("links", TRUE)+'});';
            return str.replace("\n","","g")+"\n";
	}
	instance.get = function(name,json){
            if( json){
                return JSON.stringify(instance.name);
            }
            return addslashes(instance.name);
	}
        return instance;
}

itemParser = function(){
    var 
        instance = {},
        itemList = [],
        currentItem = null
    ;
    instance.getItemList = function(){
        return itemList;
    }
    
    instance.read = function(row){
        
        var it = 0,
            regexp = null,
            callback = function(){},
            validator = function(){},
            tuple = [],
            res = [],
            expressions = [
            [/^== ([A-Z]) ==$/,function(r){
                instance.addItem()
            }],
            [/=== +(.+?) +===/,function(r){
                instance.addItem()
                currentItem = new Item(r[1]);
            }],
            [/""Short *?Description"" *?: *?(.*?) *?$/,function(r){
                currentItem.description = r[1].trim();	
                currentItem.currentState = "description";
            }],
            [/""Category"" *: *(.*?)$/,function(r){

			if( "" == r[1].trim()){
				r[1] = "program";
			};
			currentItem.category = r[1].trim();	
			currentItem.currentState = null;
            }],
            [/""Family"" *?: *?(.*?)$/,function(r){
                if( "" == r[1].trim()){
                                    r[1] = "collect";
                            };
                            currentItem.family = r[1].trim();	
                            currentItem.currentState = null;
            }],
            [/""Related items"" *?: *?(.*?)$/,function(r){
                currentItem.relatedItems = r[1].trim().split(" ");
                currentItem.currentState = null;
            }],
            [/""Status"" *?: *?(.*?)$/,function(r){
			if( "" == (r[1])){
				r[1] = "unknown";
			};
			currentItem.status = r[1].trim();	
			currentItem.currentState = null;                
            }],
            [/""Links"" :/,function(r){
                currentItem.currentState = "links";
            }],
            [/""Links"" :/,function(r){
                currentItem.currentState = "links";
            }],
            [/\[(.*)\|(.*)\]/,function(r){
                if( ! r[1] ){
                    instance.log( "[invalid url]"+ row);
                    return;
                }
                url 	= r[1];
                label	= r[2] ? r[2] : url;
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
            tuple = expressions[it];
            regexp = tuple[0];
            callback = tuple[1];
            validator = tuple[2];
            if ( null === regexp) {
                if( ! validator ){
                    break;
                }
            }
            res = regexp.exec(row);
            if( res && res.length > 0){
                callback( res );
                return;
            }
        }
    }
    /**
     * 
     */
    instance.log = function(str){
        console.log(str);
    };
    
    /**
     * 
     */
    instance.addItem = function(){
        if( !currentItem){
            return;
        }
        var item = currentItem, name = currentItem.name, list = itemList;
        if( ! name ){
            // todo : log
            instance.log("[err] could not retrieve name for "+JSON.stringify(currentItem));
        }
        itemList.push(item);
        list = itemList;
    }
    
    /**
     * 
     * @param {type} doc
     * @returns {@exp;instance@call;getItemList}
     */
    instance.run = function(doc){
        var rowList = doc.split("\n");
        for(var i = 0; i < rowList.length; i++){
            var row = rowList[i].trim();
            if( row ){
                instance.read(row);
            }
        }
        instance.addItem();
        return itemList;
    }
    
    return instance;
    
}