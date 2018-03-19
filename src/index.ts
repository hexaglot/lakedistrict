import { observable, computed, applyBindings } from 'knockout';
import { } from '@types/googlemaps';
import * as style from './styles.css';

let t = style.test;
let map : google.maps.Map;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 53.800346, lng: -1.549761 },
        zoom: 21
    });
}
(window as any).initMap = initMap;

let script = document.createElement('script');
script.type = 'text/javascript';
script.src = "https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyBdrDGYzK48wAwoDe7MwwKpGxGJZ6c2jqE&callback=initMap";
script.setAttribute('async', '');
script.setAttribute('defer', '');

let s = document.getElementsByTagName('script')[0];
s.parentNode.insertBefore(script, s);

console.log('hello');
// Here's my data model
class ViewModel {
    firstName: KnockoutObservable<string>;
    lastName: KnockoutObservable<string>;
    fullName: KnockoutComputed<string>;

    constructor(first: string, last: string) {
        this.firstName = observable(first);
        this.lastName = observable(last);

        this.fullName = computed(function () {
            // Knockout tracks dependencies automatically. It knows that fullName depends on firstName and lastName, because these get called when evaluating fullName.
            return this.firstName() + " " + this.lastName();
        }, this);
    };
}

applyBindings(new ViewModel("Planet", "Earth")); // This makes Knockout get to work