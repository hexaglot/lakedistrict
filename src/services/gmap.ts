import * as $ from "jquery";

const KEY = "AIzaSyBdrDGYzK48wAwoDe7MwwKpGxGJZ6c2jqE";
// return a promise which resolves when google maps is loaded
export function loadGoogleMapsAPI() {
    const promise = new Promise((resolve, reject) => {
        (window as any).googleMapCallback = () => resolve();
        const VERSION = 3;
        const CB_NAME = "googleMapCallback";
        const LIBRARIES = "places";
        const BASEURL = "https://maps.googleapis.com/maps/api/";
        const GMAP_URL = `${BASEURL}js?v=${VERSION}&key=${KEY}&callback=${CB_NAME}&libraries=${LIBRARIES}`;
        const $gmapScript = $('<script async defer type="text/javascript"></script>');
        $gmapScript.attr("src", GMAP_URL);
        $("body").append($gmapScript);
    });

    return promise;
}

export function streetView({ lat, lng }: google.maps.LatLng, options?: any): string {
    return `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${lat()},${lng()}&key=${KEY}`;
}

export function getPlaceDetails(placeId: string, map: google.maps.Map) {
    const service = new google.maps.places.PlacesService(map);
    return new Promise((resolve, reject) => {
        const callback = (
            place: google.maps.places.PlaceResult,
            status: google.maps.places.PlacesServiceStatus): void => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                resolve(place);
            } else {
                reject("No Google Maps! " + status.toString());
            }
        };

        service.getDetails({ placeId }, callback);
    });
}
