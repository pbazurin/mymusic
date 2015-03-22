$.UI = $.UI || {};
$.UI.Explorer = {
    _musicItems: [],

    _historyPrefix: "?v=",
    _itemClass: "explorer_content_item",
    _activeItemClass: "explorer_content_item--active",
    _activeSearchClass: "explorer_toolbar_search_text--active",
    _$template: null,
    _$currentPath: null,

    ItemType: {
        Folder: 0,
        MusicItem: 1
    },

    Init: function(onSuccess) {
        var ex = $.UI.Explorer;

        ex._$template = $("#explorerItemTemplate");
        ex._$currentPath = $(".explorer_toolbar_currPath");

        $(window).on("popstate", ex.CheckHistory);

        $(document)
            .on("click", "." + ex._itemClass, function() {
                var $item = $(this),
                    item = $item.data("item");

                if (item.type !== ex.ItemType.MusicItem) {
                    return;
                }

                $("." + ex._activeItemClass).removeClass(ex._activeItemClass);
                $item.addClass(ex._activeItemClass);

                history.pushState(null, '', ex._historyPrefix + item.yId);
                $.UI.Player.Play(item);
            })
            .on("dblclick", "." + ex._itemClass, function (e) {
                var item = $(this).data("item");

                if (item.type !== ex.ItemType.Folder) {
                    return;
                }

                ex.GoToFolder(item.path);
            });

        $(".explorer_toolbar_search_text")
            .on("focus", function() {
                $(this).addClass(ex._activeSearchClass);
            })
            .on("blur", function() {
                var $input = $(this),
                    currentItem;

                if (!$input.val()) {
                    $input.removeClass(ex._activeSearchClass);
                    currentItem = $.UI.Player.GetCurrentItem();

                    ex.GoToItem(currentItem);
                }
            })
            .on("keyup", function() {
                ex.Search($(this).val());
            });

        $.getJSON("musicdb.txt", function(data) {
            $.each(data, function(_, item) {
                item.name = item.path.split('/').pop();
                item.type = ex.ItemType.MusicItem;
            });

            data.sort(function(a, b) {
                return a.path.toUpperCase() > b.path.toUpperCase() ? 1 : -1;
            });
            ex._musicItems = data;

            ex.CheckHistory();

            $.isFunction(onSuccess) && onSuccess();
        });
    },

    GoToFolder: function(path) {
        var folders = [],
            musicItems = [],
            ex = $.UI.Explorer,
            folderName,
            allItems,
            $explorerContent = $(".explorer_content");

        if (path) {
            folders.push({
                name: "...",
                type: ex.ItemType.Folder,
                path: path.split("/").slice(0, -1).join("/")
            });
        }

        $.each(ex._musicItems, function (_, item) {
            if (path && item.path.indexOf(path) === -1) {
                return;
            }

            var shiftedPath = path ? item.path.replace(path + "/", "") : item.path;

            if (shiftedPath.indexOf('/') === -1) {
                musicItems.push(item);
                return;
            }

            folderName = shiftedPath.split('/')[0];

            if ($.grep(folders, function(ii) {
                return ii.name == folderName;
            }).length === 0) {
                folders.push({
                    name: folderName,
                    type: ex.ItemType.Folder,
                    path: path ? path + "/" + folderName : folderName
                });
            }
        });

        allItems = folders.concat(musicItems);

        $explorerContent.empty();
        ex._$template.tmpl(allItems).appendTo($explorerContent);
        ex._$currentPath.html(path);
    },

    GoToItem: function (item) {
        var ex = $.UI.Explorer,
            pl = $.UI.Player,
            currentPath = item ? item.path.split("/").slice(0, -1).join("/") : "",
            playerCurrentItem = pl.GetCurrentItem();

        ex.GoToFolder(currentPath);

        if (!item) {
            return;
        }

        $.each($("." + ex._itemClass), function (_, i) {
            var $i = $(i);

            if ($i.data("item").path === item.path) {
                $i.addClass(ex._activeItemClass);
                return;
            }
        });

        if (!playerCurrentItem || playerCurrentItem.yId !== item.yId) {
            pl.Play(item);
        }
    },

    Search: function(keyword) {
        var matchedItems = [],
            ex = $.UI.Explorer,
            $explorerContent = $(".explorer_content");

        $.each(ex._musicItems, function (_, item) {
            if (keyword && item.name.toUpperCase().indexOf(keyword.toUpperCase()) === -1) {
                return;
            }

            matchedItems.push(item);
        });

        matchedItems.sort(function(a, b) {
            return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1;
        });

        $explorerContent.empty();
        ex._$template.tmpl(matchedItems).appendTo($explorerContent);
        ex._$currentPath.empty();
    },

    CheckHistory: function() {
        var ex = $.UI.Explorer,
            prefixIndex = document.URL.indexOf(ex._historyPrefix),
            itemYId,
            item;

        if (prefixIndex === -1) {
            ex.GoToFolder();
            return;
        }

        itemYId = document.URL.slice(prefixIndex + ex._historyPrefix.length);

        $.each(ex._musicItems, function(_, it) {
            if (it.yId === itemYId) {
                item = it;
                return;
            }
        });

        item ? ex.GoToItem(item) : ex.GoToFolder();
    }
};