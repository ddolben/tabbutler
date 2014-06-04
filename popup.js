(function() {

var tabButler = {
    highlightTabFn: function (windowId, tabIndex) {
        return function() {
            chrome.tabs.highlight({windowId: windowId, tabs: [tabIndex]}, function(w) {
                chrome.windows.update(w.id, {focused: true}, function() {});
            });
        };
    },

    closeTabFn: function (tabId) {
        return function() {
            chrome.tabs.remove(tabId);
            tabButler.reload();
        };
    },

    tabsInWindow: function (ts) {
        var elem = document.createElement("div");
        elem.className = "windowContainer";

        for (var i = 0; i < ts.length; i++)
        {
            var item = document.createElement("div");

            var name = document.createElement("span");
            name.className = "button fade";
            name.innerHTML = ts[i].title;
            name.onclick = tabButler.highlightTabFn(ts[i].windowId, ts[i].index);
            
            var closeCell = document.createElement("span");
            closeCell.className = "button";
            closeCell.innerHTML = "Close";
            closeCell.onclick = tabButler.closeTabFn(ts[i].id);

            item.appendChild(name);
            item.appendChild(closeCell);
            elem.appendChild(item);
        }

        var container = document.getElementById("content");
        container.appendChild(elem);
    },

    allWindows: function (ws) {
        for (var i = 0; i < ws.length; i++)
        {
            chrome.tabs.query({windowId: ws[i].id}, tabButler.tabsInWindow);
        }
    },

    reload: function () {
        var container = document.getElementById("content");
        container.innerHTML = "";
        chrome.windows.getAll(tabButler.allWindows);
    }
};

document.addEventListener('DOMContentLoaded', function () {
    tabButler.reload();
});

})();
