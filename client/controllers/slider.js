
// Slider


Template.slider.events({
    'click a':itemLinkShowListEvent,
    'click circle':itemLinkShowListEvent,
    'click .export-wiki':function(){
        Session.set('showExport', true);
        Session.set('exportType', 'wiki');
    },
    'click .export-json':function(){
        Session.set('showExport', true);
        Session.set('exportType', 'json');
    }
})

Template.slider.isAdmin = function(){
    var user = Meteor.user();
    if( user && user.isAdmin){
        return true;
    }
    return false;
}

Template.slider.num = function(){
    return Items.find().count();
}

Template.slider.programs_num = function(){
    return Items.find({category:"program"}).count();
}
Template.slider.attacks_num = function(){
    return Items.find({category:"attack vector"}).count();
}
Template.slider.compartments_num = function(){
    return Items.find({category:"compartment"}).count();
}
Template.slider.undefineds_num = function(){
    return Items.find({category:"undefined"}).count();
}
Template.slider.rendered = function(){
    
    var data;
    //    NodeList.drawGraph();
    data = [
//        {c:"undefineds",n:"undefined",q:Items.find({category:"undefined"}).count(),cat:"undefined"},
        {c:"programs",n:"programs",q:Items.find({category:"program"}).count(),cat:"program"}, 
        {c:"attacks",n:"attack vectors",q:Items.find({category:"attack vector"}).count(),cat:"attack vector"}, 
        {c:"compartments",n:"compartments",q:Items.find({category:"compartment"}).count(),cat:"compartment"}
    ];
    var catGraph = new CategoryGraph();
    catGraph.drawGraph("#categories-graph",data,600,100);
    
    data = [
        {c:"collect",n:"collect programs",q:Items.find({category:"program",family:"collect"}).count(),cat:"program",fam:"collect"},
        {c:"process",n:"process programs",q:Items.find({category:"program",family:"process"}).count(),cat:"program",fam:"process"}, 
        {c:"database",n:"database programs",q:Items.find({category:"program",family:"database"}).count(),cat:"program",fam:"database"}, 
        {c:"target",n:"target programs",q:Items.find({category:"program",family:"target"}).count(),cat:"program",fam:"target"}, 
        {c:"attack",n:"attack programs",q:Items.find({category:"program",family:"attack"}).count(),cat:"program",fam:"attack"}
    ];
    var programGraph = new CategoryGraph();
    programGraph.drawGraph("#programs-graph",data,600,200);
    
    data = [
        {c:"hardware",n:"hardware attack vectors",q:Items.find({category:"attack vector",family:"hardware"}).count(),cat:"attack vector",fam:"hardware"},
        {c:"software",n:"software attack vectors",q:Items.find({category:"attack vector",family:"software"}).count(),cat:"attack vector",fam:"software"}, 
        {c:"network",n:"network attack vectors",q:Items.find({category:"attack vector",family:"network"}).count(),cat:"attack vector",fam:"network"} 
    ];
    var programGraph = new CategoryGraph();
    programGraph.drawGraph("#attack-graph",data,600,200);
    
    data = [
        {c:"eci",n:"Extremely Compartmented Information",q:Items.find({category:"compartiment",family:"ECI"}).count(),cat:"compartiment",fam:"ECI"}
    ];
    var programGraph = new CategoryGraph();
    programGraph.drawGraph("#compartment-graph",data,600,200);

};
