export const state = {
	
	//所有订单数据
	orderData:[],
	
	//加载数据
	loadorderData:[],
	
	//触底加载完成，没有数据可加载了
	isfinished: false,
	
	//每次加载6条数据
	count:6,
	
	//开始截取下标
	start:0
}