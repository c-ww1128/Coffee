export const routes = [
	
	{
	  path:'/main',
	  name:'Main',
	  component:r => require(['../views/Main.vue'] , r),
	  
	  //二级路由
	  
	  children:[
		  
		  {
			  path:'menu',
			  name:'Menu',
			  component:r => require(['../views/Menu.vue'] , r),
		  },
		  {
			  path:'order',
			  name:'Order',
			  component:r => require(['../views/Order.vue'] , r),
		  },
		  {
			  path:'shopcart',
			  name:'Shopcart',
			  component:r => require(['../views/Shopcart.vue'] , r),
		  },
		  {
			  path:'my',
			  name:'My',
			  component:r => require(['../views/My.vue'] , r),
		  }
	  ]
	},
	
  {
	  path:'/register',
	  name:'Register',
	  component:r => require(['../views/Register.vue'] , r)
  },
  {
  	  path:'/login',
  	  name:'Login',
  	  component:r => require(['../views/Login.vue'] , r)
  },
  {		
	  //路由参数
  	  path:'/detail/:pid',
  	  name:'Detail',
  	  component:r => require(['../views/Detail.vue'] , r)
  },
  {
  	  //账号管理
  	  path:'/account',
  	  name:'Account',
  	  component:r => require(['../views/Account.vue'] , r)
  },
  {
  	  //收货地址
  	  path:'/address',
  	  name:'Address',
  	  component:r => require(['../views/Address.vue'] , r)
  },
  {
  	  //我的收藏
  	  path:'/like',
  	  name:'Like',
  	  component:r => require(['../views/Like.vue'] , r)
  },
  {
  	  //退出
  	  path:'/sign',
  	  name:'Sign',
  	  component:r => require(['../views/Sign.vue'] , r)
  },
  {
  	  //设置
  	  path:'/install',
  	  name:'Install',
  	  component:r => require(['../views/Install.vue'] , r)
  },
  {
  	  //新增地址
  	  path:'/newAddress',
  	  name:'NewAddress',
  	  component:r => require(['../views/NewAddress.vue'] , r)
  },
  {
  	  //结算页
  	  path:'/pay',
  	  name:'Pay',
  	  component:r => require(['../views/Pay.vue'] , r)
  },
  {
  	  //集合
  	  path:'/aggregate',
  	  name:'Aggregate',
  	  component:r => require(['../views/Aggregate.vue'] , r)
  },
  {
  	  //忘记密码
  	  path:'/email',
  	  name:'Email',
  	  component:r => require(['../views/Email.vue'] , r)
  },
  {
    path: '/password',
    name: 'Password',
    component: r => require(['../views/Password.vue'], r)
  },

  {
	  path:'*',
	  redirect:{
		  name:'Menu'
	  }
  }
]