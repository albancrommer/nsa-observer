// javascript:(function(){!function(){function n(n){var e=[];o.forEach(function(t){var a=t[1],r=!1;n.forEach(function(n){var i=new RegExp("\\b"+n+"\\b","i"),o=i.exec(a);o&&o.length&&(-1===e.indexOf(n)&&e.push(n),c.push([n,t[0]]),r=!0)}),r&&(t[0].innerHTML=t[0].innerText)});var t=encodeURI(JSON.stringify(e));s=new XMLHttpRequest,s.open("GET",i+"/api/search?q="+t),s.onreadystatechange=function(){4===s.readyState&&200===s.status&&r(JSON.parse(s.response))},s.send()}function e(n,e){return'<a style="display:inline-block; background:#00ccff;color:#fff;" href="'+e+'"> -@NSAO '+n+"- </a> "}function t(n,t){var a=t.innerHTML,r=n.name,o=a.replace(new RegExp("\\b"+r+"\\b","i"),e(r,i+"/"+r));t.innerHTML=o,console.log(t,"old",a,"new",o)}function a(n,t){var a=t.innerHTML,r=n.name,o=a.replace(new RegExp("\\b"+r+"\\b","i"),e(r,i+"/tags/"+r));t.innerHTML=o}function r(n){var e=n.itemList,r=n.tagList;c.forEach(function(n){var i=n[0],o=n[1];i in e?t(e[i],o):a(r[i],o)})}var i="https://localhost:3001",o=[],c=[];["p","li","h1","h2","h3","h4"].forEach(function(n){for(var e=document.getElementsByTagName(n),t=0;t<e.length;t++)o.push([e[t],e[t].innerText])});var s=new XMLHttpRequest;s.open("GET",i+"/api/list"),s.onreadystatechange=function(){4===s.readyState&&200===s.status&&n(JSON.parse(s.response))},s.send()}(window,void 0);})();
(function (window, undefined) {
//    var host = "http://localhost:3001";
    var host = "https://www.nsa-observer.net";
    var htmlElementList = [];
    var toBindList = [];

    /* retrieve html elements and their content*/
    ["p", "li", "h1", "h2", "h3", "h4"].forEach(function (k) {
        var list = document.getElementsByTagName(k);
        for (var i = 0;
                i < list.length;
                i++) {
            htmlElementList.push([list[i], list[i].innerText]);
        }
    });

    /* fetch symbols list*/
    var xhr = new XMLHttpRequest();
    xhr.open("GET", host + "/api/list");
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState === 4 && xhr.status === 200) {
            stage2(JSON.parse(xhr.response));
        }
    };
    xhr.send();

    function stage2(symbolsList) {

        /* Build list of element,symbol */
        var toLoadList = [];
        htmlElementList.forEach(function (domElement) {
            var html = domElement[1];
            var reset = false;
            symbolsList.forEach(function (symbol) {
                var re = new RegExp('\\b' + symbol + '\\b','i');
                var found = re.exec(html);
                if (found && found.length) {
                    if (toLoadList.indexOf(symbol) === -1) {
                        toLoadList.push(symbol);
                    }
                    toBindList.push([symbol, domElement[0]]);
                    reset = true;
                }
            });
            if( reset ){
                domElement[0].innerHTML = domElement[0].innerText;
            }
        });

        var data_str = encodeURI(JSON.stringify(toLoadList));
        /* Fetch symbols content */
        xhr = new XMLHttpRequest();
        xhr.open("GET", host + "/api/search?q=" + data_str);
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState === 4 && xhr.status === 200) {
                stage3(JSON.parse(xhr.response));
            }
        };
        xhr.send();

    }

    function drawLink( name, href ){
        return '<a style="display:inline-block; background:#00ccff;color:#fff;" href="' + href + '"> -@NSAO '+ name +'- </a> ';
    }

    function drawItem(itemData, element) {

        var old_html = element.innerHTML;
        var name = itemData.name;
        var new_html = old_html.replace(new RegExp("\\b"+name+"\\b","i"), drawLink(name,host + '/' + name ));
        element.innerHTML = new_html;
        console.log( element, "old", old_html,"new", new_html)

    }

    function drawTag(tagData, element) {

        var old_html = element.innerHTML;
        var name = tagData.name;
        var new_html = old_html.replace(new RegExp("\\b"+name+"\\b","i"), drawLink(name,host + '/tags/' + name ) );
        element.innerHTML = new_html;

    }


    /* Inject and Bind content */
    function stage3(dataList) {

        var itemList = dataList.itemList;
        var tagList = dataList.tagList;
        // Note bindData is an array of
        // ["XKEYSCORE", p]

        toBindList.forEach(function (bindData) {

            var name = bindData[0];
            var element = bindData[1];
            if (name in itemList) {
                drawItem(itemList[name], element)
            } else {
                drawTag(tagList[name], element)
            }
        })

    }
})(window, undefined);