'use strict';

var request = (function () {

    var favouritesPlaceList = document.querySelector( '.favourites-list' ),
        favouritesPlaceArray = [],
        favouritesLocation = [],
        currMarkers = [],
        marker,
        map;

    favouritesLocation = ( localStorage.favouritePlaceArray ) ? JSON.parse( localStorage.favouritePlaceArray ) : [];

    function timeZoneReq ( params ) {

        var xhr = new XMLHttpRequest();


        xhr.open('GET', 'https://maps.googleapis.com/maps/api/timezone/json?location=' + params.location.lat() + ',' + params.location.lng() + '&timestamp=' + params.timestamp + '&key=' + config.apiKey, true);
        xhr.send();

        xhr.onreadystatechange = function() {

            if (xhr.readyState !== 4) return;

            if (xhr.status !== 200) {

                alert( xhr.status + ': ' + xhr.statusText );

            } else {

                var responseData = JSON.parse(xhr.responseText),
                    utc = new Date().toUTCString(), //current UTC
                    localTime = new Date( ( params.timestamp + responseData.dstOffset + responseData.rawOffset) * 1000 ).toUTCString(); //current local time

                var infowindow = new google.maps.InfoWindow({ //defined tooltip

                    content: '<div>Lat:' + params.location.lat() + '; ' + 'Lng:' + params.location.lng() + '</div>'
                    + '<div>Timezone name:' + responseData.timeZoneName + '</div>'
                    + '<div>UTC:' + utc + '; ' + '</div>'
                    + '<div>Local time:' + localTime + '</div>'
                    + '<div class="add-to-favourite"><button class="add-to-favourite__button">Add to favourite</button></div>',

                    pixelOffset: {
                        width: 0,
                        height: 40 //displace tooltip to click-point
                    }
                });

                if ( marker && marker.getOpacity() === 0 ) { //check the presence of the previous marker and remove him
                    marker.setMap( null );
                }

                marker = new google.maps.Marker( { position: params.location, map: params.map, opacity: 0 } ); // make invisible marker

                google.maps.event.addListener( infowindow, 'domready', function() {

                    var favButton = document.querySelector('.add-to-favourite__button');

                    favButton.addEventListener('click', function () { //add item to favourites

                        favouritesLocation.push({
                            location: params.location,
                            tooltipContent: infowindow.content
                        });



                        localStorage.favouritePlaceArray = JSON.stringify(favouritesLocation); // add array with location to local-storage

                        favouritesPlaceList.innerHTML = favouritesPlaceList.innerHTML + '<li class="favourites-list__item">Lat:' + params.location.lat() + '; ' + 'Lng:' + params.location.lng() + ';</li>';

                        infowindow.close();
                        marker.setOpacity(1);

                        currMarkers.push(marker);
                    })

                });
                infowindow.open(params.map, marker);
            }
        }
    }

    return {

        timeZoneReq: timeZoneReq,
        map: map,
        favouritesLocation: favouritesLocation,
        favouritesPlaceList: favouritesPlaceList,
        favouritesPlaceArray: favouritesPlaceArray,
        currMarkers: currMarkers

    }
})();