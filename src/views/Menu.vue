<template>
	<div class="menu">
		<div class="head-box">
			<div class="head-menu">
				<div class="head-menu-nav">
					菜单
					<div class="head-menu-shopp" @click="goShopcart">
						<img src="../assets/购物车.png" class="auto-img" alt="">
					</div>
				</div>
			</div>
			
			<!-- 轮播图 -->
			
			<div class="menu-rotation">
				<van-swipe :autoplay="5000" indicator-color="white">
				  <van-swipe-item v-for="(item , index) in bannerData" :key="index" >
					  <img :src="item.bannerImg" class="auto-img" alt="">
				  </van-swipe-item>
				 
				  
				</van-swipe>
				
			</div>	
		</div>
		
		<div class="menu-product">
			<div class="menu-product-nav">
				<div class="menu-category fl">
					品类
					<i></i>
				</div>
				<div class="menu-proname fl">咖啡品名</div>
			</div>
			<div class="menu-sidebar fl">
				<div class="menu-sidebar-text" :class="{active : item.isActive}" v-for="(item , index) in typeData" :key="index" @click="toggleType(item , index)">
					{{item.typeDesc}}
				</div>
				
			</div>
			
			<div class="menu-sidebar-product fl">
				<div class="sidebar-product-roll">
					<div class="sidebar-product-list clearfix" v-for="(item , index) in ProductsData" :key="index" @click="goDetail(item.pid)">
						<div class="product-list-image fl">
							<img :src="item.smallImg" class="auto-img" alt="">
						</div>
						<div class="product-list-infor fl">
							<div class="list-infor-text fl">
								<p>{{item.name}}</p>
								<span>{{item.enname}}</span>
								<div>￥{{item.price}}</div>
							</div>
							
							<div class="menu-arrow fr">
								<img src="../assets/箭头.png" class="auto-img" alt="">
							</div>
						</div>
					</div>
				</div>
			</div>
			
		</div>
	</div>
	
</template>

<script>
	//辅助函数
	import {mapState} from 'vuex'
	export default{
		name:"Menu",
		
		created(){
			
			//false 是 首次触发 ， true 是 拦截首次触发
			if(this.menuIsLoaded){
				
				return
			}
			
			//加载提示
			this.$toast.loading({
			  forbidClick: true,
			  duration: 0,
			  message: "加载中..."
			});
			
			//初始化时调用轮播图数据
			
			this.getBanner()
			
			//初始化商品类型数据
			this.getType()
			
			//更改首次触发的布尔值
			this.$store.commit("changeData" , {key: "menuIsLoaded" , value: true})
		},
		
		computed:{
			
			menuIsLoaded(){
				return this.$store.state.menuIsLoaded
			},
			//轮播图数据
			//不能直接更改计算属性需要在mutations里面更改
			// bannerData
			
			//商品类型数据
			// typeData
			
			//商品类型的商品数据
			// ProductsData
			
			...mapState("menuModule",["ProductsData" , "typeData" , "bannerData"])
				
			
		},
		
		
		methods:{
			
			//get请求携带的参数
			getBanner(){
				this.axios({
					
					method:"GET",
					
					url:"/banner",
					
					//与post请求参数不一样
					params:{
						
						appkey:this.appkey
						
					}
				}).then( result =>{
					
					if(result.data.code == 300){
						
						// this.$store.commit('menuModule/changeBannerData' , result.data.result)
					this.$store.commit('menuModule/changeData' , {key : "bannerData" , value: result.data.result})
					
					}
					
					
				}).catch( err =>{
					
					
				})
			},
			
			//商品类型数据
			getType(){
				
				this.axios({
					method:"GET",
					url:"/type",
					params:{
						appkey:this.appkey
					}
				}).then( result =>{
					//服务器的数据
					let types = result.data.result;
					//将服务器的数据加工添加一个激活类型
					types.forEach( v => {
						v.isActive = false
				
					})
					//在添加一个最新推荐的数据
					types.unshift({
						type:"isHot",
						typeDesc:"最新推荐",
						isActive:true
					})
					
					if(result.data.code == 400){
						// 向提交数据menuModule/changetypeData
						// this.$store.commit('menuModule/changetypeData' , types)
						this.$store.commit('menuModule/changeData' , {key : "typeData" , value: result.data.result})
						this.getTypeProducts(this.typeData[0])
					}
					
					this.$toast.clear();
					
				}).catch( err =>{
				})
			},
			
			
			//切换商品数据
			toggleType(item ,index){
				if(item.isActive){
					
					return;
				}
				
				let types = this.typeData.concat();
				
				for(let i = 0 ; i<types.length ; i++){
					
					if(types[i].isActive){
						
						types[i].isActive = false;
						
						break;
					}
				}
				
				//当前激活
				types[index].isActive = true
				
				// this.$store.commit('menuModule/changetypeData' , types)
				this.$store.commit('menuModule/changeData' , {key : "typeData" , value: types})
				
				//加载提示
				this.$toast.loading({
				  forbidClick: true,
				  duration: 0,
				  message: "加载中..."
				});
				
				this.getTypeProducts(item)
				
			},
			
			//获取商品类型的商品数据
			getTypeProducts(item){
				
				//请求参数
				
				let params = {
					
					appkey:this.appkey
				}
				
				if(item.type == "isHot"){
					
					params.key = "isHot"
					
					params.value = 1
				}else{
					params.value = item.type
					params.key = "type"
				}
				
				this.axios({
					
					method:"GET",
					
					url:"/typeProducts",
					
					params
					
				}).then( result =>{
					
					if(result.data.code == 500){
						this.$store.commit('menuModule/changeData' , {key : "ProductsData" , value: result.data.result})
					}
					this.$toast.clear();
				}).catch( err =>{
					this.$toast.clear();
				})
				
				
			},
		
			//跳转详情页
			goDetail(pid){
				this.$router.push({name:"Detail" , params:{pid}} )
			},
			
			goShopcart(){
				this.$router.push({name: "Shopcart"})
			}
			
		}
		
	}
</script>

<style lang="less" scoped>
	.head-box{
		// height: 213px;
		
	}
	.menu{
		
		color: #fff;
		font-size: 20px;
		
		.head-menu{
			height: 50px;
			background-image:linear-gradient(#3c120b, #882225 );
			
			.head-menu-nav{
				text-align: center;
				line-height: 50px;
				letter-spacing:8px;
				position: relative;
				color: #cbbdb0;
			}
		}
	}
	
	.head-menu-shopp{
		position: absolute;
		top: 50%;
		right: 10px;
		width: 26px;
		height: 26px;
		margin-top:-13px ;
		
		
	}
	
	.menu-rotation{
		// overflow: hidden;
		// height: 146px;
		transform: translateZ(0);
	}
	
	
	.menu-product{
		height: calc(100vh - 147px - 100px - 21px - 16px + 24px );
		background: #ddd;
		
		.menu-product-nav{
			height: 50px;
			background: #641510;
			
			color: #cbbdb0;
			
			
			
			.menu-category{
				height: 50px;
				line-height: 50px;
				width: 30%;
				text-align: center;
				border-right: 1px solid #be8483;
				box-sizing: border-box;
				// position: relative;
				>i{
					height: 35px;
					width: 1px;
					background: #be8483;
					// position: absolute;
					// top: 50%;
					// right: 0px;
					margin-top:-20px ;
				}
			}
			.menu-proname{
				height: 50px;
				line-height: 50px;
				width: 70%;
				text-align: center;
			}
		}
	}

	.menu-sidebar{
		width: 30%;
		background: #c1aea8;
		height: calc(100vh - 147px - 100px - 21px - 50px - 12px + 24px);
		border-right: 1px solid #be8483;
		box-sizing: border-box;
		.menu-sidebar-text{
			height: 45px;
			padding-left:15px ;
			box-sizing: border-box;
			font-size: 16px;
			line-height: 45px;
			color: #281612;
			border-bottom: 1px solid #a18c87;
			
		}
		.active{
			background:#e9dfd6 ;
		}
		
	}
	
	.menu-sidebar-product{
		width: 70%;
		background:#e9dfd6 ;
		height: calc(100vh - 147px - 100px - 21px - 50px - 12px + 24px);
		overflow: auto;
		
		.sidebar-product-roll{
			
			.sidebar-product-list{
				font-size: 16px;
				height: 80px;
				background: #e9dfd6;
				padding: 8px;
				box-sizing: border-box;
				border-bottom: 1px solid #cfc5bc;
				
			}
		}
		
	}
	
	.product-list-image{
		width: 65px;
	}
	.product-list-infor{
		margin-left: 10px;
		width: calc(100% - 65px - 10px);
		height: 63px;
		overflow: hidden;
		.list-infor-text{
			>p{
				color: #1f1e1c;
			}
			>span{
				color: #8d8d85;
				font-size: 14px;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
				width: 120px;
				display: block;
			}
			>div{
				color: #971221;
				font-size: 16px;
				
			}
				

		}
		
		.menu-arrow{
			margin-top: calc(80px - 20px - 40px);
		}
		
	}
	
	

</style>
