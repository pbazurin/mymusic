$.UI = $.UI || {};
$.UI.Explorer = {
    _musicItems: [],

    Init: function (onSuccess) {
        var ex = $.UI.Explorer;

        $.getJSON("musicdb.txt", function (data) {
            $.each(data, function(_, item) {
                item.name = item.path.split('/').pop();
            });

            ex._musicItems = data;

            $("#explorerItemTemplate").tmpl(data).appendTo('.explorer_content');

            $.isFunction(onSuccess) && onSuccess(ex._musicItems[0]);
        });
    }
};