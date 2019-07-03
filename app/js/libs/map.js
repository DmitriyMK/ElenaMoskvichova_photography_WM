var markersData = [{
        lat: 48.5075627,
        lng: 34.9882175,
        name: "",
        address: ""
    },
];

var map, infoWindow;

function initMap() {
    var centerLatLng = new google.maps.LatLng(48.5075627, 34.9882175);

    var mapOptions = {
        center: centerLatLng,
        zoom: 15,

        mapTypeControl: true,

        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        },

        scrollwheel: false,
        disableDoubleClickZoom: true,
        navigationControlOptions: {
            style: google.maps.NavigationControlStyle.SMALL
        },
        mapTypeId: google.maps.MapTypeId.ROADMAP,

    };

    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    var bounds = new google.maps.LatLngBounds();

    for (var i = 0; i < markersData.length; i++) {

        var latLng = new google.maps.LatLng(markersData[i].lat, markersData[i].lng);
        var name = markersData[i].name;
        var address = markersData[i].address;

        addMarker(latLng, name, address);

        bounds.extend(latLng);
    }

    // map.fitBounds(bounds);

}

function addMarker(latLng, name, address) {

    var image = 'images/marker.png';

    var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        icon: image,
        title: name
    });


}