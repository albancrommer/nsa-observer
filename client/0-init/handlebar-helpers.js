Handlebars.registerHelper("formatDate", function(datetime, format) {
    var moment = window.moment || false;
    if (moment) {
        return moment(datetime).format(format);
    }
    else {
        return datetime.toLocaleDateString() +" "+datetime.getHours()+":"+datetime.getMinutes();
    }
});