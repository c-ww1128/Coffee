<template>
	
	<div class="shopcart">
		<div class="shopcart-head-nav clearfix">
			<div class="head-nav-left">
				<i>
					<!-- <img src="../assets/Arrow-1.png"  class="auto-img" alt=""> -->
				</i>
				<span></span>
			</div>
			<div class="head-nav-mid">购物车</div>
			<div class="head-nav-rigth" @click="manage">{{isManage ? '完成' : '管理'}}</div>
		 
		</div>
		<!-- 购物车列表 -->
		<div class="shopcart-box">
			<van-list  finished-text="没有更多了"  v-model="isloading"
			:finished="isfinished" @load = "loadData">
				<van-swipe-cell v-for="(item , index) in shopcartData" :key="index" :disabled="!isManage">
					<div class="shopcart-list" >
						<div class="shopcart-check fl">
							<van-checkbox checked-color="#a73535" v-model="item.isChecked" @change="Select(item)"></van-checkbox>
						</div>
						<div class="shopcart-list-concer fl">
							<div class="shopcart-list-image fl" @click = "goPage(item.pid)">
								<img :src="item.small_img" alt="" class="auto-img">
							</div>
							<div class="shopcart-list-text fl">
								<div class="shopcart-text">
									<div class="clearfix">
										<p class="fl">{{item.name}}</p>
										<span class="fl">{{item.enname}}</span>
									</div>
									<span>{{item.rule}}</span>
								</div>
								<div class="shopcart-price clearfix">
									<div class="fl price">￥{{item.price}}</div>
									<div class="fr shopcart-change-price">
										<span class="fl" @click="decrease(item)">
											<img src="../assets/reduce.png" class="auto-img" alt="">
										</span>
										<span class="fl">{{item.count}}</span>
										<span class="fl" @click ="modify(item)" >
											<img src="../assets/plus.png" class="auto-img" alt="">
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<template #right>
						<van-button
						  square
						  text="删除"
						  type="danger"
						  class="delete-button v-btn"
						  @click = "removeOneShopcart(item.sid)"
						/>
					</template>
				</van-swipe-cell>
			</van-list>	
		</div>
		<!-- 订单栏 -->
		<van-submit-bar
		  :price="total"
		  button-text="提交订单"
		  v-show="!isManage"
		  @submit = "goPay"
		>
		<van-checkbox  v-model="isAllSelect" checked-color="#a73535" @click="AllSelect">全选</van-checkbox>

		</van-submit-bar>
		<!-- 删除列表 -->
		<van-submit-bar
		 class="v-subimt"
		  button-text="删除"
		  v-show="isManage"
		  @submit = "removeMoreShopcart"
		>
		<van-checkbox  v-model="isAllSelect" checked-color="#a73535" @click="AllSelect">全选</van-checkbox>
		</van-submit-bar>
	</div>

</template>

<script>
	//辅助函数
	import {mapState} from 'vuex'
	import {utils} from '../utils/utils.js'
	
	export default {
		name:"Shopcart",
		data(){
			return{
				//触底加载提示
				isloading: false,
				
				//全选按钮
				isAllSelect: false ,
				
			}
		},
		created(){
			//加载提示
			this.$toast.loading({
			  message: '加载中...',
			  duration: 0,
			  forbidClick: true
			});
			
			
			//置空数据
			this.$store.commit("shopcartModule/emptyData")
			
			//获取购物车所有商品
			this.getAllShopcartProduct();
			
		},
		
		//计算属性
		computed:{
			
			...mapState("shopcartModule" , ["shopcartData" , "isfinished" , "count" , "allshopcartData" ,"isManage" , "total"])
		},
		
		//方法
		methods:{
			
			//跳转订单页,提交订单
			goPay(){
					
				
					let sids = []
					this.allshopcartData.forEach( v => {
						if(v.isChecked){
							sids.push(v.sid)
						}
					})
					
					
					if(sids.length == 0){
						//加载提示
						this.$toast({
						  message: '请选择商品...',
						});
						return
					}
					this.$router.push({name:'Pay' , query:{sids : sids.join('-')}});
					
				
				
			},
			//查看商品详情
			
			goPage(pid){
				
				this.$router.push({name:"Detail" , params:{pid}})
			},
			
			
			
			//懒加载
			loadData(){
				setTimeout(() => {
					this.isloading = false;
					//如果大于等于this.count，就没有数据可加载了
					if(this.shopcartData.length >= this.allshopcartData.length){
						
						this.$store.commit("shopcartModule/changeData" , {key: "isfinished" , value: true})
						
						return;
					}

					//触底懒加载，在添加12条数据
					this.$store.commit("shopcartModule/loadShopcartData")
					
					
				},2000)
			},
			
			//获取所有购物车数据
			getAllShopcartProduct(){
				//获取token字符串
				let tokenString = utils.getToken(this);
				
				this.axios({
					method:'GET',
					url:"/findAllShopcart",
					params:{
						appkey:this.appkey,
						tokenString
					}
				}).then( result =>{
					
					if(result.data.code == 5000){
						//添加判断勾选的属性
						
						result.data.result.forEach( v => {
							v.isChecked = false ;
						})
						
						this.$store.commit("shopcartModule/changeData" , {key : 'allshopcartData' , value: result.data.result });
						
						
						
					}
					
					//关闭提示
					this.$toast.clear();
					
				}).catch( err => {
					
					this.$toast.clear();
				})
				
			},
			
			//修改购物车商品数量
			modifyShopcartCount(sid , count){
				
				//加载提示
				this.$toast.loading({
				  message: '加载中...',
				  duration: 0,
				  forbidClick: true
				});
				
				//获取token字符串
				let tokenString = utils.getToken(this);
				
				this.axios({
					method:'POST',
					url:"/modifyShopcartCount",
					data:{
						appkey:this.appkey,
						tokenString,
						sid,
						count
					},
					transformRequest:utils.transformData
				
				}).then( result =>{
					this.$toast.clear();
				}).catch( err => {
					this.$toast.clear();
				})
				
			},
			
			
			//增加商品数量
			modify(item){
				
				
				++item.count
				
				this.modifyShopcartCount(item.sid , item.count)
				this.sum()
			},
			
			//减少商品数量
			decrease(item){
				
				if(item.count == 1){
					return
				}
				
				--item.count;
				
				this.modifyShopcartCount(item.sid , item.count)
				this.sum()
			},
			
			
			//管理商品
			manage(){
				this.$store.commit("shopcartModule/changeData" , {key: "isManage" , value: !this.isManage})
			},
			
			//全选
			AllSelect(){
				
				
				this.allshopcartData.forEach( v => {
					v.isChecked = !this.isAllSelect
				})
				
				
				
			},
			
			//单选
			Select(item){
				
				this.sum();
				
				if(!item.isChecked){
					
					this.isAllSelect = false;
					
					return
				}
				
				for(let i = 0 ; i < this.shopcartData.length ; i++){
					if(!this.shopcartData[i].isChecked){
						this.isAllSelect = false;
						
						return
					}
				}
				
				this.isAllSelect = true;
			},
			
			//单个删除
			removeOneShopcart(sid){
				
				let sids = JSON.stringify([sid])
				
				this.removeShopcart(sids).then( result => {
					
					this.$store.commit("shopcartModule/removeShopcartData" , [sid])
					this.$toast.clear();
				}).catch(err => {
					this.$toast.clear();
				})
				
			},
			
			// 删除多个商品
			removeMoreShopcart(){
				
				//获取勾选商品
				let sids = [];
				this.allshopcartData.forEach( v => {
					
					if(v.isChecked){
						sids.push(v.sid);
					}
				})
				
				//如果没有删除商品，就不会请求Ajax
				if(sids.length == 0){
					this.$toast({
						
						message:"没有选择商品"
					})
					
					return
				}
				
				
				this.removeShopcart(JSON.stringify(sids)).then( result => {
					this.$toast.clear();
					this.$store.commit("shopcartModule/removeShopcartData" ,  sids)
					
				}).catch(err => {
					this.$toast.clear();
				})
				
				
			},
			
			//删除购物车商品
			removeShopcart(sids){
				
				//加载提示
				this.$toast.loading({
				  message: '处理中...',
				  duration: 0,
				  forbidClick: true
				});
				
				let tokenString = utils.getToken(this);
				
				
				return this.axios({
					method:'POST',
					url:'/removeShopcart',
					data:{
						appkey:this.appkey,
						sids,
						tokenString
					},
					
					transformRequest:utils.transformData,
				})
				
			},
			
			//计算订单
			sum(){
				
				let tolal = 0;
				
				this.allshopcartData.forEach( v => {
					
					if(v.isChecked){
						
						tolal += v.price * v.count * 100 ;
					}
				})
				
				this.$store.commit("shopcartModule/changeData" , {key:'total' , value: tolal})
				
			},
			//返回上一级
			back(){
				this.$router.go(-1);
				
				this.$store.commit("changeData" , {key: "mianIsLoaded" , value:'order' })
			},
		}
		
	}
</script>

<style lang="less" scoped>
	.v-subimt{
		.van-checkbox{
			margin-right: auto;
		}
		
	}
	.van-button{
		background: #a73535;
	}
	.van-list__loading{
		background: #a73535;
	}
	.van-submit-bar{
		bottom: 50px;
		background: #f9f0f0;
	}
	.van-submit-bar__price{
		color:#a73535 ;
	}
	.v-btn{
		height: 100%;
		background:#c1aea8;
		border: none;
	}
	.shopcart{
		min-height: calc(100vh - 50px - 150px) ;
		padding-bottom: 100px;
		// overflow: auto;
		margin-top: 50px;
		background: #e9dfd6;
		
		.shopcart-head-nav{
			color: #fff;
			background-image:linear-gradient(#3c120b, #882225 );
			position: fixed;
			top: 0px;
			left: 0px;
			width: 100%;
			z-index: 999;
			>div{
				float: left;
				height: 50px;
				line-height: 51px;
				padding: 0px 10px;
				box-sizing: border-box;
				font-size: 18px;
			}
		}
		
		.head-nav-left{
			padding: 0px 15px;
			width: 25%;
			position: relative;
		
			>i{
				position: absolute;
				top: 50%;
				left: 5px;
				margin-top: -10px;
				width: 20px;
				
			}
				
			>span{
				margin-left: 15px;
			}
		}
		
		
		.head-nav-mid{
			width: 50%;
			text-align: center;
			
		}
		
		.head-nav-rigth{
			width: 25%;
			text-align: center;
		}
	
		.shopcart-list{
			height: 80px;
			padding: 10px;
			// box-sizing: border-box;
			background: #f9f0f0;
			font-size: 16px;
			border-bottom: 1px solid #c1aea8;
			.shopcart-check{
				width: 10%;
			}
			
			.shopcart-list-concer{
				width: 90%;
				
				.shopcart-list-image{
					width:80px;
				}
				
				.shopcart-list-text{
					margin-left: 10px;
					
					width:calc(100% - 80px - 10px);
				}
				
			}
		}
		
		.shopcart-text{
			margin-bottom: 10px;
			>div{
				// margin-bottom: 10px;
				>span{
					width: 100px;
					margin-left: 10px;
					color: #666;
					font-size: 14px;
					white-space:nowrap;
					overflow:hidden;
					text-overflow:ellipsis;
					
					 
				}
			}
			>span{
				font-size: 14px;
				color: #666;
				
			}
		}
	
		.shopcart-price{
			>.price{
				color: #641510;
				line-height: 28px;
			}
			.shopcart-change-price{
				margin-left: 20px;
				>span{
					float: left;
					height: 26px;
					width: 26px;
					// background: #ae9d95;
					margin-left:10px ;
					border-radius: 50%;
					text-align: center;
					line-height: 26px;
				}
			}
		}
	
		.shopcart-check{
			height: 80px;
			>div{
				margin-top: calc(50% + 10px);
			}
		}
	}

	.van-list__loading{
		margin-top: 50px;
	}

</style>
