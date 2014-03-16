DataAccessor = function(){
    
    var instance = {};
    /**
     * 
     * @param {object} search
     * @returns []
     */
    instance.search             = function (query,filters ) {
        var query   = query|| {},
            filters = filters || {},
            dbItemList = [];
        dbItemList = Items.find(query,filters ).fetch();
        return dbItemList ;
    }
    /**
     * 
     * @param {type} item_name
     * @param {type} nodes
     * @returns {dataAccessor.instance.buildHierarchy.hierarchy}
     */
    instance.buildHierarchy = function(item_name,nodes){
        var hierarchy = {name:item_name,children:[]};
            _.each(nodes[item_name],function(item_name){
                hierarchy.children.push( instance.buildHierarchy(item_name,nodes))
            })
        return hierarchy;
    }

    /**
     * 
     * @returns []
     */
    instance.getTree  = function(category){
        var
            query               = {},
            filters             = {fields:{name:1,relatedItemsParents:1},order:{name:1}},
            // raw result
            dbitemList          = [],
            // name => parents
            relatedItemsList    = {},
            // contains the tree roots by name => boolean
            roots               = {"[[NSA]]":true},
            // contains all the trees in the form node_name => {}
            nodes               = {},
            // contains the full hierarchy
            hierarchy           = {name:"root",children:[]}
            ;
        // Fetches data
        if( category ){
            query.category      = category;
        }
        dbitemList                = instance.search(query,filters);
        // Builds the name => parents
        _.each(dbitemList,function(item){
            if (item.relatedItemsParents.length){
                relatedItemsList[item.name] = item.relatedItemsParents;
            }
        })

        // Runs through data
        _.each( relatedItemsList, function(parentItemList,child_name){
            child_name          = "[["+child_name+"]]"
            // adds child to nodes if required
            if( !( child_name in nodes)){
                nodes[child_name] = [];
            }
            // sets as false in roots list if has parents
            if( parentItemList.length ){
                roots[child_name]     = false;
            }
            // goes through parents
            _.each(parentItemList,function(parent_name){
                // adds parents to nodes if required
                if( ! (parent_name in nodes)){
                    nodes[parent_name] = [];
                }
                // adds child to parent node
                nodes[parent_name].push(child_name);                
                // adds parent to root if not set as false
                if( ! ( child_name in roots ) && roots[child_name] !== false ){
                    roots[child_name] = true;
                }
            })
            
            
        })
        
        _.each(roots,function(root_bool,item_name){
            if( root_bool ){
                hierarchy.children.push(instance.buildHierarchy(item_name,nodes));
            }
        
        })
        return hierarchy;
    }
    return instance;
}

