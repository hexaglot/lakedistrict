import { computed, observable, observableArray } from "knockout";
import { foursquare_details } from "../services/foursquare";
import { getPlaceDetails } from "../services/gmap";

export enum LoadingStatus {
    loaded = "loaded",
    loading = "loading",
    failed = "failed",
    unloaded = "unloaded",
}

export interface IJsonVenue {
    name: string;
    phone: string;
    href: string;
    location: google.maps.LatLng;
    address: string;
    google_id: string;
    foursquare_id: string;
}

export class Venue {
    public name: string;
    public phone: string;
    public href: string;
    public location: google.maps.LatLng;
    public googleId: string;
    public address: string;
    public foursquareId: string;
    public go: {
        status: KnockoutObservable<LoadingStatus>,
        result: KnockoutObservable<google.maps.places.PlaceResult>,
    };
    public fs: {
        status: KnockoutObservable<LoadingStatus>,
        result: KnockoutObservable<any>,
    };

    constructor(json: IJsonVenue) {
        this.name = json.name;
        this.googleId = json.google_id;
        this.foursquareId = json.foursquare_id;
        this.address = json.address;
        this.phone = json.phone;
        this.href = json.href;
        this.go = { status: observable(LoadingStatus.unloaded), result: observable() };
        this.fs = { status: observable(LoadingStatus.unloaded), result: observable() };
        this.location = json.location;
    }

    public updateFoursquareDetails() {
        const fs = this.foursquareId ? foursquare_details(this.foursquareId) : Promise.resolve({});
        fs.then((result) => {
            this.fs.result(result);
            this.fs.status(LoadingStatus.loaded);
        }).catch(() => {
            this.fs.status(LoadingStatus.failed);
        });
    }

    public updateGoogleDetails(map: google.maps.Map) {
        getPlaceDetails(this.googleId, map).then((result) => {
            this.go.result(result as google.maps.places.PlaceResult);
            this.go.status(LoadingStatus.loaded);
        }).catch(() => {
            this.go.status(LoadingStatus.failed);
        });
    }
}
