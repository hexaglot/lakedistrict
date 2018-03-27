import { } from 'googlemaps';
import { Markers } from './markers';
import * as $ from 'jquery';
import { Venue } from '../../Venue'
import { observable, computed, observableArray, components } from 'knockout';
import { registerGoogleMaps, streetView } from '../../gmap';
import * as style from './map.css';
import { foursquare_details } from '../../foursquare';

export class MapComponent {
    map: google.maps.Map;
    markers: Markers;
    venues: Venue[];
    visibleVenues: KnockoutObservableArray<Venue[]>;
    currentVenue: KnockoutObservable<Venue>;
    infoWindow: google.maps.InfoWindow;

    constructor(element: HTMLElement, params: any) {
        this.venues = params.venues;
        this.visibleVenues = params.visibleVenues;
        this.currentVenue = params.currentVenue;

        const loadGoogleMaps = registerGoogleMaps();
        loadGoogleMaps.then(() => {
            this.map = new google.maps.Map(element, {
                mapTypeControl: false,
                mapTypeId: 'terrain',
                ...params.options});
            
            // this.map.data.loadGeoJson('data/lakes.geojson');
            this.map.data.setStyle({
                fillColor: 'lightgray',
                strokeWeight: 0
            });

            this.markers = new Markers(this.map);

            this.venues = params.venues();
            for (const venue of this.venues) {
                this.addVenueMarker(venue.name, venue.location, venue.href);
            }

            //add the hooks to update the map - these are not managed by Knockout
            params.visibleVenues.subscribe((venues: Venue[]) => {
                this.markers.showCurrentMarkers(venues.map(v => v.name));
                this.map.fitBounds(this.markers.calculate_bounds());
            });
            params.currentVenue.subscribe((venue: Venue) => {
                if (this.infoWindow) {
                    this.infoWindow.close();
                }
                this.markers.showMarker(venue.name);
                this.createInfoWindow(venue).then((infoWindow) => {
                    this.infoWindow = infoWindow;
                    infoWindow.open(this.map, this.markers.markers[venue.name])
                })//.catch(err => console.log('Offline? ' + err));

            });

        });
    }

    addVenueMarker(name: string, location: google.maps.LatLng, href: string): google.maps.Marker {
        const marker = new google.maps.Marker({
            map: this.map,
            position: location,
            title: name,
            animation: google.maps.Animation.DROP,
        });

        marker.addListener('click', () => {
            let venue: Venue;
            for (const v of this.venues) {
                if (v.name === name) {
                    venue = v;
                }
            }
            this.currentVenue(venue);
        });

        this.markers.addMarker(name, marker);
        this.map.fitBounds(this.markers.calculate_bounds());
        return marker;
    }

    createInfoWindow(venue: Venue): Promise<google.maps.InfoWindow> {
        let infoWindow: google.maps.InfoWindow;
        let service = new google.maps.places.PlacesService(this.map);
        const placeId = venue.place_id;
        let fs: any;

        fs = venue.foursquare_id ? foursquare_details(venue.foursquare_id) : Promise.resolve({});

        let p: Promise<google.maps.places.PlaceResult> = new Promise((resolve, reject) => {
            let callback = (place: google.maps.places.PlaceResult, status: google.maps.places.PlacesServiceStatus): void => {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    resolve(place);
                } else {
                    throw Error("No Google Maps! " + status.toString());
                }
            }

            service.getDetails({ placeId: placeId }, callback);

        });

        //return a promise with all services resolved
        return Promise.all([p, fs]).then(([place, fs_result]: [google.maps.places.PlaceResult, any]) => {
            return Promise.resolve(new google.maps.InfoWindow({ content: venueInfo(place, fs_result) }));
        });
    }
}

export const viewmodel = {
    viewModel: {
        createViewModel: function (params: any, componentInfo: any) {
            return new MapComponent($(componentInfo.element).find('#map').get(0), params);
        }
    },
    template: `<div class="${style.map}" id="map"></div>`
};

components.register('map-widget', viewmodel);

function venueInfo(
    { photos,
        name = '',
        formatted_address = '',
        formatted_phone_number = '',
        website = '',
        rating,
        geometry
        
    }: google.maps.places.PlaceResult,
    fs_json: any): string {
    // console.log('vinf:' + fs_json.canonicalUrl);
    // console.log(fs_json.response.venue.canonicalUrl);
    let fs_url = fs_json.response ? fs_json.response.venue.canonicalUrl : '';
    // let photoUrl = photos ? photos[0].getUrl({ 'maxWidth': 196, 'maxHeight': 196 }) : '';
    let photoUrl = streetView(geometry.location);
    let content = `<div class="${style.popup}">
                    <div><a href="${website}">${name}</a></div>
                    ${photoUrl ? `<div><img src="${photoUrl}" alt=""></div>` : ``}
                    ${rating ? `<div>${rating}</div>` : ``}
                    <div>${formatted_phone_number}</div>
                    <div>${formatted_address}</div>
                    ${fs_url ? `<div><a href=${fs_url}>Foursquare link</a></div>` : ``}
                   <div>`;
    return content;
}