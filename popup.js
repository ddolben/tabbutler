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
            chrome.tabs.remove(tabId, function() {
                $("#" + tabId).remove();
            });
        };
    },

    openNewWindowForTabFn: function (tabId) {
        return function() {
            chrome.windows.create({tabId: tabId, focused: true}, function() {
                window.close();
            });
        };
    },

    tabsInWindow: function (ts) {
        var elem = $(document.createElement("div"));
        elem.addClass("windowContainer");
        elem.attr("id", ts[0].windowId)

        for (var i = 0; i < ts.length; i++)
        {
            var item = $(document.createElement("div"));
            item.addClass("tabContainer");
            item.attr("id", ts[i].id)

            var name = $(document.createElement("span"));
            name.addClass("left button truncated");
            name.html("<img class='favicon' src='" + ts[i].favIconUrl + "' />" + ts[i].title);
            name.click(tabButler.highlightTabFn(ts[i].windowId, ts[i].index));
            
            var closeCell = $(document.createElement("span"));
            closeCell.addClass("right button");
            closeCell.html("Close");
            closeCell.click(tabButler.closeTabFn(ts[i].id));

            var centerElem = $(document.createElement("span"));
            centerElem.addClass("center");
            centerElem.html("&nbsp;");

            item.append(name);
            item.append(closeCell);
            item.append(centerElem); // Must be appended after first two
            elem.append(item);
        }

        $("#content").append(elem);
    },

    allWindows: function (ws) {
        for (var i = 0; i < ws.length; i++)
        {
            chrome.tabs.query({windowId: ws[i].id}, tabButler.tabsInWindow);
        }
    },

    moveTab: function (tabId, newWindowId, newIndex) {
        chrome.tabs.move(tabId, {windowId: newWindowId, index: newIndex}, function () {
            var elem = $("#" + tabId + " .left");
            elem.unbind("click");
            elem.click(tabButler.highlightTabFn(newWindowId, newIndex));

            elem = $("#" + tabId + " .right");
            elem.unbind("click");
            elem.click(tabButler.closeTabFn(tabId));
        });
    },

    reload: function () {
        var container = document.getElementById("content");
        container.innerHTML = "";
        chrome.windows.getAll(tabButler.allWindows);
    }
};

document.addEventListener('DOMContentLoaded', function () {
    tabButler.reload();

    document.getElementById("content").addEventListener("DOMNodeInserted", function() {
        $(".windowContainer").sortable({
            connectWith: ".windowContainer",
            update: function(event, ui) {
                tabButler.moveTab(
                    parseInt(ui.item.attr('id')),
                    parseInt(ui.item.parent().attr('id')),
                    ui.item.parent().sortable("toArray").indexOf(ui.item.attr('id'))
                );
            }
        }).disableSelection();
    }, false);
});

})();
