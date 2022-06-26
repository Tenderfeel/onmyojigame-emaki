import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import { createPinia } from 'pinia'
import "primevue/resources/themes/arya-blue/theme.css"
import "primevue/resources/primevue.css"
import "primeicons/primeicons.css"
import "primeflex/primeflex.css"

import Button from "primevue/button";
import InputNumber from 'primevue/inputnumber';
import Panel from 'primevue/panel';
import Tag from 'primevue/tag';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import Dialog from 'primevue/dialog';
import ConfirmationService from 'primevue/confirmationservice';
import ConfirmDialog from 'primevue/confirmdialog';
import Tooltip from 'primevue/tooltip';
import FileUpload from 'primevue/fileupload';
import ToastService from 'primevue/toastservice';
import OverlayPanel from 'primevue/overlaypanel';

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(PrimeVue);
app.use(ConfirmationService);
app.use(ToastService);
app.component("Button", Button);
app.component("InputNumber", InputNumber);
app.component("Panel", Panel);
app.component("Tag", Tag);
app.component("Calendar", Calendar);
app.component("Dropdown", Dropdown);
app.component("Dialog", Dialog);
app.component("ConfirmDialog", ConfirmDialog);
app.component("FileUpload", FileUpload);
app.component("OverlayPanel", OverlayPanel);
app.directive('tooltip', Tooltip);

app.mount('#app')
