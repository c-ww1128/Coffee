export const mutations = {
	
	//修改数据
	changeData(state , data){
		
		state[data.key] = data.value;
	},
	
	
	//清空数据
	emptyData(state){
		
		//订单数据
		state.orderData = [],
		
		state.orderDesc = {
			
			//总价
			total:0,
			
			//商品总价数量
			count:0

			
		},
		
		//是否选择地址了
		state.isSelect = false ,
		
		//地址数据
		state.list= [],
		
		//当前地址
		state.address= '请选择收货地址',
		
		//sids商品
		state.sids=[]
		
	}
}