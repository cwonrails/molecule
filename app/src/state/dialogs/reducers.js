import { combineReducers } from 'redux';

import clearBrowsingData from './clear-browsing-data/reducers';
import injectCSS from './inject-css/reducers';
import injectJS from './inject-js/reducers';
import userAgent from './user-agent/reducers';
import preferences from './preferences/reducers';
import relaunch from './relaunch/reducers';
import reset from './reset/reducers';

export default combineReducers({
  clearBrowsingData,
  injectCSS,
  injectJS,
  preferences,
  relaunch,
  reset,
  userAgent,
});