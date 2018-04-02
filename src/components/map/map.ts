import { } from "googlemaps";
import * as $ from "jquery";
import { components, computed, observable, observableArray } from "knockout";
import { Venue } from "../../model/venue";
import { loadGoogleMapsAPI } from "../../services/gmap";
import * as style from "./map.less";

interface IStringMarker {
    // association between venues name and markers
    [index: string]: google.maps.Marker;
}

class MapComponent {
    public map: google.maps.Map;
    public markers: IStringMarker;
    public venues: Venue[];
    public visibleVenues: KnockoutObservableArray<Venue>;
    public currentVenue: KnockoutObservable<Venue>;
    public overlayVisible: KnockoutObservable<boolean>;
    public currentVenueMatching: KnockoutObservable<boolean>;
    public notVisibleVenues: KnockoutComputed<Venue[]>;

    constructor(element: HTMLElement, params: any) {
        this.venues = params.venues;
        this.visibleVenues = params.visibleVenues;
        this.currentVenue = params.currentVenue;
        this.currentVenueMatching = params.currentVenueMatching;
        this.overlayVisible = observable(false);
        this.notVisibleVenues = params.notVisibleVenues;

        loadGoogleMapsAPI().then(() => {
            this.map = new google.maps.Map(element, {
                fullscreenControl: false,
                mapTypeControl: false,
                mapTypeId: "terrain",
                streetViewControl: true,
                streetViewControlOptions: {
                    position: google.maps.ControlPosition.TOP_RIGHT,
                },
                zoomControl: true,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_TOP,
                },
                ...params.options,
            });

            const overlay = document.getElementById("overlay");

            // uncomment this line for a border round the national park
            // this.map.data.loadGeoJson('data/lakes.geojson');

            this.map.data.setStyle({
                fillColor: "lightgray",
                strokeWeight: 0,
            });

            this.markers = {};
            this.venues = params.venues();
            for (const venue of this.venues) {
                this.addVenueMarker(venue.name, venue.location, venue.href);
            }

            // add the hooks to update the map - these are not managed by Knockout
            // if the visible venues change
            this.currentVenueMatching.subscribe((matching: boolean) => {
                if (!matching) {
                    this.clearHighlights();
                    this.currentVenue(null);
                }
            });

            this.notVisibleVenues.subscribe((venues: Venue[]) => {
                for (const venue of venues) {
                    this.markers[venue.name].setAnimation(null);
                    this.markers[venue.name].setMap(null);
                }
            });

            this.visibleVenues.subscribe((venues: Venue[]) => {
                if (venues.length > 0) {
                    for (const venue of venues) {
                        const marker = this.markers[venue.name];
                        if (!marker.getMap()) {
                            marker.setMap(this.map);
                        }
                    }
                    this.map.fitBounds(this.calculate_bounds());
                } else {
                    // there are no venues which match
                    this.map.setCenter(new google.maps.LatLng(54.448906, -3.088366));
                    this.map.setZoom(8);
                }
            });

            // if the currentVenue changes
            this.currentVenue.subscribe((venue: Venue) => {
                if (venue) {
                    this.map.setCenter(venue.location);
                    this.clearHighlights();
                    this.markers[venue.name].setMap(this.map);
                    this.markers[venue.name].setAnimation(google.maps.Animation.BOUNCE);
                    venue.updateGoogleDetails(this.map);
                    this.overlayVisible(true);
                } else {
                    // currentVenue is null
                    this.clearHighlights();
                    this.overlayVisible(false);
                }
            });
        });
    }

    public addVenueMarker(name: string, location: google.maps.LatLng, href: string): google.maps.Marker {
        const marker = new google.maps.Marker({
            animation: google.maps.Animation.DROP,
            map: this.map,
            position: location,
            title: name,
        });

        marker.addListener("click", () => {
            for (const v of this.venues) {
                if (v.name === name) {
                    this.currentVenue(v);
                }
            }
        });

        this.markers[name] = marker;
        this.map.fitBounds(this.calculate_bounds());
        return marker;
    }

    public clearHighlights() {
        for (const name in this.markers) {
            if (this.markers[name]) {
                this.markers[name].setAnimation(null);
            }
        }
    }

    public calculate_bounds(): google.maps.LatLngBounds {
        const bounds = new google.maps.LatLngBounds();
        for (const name in this.markers) {
            if (this.markers[name].getMap()) {
                bounds.extend(this.markers[name].getPosition());
            }
        }

        return bounds;
    }
}

export const viewmodel = {
    template: `
<div class="${style.map}" id="map"></div>
<overlay-widget id="overlay" class="${style.container}" data-bind="css: {'${style.open}': overlayVisible()}" params="venue : currentVenue, visible : overlayVisible"></overlay-widget>
    `,
    viewModel: {
        createViewModel: (params: any, componentInfo: any) => {
            return new MapComponent($(componentInfo.element).find("#map").get(0), params);
        },
    },
};

components.register("map-widget", viewmodel);
