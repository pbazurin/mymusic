$.UI = $.UI || {};
$.UI.Player = {
    _player: null,
    _currentItem: null,

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
                videoId: "guXMb7zLblM",
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
    Play: function (item) {
        $.UI.Player._player.loadVideoById(item.yId);
        $(".player_header").html(item.name);
        $.UI.Player._currentItem = item;
    },
    GetCurrentItem: function() {
        return $.UI.Player._currentItem;
    },

    // Events
    OnPlayerReady: function () {
        $.UI.Player._player.playVideo();
    },
    OnPlayerStateChange: function (a) {
        if (a.data === 0) {
            $.UI.Player._player.playVideo();
        }
    },
    OnPlayerError: function () {
        // TODO: add some google analytics
        console.error("Player doesn't feel well");
    }
};