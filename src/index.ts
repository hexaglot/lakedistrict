import './styles.css';
import './components/venue-list/venueViewModel';
import './components/app/appModel';
import './components/map/map';
import { applyBindings, observableArray } from 'knockout';
import { Venue } from './Venue';

//load venue data
const loadVenues = fetch('data/wv.json')
    .then(function (response) {
        return response.json();
    })
    .then(function (json) {
        return new Promise((resolve: any) => { resolve(<Venue[]>json) });
    });

const appdata = {
    venues: observableArray()
};

loadVenues.then((venues: Venue[]) => {
    for (const v of venues) {
        appdata.venues.push(v);
    }
});

applyBindings(appdata);
