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
count = 0;
CategoryGraph = function(){
    var instance = {};
    instance.max_q = null,
    instance.average_q = null;
    instance.getMedian = function(toSort){
        if( ! toSort.length){
            throw "invalid data provided :"+data
        }
        var med = 0;
        var o;
        for(var i = 0; i < toSort.length; i++){
            o = toSort[i];
            med += o.q;
        }
        med /= (toSort.length);
        return med;
    };
    instance.getMax = function(toSort){
        if( ! toSort.length){
            throw "invalid data provided :"+data
        }
        var max = -999999999;
        var o;
        for(var i = 0; i < toSort.length; i++){
            o = toSort[i];
            if( o.q > max ){
                max = o.q;
            }
        }
        return max;
    };
    instance.getSum = function(toSort){
        if( ! toSort.length){
            throw "invalid data provided :"+data
        }
        var sum = 0;
        var o;
        for(var i = 0; i < toSort.length; i++){
            o = toSort[i];
            sum += o.q;
        }
        return sum;
    };
    instance.sortData = function(data){
        var that = instance;
        var sort = function(toSort,med,deb){
            if( !(toSort instanceof Array) || toSort.length <= 1){
                //console.log( "done: ",toSort,deb)
                return toSort;
            }
            var a = [];
            var b = [];
            var new_med = 0;
            var o;
            var deviance = false;
            for(var i = 0; i < toSort.length; i++){
                o = toSort[i];
                if( i>0 &&  toSort[0].q != o.q){
                    deviance = true;
                }
                new_med += o.q;
                if( o.q <= med ){
                    a.push(o);
                }else{
                    b.push(o);
                }
            }
            if( ! deviance){
                return toSort;
            }
            new_med /= (toSort.length);
            a = sort(a,new_med,"a");
            b = sort(b,new_med,"b");
            var res = b.concat(a);
            //console.log("concated",res)
            return res;
        };
        var q;
        for( var i = 0; i<data.length;i++){
            q = data[i].q;
            that.max_q =  q > that.max_q ? q : that.max_q;
            that.average_q += q;
        }
        that.average_q /= data.length;
        return sort(data,that.average_q,"init");
    };
    instance.sort = function(toSort){
            if( !(toSort instanceof Array) || toSort.length <= 1){
                //console.log( "done: ",toSort,deb)
                return toSort;
            }
            var a = [];
            var b = [];
            var med = instance.getMedian( toSort);
            var o;
            var deviance = false;
            for(var i = 0; i < toSort.length; i++){
                o = toSort[i];
                if( i>0 &&  toSort[0].q != o.q){
                    deviance = true;
                }
                if( o.q <= med ){
                    a.push(o);
                }else{
                    b.push(o);
                }
            }
            if( ! deviance){
                return toSort;
            }
            a = instance.sort(a);
            b = instance.sort(b);
            var res = a.concat(b);
            //console.log("concated",res)
            return res;
        };
    instance.drawGraph = function(selector,data,width,height){
        data = instance.sort(data).reverse();
        $(selector).html("");
        var median = instance.getMax(data);
        var sum = instance.getSum(data);
        var current_sum = sum;
//        console.log("selector: "+selector+", sum: "+sum+" ---------------",data);
        if( ! median ){
            return;
        }
        var svgContainer = d3.select(selector).append("svg")
                                            .attr("width", width)
                                            .attr("height", height);
        var circles = svgContainer.selectAll("circle")
                                  .data(data)
                                  .enter()
                                  .append("circle");
        var circleAttributes = circles
                               .attr("cx", "50%")
                               .attr("cy", "50%")
                               .attr("title", function(d){return d.q+" "+d.n})
                               .attr("category", function(d){return d.cat})
                               .attr("family", function(d){return d.fam})
                               .attr("r", function (d) { 
                                    var q = d.q;
                                    var s = ((current_sum*width)/(sum*1.39));
                                    current_sum -= q;
                                    return s;
                                })
                                .attr("class",function(d){
                                    return "item-show-link "+d.c;
                                });
        var text = svgContainer.selectAll("text")
                                .data(data)
                                .enter()
                                .append("text");

//        var textLabels = text
//                         .attr("x", "1%")
//                         .attr("y", function(d,i) { return height - (1+i)*15 })
//                         .attr("z-index", "50")
//                         .text( function (d) { return d.n; })
//                         .attr("opacity", "0.5")
//                         .attr("font-family", "sans-serif")
//                         .attr("font-size", "10px")
//                         .attr("class", function(d){return "graph-label "+d.c;})   
//                 ;
        }
        return instance;
}

ItemGraph = function(){
    var instance = {};
    instance.drawGraph = function(selector,links,width,height){
        $(selector).html("");
//        console.log("selector: ",selector," ---------------",links.length);
        var svg = d3.select(selector).append("svg")
                                            .attr("width", width)
                                            .attr("height", height);
        // Use elliptical arc path segments to doubly-encode directionality.
        function tick() {
          path.attr("d", linkArc);
          circle.attr("transform", transform);
          text.attr("transform", transform);
        }

        var nodes = {};

        // Compute the distinct nodes from the links.
        links.forEach(function(link) {
          link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
          link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
        });

        var force = d3.layout.force()
            .nodes(d3.values(nodes))
            .links(links)
            .size([width, height])
            .linkDistance(100)
            .charge(-1000)
            .on("tick", tick)
            .start();


        var path = svg.append("g").selectAll("path")
            .data(force.links())
            .enter().append("path")
            .attr("class", function(d) { return "link " + d.type; })
            ;

        var circle = svg.append("g").selectAll("circle")
            .data(force.nodes())
            .enter().append("circle")
            .attr("r", 10)
            .attr("class",function(d){ return "internal-link "+ d.type;})
            .attr("rel",function(d){return d.name;})
            .call(force.drag);

        var text = svg.append("g").selectAll("a")
            .data(force.nodes())
          .enter().append("a")
            .attr("href", "/")
            .attr("rx", 8)
            .attr("ry", ".31em")
            .attr("class",function(d){ return "internal-link "+ d.type;})
            .attr("rel",function(d){return d.name;})
            .attr("onclick",function(){return "alert('foo')"})
            .append("text")
            .attr("class",function(d,i){return i?"child":"parent"})
            .text(function(d) { return d.name; })
                .call(force.drag);
;
//        var text = svg.append("g").selectAll("a")
//            .data(force.nodes())
//          .enter().append("a")
//            .attr("href", "/")
//            .attr("x", 8)
//            .attr("y", ".31em")
//            .attr("class",function(d){ return "internal-link "+ d.type;})
//            .attr("rel",function(d){return d.name;})
//            .append("text")
//            .attr("class",function(d,i){return i?"child":"parent"})
//            .text(function(d) { return d.name; });


        function linkArc(d) {
          var dx = d.target.x - d.source.x,
              dy = d.target.y - d.source.y,
              dr = Math.sqrt(dx * dx + dy * dy);
          return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
        }

        function transform(d) {
          return "translate(" + d.x + "," + d.y + ")";
        }        }
        return instance;
}


BigGraph = function(){
    var instance = {};
    instance.drawGraph = function(selector,hierarchy,width,height){

        console.log(hierarchy);
//        console.log("selector: ",selector," ---------------",hierarchy);

    var margin = {top: 20, right: 120, bottom: 20, left: 120},
        width = 960 - margin.right - margin.left,
        height = 800 - margin.top - margin.bottom;

        var i = 0,
            duration = 750,
            root;

        var tree = d3.layout.tree()
            .size([height, width]);

        var diagonal = d3.svg.diagonal()
            .projection(function(d) { return [d.y, d.x]; });

        var svg = d3.select(selector).append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          root = hierarchy;
          root.x0 = height / 2;
          root.y0 = 0;

          function collapse(d) {
            if (d.children) {
              d._children = d.children;
              d._children.forEach(collapse);
              d.children = null;
            }
          }

          root.children.forEach(collapse);
          update(root);

        d3.select(self.frameElement).style("height", "800px");

        function update(source) {

          // Compute the new tree layout.
          var nodes = tree.nodes(root).reverse(),
              links = tree.links(nodes);

          // Normalize for fixed-depth.
          nodes.forEach(function(d) { d.y = d.depth * 180; });

          // Update the nodes…
          var node = svg.selectAll("g.node")
              .data(nodes, function(d) { return d.id || (d.id = ++i); });

          // Enter any new nodes at the parent's previous position.
          var nodeEnter = node.enter().append("g")
              .attr("class", "node")
              .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
              .on("click", click);

          nodeEnter.append("circle")
              .attr("r", 1e-6)
              .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

          nodeEnter.append("text")
              .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
              .attr("dy", ".35em")
              .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
              .text(function(d) { return d.name; })
              .style("fill-opacity", 1e-6);

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

        nodeUpdate.select("circle")
            .attr("r", 4.5)
            .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

        nodeUpdate.select("text")
            .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
            .remove();

        nodeExit.select("circle")
            .attr("r", 1e-6);

        nodeExit.select("text")
            .style("fill-opacity", 1e-6);

        // Update the links…
        var link = svg.selectAll("path.link")
            .data(links, function(d) { return d.target.id; });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
              var o = {x: source.x0, y: source.y0};
              return diagonal({source: o, target: o});
            });

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
              var o = {x: source.x, y: source.y};
              return diagonal({source: o, target: o});
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
          d.x0 = d.x;
          d.y0 = d.y;
        });
      }

      // Toggle children on click.
      function click(d) {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        update(d);
      }

    }
    
    return instance;
}

