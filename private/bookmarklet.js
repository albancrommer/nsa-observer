// javascript:(function(){!function(e,n){function%20t(e){return%20e?p?e.innerText:e.textContent:""}function%20a(e){var%20n=[];f.forEach(function(a){var%20r=a[1],i=!1;e.forEach(function(e){var%20t=new%20RegExp("\\b"+e+"\\b","i"),o=t.exec(r);o&&o.length&&(-1===n.indexOf(e)&&n.push(e),u.push([e,a[0]]),i=!0)}),i&&(a[0].innerHTML=t(a[0]))});var%20a=encodeURI(JSON.stringify(n));h=new%20XMLHttpRequest,h.open("GET",c+"/api/search?q="+a),h.onreadystatechange=function(){4===h.readyState&&200===h.status&&s(JSON.parse(h.response))},h.send()}function%20r(e,n){return'<a%20style="display:inline-block;%20background:#00ccff;color:#fff;%20padding:%200.38em%200.61em;"%20href="'+n+'">%20#'+e+"%20</a>%20"}function%20i(e,n){var%20t=n.innerHTML,a=e.name,i=t.replace(new%20RegExp("\\b"+a+"\\b","i"),r(a,c+"/"+a));n.innerHTML=i}function%20o(e,n){var%20t=n.innerHTML,a=e.name,i=t.replace(new%20RegExp("\\b"+a+"\\b","i"),r(a,c+"/tags/"+a));n.innerHTML=i}function%20s(e){var%20n=e.itemList,t=e.tagList;u.forEach(function(e){var%20a=e[0],r=e[1];a%20in%20n?i(n[a],r):o(t[a],r)})}var%20c="https://www.nsa-observer.net",f=[],u=[],p=document.getElementsByTagName("body")[0].innerText!=n?!0:!1;["p","li","h1","h2","h3","h4"].forEach(function(e){for(var%20n=document.getElementsByTagName(e),a=0;a<n.length;a++)f.push([n[a],t(n[a])])});var%20h=new%20XMLHttpRequest;h.open("GET",c+"/api/list"),h.onreadystatechange=function(){4===h.readyState&&200===h.status&&a(JSON.parse(h.response))},h.send()}(window,void%200);})()
(function (window, undefined) {
//    var host = "http://localhost:3001";
    var host = "https://www.nsa-observer.net";
    var htmlElementList = [];
    var toBindList = [];

    var hasInnerText = (document.getElementsByTagName("body")[0].innerText != undefined) ? true : false;

    /**
     * 
     * @param {type} element
     * @returns String
     */
    function getInnerText(element) {
        if( ! element ){
            return "";
        }
        if (hasInnerText) {
            return element.innerText;
        }
        return element.textContent;
    }

    /* retrieve html elements and their content*/
    ["p", "li", "h1", "h2", "h3", "h4"].forEach(function (k) {
        var list = document.getElementsByTagName(k);
        for (var i = 0;
                i < list.length;
                i++) {
            htmlElementList.push([list[i], getInnerText(list[i])]);
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
                var re = new RegExp('\\b' + symbol + '\\b', 'i');
                var found = re.exec(html);
                if (found && found.length) {
                    if (toLoadList.indexOf(symbol) === -1) {
                        toLoadList.push(symbol);
                    }
                    toBindList.push([symbol, domElement[0]]);
                    reset = true;
                }
            });
            if (reset) {
                domElement[0].innerHTML = getInnerText(domElement[0]);
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

    function drawLink(name, href) {
        return '<a style="display:inline-block; background:#00ccff;color:#fff; padding: 0.38em 0.61em;" href="' + href + '"> #' + name + ' </a> ';
    }

    function drawItem(itemData, element) {

        var old_html = element.innerHTML;
        var name = itemData.name;
        var new_html = old_html.replace(new RegExp("\\b" + name + "\\b", "i"), drawLink(name, host + '/' + name));
        element.innerHTML = new_html;

    }

    function drawTag(tagData, element) {

        var old_html = element.innerHTML;
        var name = tagData.name;
        var new_html = old_html.replace(new RegExp("\\b" + name + "\\b", "i"), drawLink(name, host + '/tags/' + name));
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