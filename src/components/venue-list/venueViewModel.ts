import { observable, computed, applyBindings, observableArray, components } from 'knockout';
import { Venue } from '../../model/model';
import * as style from './venueViewModel.less';

class ViewModel {
    searchTerm: KnockoutObservable<string>;
    visibleVenues: KnockoutComputed<Venue[]>;
    currentVenue: KnockoutObservable<Venue>;

    constructor(params: any) {
        this.currentVenue = params.currentVenue;
        this.visibleVenues = params.visibleVenues;
        this.searchTerm = params.searchTerm;
    }

    setCurrentVenue = (venue: Venue) => {
        this.currentVenue(venue);
    }
}

components.register('venue-list-widget', {
    viewModel: ViewModel,
    template: `
<div class="${style.container}">
    <div>
        <input class="${style.input}" data-bind="textInput: searchTerm" type="text" placeholder="Search"></input>
    </div>
   
    <!-- ko if: visibleVenues().length > 0 -->
    <ul class="${style.list}" data-bind="foreach: visibleVenues">
        <li class="${style.item}" data-bind="text:name, click:$parent.setCurrentVenue, css: {'${style.selected}': $parent.currentVenue() === $data}"></li>
    </ul>
    <!-- /ko -->
    <!-- ko if: !visibleVenues().length -->
        <div class="${style.noneMatch}">No Venues Match Filter</div>
    <!-- /ko -->
</div>`
});