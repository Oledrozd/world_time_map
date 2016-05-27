'use strict';

function initMap() {

    var favouritesDeleteBtn = document.querySelector( '.favourites-delete__button' );

    request.map = new google.maps.Map( document.querySelector('.map_container' ), {
        center: config.mapCenter,
        scrollwheel: config.mapScrollWheel,
        zoom: config.mapZoom
    });

    if( localStorage.favouritePlaceArray ) {

        var placeArray = JSON.parse( localStorage.favouritePlaceArray );

        for ( var i = 0; i < placeArray.length; i++ ) {

            var favouritePlaceMarker = new google.maps.Marker( { position: placeArray[i].location, map: request.map } ); // add marker for favourite place from local-storage

            var tooltip = new google.maps.InfoWindow({ //defined tooltip for favourites

                content: placeArray[i].tooltipContent.slice(0,  placeArray[i].tooltipContent.lastIndexOf('<div'))
            });

            favouritePlaceMarker.addListener( 'click', function() {
                tooltip.open(request.map, favouritePlaceMarker);
            });

            request.favouritesPlaceArray.push(favouritePlaceMarker);

            // add item to favourites place list
            request.favouritesPlaceList.innerHTML = request.favouritesPlaceList.innerHTML + '<li class="favourites-list__item">Lat:' + placeArray[i].location.lat + '; ' + 'Lng:' + placeArray[i].location.lng + ';</li>';
        }
    }

    // function-cleaner for locale-storage and favorites list
    favouritesDeleteBtn.addEventListener( 'click', function () {

        localStorage.removeItem( 'favouritePlaceArray' );
        request.favouritesPlaceList.innerHTML = '';

        for ( var j = 0; j < request.favouritesPlaceArray.length; j++ ) {
            request.favouritesPlaceArray[j].setMap( null );
        }

        for ( var j = 0; j < request.currMarkers.length; j++ ) {
            request.currMarkers[j].setMap( null );
        }

        request.favouritesLocation.length = 0;
        request.favouritesPlaceList.innerHTML = '';
        localStorage.removeItem( 'favouritePlaceArray' );
    });

    request.map.addListener( 'rightclick', function( event ) {

        var requestParams = {
            map: request.map,
            location: event.latLng,
            timestamp: new Date().getTime() / 1000
        };

        request.timeZoneReq( requestParams );
    });
}