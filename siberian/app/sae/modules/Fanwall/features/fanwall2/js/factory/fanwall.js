/**
 * Module FanWall
 *
 * @author Xtraball SAS <dev@xtraball.com>
 * @version 4.18.20
 */
angular
    .module('starter')
    .factory('Fanwall', function ($pwaRequest, $stateParams) {

    var factory = {
        storage: [],
        lastValueId: null
    };

    factory.loadSettings = function () {
        if (factory.storage.hasOwnProperty($stateParams.value_id)) {
            return $pwaRequest.resolve(factory.storage[$stateParams.value_id]);
        }

        var payload = $pwaRequest.getPayloadForValueId($stateParams.value_id);
        if (payload !== false) {
            factory.storage[$stateParams.value_id] = payload;
            return $pwaRequest.resolve(payload);
        }

        // Otherwise fallback on PWA!
        var promise = $pwaRequest.get('fanwall/mobile_home/load-settings', {
            urlParams: {
                value_id: $stateParams.value_id
            }
        });

        promise.then(function (success) {
            factory.storage[$stateParams.value_id] = success;
        });

        return promise;
    };

    factory.getSettings = function () {
        // First the current valudId if inside social wall
        if (factory.storage.hasOwnProperty($stateParams.value_id)) {
            factory.lastValueId = $stateParams.value_id;
            return factory.storage[$stateParams.value_id].settings;
        }
        // Fallback on the "last" valueId if we go back
        if (factory.storage.hasOwnProperty(factory.lastValueId)) {
            return factory.storage[factory.lastValueId].settings;
        }
        // Then default nulled settings
        return {
            cardDesign: false,
            features: {
                enableGallery: true,
                enableMap: true,
                enableNearby: true,
                enableUserComment: true,
                enableUserLike: true,
                enableUserPost: true
            },
            icons: {
                gallery: null,
                map: null,
                nearby: null,
                new: null,
                post: null,
                profile: null
            },
            max_images: 10
        };
    };

    return factory;
});
