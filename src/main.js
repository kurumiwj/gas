import Vue from 'vue';
import Cookies from "js-cookie";
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';
import VueRouter from "vue-router";
import './assets/reset.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/font.css';
import "./icons";
import "./permission";

Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.config.productionTip = false;
document.title = "无线智能报警系统";

new Vue({
    router,
    store,
    beforeCreate() {
        Vue.prototype.$bus = this;
    },
    render: h => h(App)
}).$mount('#app');