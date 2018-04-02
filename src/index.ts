import './styles.less';
import './components/venue-list/venueViewModel';
import './components/app/appModel';
import './components/overlay/overlay';
import './components/map/map';
import { applyBindings } from 'knockout';
import { Model } from './model/model';

const model = new Model();

model.loadFromJson('data/wv.json');

applyBindings(model);
