import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'vuetify/styles'
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from './App.vue'
import router from './router'
import '@/assets/main.css'

const app = createApp(App)
const vuetify = createVuetify({
  components,
  directives,
  theme: {
      defaultTheme: 'light',
  },
})

app.use(createPinia())
app.use(router)
app.use(vuetify)

async function prepareApp() {
  const { worker } = await import("./mocks/browser.js");
  return worker.start();
}
prepareApp().then(() => {
  app.mount("#app");
});
