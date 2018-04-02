import { observableArray, observable, computed } from 'knockout';
import { foursquare_details } from '../services/foursquare'
import { getPlaceDetails } from '../services/gmap'

export enum LoadingStatus {
    loaded = 'loaded',
    loading = 'loading',
    failed = 'failed',
    unloaded = 'unloaded'
}

export interface JsonVenue {
    name: string,
    phone: string,
    href: string,
    latlng: google.maps.LatLng,
    location: google.maps.LatLng,
    place_id: string,
    address: string,
    foursqaure_name: string,
    foursquare_id: string,
    go: any,
    fs: any,
}

export class Venue {
    name: string;
    phone: string;
    href: string;
    location: google.maps.LatLng;
    place_id: string;
    address: string;
    foursquare_id: string;
    photoUrl: KnockoutComputed<string>;
    go: { status: KnockoutObservable<LoadingStatus>, result: KnockoutObservable<google.maps.places.PlaceResult> };
    fs: { status: KnockoutObservable<LoadingStatus>, result: KnockoutObservable<any> };

    constructor(json: JsonVenue) {
        this.name = json.name;
        this.place_id = json.place_id;
        this.foursquare_id = json.foursquare_id;
        this.address = json.address;
        this.phone = json.phone;
        this.href = json.href;
        this.go = { status: observable(LoadingStatus.unloaded), result: observable() };
        this.fs = { status: observable(LoadingStatus.unloaded), result: observable() };
        this.location = json.location;
    }

    updateFoursquareDetails() {
        let fs = this.foursquare_id ? foursquare_details(this.foursquare_id) : Promise.resolve({});
        fs.then(result => {
            this.fs.result(result);
            this.fs.status(LoadingStatus.loaded);
        }).catch(() => {
            this.fs.status(LoadingStatus.failed);
        });
    }

    updateGoogleDetails(map: google.maps.Map) {
        getPlaceDetails(this.place_id, map).then(result => {
            this.go.result(<google.maps.places.PlaceResult>result);
            this.go.status(LoadingStatus.loaded);
        }).catch(() => {
            this.go.status(LoadingStatus.failed);
        });
    }
}


export class Model {
    venues: KnockoutObservableArray<Venue>;
    status: any; //unloaded/loaded/failed

    constructor() {
        this.venues = observableArray();
        this.status = observable('unloaded');
    }

    loadFromJson(url: string) {
        //load venue data
        const loadVenues = fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                return new Promise((resolve: any) => { resolve(<JsonVenue[]>json) });
            });

        loadVenues.then((venues: JsonVenue[]) => {
            for (const venue of venues) {
                this.venues.push(new Venue(venue));
            }
            this.status('loaded');
        }).catch(error => {
            this.status('failed');
        });
    }
}


