import ElementUI from 'element-ui';
import Vue from 'vue'
import App from './App.vue'

Vue.use(ElementUI);

new Vue({
  el: '#app',
  render: h => h(App)
});
