function ServiceWorkerExample() {
    var me = this;
    var refreshing;

    me.init = async function() {
        me.registerServiceWorker();
        me.checkNetworkConnection();
    };

    me.registerServiceWorker = async function() {
        if (!'serviceWorker' in navigator) {
            console.error('Service Workers are not supported by this browser');
            return;
        }

        navigator.serviceWorker.addEventListener('controllerchange', function (e) {
            if (refreshing) return;
            refreshing = true;
            window.location.reload();
        });
        
        var registration = await navigator.serviceWorker.register('service-worker.js');

        registration.addEventListener('updatefound', function (e) {
            console.log('Service Worker update found.', e);
        });
    };

    me.checkNetworkConnection = async function() {
        try {
            var response = await fetch('img/green.png?version=' + Date.now());
            await response.text();
            me.toggleIndicator(true);
        } catch(error) {
            me.toggleIndicator(false);
        }

        await timeout(10000);
        me.checkNetworkConnection();
    };

    me.toggleIndicator = function(online) {
        var online_indicator = document.querySelector('.online-indicator');
        var offline_indicator = document.querySelector('.offline-indicator');

        online_indicator.classList.remove('hidden');
        offline_indicator.classList.remove('hidden');

        if (online) {
            offline_indicator.classList.add('hidden');
        } else {
            online_indicator.classList.add('hidden');
        }
    };

    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    me.init();
}
var serviceworkerexample = new ServiceWorkerExample();