export const mutations = {
	
	changeData(state , data){
		state[data.key] = data.value
	},
	
	//置空数据
	emptyData(state){
		
		//我的商品收藏商品数据
		state.orderData=[],
		
		//懒加载数据
		state.loadorderData=[]
		
		//触底加载完成，没有数据可加载了
		state.isfinished= false,
		
		//每次加载6条数据
		state.count=6,
		
		//开始截取下标
		state.start=0
	},
	
	//懒加载每次6条
	loadData(state){
		state.orderData.push(...state.loadorderData.slice(state.start , state.start + state.count))
		
		state.start = state.count ;
	},
	
	//删除
	removeOrderData(state , index){
		state.orderData.splice(index , 1)
	}
	

}