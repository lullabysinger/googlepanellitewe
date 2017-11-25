// GooglePanelLite WE
// 20171125: V1.0.0-alpha
//
// BACKGROUND SCRIPT
// create context menus and listeners
//



const GOOGLEHOST = "www.google.com";
const GOOGLEPREFIX = "https://"+GOOGLEHOST+"/";

const CACHEURL  = GOOGLEPREFIX+"search?q=cache:";
const TRANSLATEURL = "https://translate.google.com/translate?u=";
const SEARCHURL  = GOOGLEPREFIX+"search?q=";

// CREDITS: https://github.com/mdn/webextensions-examples/tree/master/context-menu-demo
// CREDITS: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Modify_a_web_page
function onCreated() {
    if (browser.runtime.lastError) console.log('Error: ${browser.runtime.lastError}');
}

function onError(error) { console.log('Error: ${error}'); }


browser.contextMenus.create({
    id: "selection-search-web",
    title: "This selection: Search web for selected text",
    contexts: ["selection"]
});

browser.contextMenus.create({
    id: "link-cached",
    title: "This link: Find Google cached snapshot of link target",
    contexts: ["link"]
});

browser.contextMenus.create({
  id: "separator-1",
  type: "separator",
  contexts: ["all"]
}); 

browser.contextMenus.create({
    id: "page-cached",
    title: "Current page: Find Google cached snapshot of the page",
    contexts: ["all"]
});

browser.contextMenus.create({
    id: "page-translate",
    title: "Current page: Translate this page",
    contexts: ["all"]
});


browser.contextMenus.onClicked.addListener(
    (data, tab) => {
        //console.log(tab.url);
        
        // commands that override current tab URL can be done here in this BACKGROUND SCRIPT...
        if (data.menuItemId == "page-cached") {
            browser.tabs.update(tab.id, { url: CACHEURL+tab.url });
        }
        else if (data.menuItemId == "page-translate") {
            browser.tabs.update(tab.id, { url: TRANSLATEURL+tab.url });
        }
        
        
        // commands that require access to selection or element-targets --> call to CONTENTSCRIPT --> wait for response promise
        else if (data.menuItemId == "selection-search-web") {
            var askContentTextPromise = browser.tabs.sendMessage(tab.id, { menuitem: data.menuItemId });
            askContentTextPromise.then(
                (response) => {
                    //console.log(response.selection);   
                    browser.tabs.update(tab.id, { url: SEARCHURL+response.selection});
                }, 
                (error) =>{
                    console.log(error);
                }
            );  
        }
        
        else if (data.menuItemId == "link-cached") {
            var askLinkPromise = browser.tabs.sendMessage(tab.id, { menuitem: data.menuItemId });
            askLinkPromise.then(
                (response) => {
                    console.log(response.link);   
                    browser.tabs.update(tab.id, { url: CACHEURL+response.link});
                }, 
                (error) =>{
                    console.log(error);
                }
            );  
        }
    }
);


/////////////////////////////////////////////////////////////////////////////////////
    
// FUTURE PROOF
    
function backgroundScriptCallBack(request, sender, sendResponse) {
    console.log("backgroundScriptCallBack");
    // for future functionality    
    return true;
}
// defers execution till message is found
browser.runtime.onMessage.addListener(backgroundScriptCallBack);