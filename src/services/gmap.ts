import * as $ from 'jquery';

const key = 'AIzaSyBdrDGYzK48wAwoDe7MwwKpGxGJZ6c2jqE';
//return a promise which resolves when google maps is loaded
export function loadGoogleMapsAPI() {
    let p = new Promise((resolve, reject) => {
        (window as any).googleMapCallback = () => resolve();
        const version = 3;
        const cb_name = 'googleMapCallback';
        const libraries = 'places';
        const baseUrl = `https://maps.googleapis.com/maps/api/`
        const gmapUrl = `${baseUrl}js?v=${version}&key=${key}&callback=${cb_name}&libraries=${libraries}`
        const $gmapScript = $('<script async defer type="text/javascript"></script>');
        $gmapScript.attr('src', gmapUrl);
        $('body').append($gmapScript)
    });

    return p;
}

export function streetView({ lat, lng }: google.maps.LatLng, options?: any): string {
    return `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${lat()},${lng()}&key=${key}`;
}

export function getPlaceDetails(placeId : string, map: google.maps.Map) {
    let service = new google.maps.places.PlacesService(map);
    return new Promise((resolve, reject) => {
        let callback = (place: google.maps.places.PlaceResult, status: google.maps.places.PlacesServiceStatus): void => {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                resolve(place);
            } else {
                reject("No Google Maps! " + status.toString());
            }
        }

        service.getDetails({ placeId: placeId }, callback);
    });
}