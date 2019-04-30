/** @format */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { Client } from 'bugsnag-react-native';

const bugsnag = new Client("9126dbe76b383d894aa0d8b13b23a570");

AppRegistry.registerComponent(appName, () => App);
