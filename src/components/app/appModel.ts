import { observableArray, components, observable } from 'knockout';
import { Venue } from '../../Venue';
import * as template from './appModel.html'

class AllViewModel {
    venues: KnockoutObservable<Venue[]>;
    currentVenue: KnockoutObservable<Venue>;
    visibleVenues: KnockoutObservableArray<Venue>;

    constructor(params : any) {
        this.venues = params.venues;
        this.visibleVenues = observableArray();
        this.currentVenue = observable();
    }
}

components.register('app-widget', {
    viewModel: AllViewModel,
    template: template
});