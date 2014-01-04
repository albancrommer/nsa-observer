if( ! (Session.get("itemList") instanceof Array) ){
    Session.set("itemList",[]);
}

Template.itemList.element= function () {
    return Session.get("itemList") || [];
};
Template.item.events({
  'click a': function () {
      $(".item-show-outer").show().html(Template.itemShow(this))
  }
});
Template.nav.events({
    'click a':function(event){
        var category = $(event.currentTarget).attr("category"),
            itemList = Items.find({family:category}).fetch()
        ;
        $(".item-list-outer").show()
        Session.set("itemList",itemList)
    }
})