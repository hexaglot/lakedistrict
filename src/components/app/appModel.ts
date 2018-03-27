import { observableArray, components, observable } from 'knockout';
import { Venue } from '../../Venue';
import * as style from './appModel.css'

class AllViewModel {
    venues: KnockoutObservable<Venue[]>;
    currentVenue: KnockoutObservable<Venue>;
    visibleVenues: KnockoutObservableArray<Venue>;
    menuOpen : KnockoutObservable<boolean>;

    constructor(params: any) {
        this.venues = params.venues;
        this.visibleVenues = observableArray();
        this.currentVenue = observable();
        this.menuOpen = observable(false);
    }

    toggleMenu() {
        this.menuOpen(!this.menuOpen());
    }
}

const params = `venues : venues, visibleVenues : visibleVenues, currentVenue : currentVenue`;
const template = `
<div class="${style.appContainer}">
    <div class="${style.buttonContainer}"><button data-bind="click: toggleMenu" class="${style.menuButton}">Hamburger</button></div>
    <div class="${style.mapContainer}">
        <map-widget params="${params}"></map-widget>
    </div>
    <div class="${style.listContainer}" data-bind="css: {'${style.open}': menuOpen()}">
        <venue-list-widget params="${params}"></venue-list-widget>
    </div>
</div>`;

components.register('app-widget', {
    viewModel: AllViewModel,
    template: template
});