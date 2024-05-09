'use strict';

MyScreen.screens['main-menu'] = (function(screen) {

    function initialize() {
        document.getElementById('button-1p').addEventListener(
            'click',
            function() {
                MyScreen.local2P = false;
                screen.showScreen('game-play');
            }
        );

        document.getElementById('button-local').addEventListener(
            'click',
            function() {
                MyScreen.local2P = true;
                screen.showScreen('game-play');
            }
        );

        /*
        document.getElementById('button-multiplayer').addEventListener(
            'click',
            function() {
                MyScreen.local2P = false;
                screen.showScreen('multiplayer-menu');
            }
        );
        */
    }

    function run() {}

    return {
        initialize : initialize,
        run : run
    };
}(MyScreen.screen));
