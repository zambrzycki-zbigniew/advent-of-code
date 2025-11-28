/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Ensure hash is present so the hash router can resolve routes on first load
if (!window.location.hash || window.location.hash === '#') {
  window.location.hash = '#/';
}

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
