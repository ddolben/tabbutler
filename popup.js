(function() {
    var highlightTabFn = function (windowId, tabIndex) {
        return function() {
            console.log(windowId, tabIndex);
            chrome.tabs.highlight({windowId: windowId, tabs: [tabIndex]}, function(w) {
                chrome.windows.update(w.id, {focused: true}, function() {});
            });
        };
    };

    var tabsInWindow = function (ts) {
        var elem = document.createElement("table");

        for (var i = 0; i < ts.length; i++)
        {
            var item = document.createElement("tr");
            var name = document.createElement("td");
            var wname = document.createElement("td");
            name.innerHTML = ts[i].title;
            wname.innerHTML = ts[i].windowId;
            item.className = "clickable";
            item.onclick = highlightTabFn(ts[i].windowId, ts[i].index);
            item.appendChild(name);
            item.appendChild(wname);
            elem.appendChild(item);
        }

        document.body.appendChild(elem);
    };

    var allWindows = function (ws) {
        for (var i = 0; i < ws.length; i++)
        {
            chrome.tabs.query({windowId: ws[i].id}, tabsInWindow);
        }
    };

    document.addEventListener('DOMContentLoaded', function () {
        chrome.windows.getAll(allWindows);
    });
})();
