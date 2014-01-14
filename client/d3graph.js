NodeList = {
    nodes : [],
    links : {},
    build : function(){
        var itemList = Items.find({}).fetch(),
                that = this;
        var addLinks = function(item){    
            var it,
                relatedItems;
            for( it in item){
                if( "relatedItems" === it ){
                    relatedItems  = item[it];
                }
            }
            if ( ! relatedItems){
                return;
            }
            for (it=0;it < relatedItems.length;it++) {
                var relatedName = relatedItems[it],
                    matches     = []
                    ;
                if( "" === relatedName){
                    continue;
                }
                if( matches = /\[\[([A-Z0-9\-_]+)\]\]/.exec(relatedName) ){
                    relatedName = matches[1];
                    relatedItem = Items.findOne({name:relatedName});
                    if( relatedItem ){
                        NodeList.addKey(item,relatedItem);
                    }
                }
            }
        };
        var addNodes = function(item){
            that.nodes.push(item._id);
        }
        _.each(itemList,addLinks );
        _.each(itemList,addNodes);
        return this;
    },
    minMaxKey : function(A,B){
    var id_A = A._id,
        id_B = B._id,
        min,
        max,
        it;
        if( id_A === id_B ){
            return false;
        }
        for (it=0;it < id_A.length; it++){
            if( id_A[it] < id_B[it] ){
                min = id_A;
                max = id_B;
            }else if( id_A[it] > id_B[it] ){
                min = id_B;
                max = id_A;
            }
        }
        return [min+max, min, max];
    },
    addKey : function(A,B){
        var tuple = this.minMaxKey(A,B);
        if( ! tuple ){
            return;
        }
        this.links[tuple[0]] = [tuple[1],tuple[2]];
    },
    getContent : function(){
        return this.content;
    },
    drawGraph : function()
    {
	// Declare a spot for the graph
	var svg = d3.select("body").append("svg")
		.attr("width", '100%')
		.attr("height", '89%');

        this.build();
        
	// Create the graph
	var force = d3.layout.force()
		.gravity(.2)
		.distance(250)
		.charge(-1000)
//		.on('tick', tick)
		.size([1000, 350]);
 
	// Add the data
	force.nodes(this.nodes)
		.links(d3.values(this.links))
		.start();	
 
//	// Draw the links
//	var link = svg.selectAll(".link").data(force.links());
// 
//	// Update the new links
//	link.enter().append("line");
// 
//	// Remove the old links
//	link.exit().remove();
// 
//	// Draw the nodes
//	var node = svg.selectAll(".node").data(force.nodes());
// 
//	// Update the new nodes 
//	node.enter().append("svg:g");
// 
//	// Remove the old nodes
//	node.exit().remove();	
// 
//	// Create the tick function which animates the graph
//	function tick()
//	{
//		link.attr("x1", function(d) { return d.source.x; })
//		    .attr("y1", function(d) { return d.source.y; })
//		    .attr("x2", function(d) { return d.target.x; })
//		    .attr("y2", function(d) { return d.target.y; });
//		node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
//	}
    }
}

CategoryGraph ={
    drawGraph : function(){
    }
}
