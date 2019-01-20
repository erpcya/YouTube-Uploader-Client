import ElementUI from 'element-ui';
import Vue from 'vue'
import App from './App.vue'

Vue.use(ElementUI);

export var eventBus = new Vue({
  methods:{
    publishMedia(mediaAttribute){
      this.$emit('media-to-publish', mediaAttribute);
    },
    cancelMedia(){
      this.$emit('media-to-cancel');
    }
  }
});

new Vue({
  el: '#app',
  render: h => h(App)
});
