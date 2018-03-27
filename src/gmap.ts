import * as $ from 'jquery';

//attach a script element to the body of the page to load google maps, calling
//cb when its done
const key = 'AIzaSyBdrDGYzK48wAwoDe7MwwKpGxGJZ6c2jqE';
export function registerGoogleMaps() {
    let p =  new Promise((resolve, reject) => {
        (window as any).googleMapCallback = () => resolve();  
        const version = 3;
        const cb_name = 'googleMapCallback';
        const libraries = 'places';
        const gmapUrl = `https://maps.googleapis.com/maps/api/js?v=${version}&key=${key}&callback=${cb_name}&libraries=${libraries}`
        const $gmapScript = $('<script async defer type="text/javascript"></script>');
        $gmapScript.attr('src', gmapUrl);
        $('body').append($gmapScript)
    });

    return p;
}

export function streetView({lat, lng} : google.maps.LatLng, options? : any) : string {
    //&fov=90&heading=235&pitch
    return `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${lat()},${lng()}&key=${key}`;

}
