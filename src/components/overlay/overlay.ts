import { observable, computed, applyBindings, observableArray, components } from 'knockout';
import { Venue, LoadingStatus } from '../../model/model';
import * as style from './overlay.less';


class ViewModel {
    venue: KnockoutObservable<Venue>;
    visible : KnockoutObservable<boolean>;

    constructor(params: any) {
        this.venue = params.venue;
        this.visible = params.visible;
    }

    toggleVisible() {
        this.visible(!this.visible());
    }
}

components.register('overlay-widget', {
    viewModel: ViewModel,
    template: `
    <div class="${style.container}" data-bind="css: {'${style.open}': visible()}, with: venue">
        <div class="${style.inner}">
            <div class="${style.nav}">
                <span class="${style.title}" data-bind="text: name"></span>
                <div class="${style.closeButton}" data-bind="click: $parent.toggleVisible()"></div>
            </div>
        </div>

        <!-- ko if: go.status() !== 'failed'-->
        <div class="${style.photoContainer}" data-bind="with: go.result">
            <div class="${style.photo}" data-bind="style: { 'backgroundImage' : $data.photos ? 'url('+ $data.photos[0].getUrl({ 'maxWidth': 400, 'maxHeight': 196 }) +')': '0'}"> </div>
        </div>
        <!-- /ko -->
        <!-- ko if: go.status() === 'failed'-->
        <div>
            <div>Can't load a picture</div>
        </div>
        <!-- /ko -->

        <div class="${style.inner}">
            <div class="${style.website}"><a data-bind="attr: {href: href}"><span data-bind="text: name"></span></a></div>
            <div class="${style.phone}" data-bind="text: phone"></div>
            <div class="${style.address}" data-bind="text: address"></div>

            <!-- ko if: fs.status() === 'failed'-->
                <span>Foursquare unavailable.</span>
            <!-- /ko -->
            <!-- ko if: fs.status() === 'loaded' && fs.result().response-->
            <div data-bind="with: fs.result">
                <div data-bind="with: response.venue">
                <!-- ko if: tips.count > 0 -->
                    <div class="${style.tipsTitle}"><a data-bind="attr: {href : canonicalUrl}">FourSquare Tips:</a></div>

                    <ul class="${style.tips}" data-bind="foreach: tips.groups">
                    <!-- ko foreach: $data.items -->
                            <li class="${style.tip}">
                                <span class=${style.tipsQuote} data-bind="text: $data.text"></span>
                                <span class="${style.tipsName}" data-bind="text: $data.user.firstName + ' ' + $data.user.lastName"></span>
                            </li>
                        <!-- /ko -->
                    </ul>
                <!-- /ko -->
                </div>
            </div>
            <!-- /ko -->
        </div>
</div>
`
});
