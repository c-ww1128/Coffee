export const mutations = {
	
	//修改数据
	changeData(state , data){
		state[data.key] = data.value;
	},
	
	//置空
	emptyData(state){
		state.productDetailData = {};
		state.rules = [];
		state.describe = [];
		state.isLike = false;
		state.count = 1 ;
		state.shopCount = 0
	},
	
	//商品规格数据整理
	changeproductDetailData(state , data){
		//商品规格整理
		
		let titles = {
			//键名之所以这样写是为了更好拿到数据
			//键名就是类型值，可以遍历用key拿值
			tem:data.tem_desc,
			milk:data.milk_desc,
			sugar:data.sugar_desc,
			cream:data.cream_desc
		}
		
		for(let key in titles){
			//判断空字符串不需要添加
			if(data[key] == ""){
				continue;
			}
			let o = {
				title:titles[key],
				rule:[]
			}
			
			let ruleData = data[key].split("/");
			
			
			
			for(var i = 0 ; i<ruleData.length ; i++){
				let o1 = {
					text:ruleData[i],
					isActve: i == 0 
				}
				// 把数据推送到o对象
				o.rule.push(o1)
				
				
			}
			
			state.rules.push(o)
			
			
			
		}
		
		// 商品描述
		  state.describe = data.desc.split(/\n/) ;

		state.productDetailData = data
	}
	
	
	
}