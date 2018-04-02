import { applyBindings } from "knockout";
import "./components/app/appModel";
import "./components/map/map";
import "./components/overlay/overlay";
import "./components/venue-list/venueViewModel";
import { Model } from "./model/model";
import "./styles.less";

const model = new Model();

model.loadFromJson("data/wv.json");

applyBindings(model);
