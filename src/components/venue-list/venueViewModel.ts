import { applyBindings, components, computed, observable, observableArray } from "knockout";
import { Venue } from "../../model/venue";
import * as style from "./venueViewModel.less";

class ViewModel {
    public searchTerm: KnockoutObservable<string>;
    public visibleVenues: KnockoutComputed<Venue[]>;
    public currentVenue: KnockoutObservable<Venue>;

    constructor(params: any) {
        this.currentVenue = params.currentVenue;
        this.visibleVenues = params.visibleVenues;
        this.searchTerm = params.searchTerm;
    }

    public setCurrentVenue = (venue: Venue) => {
        this.currentVenue(venue);
    }
}

components.register("venue-list-widget", {
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
</div>`,
    viewModel: ViewModel,
});
