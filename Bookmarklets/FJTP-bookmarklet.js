(function(){
  
  alert("script started on document: " + window.document.location.href);

  if (window.document.location === undefined || window.document.location.href === undefined || window.document.location.href.substring(36) != "https://www.frankenjura.com/klettern") {
    alert("script only usable for 'www.frankenjura.com/klettern'");
    return;
  }

  // check availability of jQuery
	if (window.jQuery === undefined) {
	  alert("jQuery not available");
    return;
	}
	var v = "1.3.2"; if (window.jQuery.fn.jquery < v) {alert("jQuery version to old");}
	
  alert("start processing page");
  var workDocument = window.document;
	FJCTPmodifyDocument(window.document);

    var MASK_ID_PREPROCESSED = "__FJCTP_mask_preprocessed__";
    var MASK_ID_PROCESSING = "__FJCTP_mask_processing__";
    var MASK_ID_PROCESSED = "__FJCTP_mask_processed__";

    function setProcessPages(processPages) {
    		return setCookie("FJCTPProcessPages", processPages, 7);
    }

    function getProcessPages() {
    		return getCookie("FJCTPProcessPages");
    }

    function isPreProcessed() {
        var div = workDocument.getElementById(MASK_ID_PREPROCESSED);
        if (div) {
            return true;
        }
        return false;
    }

    function isProcesssing() {
        var div = workDocument.getElementById(MASK_ID_PROCESSING);
        if (div) {
            return true;
        }
        return false;
    }

    function isProcessed() {
        var div = workDocument.getElementById(MASK_ID_PROCESSED);
        if (div) {
            return true;
        }
        return false;
    }

    function markAsPreProcess() {
        var div = workDocument.getElementById(MASK_ID_PREPROCESSED);
        if (!div) {
            div = workDocument.createElement("div");
            div.id = MASK_ID_PREPROCESSED;
            div.style.position = "fixed";
            div.style.top = "0px";
            div.style.left = "0px";
            div.style.height = "0%";
            div.style.width = "0%";
            div.style.backgroundColor = "black";
            div.style.zIndex = 0;
            div.style.opacity = 0;
            workDocument.body.appendChild(div);
            //div.offsetWidth;
        }
    }

    function unmarkAsPreProcessed() {
        var div = workDocument.getElementById(MASK_ID_PREPROCESSED);
        if (div) {
            workDocument.body.removeChild(div);
        }
    }

    function processStart() {
        var div = workDocument.getElementById(MASK_ID_PROCESSING);
        if (!div) {
            div = workDocument.createElement("div");
            div.id = MASK_ID_PROCESSING;
            div.style.position = "fixed";
            div.style.top = "0px";
            div.style.left = "0px";
            div.style.height = "100%";
            div.style.width = "100%";
            div.style.backgroundColor = "black";
            div.style.zIndex = 2147483647;
            div.style.opacity = 0;
            div.style["-webkit-transition"] = "opacity 250ms";
            workDocument.body.appendChild(div);
            div.offsetWidth;
            div.style.opacity = .3;
        }
    }

    function processEnd() {
        var div = workDocument.getElementById(MASK_ID_PROCESSING);
        if (div)
            workDocument.body.removeChild(div);

        div = workDocument.getElementById(MASK_ID_PROCESSED);
        if (!div) {
            div = workDocument.createElement("div");
            div.id = MASK_ID_PROCESSED;
            div.style.position = "fixed";
            div.style.top = "0px";
            div.style.left = "0px";
            div.style.height = "0%";
            div.style.width = "0%";
            div.style.backgroundColor = "black";
            div.style.zIndex = 0;
            div.style.opacity = 0;
            workDocument.body.appendChild(div);
            //div.offsetWidth;
        }

        //unmarkAsPreProcessed();

        //createDownloadBanner();
    }

    // functions for FJCTP modifications...
    var verbose = false;

    function FJCTPremoveGoogleAnalytics(html) {
        Array.prototype.forEach.call(html.querySelectorAll("script"), function (element) {
            var matches = element.textContent.match(/GoogleAnalytics/gi);
            if (matches != null && matches.length > 0) {
                if (verbose) alert("removing script: \n" + element.textContent);
                element.parentElement.removeChild(element);
            }
            else {
                var srcArrrib = element.getAttribute("src");
                if (srcArrrib) {
                    var matches = srcArrrib.match(/google.*analytics/gi);
                    if (matches != null && matches.length > 0) {
                        if (verbose) alert("removing script: \n" + srcArrrib);
                        element.parentElement.removeChild(element);
                    }
                }
            }
        });
    }

    function FJCTPremoveAllScripts(dochtml) {
        if (verbose) alert("FJCTPremoveAllScripts");
        Array.prototype.forEach.call(dochtml.querySelectorAll("*[onload]"), function (node) {
            node.removeAttribute("onload");
        });

        Array.prototype.forEach.call(dochtml.querySelectorAll("script"), function (element) {
            element.parentElement.removeChild(element);
        });
    }

    function FJCTPremoveElement(html, selector) {
        Array.prototype.forEach.call(html.querySelectorAll(selector), function (element) {
            if (verbose) alert("removing element: " + selector);
            element.parentElement.removeChild(element);
        });
    }

    function FJCTPmodifyDivWithClassName(html, classname, newClassName) {
        Array.prototype.forEach.call(html.querySelectorAll("div." + classname), function (element) {
            if (verbose) alert("modifing div class name from: " + element.attributes.getNamedItem("class").value + " to: " + newClassName);
            element.attributes.getNamedItem("class").value = newClassName;
        });
    }

    // something about arrays:
    //var replaceFromTo = [,]; //[[]]; //new Array(matches.length, 2);
    //replaceFromTo[i][0] = matches[i].toString();
    //replaceFromTo[i][1] = matches[i].toString().replace(/$/i, "<b>").replace(/$/i, "</b>");

    // END OF GENERAL FUNCTIONS
    //--------------------------------------------------------------------------------------------------
    // here starts the main FJCTP processing (processsing logic)...

    function FJCTPShowDebugMessage(message) {
        //alert(message);

        var html = workDocument.documentElement;
        Array.prototype.forEach.call(html.querySelectorAll("body:nth-of-type(1)"), function (element) {

            var parent = element;//.parentElement;

            var hr = workDocument.createElement("HR");
            hr.style.pageBreakAfter = "always";
            //parent.insertBefore(hr, element);
            parent.appendChild(hr);

            var paragraph = workDocument.createElement("P");
            paragraph.textContent = message;
            paragraph.style.pageBreakAfter = "always";
            element.appendChild(paragraph);

            var hr = workDocument.createElement("HR");
            hr.style.pageBreakAfter = "always";
            element.appendChild(hr);
        });
    }

    function FJCTPmodifyPoiTableClassNameToSmall(html) {
        Array.prototype.forEach.call(html.querySelectorAll("table.poi-table-big"), function (element) {
            if (verbose) alert("modifing class name of table from poi-table-big to poi-table-small");
            element.className = "poi-table-small";
        });
    }

    function FJCTPmodifyHeadlineAndGragTable(html) {
        // prepare divs
        //FJCTPmodifyPoiTableClassNameToSmall(html);

        // remove linebreaks in headers
        Array.prototype.forEach.call(html.querySelectorAll(/*"div.poi-section>*/"table.poi-table-small>tbody>tr>th"), function (element) {
            element.textContent = element.textContent.replace("- ", "").replace(": ", ":");
        });

        // move crag name and crag stars
        //<tr>
        //    <td colspan="2">
        //        <h2>Weißenstein 03 - Rechter Teil</h2>
        //        <img class="stars" src="/images/icons/sterne5.gif" alt="Sterne">
        //        <br>
        //        <br>
        //    </td>
        //</tr>
        var td = workDocument.createElement("td");
        td.colSpan = "2";
        Array.prototype.forEach.call(html.querySelectorAll("div#breadcrumb-container>ul~h2:nth-of-type(1)"), function (element) {
            if (verbose) alert("moving crag name: " + element.textContent);
            element.parentElement.removeChild(element);
            td.appendChild(element);

            //// misuse crag name as anchor for backward link to overview page
            //var anchor = workDocument.createElement("a");
            //anchor.onclick = window.history.back();
            ////anchor.href = "https://www.frankenjura.com/klettern/personal/login";
            //anchor.appendChild(element);
            //td.appendChild(anchor);
        });
        Array.prototype.forEach.call(html.querySelectorAll("div#breadcrumb-container>ul~img.stars"), function (element) {
            if (verbose) alert("moving crag stars: " + element.textContent);
            element.parentElement.removeChild(element);
            //td.appendChild(element);
            // misuse grag stars as anchor for login/logout
            //<a href="/klettern/personal/login">Anmelden</a>
            //<a href="/klettern/personal/logout">Logout</a>
            var anchor = workDocument.createElement("a");
            anchor.href = "https://www.frankenjura.com/klettern/personal/login"; 
            anchor.appendChild(element);
            td.appendChild(anchor);
        });
        td.appendChild(workDocument.createElement("br"));
        td.appendChild(workDocument.createElement("br"));

        Array.prototype.forEach.call(html.querySelectorAll(/*"div.poi-section>*/"table.poi-table-small>tbody>tr:nth-of-type(1)"), function (element) {
            if (verbose) alert("inserting tr");
            var tr = workDocument.createElement("tr");
            // tag first original table row
            element.id = "first-original-row";
            tr.appendChild(td);
            element.parentElement.insertBefore(tr, element);
        });

        // add GPS position
        var gpsCoords = FJTCPreadGpsLocation(html);
        if (gpsCoords.length > 0) {
            Array.prototype.forEach.call(html.querySelectorAll( /*"div.poi-section>*/"table.poi-table-small>tbody>tr#first-original-row"), function(element) {
                var tr2 = workDocument.createElement("tr");
                var th2 = workDocument.createElement("th");
                var td2 = workDocument.createElement("td");
                th2.textContent = "GPS:";
                //td2.textContent = gpsCoords;
                var anchor = workDocument.createElement("a");
                anchor.href = "https://maps.google.de/maps?q=" + gpsCoords;
                anchor.text = gpsCoords;
                anchor.style.fontWeight = "normal";
                td2.appendChild(anchor);
                tr2.appendChild(th2);
                tr2.appendChild(td2);
                element.parentElement.insertBefore(tr2, element);
            });
        }

        // add Region and Gebiet
        //<ul id="breadcrumb">
        //    <li>»   <a href="/klettern/region/1">Frankenjura</a></li>
        //    <li>»  Region <a href="/klettern/region/5">Südwest</a></li>
        //    <li>»  Gebiet <a href="/klettern/region/39">Stierberg, Leupoldstein und Betzenstein</a></li>
        //</ul>
        var region;
        var gebiet;
        Array.prototype.forEach.call(html.querySelectorAll("ul#breadcrumb>li>a"), function (element) {
            if (region == undefined && element.parentElement.textContent.indexOf("Region") >= 0) {
                region = element;
                region.style.fontWeight = "normal";
            }
            if (gebiet == undefined && element.parentElement.textContent.indexOf("Gebiet") >= 0) {
                gebiet = element;
                gebiet.style.fontWeight = "normal";
            }
        });
        if (gebiet != undefined) {
            Array.prototype.forEach.call(html.querySelectorAll( /*"div.poi-section>*/"table.poi-table-small>tbody>tr#first-original-row"), function (element) {
                var tr2 = workDocument.createElement("tr");
                var th2 = workDocument.createElement("th");
                var td2 = workDocument.createElement("td");
                th2.textContent = "Gebiet:";
                td2.appendChild(gebiet);
                tr2.appendChild(th2);
                tr2.appendChild(td2);
                element.parentElement.insertBefore(tr2, element);
            });
        }
        if (region != undefined) {
            Array.prototype.forEach.call(html.querySelectorAll( /*"div.poi-section>*/"table.poi-table-small>tbody>tr#first-original-row"), function (element) {
                var tr2 = workDocument.createElement("tr");
                var th2 = workDocument.createElement("th");
                var td2 = workDocument.createElement("td");
                th2.textContent = "Region:";
                td2.appendChild(region);
                tr2.appendChild(th2);
                tr2.appendChild(td2);
                element.parentElement.insertBefore(tr2, element);
            });
        }

        //// remove crag location navigation menu from header
        //Array.prototype.forEach.call(html.querySelectorAll("ul#breadcrumb"), function (element) {
        //    if (verbose) alert("removing ul#breadcrumb");
        //    element.parentElement.removeChild(element);
        //});
        //// remove FrankenJura crag icon from Header
        //Array.prototype.forEach.call(html.querySelectorAll("img[src*='/images/pages/poi_crag.png']"), function (element) {
        //    if (verbose) alert("removing img: " + element.attributes.getNamedItem("src").value);
        //    element.parentElement.removeChild(element);
        //});
        // remove complete header
        Array.prototype.forEach.call(html.querySelectorAll("div#breadcrumb-container"), function (element) {
            if (verbose) alert("removing ul#breadcrumb");
            element.parentElement.removeChild(element);
        });
    }

    function FJCTPreplaceFrankenJuraPremiumTopoImage(html) {
        // prepare divs
        //FJCTPmodifyPoiTableClassNameToSmall(html);

        //FROM:
        //<a href="/klettern/premium">
        //<img src="/images/content/topo_premium.png" alt="Premium. Kompletter Topo benötigt einen Premium Account" style="margin: 0">
        //</a>
        //<img src="/images/php/topo_db?s=467" alt="Topo" class="border" id="topo_image">
        //
        //TO:
        //<img src="https://www.frankenjura.com/images/php/topo_print_db.php?s=385" alt="Topo" class="border" id="topo_image">

        Array.prototype.forEach.call(html.querySelectorAll("a[href*='/klettern/premium']"), function (element) {
            if (verbose) alert("removing a: " + element.attributes.getNamedItem("href").value);
            element.parentElement.removeChild(element);
        });
        Array.prototype.forEach.call(html.querySelectorAll("img[src*='/images/php/topo_db']"), function (element) {
            if (verbose) alert("removing img: " + element.attributes.getNamedItem("src").value);
            element.parentElement.removeChild(element);
        });
        Array.prototype.forEach.call(html.querySelectorAll("div.image-vertical"), function (element) {
            if (verbose) alert("removing div.image-vertical");
            element.parentElement.removeChild(element);
        });
        Array.prototype.forEach.call(html.querySelectorAll("div.image-horizontal"), function (element) {
            if (verbose) alert("removing div.image-vertical");
            element.parentElement.removeChild(element);
        });

        Array.prototype.forEach.call(html.querySelectorAll("div.poi-section>h4+p"), function (element) {
            if (element.previousElementSibling.textContent == "Beschreibung") {
                if (element.textContent.length > 0 && element.textContent.indexOf("Foto") >= 0) {
                    if (verbose) alert("removing Beschreibung: " + element.textContent);
                    element.parentElement.removeChild(element.previousElementSibling);
                    element.parentElement.removeChild(element);
                } 
            }
        });

        var poiId = FJCTPreadPoiId(html);
        var poiSrc = "https://www.frankenjura.com/images/php/topo_print_db.php?s=" + poiId;

        var img = workDocument.createElement("img");
        img.src = poiSrc;
        img.alt = "Topo " + poiId;
        img.style.width = "540px"; //"500px";
        img.style.maxWidth = "570px";  //table with + maxWith of TopImage must not exceed 1000px
        img.style.margin = "0";
        Array.prototype.forEach.call(html.querySelectorAll("div.poi-section>table.poi-table-small"), function(element) {
            if (verbose) alert("adding div.image-vertical>img behind table.poi-table-small");
            element.parentElement.appendChild(img);
        });
    }

    function FJCTPtrimText(text) {
        text = text.trim();
        while (text.length >= 6 && text.substring(text.length - 6) == "&nbsp;") {
            text = text.substring(0, text.length - 6);
        }
        text = text.trim();
        while (text.length >= 6 && text.substring(0, 5) == "&nbsp;") {
            text = text.substring(6);
        }
        text = text.trim();

        return text;
    }

    function FJCTPmodifyRouteDescriptionElement(element, firstAscenter, routeDescription) {
        //BEFORE:
        //<li>
        //  <a href="/klettern/poi/4834">MaRo (Marlies-Rolf )</a> 7+&nbsp;
        //  <img src="/images/icons/beschreibung_liste.gif" alt="Beschreibung vorhanden">
        //</li>
        //...
        //
        //BEFORE (with hit info):
        //<li>
        //  <a href="/klettern/poi/4847" class="blue">Vertigo</a> 7&nbsp;
        //  <img src="/images/icons/beschreibung_liste.gif" alt="Beschreibung vorhanden">
        //  <br>
        //  <span>Toprope, 10.05.16</span>
        //</li>
        //...
        //
        //AFTER:

        var oldtext = element.parentElement.innerHTML;

        // 1) split oldText into routeName, routeDifficulty and routeHitData:
        oldtext = oldtext.replace("<br>", " ");
        // 1a) extract routeHitData
        var idx = oldtext.indexOf("<span>");
        var routeHitData = (idx >= 0) ? oldtext.substring(idx + "<span>".length) : "";
        oldtext = (idx >= 0) ? oldtext.substring(0, idx) : oldtext;
        idx = routeHitData.indexOf("</span>");
        routeHitData = (idx >= 0) ? routeHitData.substring(0, idx) : routeHitData;
        // 1b) extract routeName and routeDifficulty
        idx = oldtext.indexOf("</a>");
        var routeName = (idx >= 0) ? oldtext.substring(0, idx + "</a>".length) : "";
        var routeDifficulty = (idx >= 0) ? oldtext.substring(idx + "</a>".length) : oldtext;
        // 1c) clean routeName, routeDifficulty and routeHitData:
        routeHitData = routeHitData.replace(", ", " ");
        routeHitData = FJCTPtrimText(routeHitData);
        routeName = FJCTPtrimText(routeName);
        routeDifficulty = FJCTPtrimText(routeDifficulty);

        // 2) prepare FirstAscenterData
        firstAscenter = (firstAscenter == undefined) ? "" : firstAscenter;
        if (firstAscenter.length > 0) {
            firstAscenter = firstAscenter.replace("(", "");
            firstAscenter = firstAscenter.replace(")", "");
            firstAscenter = firstAscenter.trim();
        }

        // 3) build ascentInfo
        var ascentInfo = "";
        if (firstAscenter.length > 0 && routeHitData.length > 0) {
            ascentInfo = "(" + firstAscenter + " | " + routeHitData + ")";
        } else if (firstAscenter.length > 0) {
            ascentInfo = "(" + firstAscenter + ")";
        } else if (routeHitData.length > 0) {
            ascentInfo = "(" + routeHitData + ")";
        }
        //alert(routeName + " - " + routeDifficulty + " - " + routeHitData + " - " + ascentInfo);

        // 4) prepare routeDifficulty
        //<a href="/klettern/personal/hitliste/eintragen/14571">&nbsp; 6&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>
        // 4a) extract poi from routeName
        idx = routeName.indexOf("poi/");
        var poi = (idx >= 0) ? routeName.substring(idx + "poi/".length) : "";
        idx = poi.indexOf("\"");
        poi = (idx >= 0) ? poi.substring(0, idx) : poi;
        //alert(poi);

        routeDifficulty = (poi.length > 0)
            ? "<a href=\"/klettern/personal/hitliste/eintragen/" + poi + "\">&nbsp; " + routeDifficulty + " &nbsp;&nbsp;&nbsp;&nbsp;</a>"
            : "&nbsp; " + routeDifficulty + " &nbsp;&nbsp;&nbsp;&nbsp;";

        // 5) concatenate elements
        var newtext = (ascentInfo.length > 0) 
            ? routeName + routeDifficulty + "<span>" + ascentInfo + "</span><br>" + routeDescription
            : routeName + routeDifficulty + "<br>" + routeDescription;

        element.parentElement.innerHTML = newtext;
    }

    //function FJCTPmodifyRouteDescriptionsSync(html, callback) {
    //    FJCTPmodifyRouteDescriptionsPreHook(html);
    //
    //    var xmlhttp;
    //    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
    //        xmlhttp = new XMLHttpRequest();
    //    }
    //    else {// code for IE6, IE5
    //        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    //    }
    //
    //    var receivedDataElement = workDocument.createElement("DIV");
    //
    //    Array.prototype.forEach.call(html.querySelectorAll("ol.route-list>li>a:nth-of-type(1)"), function (element) {
    //        var href = element.attributes.getNamedItem("href").value;
    //        if (href.length > 0) {
    //            if (verbose) alert(href);
    //
    //            xmlhttp.open("GET", href, /*asynchronous*/false);
    //            xmlhttp.send();
    //
    //            element.attributes.getNamedItem("href").value = "";
    //
    //            receivedDataElement.innerHTML = xmlhttp.responseText;
    //            var firstAscenter = FJCTPreadRouteFirstAscenter(receivedDataElement);
    //            var routeDescription = FJCTPreadRouteDescription(receivedDataElement);
    //
    //            FJCTPmodifyRouteDescriptionElement(element, firstAscenter, routeDescription);
    //        }
    //    });
    //
    //    FJCTPmodifyRouteDescriptionsPostHook(html, callback);
    //}

    function FJCTPmodifyRouteDescriptionsAsync(html, callback) {
        FJCTPmodifyRouteDescriptionsPreHook(html);

        var xmlhttp;
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        }
        else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        var receivedDataElement = workDocument.createElement("DIV");

        var keyInsert = "INSERT";
        var keyDone = "DONE";

        var allCount = 0;
        var firstHref;
        Array.prototype.forEach.call(html.querySelectorAll("ol.route-list>li>a:nth-of-type(1)"), function (element) {
            if (element.id != keyInsert && element.id != keyDone) {
                var href = element.attributes.getNamedItem("href").value;
                if (href.length > 0) {
                    allCount++;
                    if (firstHref == undefined) {
                        firstHref = href;
                    }
                    //if (verbose) alert(href);
                }
            }
        });

        //verbose = true;
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

                var pagehtml = xmlhttp.responseText; //.responseText; .response; .responseXML; .responseBody;
                if (pagehtml != null) {

                    var doneCount = 0;
                    var nextAsyncDownloadAlreadyStarted = false;
                    Array.prototype.forEach.call(html.querySelectorAll("ol.route-list>li>a:nth-of-type(1)"), function (element) {
                        var href = element.attributes.getNamedItem("href").value;
                        var isValid = href.length > 0;
                        var isInsert = isValid && (element.id == keyInsert);
                        var isDone = isValid && (element.id == keyDone);
                        if (verbose) alert("RouteDescription isValid: " + isValid + "  isInsert: " + isInsert + "  isDone: " + isDone + "  href: " + href);

                        if (isInsert) {
                            // insert details:
                            element.id = keyDone;
                            doneCount++;
                            if (verbose) alert("RouteDescription inserting data of href: " + href);

                            // processing
                            receivedDataElement.innerHTML = pagehtml;
                            var firstAscenter = FJCTPreadRouteFirstAscenter(receivedDataElement);
                            var routeDescription = FJCTPreadRouteDescription(receivedDataElement);

                            FJCTPmodifyRouteDescriptionElement(element, firstAscenter, routeDescription);
                        }
                        else if (isValid && !isDone && !nextAsyncDownloadAlreadyStarted) {
                            // start async downloaad of details of next unprocessed route list entry:
                            nextAsyncDownloadAlreadyStarted = true;
                            element.id = keyInsert;
                            if (verbose) alert("RouteDescription downloading href: " + href);

                            //xmlhttp.responseType = "document";
                            xmlhttp.open("GET", href, /*asynchronous*/true);
                            xmlhttp.send();
                        }
                        else if (isDone) {
                            doneCount++;
                        }
                    });

                    if (doneCount == allCount) {
                        if (verbose) alert("RouteDescription all async downloads done -> final prrocessing");

                        FJCTPmodifyRouteDescriptionsPostHook(html, callback);
                    }
                }
                else {
                    alert("error in received data for url='" + href + "'");
                }
            }
        }

        // start async downloaad of details for first (naturally unprocessed) route list entry:
        if (allCount > 0 && firstHref != undefined) {
            //xmlhttp.responseType = "document";
            xmlhttp.open("GET", firstHref, /*asynchronous*/true);
            xmlhttp.send();
        }
        else {
            FJCTPmodifyRouteDescriptionsPostHook(html, callback);
        }
    }

    function FJCTPmodifyRouteDescriptionsPreHook(html) {
        Array.prototype.forEach.call(html.querySelectorAll("ol.route-list>li>a:nth-of-type(1)"), function (element) {
            if (element.className == "blue") {
                element.className = "";
            }
        });

        Array.prototype.forEach.call(html.querySelectorAll("ol.route-list"), function (element) {
            element.style.listStyleType = "none";
        });

        var num = 0;
        Array.prototype.forEach.call(html.querySelectorAll("ol.route-list>li"), function (element) {
            num++;
            //border-radius: 50%; width: 12px; height: 12px; padding: 2px; border: 1px solid; text-align: center;
            //border-radius: 50%; padding: 2px 5px; border: 1px solid; text-align: center;
            if (num > 9)
                element.innerHTML = "<span style=\"border-radius: 50%; padding: 2px 3px; border: 1px solid; text-align: center;\">" + num + "</span> &nbsp;" + FJCTPtrimText(element.innerHTML);
            else
                element.innerHTML = "<span style=\"border-radius: 50%; padding: 2px 5px; border: 1px solid; text-align: center;\">" + num + "</span> &nbsp;" + FJCTPtrimText(element.innerHTML);
        });
    }

    function FJCTPmodifyRouteDescriptionsPostHook(html, callback) {
        callback();
    }

    function FJCTPmodifyRouteDescriptions(html, callback) {
        // kickout "Routennamen sind anklickbar"
        Array.prototype.forEach.call(html.querySelectorAll("div.poi-section>h4+p"), function (element) {
            if (element.previousElementSibling.textContent == "Routen") {
                if (verbose) alert(element.textContent);
                if (element.textContent.length > 0 && element.textContent.indexOf("Routennamen sind anklickbar") >= 0) {
                    element.parentElement.removeChild(element);
                }
            }
        });

        // kickout route info images (! or eye)
        Array.prototype.forEach.call(html.querySelectorAll("ol.route-list>li>img"), function (element) {
            if (verbose) alert("removing a: " + element.attributes.getNamedItem("src").value);
            element.parentElement.removeChild(element);
        });

        FJCTPmodifyRouteDescriptionsAsync(html, callback);
        //FJCTPmodifyRouteDescriptionsSync(html, callback);
    }

    function FJTCPcleanTextContent(text) {
        while (text.indexOf("\r\n") >= 0) {
            text = text.replace("\r\n", " ");
        }
        while (text.indexOf("\r") >= 0) {
            text = text.replace("\r", " ");
        }
        while (text.indexOf("\n") >= 0) {
            text = text.replace("\n", " ");
        }
        while (text.indexOf("  ") >= 0) {
            text = text.replace("  ", " ");
        }
        return text;
    }

    function FJCTPreadRouteFirstAscenter(html) {
        var firstAscenter = "";
        Array.prototype.forEach.call(html.querySelectorAll("div.poi-section>table>tbody>tr>th+td"), function (element) {
            if (element.previousElementSibling.textContent == "Erstbegehung:") { 
                var text = FJTCPcleanTextContent(element.textContent);
                if (text.length > 0) {
                    if (verbose) alert(text);
                    firstAscenter = text;
                }
            }
        });
        return firstAscenter;
   }

    function FJCTPreadRouteDescription(html) {
        var routeDescription = "";
        Array.prototype.forEach.call(html.querySelectorAll("div.poi-section>h4+p"), function (element) {
            if (element.previousElementSibling.textContent == "Beschreibung") {
                var text = FJTCPcleanTextContent(element.textContent);
                if (text.length > 0) {
                    if (verbose) alert(text);

                    routeDescription = text;
                }
            }
            if (element.previousElementSibling.textContent == "Anmerkungen") {
                var text = FJTCPcleanTextContent(element.textContent);
                if (text.length > 0) {
                    if (verbose) alert(text);

                    if (routeDescription.length > 0) {
                        routeDescription = routeDescription + " ";
                    }
                    routeDescription = routeDescription + text;
                }
            }
        });
        return routeDescription;
    }

    function FJCTPreadPoiId(html) {
        //<ul id="poi-menu">
        //    <li>		<a href="/klettern/premium" target="_blank">
        //            <img src="/images/menu/print-premium.png" border="0" alt="Druckausgabe nur bei Premium" title="Druckausgabe  nur bei Premium" align="absmiddle"><br>
        //            Drucken
        //        </a>
        //        </li>
        //    <li>
        //        <a href="/klettern/senden/448">
        //            <img src="/images/menu/send.png" alt="Felsen versenden" title="Felsen versenden"><br>
        //            Felsen versenden
        //        </a>
        //    </li>
        //    <li>
        //        <a href="/klettern/vorschlag/felsBearbeiten/448">
        //...
        var poi;
        var poiKey = "/felsBearbeiten/"
        Array.prototype.forEach.call(html.querySelectorAll("ul#poi-menu>li>a"), function (element) {
            if (verbose) alert("inspecting poi-menu: " + element.href);
            if (poi == undefined) {
                var href = element.href;
                var idx = href.indexOf(poiKey);
                if (idx >= 0) {
                    var poiStr = href.substring(idx + poiKey.length);
                    poi = parseInt(poiStr);
                }
            }
        });

        if (poi == undefined) {
            //<div class="box" id="box-current-topo">
            //  <a href="/klettern/poi/1290"><h3 style="margin-bottom: 8px;">Jubiläumswand 02 - Rechter Teil</h3></a>
            //...
            var poiKey = "/klettern/poi/"
            Array.prototype.forEach.call(html.querySelectorAll("a[href*='" + poiKey + "']"), function (element) {
                if (verbose) alert("inspecting poi-anchor: " + element.href);
                if (poi == undefined) {
                    var href = element.href;
                    var idx = href.indexOf(poiKey);
                    if (idx >= 0) {
                        var poiStr = href.substring(idx + poiKey.length);
                        poi = parseInt(poiStr);
                    }
                }
            });
        }
        return poi;
    }

    function FJTCPgoogleMapsTileCoordsToLonDegree(zoom, xtile, ytile) {
        //tileproxy.php
        //http://www.drweb.de/magazin/tipps-tricks-mit-openstreetmap/      

        //OSM tiles server
        //http://wiki.openstreetmap.org/wiki/Tiles

        //coordinates <> OSM tiles
        //http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Lon..2Flat._to_tile_numbers
        //
        //Tile numbers to lon./lat.
        //n = 2 ^ zoom
        //lon_deg = xtile / n * 360.0 - 180.0
        //lat_rad = arctan(sinh(p * (1 - 2 * ytile / n)))
        //lat_deg = lat_rad * 180.0 / p

        if (zoom == undefined || xtile == undefined || ytile == undefined) {
            return undefined;
        }

        var n = Math.pow(2, zoom);
        var lon_deg = xtile / n * 360.0 - 180.0;
        //var lat_rad = Math.atan(MathSinh(Math.PI * (1 - 2 * ytile / n)));
        //var lat_deg = lat_rad * 180.0 / Math.PI;
        return lon_deg;
    }
    function FJTCPgoogleMapsTileCoordsToLatDegree(zoom, xtile, ytile) {
        if (zoom == undefined || xtile == undefined || ytile == undefined) {
            return undefined;
        }
        var n = Math.pow(2, zoom);
        //var lon_deg = xtile / n * 360.0 - 180.0;
        var lat_rad = Math.atan(MathSinh(Math.PI * (1 - 2 * ytile / n)));
        var lat_deg = lat_rad * 180.0 / Math.PI;
        return lat_deg;
    }

    function FJTCPreadGpsLocation(html) {
        //tileproxy.php
        //http://www.drweb.de/magazin/tipps-tricks-mit-openstreetmap/      

        //OSM tiles server
        //http://wiki.openstreetmap.org/wiki/Tiles

        //coordinates <> OSM tiles
        //http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Lon..2Flat._to_tile_numbers
        //
        //Tile numbers to lon./lat.
        //n = 2 ^ zoom
        //lon_deg = xtile / n * 360.0 - 180.0
        //lat_rad = arctan(sinh(p * (1 - 2 * ytile / n)))
        //lat_deg = lat_rad * 180.0 / p

        //Weißenstein: 
        // https://www.frankenjura.com/klettern/poi/992
        //
        // after page load:
        //   <div id="map" style="width: 570px; height: 240px;" class="olMap">
        //     <div id="OpenLayers.Map_4_OpenLayers_ViewPort" class="olMapViewport olControlDragPanActive olControlZoomBoxActive olControlPinchZoomActive olControlNavigationActive" style="position: relative; overflow: hidden; width: 100%; height: 100%;">
        //       <div id="OpenLayers.Map_4_OpenLayers_Container" style="position: absolute; width: 100px; height: 100px; z-index: 749; left: 0px; top: 0px;">
        //         <div id="OpenLayers.Layer.OSM_15" dir="ltr" class="olLayerDiv olLayerGrid" style="position: absolute; width: 100%; height: 100%; z-index: 100; left: 0%; top: 0%;">
        //           <img class="olTileImage" src="/osm/tileproxy.php?layer=OSM_MAPNIK&amp;path=13/4358/2791.png" crossorigin="anonymous" style="visibility: inherit; opacity: 1; position: absolute; left: 182%; top: 78%; width: 256%; height: 256%;">
        //           <img class="olTileImage" src="/osm/tileproxy.php?layer=OSM_MAPNIK&amp;path=13/4358/2790.png" crossorigin="anonymous" style="visibility: inherit; opacity: 1; position: absolute; left: 182%; top: -178%; width: 256%; height: 256%;">
        //           <img class="olTileImage" src="/osm/tileproxy.php?layer=OSM_MAPNIK&amp;path=13/4357/2791.png" crossorigin="anonymous" style="visibility: inherit; opacity: 1; position: absolute; left: -74%; top: 78%; width: 256%; height: 256%;">
        //           <img class="olTileImage" src="/osm/tileproxy.php?layer=OSM_MAPNIK&amp;path=13/4357/2790.png" crossorigin="anonymous" style="visibility: inherit; opacity: 1; position: absolute; left: -74%; top: -178%; width: 256%; height: 256%;">
        //           <img class="olTileImage" src="/osm/tileproxy.php?layer=OSM_MAPNIK&amp;path=13/4359/2791.png" crossorigin="anonymous" style="visibility: inherit; opacity: 1; position: absolute; left: 438%; top: 78%; width: 256%; height: 256%;">
        //           <img class="olTileImage" src="/osm/tileproxy.php?layer=OSM_MAPNIK&amp;path=13/4359/2790.png" crossorigin="anonymous" style="visibility: inherit; opacity: 1; position: absolute; left: 438%; top: -178%; width: 256%; height: 256%;">
        //           <img class="olTileImage" src="/osm/tileproxy.php?layer=OSM_MAPNIK&amp;path=13/4360/2791.png" crossorigin="anonymous" style="visibility: inherit; opacity: 1; position: absolute; left: 694%; top: 78%; width: 256%; height: 256%;">
        //           <img class="olTileImage" src="/osm/tileproxy.php?layer=OSM_MAPNIK&amp;path=13/4360/2790.png" crossorigin="anonymous" style="visibility: inherit; opacity: 1; position: absolute; left: 694%; top: -178%; width: 256%; height: 256%;">
        //         </div>
        //         <div id="OpenLayers.Layer.Markers_25" dir="ltr" class="olLayerDiv" style="position: absolute; width: 100%; height: 100%; z-index: 330;">
        //           <div id="OL_Icon_27" style="position: absolute; width: 21px; height: 26px; left: 274.5px; top: 94px;">
        //             <img id="OL_Icon_27_innerImage" class="olAlphaImg" src="/images/poi/poi_crag.png" style="position: relative; width: 21px; height: 26px;">
        //           </div>
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        // -> https://www.frankenjura.com/osm/tileproxy.php?layer=OSM_MAPNIK&path=13/4358/2791.png
        // -> zoom = 13
        // -> xtile = 4358
        // -> ytile = 2791
        // -> calculated: 49.639177, 11.513672
        //          real: 49.634616, 11.531333

        //if (verbose) alert("FJTCPreadGpsLocation");
        //Array.prototype.forEach.call(html.querySelectorAll("div.poi-section>div#map>div>div>div>img.olTileImage"), function (element) {
        //    if (verbose) alert("div.poi-section>div#map>div>div>div>img.olTileImage");
        //});
        //Array.prototype.forEach.call(html.querySelectorAll("div.poi-section>div#map"), function (element) {
        //    if (verbose) alert("div#map");
        //});
        //Array.prototype.forEach.call(html.querySelectorAll("div.olLayerDiv olLayerGrid"), function (element) {
        //    if (verbose) alert("div.olLayerDiv olLayerGrid");
        //});
        //Array.prototype.forEach.call(html.querySelectorAll("div#OpenLayers.Layer.OSM_15"), function (element) {
        //    if (verbose) alert("div#OpenLayers.Layer.OSM_15");
        //});
        //Array.prototype.forEach.call(html.querySelectorAll("div#map>div>div>dic>img"), function (element) {
        //    if (verbose) alert("map->img");
        //});
        //Array.prototype.forEach.call(html.querySelectorAll("img.olTileImage"), function (element) {
        //    if (verbose) alert("img.olTileImage");
        //});
        //Array.prototype.forEach.call(html.querySelectorAll("img[src*='/osm/tileproxy.php']"), function (element) {
        //    if (verbose) alert("img src*=tileproxy.php");
        //});

        var cragLeft;
        var cragTop;
        var cragWidth;
        var cragHeight;
        Array.prototype.forEach.call(html.querySelectorAll("img.olAlphaImg"), function (element) {
            cragLeft = NumberFromStyleValue(element.parentElement.style.left);
            cragTop = NumberFromStyleValue(element.parentElement.style.top);
            cragWidth = NumberFromStyleValue(element.parentElement.style.width);
            cragHeight = NumberFromStyleValue(element.parentElement.style.height);
        });
        if (cragLeft == undefined || cragTop == undefined)
            return "";

        var lon;
        var lat;
        Array.prototype.forEach.call(html.querySelectorAll("img.olTileImage:nth-of-type(1)"), function (element) {
            var firstTileLeft = NumberFromStyleValue(element.style.left);
            var firstTileTop = NumberFromStyleValue(element.style.top);
            var firstTileWidth = NumberFromStyleValue(element.style.width);
            var firstTileHeight = NumberFromStyleValue(element.style.height);

            var imgSrc = element.src;
            // ...tileproxy.php?layer=OSM_MAPNIK&amp;path=13/4358/2791.png

            var tileCoords = imgSrc.substring(imgSrc.indexOf("path") + 5);
            var tileCoords = tileCoords.substring(0, tileCoords.indexOf("."/*".png"*/));
            // 13/4358/2791
            if (verbose) alert("imgSrc: " + imgSrc);
            if (verbose) alert("tileCoords: " + tileCoords);

            var zoomString = tileCoords.substring(0, tileCoords.indexOf("/"));
            tileCoords = tileCoords.substring(zoomString.length + 1);
            var tileXString = tileCoords.substring(0, tileCoords.indexOf("/"));
            tileCoords = tileCoords.substring(tileXString.length + 1);
            var tileYString = tileCoords; //tileCoords.substring(0, tileCoords.indexOf("."));
            var firstTileZoom = parseFloat(zoomString);
            var firstTileX = parseFloat(tileXString);
            var firstTileY = parseFloat(tileYString);

            var rightTileX = firstTileX + 1;
            var bottomTileY = firstTileY + 1;

            var firstTileLon = FJTCPgoogleMapsTileCoordsToLonDegree(firstTileZoom, firstTileX, firstTileY);
            var firstTileLat = FJTCPgoogleMapsTileCoordsToLatDegree(firstTileZoom, firstTileX, firstTileY);
            var rightTileLon = FJTCPgoogleMapsTileCoordsToLonDegree(firstTileZoom, rightTileX, firstTileY);
            var bottomTileLat = FJTCPgoogleMapsTileCoordsToLatDegree(firstTileZoom, firstTileX, bottomTileY);

            if (verbose) alert("firstTileZoom: " + firstTileZoom);
            if (verbose) alert("firstTileX: " + firstTileX);
            if (verbose) alert("firstTileY: " + firstTileY);
            if (verbose) alert("rightTileX: " + rightTileX);
            if (verbose) alert("bottomTileY: " + bottomTileY);
            //verbose = true;
            if (verbose) alert("cragLeft: " + cragLeft);
            if (verbose) alert("cragTop: " + cragTop);
            if (verbose) alert("firstTileWidth: " + firstTileWidth);
            if (verbose) alert("firstTileHeight: " + firstTileHeight);
            if (verbose) alert("firstTileLon: " + firstTileLon);
            if (verbose) alert("firstTileLat: " + firstTileLat);
            if (verbose) alert("rightTileLon: " + rightTileLon);
            if (verbose) alert("bottomTileLat: " + bottomTileLat);
            //verbose = false;

            if (cragLeft != undefined && firstTileLon != undefined && rightTileLon != undefined && firstTileLeft != undefined && firstTileWidth != undefined &&
                cragTop != undefined && firstTileLat != undefined && bottomTileLat != undefined && firstTileTop != undefined && firstTileHeight != undefined) {

                var leftCrag = cragLeft;
                var topCrag = cragTop;
                if (cragWidth != undefined) {
                    leftCrag += cragWidth / 2.0;
                }
                if (cragHeight != undefined) {
                    topCrag += cragHeight;
                }

                if (verbose) alert("leftCrag: " + leftCrag);
                if (verbose) alert("topCrag: " + topCrag);
                //verbose = false;

                lon = firstTileLon + (leftCrag - firstTileLeft) * (rightTileLon - firstTileLon) / firstTileWidth;
                lat = firstTileLat + (topCrag - firstTileTop) * (bottomTileLat - firstTileLat) / firstTileHeight;
            }
        });

        if (lat != undefined && lon != undefined) {
            return lat.toFixed(6) + ", " + lon.toFixed(6);
        }

        return ""; //"???????";
        // fallback: return left/top of first tile
        //return (ylat[0][1]).toFixed(6) + ", " + (xlon[0][1]).toFixed(6);
    }
    
    function MathSinh(x) {
        return (Math.exp(x) - Math.exp(x * -1)) / 2;
    }

    function NumberFromStyleValue(styleValue) {
        if (styleValue == undefined) {
            return undefined;
        }
        var idx = styleValue.indexOf("%");
        if (idx > 0) {
            return parseFloat(styleValue.substring(0, idx));
        }
        var idx = styleValue.indexOf("px");
        if (idx > 0) {
            return parseFloat(styleValue.substring(0, idx));
        }
        return undefined;
    }

    function FJCTPadaptElementStyles(html) {
        // prepare divs
        //FJCTPmodifyPoiTableClassNameToSmall(html);

        // adapt body style
        Array.prototype.forEach.call(html.querySelectorAll("body"), function (element) {
            if (verbose) alert("modifying body");
            element.style = "";
            element.style.marginLeft = "70px";
            element.style.backgroundColor = "#ffffff"
            //element.style.margin = "30";
        });

        Array.prototype.forEach.call(html.querySelectorAll("div#content"), function (element) {
            element.style.borderStyle = "hidden";
            element.style.width = "1000px"; //-> table with + maxWith of TopImage must not exceed 1000px
        });

        Array.prototype.forEach.call(html.querySelectorAll("div#content-center"), function (element) {
            element.style.borderStyle = "hidden";
            element.style.padding = "0 0 0 0";
        });

        Array.prototype.forEach.call(html.querySelectorAll("div.poi-section"), function (element) {
            element.style.borderStyle = "hidden";
            element.style.padding = "0 0 0 0";
            element.style.margin = "0 0 0 0";
        });

        // adapt table style
        Array.prototype.forEach.call(html.querySelectorAll("table.poi-table-small"), function (element) {
            element.style.width = "429px"; //table with + maxWith of TopImage must not exceed 1000px
            element.style.lineHeight = "";
            //element.style.borderStyle = "1px solid black";
        });

        // adapt th style
        Array.prototype.forEach.call(html.querySelectorAll("th"), function (element) {
            element.style.width = "150px";
            element.style.lineHeight = "";
        });

        // adapt ul style
        Array.prototype.forEach.call(html.querySelectorAll("ul"), function (element) {
            element.style.margin = "0 0 0px 0";
            element.style.lineHeight = "";
        });

        // adapt p style
        Array.prototype.forEach.call(html.querySelectorAll("p"), function (element) {
            //element.style.margin = "0 0 0px 0";
            element.style.margin = "0 0 10px 0";
            element.style.lineHeight = "";
        });

        // adapt h4 style
        Array.prototype.forEach.call(html.querySelectorAll("h4"), function (element) {
            //element.style.margin = "6px 0 6px 0";
            element.style.margin = "0px 0 6px 0";
            element.style.lineHeight = "";
        });

        // adapt route-list ol style
        Array.prototype.forEach.call(html.querySelectorAll("ol.route-list"), function (element) {
            element.style.width = "1000px";
            element.style.margin = "0 0 0px 0";
            element.style.lineHeight = "";
        });
        // adapt route-list li style
        Array.prototype.forEach.call(html.querySelectorAll("ol.route-list>li"), function (element) {
            element.style.padding = "0 0 6px 0";
        });
        // adapt route-list li style
        Array.prototype.forEach.call(html.querySelectorAll("ol.route-list>li>p"), function (element) {
            element.style.padding = "0 0 0px 0";
            element.style.lineHeight = "";
        });

    }

    function FJCTPkickoutDivBetweenBodyAndDiv(html, divToShiftToBody) {
        //var bgdiv = html.querySelectorAll("#bg:nth-of-type(1)")[0];
        var divToShift = html.querySelectorAll("#" + divToShiftToBody + ":nth-of-type(1)")[0];
        var divToKickout = divToShift.parentElement;

        if (verbose) alert("moving div under body (" + divToKickout.getAttribute("id") + "-> " + divToShift.getAttribute("id") + ")");
        divToShift.parentElement.removeChild(divToShift);
        divToKickout.parentElement.insertBefore(divToShift, divToKickout);
        if (verbose) alert("removing div: " + divToKickout.getAttribute("id"));
        divToKickout.parentElement.removeChild(divToKickout);
    }

    //function FJTCprocessOnClick(document, element) {
    //    //element.innerHTML = "  Ooops  ";
    //
    //    //var p = workDocument.createElement("p");
    //    //p.textContent = "FJTCprocessOnClick";
    //    //workDocument.body.appendChild(p);
    //}
    var processPages = false;

    function FJCTPmodifyDocument(document) {

        //if (isProcesssing()) {
        //    return;
        //}

        //if (isProcessed()) {
        //    return;
        //}

        //if (!isPreProcessed()) {
        //    // on first processing, we just add a clickable element for toggling Raw<>Processed
        //    markAsPreProcess();

        //    Array.prototype.forEach.call(workDocument.documentElement.querySelectorAll("div#breadcrumb-container>ul~h2:nth-of-type(1)"), function (element) {
        //        if (verbose)
        //            alert("manipulating crag name: " + element.textContent);

        //        // misuse crag name as anchor for backward link to overview page
        //        element.onclick = function () {
        //            // toggle current page processing on every click
        //            if (isProcessed()) {
        //                location.reload();
        //            } else if (isPreProcessed()) {
        //                FJCTPmodifyDocument(document);
        //            }

                    //// toggle mode on every click
                    //processPages = !getProcessPages();
                    //setProcessPages(processPages);
                    //
                    //// immediate apply new mode
                    //if (processPages && !isProcessed()) {
                    //    FJCTPmodifyDocument(document);
                    //} else if (!processPages && isProcessed()) {
                    //    location.reload();
                    //}
        //        };
        //    });
        //    return;
        //}

        //alert("FJCTPmodifyDocument: processPages= " + processPages);
        //if (!getProcessPages()) {
        //    return;
        //}

        processStart();

        var dochtml = document.documentElement;

        // (1) GENRAL processing
        FJCTPremoveGoogleAnalytics(dochtml);
        FJCTPremoveAllScripts(dochtml);

        // (2) reorganize, replace or augment content
        FJCTPmodifyPoiTableClassNameToSmall(dochtml);
        FJCTPmodifyHeadlineAndGragTable(dochtml);
        FJCTPreplaceFrankenJuraPremiumTopoImage(dochtml);

        // (3) remove unwanted content
        
        FJCTPremoveElement(dochtml, "div.presenter");                   //remove presenter divs
        FJCTPremoveElement(dochtml, "div#header");                      //Hauptmenü
        FJCTPremoveElement(dochtml, "div.advertising");                 //Werbung für Pensionen, Gaststätten
        FJCTPremoveElement(dochtml, "div.poi-section:nth-of-type(7)");  //Routeninformationen (Balkendiagramm)
        FJCTPremoveElement(dochtml, "div.poi-section:nth-of-type(6)");  //Informationtn von
        FJCTPremoveElement(dochtml, "div.poi-section:nth-of-type(5)");  //Rock-Events
        FJCTPremoveElement(dochtml, "div.poi-section:nth-of-type(4)");  //Zonierung - Aktuelle Sperrungen
      //FJCTPremoveElement(dochtml, "div.poi-section:nth-of-type(3)");  //Beschreibung - Zufahrt - Zusteig
        FJCTPremoveElement(dochtml, "div.poi-section:nth-of-type(2)");  //Karte (OpenStreetMap)
        FJCTPremoveElement(dochtml, "ul#poi-menu");                     //POI-MENÜ: (Drucken, Felsen versenden, Änderungsvorschlag, Neue Route)
        FJCTPremoveElement(dochtml, "div#content-right-wrapper");       //Werbung in rechter Spalte
        FJCTPremoveElement(dochtml, "div#footer");                      //Login,Kontak,Werbung,Impressum

        // (4) adapt layouting for optimal printing
        // remove images and color from body (background)
        FJCTPadaptElementStyles(dochtml);
        // remove margins
        FJCTPmodifyDivWithClassName(dochtml, "column", "column_two-columnDEACTIVATED");
        // eliminate "bg" div
        FJCTPkickoutDivBetweenBodyAndDiv(dochtml, "page");
        // eliminate "page" div
        FJCTPkickoutDivBetweenBodyAndDiv(dochtml, "content");
        FJCTPremoveElement(dochtml, "div#lightboxOverlay");
        FJCTPremoveElement(dochtml, "div#lightbox");

        // (6) reorganize, replace or augment content
        FJCTPmodifyRouteDescriptions(dochtml, processEnd);
    }

})();