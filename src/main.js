import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

// library fixed
import router from './router';
import { createPinia } from 'pinia'
import Datepicker from '@vuepic/vue-datepicker';
import { QuillEditor } from '@vueup/vue-quill'
import AOS from 'aos'
import VueGoodTablePlugin from 'vue-good-table-next';
import VueWriter from "vue-writer";
import vSelect from 'vue-select'

// testing

// style
import '@vuepic/vue-datepicker/dist/main.css'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import 'aos/dist/aos.css'
import 'vue-good-table-next/dist/vue-good-table-next.css'
import 'vue-select/dist/vue-select.css';

let app;
app = createApp(App);


// calling library fixed
app.use(router);
app.use(createPinia())
app.component('Datepicker', Datepicker);
app.component('QuillEditor', QuillEditor)
app.use(AOS.init());
app.use(VueGoodTablePlugin)
app.use(VueWriter)
app.component('v-select', vSelect);

// testing



//execute
app.mount('#app');

