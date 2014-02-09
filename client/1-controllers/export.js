
Template.export.itemList = function(){
    return  Items.find({},{order:{name:1}}).fetch();
};
Template.export.JSONitemList = function(){
    return  JSON.stringify(Items.find({},{order:{name:1}}).fetch());
};
Template.export.wikiType = function(){
    return Session.equals("exportType","wiki");
}
Template.export.events({
    "click .export-close":function(){
        Router.go("home");
    },
});
Template.export.rendered = function(){
    $('.visible-content')
    .html($(".export-content").html())
    .select();
};
