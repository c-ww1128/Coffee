export const mutations = {
	
	changeData(state ,data){
		
		state[data.key] = data.value ;
	},
	 
	
	loadShopcartData(state){
		//每次获取10条数据
		state.shopcartData.push(...state.allshopcartData.slice(state.start , state.count + state.start));
		
		state.start = state.count ;
	},
	
	//删除shopcartData数组数据的元素
	removeShopcartData(state , data){
		for(let i = state.shopcartData.length - 1 ; i >= 0 ; i--){
			
			if(data.indexOf(state.shopcartData[i].sid) > -1){
				
				state.shopcartData.splice(i , 1);
			}
			
		}
	},
	
	//置空数据
	emptyData(state){
		
		//触底加载完成，没有数据可加载了
		state.isfinished = false ,
		
		//购物车数据
		state.shopcartData =[],
		
		//购物车数据
		state.allshopcartData =[],
		
		//每次加载10条数据
		state.count = 10,
		
		//开始截取下标
		state.start = 0,
		
		//管理
		state.isManage = false ,
		
		//总价格
		state.total = 0
		
	
	}
}