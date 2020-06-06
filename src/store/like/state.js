export const state = {
	
	//我的商品收藏商品数据
	likeData:[],
	
	//懒加载数据
	loadLikeData:[],
	
	//触底加载完成，没有数据可加载了
	isfinished: false,
	
	//每次加载6条数据
	count:6,
	
	//开始截取下标
	start:0
	
};