// GOOGLEPANELLITE WE
// 20171125: V1.0.0-alpha
//
// POPUP SCRIPT: MOSTLY FOR:
//  TABS->UPDATE UI (EG SEARCH QUERY) AND 
//  UI->CALL PAGE INTO TABS
//

// basic US Google constant definitions
const GOOGLEHOST = "www.google.com";
const GOOGLEPREFIX = "https://"+GOOGLEHOST+"/";

const SEARCHURL  = GOOGLEPREFIX+"search?q=";
const IMAGESURL  = GOOGLEPREFIX+"search?tbm=isch&q=";
const MAPSURL    = GOOGLEPREFIX+"maps?q=";
const NEWSURL    = GOOGLEPREFIX+"search?tbm=nws&q=";
const SCHOLARURL = "https://scholar.google.com/scholar?q=";
const DEFINEURL  = GOOGLEPREFIX+"search?q=define:";


// functions here...
// try preloading google.com query data from URI to textbox
function documentGoogleURIPreload() {
    //console.log("load()");
    var tabsPromise = browser.tabs.query({active:true, currentWindow:true});
    tabsPromise.then(
        (tabs) => {
            // CREDITS: https://gist.github.com/jlong/2428561#file-uri-js
            var parser = document.createElement('a');
            parser.href = tabs[0].url;
            
            if (parser.hostname.match(GOOGLEHOST)) {
                var querystring = parser.search; // ?aaa=xxx&bbb=yyy&q=QUERY etc
                querystring = querystring.substr(1); // remove leading ?
                var queryparams = querystring.split("&"); // each array has key=VALUE pairs now
                
                for (var i=0; i<queryparams.length; i++) {
                    console.log(queryparams[i]);
                    if (queryparams[i].substr(0,2) == "q=") { // check first two chars, must strictly be "q="
                        var querytext = queryparams[i].substr(2); // final product ignores "q="
                        querytext = querytext.replace(/\+/g, " ");   // final product swaps + for spaces
                        querytext = unescape(querytext);   // and any leftover sanitized url escapes
                        document.getElementById("textbox").value = querytext;
                    }
                }
            }
        }
    );
}


// call search on current tab
function search(type) {
    console.log(type);
    query = document.getElementById("textbox").value;
    console.log(query);

    // CREDITS: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/tabs/update    
    var tabsPromise = browser.tabs.query({active:true, currentWindow:true});
    tabsPromise.then((tabs) =>
    {
        var currentTabId = tabs[0].id;
        browser.tabs.update(currentTabId, { url: type+query });
    });
    

}


//////////////////////////////////////


// ON LOADING OF THE POPUP HTML - these are called as page is loaded...
// NOTE: document. in this scope refers to POPUP
// event listener inits
document.getElementById("btnSearch" ).addEventListener("click", function(){ search(SEARCHURL); }); 
document.getElementById("btnImages" ).addEventListener("click", function(){ search(IMAGESURL); }); 
document.getElementById("btnNews"   ).addEventListener("click", function(){ search(NEWSURL); }); 
document.getElementById("btnMaps"   ).addEventListener("click", function(){ search(MAPSURL); }); 
document.getElementById("btnScholar").addEventListener("click", function(){ search(SCHOLARURL); }); 
document.getElementById("btnDictionary").addEventListener("click", function(){ search(DEFINEURL); }); 
// CREDITS: Steve Paulo - Max Starkenburg - https://stackoverflow.com/questions/155188/trigger-a-button-click-with-javascript-on-the-enter-key-in-a-text-box
document.getElementById("textbox"   ).addEventListener("keypress", 
    function(event) {
        if (event.keyCode == 13) {
            search(SEARCHURL);
            event.preventDefault();
            return false;
        }
    }
);

documentGoogleURIPreload();