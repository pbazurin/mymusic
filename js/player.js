$.UI = $.UI || {};
$.UI.Player = {
    _player: null,
    _currentItem: null,
    _initialItem: null,

    Init: function(onSuccess) {
        $('<script>')
            .attr({
                "type": "text/javascript",
                "src": "https://www.youtube.com/player_api"
            })
            .appendTo('head');

        window.onYouTubePlayerAPIReady = function() {
            var pl = $.UI.Player;

            pl._player = new YT.Player('ytplayer', {
                videoId: pl._initialItem ? pl._initialItem.yId : "guXMb7zLblM",
                playerVars: {
                    rel: 0,
                    showinfo: 0
                },
                events: {
                    onReady: pl.OnPlayerReady,
                    onStateChange: pl.OnPlayerStateChange,
                    onError: pl.OnPlayerError
                }
            });
        };

        $.isFunction(onSuccess) && onSuccess();
    },
    Play: function(item) {
        var pl = $.UI.Player;

        if (!pl._player) {
            pl._initialItem = item;
            return;
        }

        pl._player.loadVideoById(item.yId);
        $(".player_header").html(item.name);
        pl._currentItem = item;
    },
    GetCurrentItem: function() {
        return $.UI.Player._currentItem;
    },

    OnPlayerReady: function () {
        $.UI.Player._player.playVideo();
    },
    OnPlayerStateChange: function (a) {
        if (a.data === 0) {
            $.UI.Player._player.playVideo();
        }
    },
    OnPlayerError: function () {
        if (!ga) {
            return;
        }

        ga('send', 'exception', { 'exDescription': "Player doesn't feel well" });
    }
};