
// home


Template.home.events({
    'click #home-search-btn': function(e){
        Router.go("search", { name:$("#home-search").val() } );
        
    }
       
})

Template.home.isAdmin = function(){
    var user = Meteor.user();
    if( user && user.isAdmin){
        return true;
    }
    return false;
}
Template.home.isUser = function(){
    if( Meteor.user() ){
        return true;
    }
    return false;
}

Template.home.num = function(){
    return Items.find().count();
}

Template.home.programs_num = function(){
    return Items.find({category:"program"}).count();
}
Template.home.attacks_num = function(){
    return Items.find({category:"attack vector"}).count();
}
Template.home.getCategoryList = function(category){
    var rawSet = Items.find({category:category},{fields:{name:1,family:1}}).fetch();
    var orderedSet = _.groupBy(_.pluck(rawSet, 'family'));
    var finalSet = [];
    _.each( orderedSet,function(list,family ){
        finalSet.push({family:family, count:list.length,category:category});
    })
    return finalSet
}

Template.home.tagList = function(){
    return [{tags:"phone"},{tags:"gsm"},{tags:"geolocation"},{tags:"router"},{tags:"email"},{tags:"malware"}];
}

Template.home.fullTagList = function(){
    var rawSet = Items.find({},{fields:{"tags":1}}).fetch();
    var fullList = [];
    var sortable = [];
    _.each(rawSet,function(item){
        _.each(item.tags,function(t){ 
            if ( -1 === fullList.indexOf(t) ) {
                var i = /\[?\[?([\w\s]+)\]?\]?/.exec(t)[1];
                fullList.push(t); 
                sortable.push({tags:i}); 
            }; 
        });
    }); 
    var final  = sortable.sort(function(a,b){return a.tags > b.tags })
//    fullList.sort()
    console.log(sortable)
    return final;
}
Template.home.tags_num = function(){
    return Template.home.tags_num;
}

Template.home.programList = function(){
    return Template.home.getCategoryList("program");
}
Template.home.attackList = function(){
    return Template.home.getCategoryList("attack vector");
}
//Template.home.rendered = function(){
//    
//    var data;
//    //    NodeList.drawGraph();
//    data = [
////        {c:"undefineds",n:"undefined",q:Items.find({category:"undefined"}).count(),cat:"undefined"},
//        {c:"programs",n:"programs",q:Items.find({category:"program"}).count(),cat:"program"}, 
//        {c:"attacks",n:"attack vectors",q:Items.find({category:"attack vector"}).count(),cat:"attack vector"}, 
//        {c:"compartments",n:"compartments",q:Items.find({category:"compartment"}).count(),cat:"compartment"}
//    ];
//    var catGraph = new CategoryGraph();
//    catGraph.drawGraph("#categories-graph",data,600,100);
//    
//    data = [
//        {c:"collect",n:"collect programs",q:Items.find({category:"program",family:"collect"}).count(),cat:"program",fam:"collect"},
//        {c:"process",n:"process programs",q:Items.find({category:"program",family:"process"}).count(),cat:"program",fam:"process"}, 
//        {c:"database",n:"database programs",q:Items.find({category:"program",family:"database"}).count(),cat:"program",fam:"database"}, 
//        {c:"target",n:"target programs",q:Items.find({category:"program",family:"target"}).count(),cat:"program",fam:"target"}, 
//        {c:"attack",n:"attack programs",q:Items.find({category:"program",family:"attack"}).count(),cat:"program",fam:"attack"}
//    ];
//    var programGraph = new CategoryGraph();
//    programGraph.drawGraph("#programs-graph",data,600,200);
//    
//    data = [
//        {c:"hardware",n:"hardware attack vectors",q:Items.find({category:"attack vector",family:"hardware"}).count(),cat:"attack vector",fam:"hardware"},
//        {c:"software",n:"software attack vectors",q:Items.find({category:"attack vector",family:"software"}).count(),cat:"attack vector",fam:"software"}, 
//        {c:"network",n:"network attack vectors",q:Items.find({category:"attack vector",family:"network"}).count(),cat:"attack vector",fam:"network"} 
//    ];
//    var programGraph = new CategoryGraph();
//    programGraph.drawGraph("#attack-graph",data,600,200);
//    
//    data = [
//        {c:"eci",n:"Extremely Compartmented Information",q:Items.find({category:"compartiment",family:"ECI"}).count(),cat:"compartiment",fam:"ECI"}
//    ];
//    var programGraph = new CategoryGraph();
//    programGraph.drawGraph("#compartment-graph",data,600,200);
//
//};
