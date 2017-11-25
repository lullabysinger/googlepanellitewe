// GOOGLEPANELLITE WE
// 20171125: V1.0.0-alpha
//
// CONTENT SCRIPT: FOR LISTENING TO EVENTS TO HANDLE PAGE SELECTIONS AND CLICKS;
//  ALSO FUTURE HIGHLIGHTING
//

var gblContextMenuTarget;

// ON LOADING OF THE CONTENT HTML - these are called as page is loaded...
// NOTE: document. in this scope refers to the actual page's DOCUMENT

// CREDITS: https://stackoverflow.com/questions/7703697/how-to-retrieve-the-element-where-a-contextmenu-has-been-executed
// CREDITS: https://developer.mozilla.org/en-US/docs/Web/Events/contextmenu

// listen to rightclick targets...
document.addEventListener("contextmenu", function(event){gblContextMenuTarget = event.target;}, true);
    

// listen to callbacks from BACKGROUND
function contentScriptCallBack(request, sender, sendResponse) {
    console.log("contentScriptCallBack");

    // summoned from BACKGROUND    
    if (request.menuitem === "selection-search-web") {
        var selectionString = window.getSelection().toString(); // only raw strings needed
        sendResponse({selection: selectionString});
    }
    else if (request.menuitem === "link-cached")
    {
        sendResponse({link: gblContextMenuTarget.href});
    }
    else if (request.menuitem === "highlighter")
    {
        
    }
    return true;

}


// defers execution till message is found
browser.runtime.onMessage.addListener(contentScriptCallBack);