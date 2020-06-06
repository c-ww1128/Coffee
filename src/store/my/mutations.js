export const mutations = {
	
	changeData(state ,data){
		
		state[data.key] = data.value ;
	},

	//清空数据
	emptyData(state){
		
		//订单数据
		state.userData = []
		
		
		
	}
}