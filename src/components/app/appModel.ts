import { observableArray, components, observable } from 'knockout';
import { Venue } from '../../Venue';
import * as style from './appModel.css'

class AllViewModel {
    venues: KnockoutObservable<Venue[]>;
    currentVenue: KnockoutObservable<Venue>;
    visibleVenues: KnockoutObservableArray<Venue>;

    constructor(params: any) {
        this.venues = params.venues;
        this.visibleVenues = observableArray();
        this.currentVenue = observable();
    }
}

const params = `venues : venues, visibleVenues : visibleVenues, currentVenue : currentVenue`;
const template = `
<div class="${style.appContainer}">
    <div class="${style.mapContainer}">
        <map-widget params="${params}"></map-widget>
    </div>
    <div class="${style.listContainer}">
        <venue-list-widget params="${params}"></venue-list-widget>
    </div>
</div>`;

components.register('app-widget', {
    viewModel: AllViewModel,
    template: template
});