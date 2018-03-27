import { observable, computed, applyBindings, observableArray, components } from 'knockout';
import { Venue } from '../../Venue';
import * as style from './venueViewModel.css';

class ViewModel {
    allVenues: KnockoutComputed<Venue[]>;
    searchTerm: KnockoutObservable<string>;
    visibleVenues: KnockoutComputed<Venue[]>;
    currentVenue: KnockoutObservable<Venue>;

    constructor(params: any) {
        this.allVenues = params.venues;
        this.searchTerm = observable();
        this.currentVenue = params.currentVenue;
        this.visibleVenues = computed((): Venue[] => {
            const regex = new RegExp(this.searchTerm());
            const matchingVenues = this.allVenues().filter((v: Venue) => regex.test(v.name));
            params.visibleVenues.removeAll();
            for (let v of matchingVenues) {
                params.visibleVenues.push(v);
            }
            return matchingVenues;
        }, this);
    }

    setCurrentVenue = (venue: Venue) => {
        this.currentVenue(venue);
    }
}

components.register('venue-list-widget', {
    viewModel: ViewModel,
    template: `
<input class="${style.input}" data-bind="textInput: searchTerm"></input>
    <ul class="${style.list}" data-bind="foreach: visibleVenues">
    <li data-bind="text:name, click:$parent.setCurrentVenue, css: {'${style.selected}': $parent.currentVenue() === $data}"></li>
</ul>`
});
//selected: $data === $parent.Selected() 