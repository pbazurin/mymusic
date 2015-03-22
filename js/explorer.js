$.UI = $.UI || {};
$.UI.Explorer = {
    _musicItems: [],

    ItemType: {
        Folder: 0,
        MusicItem: 1
    },

    Init: function(onSuccess) {
        var ex = $.UI.Explorer,
            activeItemClass = "explorer_content_item--active",
            activeSearchClass = "explorer_toolbar_search_text--active";

        $(document)
            .on("click", ".explorer_content_item", function() {
                var $item = $(this),
                    item = $item.data("item");

                if (item.type !== ex.ItemType.MusicItem) {
                    return;
                }

                $("." + activeItemClass).removeClass(activeItemClass);
                $item.addClass(activeItemClass);

                $.UI.Player.Play(item);
            })
            .on("dblclick", ".explorer_content_item", function(e) {
                var item = $(this).data("item");

                if (item.type !== ex.ItemType.Folder) {
                    return;
                }

                ex.GoToFolder(item.path);
            });

        $(".explorer_toolbar_search_text")
            .on("focus", function() {
                $(this).addClass(activeSearchClass);
            })
            .on("blur", function() {
                var $input = $(this),
                    currentItem;

                if (!$input.val()) {
                    $input.removeClass(activeSearchClass);
                    currentItem = $.UI.Player.GetCurrentItem();

                    ex.GoToFolder(currentItem.path.split("/").slice(0, -1).join("/"));

                    $.each($(".explorer_content_item"), function(_, i) {
                        var $i = $(i);

                        if ($i.data("item").path === currentItem.path) {
                            $i.addClass(activeItemClass);
                            return;
                        }
                    });
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
                return a.path > b.path ? 1 : -1;
            });
            ex._musicItems = data;

            ex.GoToFolder();

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
        $("#explorerItemTemplate").tmpl(allItems).appendTo($explorerContent);
        $(".explorer_toolbar_currPath").html(path);
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
            return a.name > b.name ? 1 : -1;
        });

        $explorerContent.empty();
        $("#explorerItemTemplate").tmpl(matchedItems).appendTo($explorerContent);
        $(".explorer_toolbar_currPath").empty();
    }
};