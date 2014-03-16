Template.bigGraph.rendered = function(){
    var dataAccessor                    = new DataAccessor();
    var hierarchy                       = dataAccessor.getTree()
    var bigGraph                        = new BigGraph();
    bigGraph.drawGraph("#bigGraph",hierarchy,600,600);
    

}