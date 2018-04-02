import { observableArray, components, observable, computed } from 'knockout';
import { Venue } from '../../model/model';
import * as style from './appModel.less'

class AllViewModel {
    venues: KnockoutObservable<Venue[]>;

    currentVenue: KnockoutObservable<Venue>;
    visibleVenues: KnockoutComputed<Venue[]>;
    notVisibleVenues: KnockoutComputed<Venue[]>;
    searchTerm: KnockoutObservable<string>;
    menuOpen: KnockoutObservable<boolean>;
    status: KnockoutObservable<any>;
    currentVenueMatching: KnockoutObservable<boolean>;

    constructor(params: any) {
        this.venues = params.venues;
        this.status = params.status;
        this.searchTerm = observable();
        this.visibleVenues = computed(() => {
            const regex = new RegExp(this.searchTerm(), 'i');
            return this.venues().filter((v: Venue) => regex.test(v.name));
        });

        this.notVisibleVenues = computed(() => {
            const regex = new RegExp(this.searchTerm(), 'i');
            return this.venues().filter((v: Venue) => !regex.test(v.name));
        });
        
        this.currentVenue = observable();
        this.menuOpen = observable(false);

        this.currentVenueMatching = computed(() => {
            //returns true if currentVenue is in matchingVenues
            if (this.currentVenue()) {
                for (let v of this.visibleVenues()) {
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

    toggleMenu() {
        this.menuOpen(!this.menuOpen());
    }
}
const params = `venues : venues, visibleVenues : visibleVenues, currentVenue : currentVenue, currentVenueMatching : currentVenueMatching, searchTerm : searchTerm, notVisibleVenues : notVisibleVenues`;
const template = `
<!-- ko if: status() != 'failed' -->
<div class="${style.appContainer}">
    <nav class="${style.nav}">
        <span class="${style.title}">Wedding Venues</span>
        <div type="button" data-bind="click: toggleMenu, css: {'${style.open}': menuOpen()}" class="${style.menuButton}"></div>
    </nav>
    <div class="${style.innerWindow}" data-bind="if: status() == 'loaded'">
        <div class="${style.mapContainer}">
            <map-widget params="${params}"></map-widget>
        </div>
        <div class="${style.listContainer}" data-bind="css: {'${style.open}': menuOpen()}">
            <venue-list-widget params="${params}"></venue-list-widget>
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

components.register('app-widget', {
    viewModel: AllViewModel,
    template: template
});