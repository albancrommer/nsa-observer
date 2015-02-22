
// home


Template.home.events({
    'click #home-search-btn': function(e){
        Router.go("search", { name:$("#home-search").val() } );
    },
    'keypress #home-search': function(e){
        // If return pressed
        if(e.charCode === 13){
        Router.go("search", { name:$("#home-search").val() } );
        }
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
    var da = new DataAccessor();
    return da.getTagsList();
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

Template.home.rendered = function(){
    $("#home-search").focus();

}