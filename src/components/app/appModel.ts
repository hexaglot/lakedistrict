import { components, computed, observable, observableArray } from "knockout";
import { Venue } from "../../model/venue";
import * as style from "./appModel.less";

class AllViewModel {
    public venues: KnockoutObservable<Venue[]>;

    public currentVenue: KnockoutObservable<Venue>;
    public visibleVenues: KnockoutComputed<Venue[]>;
    public notVisibleVenues: KnockoutComputed<Venue[]>;
    public searchTerm: KnockoutObservable<string>;
    public menuOpen: KnockoutObservable<boolean>;
    public status: KnockoutObservable<any>;
    public currentVenueMatching: KnockoutObservable<boolean>;

    constructor(params: any) {
        this.venues = params.venues;
        this.status = params.status;
        this.searchTerm = observable();
        this.visibleVenues = computed(() => {
            const regex = new RegExp(this.searchTerm(), "i");
            return this.venues().filter((v: Venue) => regex.test(v.name));
        });

        this.notVisibleVenues = computed(() => {
            const regex = new RegExp(this.searchTerm(), "i");
            return this.venues().filter((v: Venue) => !regex.test(v.name));
        });

        this.currentVenue = observable();
        this.menuOpen = observable(false);

        this.currentVenueMatching = computed(() => {
            // returns true if currentVenue is in matchingVenues
            if (this.currentVenue()) {
                for (const v of this.visibleVenues()) {
                    if (v.name === this.currentVenue().name) {
                        return true;
                    }
                }
            }
            return false;
        });

        this.currentVenue.subscribe((venue: Venue) => {
            if (venue) {
                venue.updateFoursquareDetails();
            }
        });
    }

    public toggleMenu() {
        this.menuOpen(!this.menuOpen());
    }
}
const childParams = `venues : venues,
                    visibleVenues : visibleVenues,
                    currentVenue : currentVenue,
                    currentVenueMatching : currentVenueMatching,
                    searchTerm : searchTerm,
                    notVisibleVenues : notVisibleVenues`;

const html = `
<!-- ko if: status() != 'failed' -->
<div class="${style.appContainer}">
    <nav class="${style.nav}">
        <span class="${style.title}">Wedding Venues</span>
        <div type="button" data-bind="click: toggleMenu, css: {'${style.open}': menuOpen()}" class="${style.menuButton}"></div>
    </nav>
    <div class="${style.innerWindow}" data-bind="if: status() == 'loaded'">
        <div class="${style.mapContainer}">
            <map-widget params="${childParams}"></map-widget>
        </div>
        <div class="${style.listContainer}" data-bind="css: {'${style.open}': menuOpen()}">
            <venue-list-widget params="${childParams}"></venue-list-widget>
        </div>
    </div>
</div>
<!-- /ko -->
<!-- ko if: status() === 'failed' -->
<div data-bind="if: status() === 'failed'" class="${style.loadingFailed}">
    <p>Couldn't load the list of venues, please try again later.</p>
</div>
<!-- /ko -->
`;

components.register("app-widget", {
    template: html,
    viewModel: AllViewModel,
});
