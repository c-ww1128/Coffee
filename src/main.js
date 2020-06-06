import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//导入rem
import 'lib-flexible'


//配置axios
import axios from 'axios'
import VueAxios from 'vue-axios'


//导入操作cookies模块

import VueCookies from 'vue-cookies'




import
{ Toast ,
  Tabbar,
  TabbarItem,
  Swipe,
  SwipeItem,
  NavBar ,
  Checkbox,
  CheckboxGroup,
  SwipeCell ,
  Button,
  SubmitBar,
  List ,
  Cell,
  CellGroup,
  AddressList,
  AddressEdit,
  ActionSheet,
  Tab,
  Tabs,
  Field,
  Uploader,
  Form,
  Dialog 
	
} from 'vant'



Vue.use(VueAxios, axios);
//注册cookie
Vue.use(VueCookies)

Vue
.use(Toast)
.use(Tabbar)
.use(TabbarItem)
.use(Swipe)
.use(SwipeItem)
.use(NavBar)
.use(Checkbox)
.use(CheckboxGroup)
.use(SwipeCell )
.use(Button)
.use(SubmitBar)
.use(List)
.use(Cell)
.use(CellGroup)
.use(AddressList)
.use(AddressEdit)
.use(ActionSheet)
.use(Tab)
.use(Tabs)
.use(Field )
.use(Uploader )
.use(Form)
.use(Dialog)
Vue.config.productionTip = false

//设置基础请求路径
axios.defaults.baseURL = 'http://www.kangliuyong.com:10002'

// 配置请求头
// post请求的请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'

//为vue原型添加以一个属性
Vue.prototype.appkey = 'U2FsdGVkX1/8MaMiB5GcjWkI1PJLtigenZcJrFEZy/U=' 

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
