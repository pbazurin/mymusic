$.UI = $.UI || {};
$.UI.Player = {
    _player: null,

    Init: function(item, onSuccess) {
        $('<script>')
            .attr({
                "type": "text/javascript",
                "src": "https://www.youtube.com/player_api"
            })
            .appendTo('head');

        window.onYouTubePlayerAPIReady = function() {
            var pl = $.UI.Player;

            pl._player = new YT.Player('ytplayer', {
                videoId: item.yId,
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

            $(".player_header").html(item.name);
        };

        $.isFunction(onSuccess) && onSuccess();
    },
    Play: function (item) {
        $.UI.Player._player.loadVideoById(item.yId);
        $(".player_header").html(item.name);
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