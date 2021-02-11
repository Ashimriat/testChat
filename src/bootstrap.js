import Vue from 'vue';
import store from './store';
import App from "./App";


new Vue({
  store,
  ender: h => h(App)
}).$mount('#app');
