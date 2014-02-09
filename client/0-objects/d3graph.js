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
            .attr("class",function(d){ return "internal-link "+ d.category + " " + d.family;})
            .attr("rel",function(d){return d.name;})
            .call(force.drag);

        var text = svg.append("g").selectAll("a")
            .data(force.nodes())
            .enter()
            .append("a")
            .attr('xlink:href', "#")
            .attr("rx", 8)
            .attr("ry", ".31em")
            .attr("class",function(d){ return "internal-link "+ d.category + " " + d.family;})
            .attr("rel",function(d){return d.name;})
            .attr("onclick",function(){return "alert('foo')"})
            .append("text")
            .attr("class",function(d,i){return (i?"child":"parent") + " " +  d.category + " " + d.family;})
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
