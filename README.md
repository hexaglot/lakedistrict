# Lake District Wedding Venues

[View the app](https://hexaglot.github.io/lakedistrict/dist/)

To run the application locally use ```npm run start``` for a local development server.

Use ```npm run build``` to run the production build. All files will be found in dist/.

This is a frontend web application which uses google maps to help you find a
wedding venue in the Lake District national park in the UK. Its renders at
different sizes and gives user feedback when services don't load.

The application uses webpack, typescript, less, knockout and jquery.
Data is provided by google maps and Foursquare API's.


All html, css, javascript (apart from libraries) and images are my own work. 

## Typescript

Typescript was used to gain extra quality checks and as an opportunity to learn
it. The extra effort of using it alongside knockout probably wasn't worth it.
Although typescript provides many nice features, it probably wasn't used enough
and the extra effort of defining classes is probably no used - most objects
would have been better developed as object literals. Types are included for
google maps and knockout.js.

## The Build System

Webpack is used to build the project. There is a config file for development and
production and common file which stores options shared by both.

Webpack is configured to lint the typescript files, compile them. CSS is passed
through less, and collected into a single file to reduce the amount the client
needs to download. The data files are copied from source to the dist folder. An
index.html is a template to which the main app.bundle and a vendor bundle are
inserted, along with the styles.css.

## Knockout
The project uses knockout to render. Knockout components are used to organize
the project. Again this probably wasn't a great idea - the project isn't big
enough to justify the overhead of passing variables through the code. The layout
is kind of useful and gives a clear scope to sections. Modular css is a big help
in keeping things organized and giving some reassurance that things are not
being redefined. Templates probably shouldn't have been strings - this was
annoying.

This is the directory layout:

```
src/
├── components
│   ├── app
│   │   ├── appModel.less
│   │   └── appModel.ts
│   ├── map
│   │   ├── map.less
│   │   └── map.ts
│   ├── overlay
│   │   ├── overlay.less
│   │   └── overlay.ts
│   ├── shared.less
│   ├── shared.less.d.ts
│   └── venue-list
│       ├── venueViewModel.less
│       └── venueViewModel.ts
├── data
│   └── wv.json
├── images
├── model
│   ├── model.ts
│   └── venue.ts
├── services
│   ├── foursquare.ts
│   └── gmap.ts
├── index.ts
├── styles.less
```

Each directory in components stores registers a new knockout component as a side
effect when its included by index.ts;

google maps place details service and foursquare venue details are handled by
the services directory - each defines a method which returns a promise.

## Data Sources
The official registered venues were obtained from the [Cumbrian local government](https://www.cumbria.gov.uk/findmynearest/weddingvenues.asp) 
and then filtered with d3.js using a [boundary of the national park](https://data.gov.uk/dataset/national-parks-august-2016-full-clipped-boundaries-in-great-britain3/resource/296639c1-c918-4b6e-9c6f-3efe6ed32141
) ( [after being simplified with Map Shaper](http://mapshaper.org/) ) before being put in a json file filtered with jq.

## Todo:
- API keys abstracted to change easily
- Improve the CSS
- clear up gmap.ts
- add tests
- improve the UI (esp on small screens)
