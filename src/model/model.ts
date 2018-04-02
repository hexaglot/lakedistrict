import { computed, observable, observableArray } from "knockout";
import { IJsonVenue, Venue } from "./venue";

export class Model {
    public venues: KnockoutObservableArray<Venue>;
    public status: any; // unloaded/loaded/failed

    constructor() {
        this.venues = observableArray();
        this.status = observable("unloaded");
    }

    public loadFromJson(url: string) {
        // load venue data
        const loadVenues = fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                return new Promise((resolve: any) => { resolve(json as IJsonVenue[]); });
            });

        loadVenues.then((venues: IJsonVenue[]) => {
            for (const venue of venues) {
                this.venues.push(new Venue(venue));
            }
            this.status("loaded");
        }).catch((error) => {
            this.status("failed");
        });
    }
}
