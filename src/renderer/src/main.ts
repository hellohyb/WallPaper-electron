import { createApp } from 'vue'
import App from './App.vue'
//路由
import router from './router/index'
//注册懒加载
import lazy from './directives/lazy'
const app = createApp(App)
app.directive('lazy',lazy)

app.use(router)

app.mount('#app')
