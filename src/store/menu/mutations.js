export const mutations = {
	
	//修改数据
	changeData(state , data){
		state[data.key] = data.value;
	},
	//banner图数据
	// changeBannerData(state , data){
	// 	state.bannerData = data;
	// },
	
	//商品类型数据
	// changetypeData(state , data){
		
	// 	state.typeData = data;
	// },
	
	//当前商品类型的商品数据
	// changeProductsData(state , data){
		
	// 	state.ProductsData = data;
	// }
}