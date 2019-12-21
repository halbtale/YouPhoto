import Vue from 'vue';
import App from './App.vue';
import LongPress from 'vue-directive-long-press';

Vue.directive('long-press', LongPress);

Vue.config.productionTip = false;

new Vue({
    render: h => h(App)
}).$mount('#app');
