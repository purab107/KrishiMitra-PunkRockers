import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';

import App from './App';

// On web, import the CSS that sets html/body/#root to full-height so ScrollView works.
if (Platform.OS === 'web') {
	try {
		require('./frontend/app.css');
	} catch (e) {
		// ignore if file not found
		// eslint-disable-next-line no-console
		console.warn('frontend/app.css not found or could not be loaded:', e.message);
	}
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
