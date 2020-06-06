export const mutations = {
	
	//修改数据
	changeData(state , data){
		
		state[data.key] = data.value;
	},
	
	//置空数据
	emptyData(state){
		
		state.orderData = []
	
	},
	
	//删除
	removeOrderData(state , index){
		state.orderData.splice(index , 1)
	}
	
}