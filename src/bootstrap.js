import Vue from 'vue';
import store from './store';
import App from "./App";


window.APP = new Vue({
	store,
	render: h => h(App)
});
window.APP.$mount('#app');
