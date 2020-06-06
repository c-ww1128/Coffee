import Vue from 'vue'
import Vuex from 'vuex'

import {registerModule} from './register/store'
import {loginModule} from './login/store'
import {mainModule} from './main/store'
import {menuModule} from './menu/store'
import {detailModule} from './detail/store'
import {shopcartModule} from './shopcart/store'
import {myModule} from './my/store'
import {likeModule} from './like/store'
import {newAddressModule} from './newAddress/store'
import {addressModule} from './address/store'
import {payModule} from './pay/store'
import {orderModule} from './order/store'
import {aggregateModule} from './aggregate/store'


Vue.use(Vuex)

export default new Vuex.Store({
	
  state:{
	  //页面是否加载过
	  menuIsLoaded:false,
	  
	  //页面是否加载过
	  mianIsLoaded:'menu',
	  
	  //记录是否登录
	  isLogin:false
  },
  mutations:{
	  changeData(state ,data){
		  state[data.key] = data.value ;
	  }
  },
  modules: {
	 registerModule,
	 loginModule,
	 mainModule,
	 menuModule,
	 detailModule,
	 shopcartModule,
	 myModule,
	 likeModule,
	 newAddressModule,
	 addressModule,
	 payModule,
	 orderModule,
	 aggregateModule
	 
  }
})
