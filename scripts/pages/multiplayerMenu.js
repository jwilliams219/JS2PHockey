'use strict';

MyScreen.screens['multiplayer-menu'] = (function(screen) {

    function initialize() {
        document.getElementById('back').addEventListener(
            'click',
            function() {
                screen.showScreen('main-menu');
            }
        );
    }

    function run() {}

    return {
        initialize : initialize,
        run : run
    };
}(MyScreen.screen));
