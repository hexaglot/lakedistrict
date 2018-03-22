import * as $ from 'jquery';

//attach a script element to the body of the page to load google maps, calling
//cb when its done

export function registerGoogleMaps() {
    let p =  new Promise((resolve, reject) => {
        (window as any).googleMapCallback = () => resolve();
        const key = 'AIzaSyBdrDGYzK48wAwoDe7MwwKpGxGJZ6c2jqE';
        const version = 3;
        const cb_name = 'googleMapCallback';
        const gmapUrl = `https://maps.googleapis.com/maps/api/js?v=${version}&key=${key}&callback=${cb_name}`
        const $gmapScript = $('<script async defer type="text/javascript"></script>');
        $gmapScript.attr('src', gmapUrl);
        $('body').append($gmapScript)
    });

    return p;
}
