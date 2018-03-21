import { observable, computed, applyBindings, observableArray } from 'knockout';

export interface Venue {
    name: string,
    phone: string,
    href: string,
    latlng: google.maps.LatLng,
    location: google.maps.LatLng,
    place_id: string,
    address: string
}

export class ViewModel {
    // visibleVenues: KnockoutObservableArray<Venue>;
    allVenues: Venue[];
    searchTerm: KnockoutObservable<string>;
    visibleVenues: KnockoutComputed<Venue[]>;
    currentVenue: KnockoutObservable<Venue>;

    constructor() {
        // this.visibleVenues = observableArray();
        this.allVenues = [];
        this.searchTerm = observable();
        this.currentVenue = observable();
        this.visibleVenues = computed((): Venue[] => {
            const regex = new RegExp(this.searchTerm());
            const matchingVenues = this.allVenues.filter((v: Venue) => regex.test(v.name));
            return matchingVenues;
        }, this);
    }

    setCurrentVenue = (venue: Venue) => {
        console.log(this.currentVenue);
        this.currentVenue(venue);
    }
}