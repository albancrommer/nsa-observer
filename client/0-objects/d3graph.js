CategoryGraph = function(){
    var instance = {};
    instance.max_q = null,
    instance.average_q = null;
    instance.getMedian = function(toSort){
        if( ! toSort.length){
            throw "invalid data provided :"+data
        }
        return d3.mean(toSort, function(o) {return o.q; });
    };
    instance.getMax = function(toSort){
        if( ! toSort.length){
            throw "invalid data provided :"+data
        }
        return d3.max(toSort, function(o) { return o.q; });
    };
    instance.getSum = function(toSort){
        if( ! toSort.length){
            throw "invalid data provided :"+data
        }
        return d3.sum(toSort, function(o) { return o.q; });
    };

    instance.drawGraph = function(selector,data,width,height){
        data = data.sort(function(o, p) {return p.q - o.q; });
        $(selector).html("");
        var median = instance.getMax(data);
        var sum = instance.getSum(data);
        var current_sum = sum;
//        console.log("selector: "+selector+", sum: "+sum+" ---------------",data);
        if( ! median ){
            return;
        }

        var color_scale = d3.scale.linear()
            .domain([0, data.length - 1])
            .range(['#4996CD', '#1b4562']);

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
                                .attr("class", "item-show-link")
                                .attr("fill", function(d, i) { return color_scale(i); })

                                .on("mouseover", function(d, i) {
                                    d3.select(this).attr("fill", d3.rgb(color_scale(i)).darker());
                                })
                                .on("mouseout", function(d, i) {
                                    d3.select(this).attr("fill", color_scale(i));
                                })

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
    var css = function(t){
//        return t;
        return t.replace(" ","-");
        return t.replace(/[ !]/g,"-");
    }
    instance.drawGraph = function(selector,links,allItems,width,height){
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
          link.source = nodes[link.source] || (nodes[link.source] = {name: link.source, category:css(allItems[link.source].category), family:css(allItems[link.source].family)});
          link.target = nodes[link.target] || (nodes[link.target] = {name: link.target, category:css(allItems[link.target].category), family:css(allItems[link.target].family)});
            
        });

        var force = d3.layout.force()
            .nodes(d3.values(nodes))
            .links(links)
            .size([width, height])
            .linkDistance(100)
            .charge(-2000)
            .gravity(0.3)
            .on("tick", tick)
            .friction(0.9)
            .start();


        var path = svg.append("g").selectAll("path")
            .data(force.links())
            .enter().append("path")
            .attr("class", function(d) {return "link " + d.type +" "+ d.category + " " + d.family; })
            ;

        var circle = svg.append("g").selectAll("circle")
            .data(force.nodes())
            .enter().append("circle")
            .attr("r", function(d){ 
                var r = Math.sqrt(d.weight) * 8;   
                return r;
            })
            .attr("class",function(d){
                var class_value = "internal-link";
                if(d.category) class_value += " " + d.category;
                if(d.family) class_value += " " + d.family;
                return class_value;
            })
            .attr("rel",function(d){return d.name;})
            .call(force.drag);

        var text = svg.append("g").selectAll("a")
            .data(force.nodes())
            .enter()
            .append("a")
            .attr('xlink:href', "#")
            .attr("rx", 8)
            .attr("ry", ".31em")
            .attr("class",function(d){
                var class_value = "internal-link";
                if(d.category) class_value += " " + d.category;
                if(d.family) class_value += " " + d.family;
                return class_value;
            })
            .attr("rel",function(d){return d.name;})
            .append("text")
            .attr("class",function(d,i){return d.category + " " + d.family;})
            .text(function(d) { return d.name; })
            .call(force.drag);

        function linkArc(d) {
          var dx = d.target.x - d.source.x,
              dy = d.target.y - d.source.y,
//              dr = Math.sqrt(dx * dx + dy * dy);
              dr = 0;
          return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
        }

        function transform(d) {
          return "translate(" + d.x + "," + d.y + ")";
        }        
    }
    
    return instance;
}


BigGraph = function(){
    var instance = {};
    instance.drawGraph = function(selector,hierarchy,width,height){

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

