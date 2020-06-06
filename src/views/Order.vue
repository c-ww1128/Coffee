<template>
	<div class="order">
		<div class="order-head-nav clearfix">
			<div class="head-nav-left" >
				<i>
					<!-- <img src="../assets/Arrow-1.png"  class="auto-img" alt=""> -->
				</i>
				<span></span>
			</div>
			<div class="head-nav-mid">订单</div>
			<div class="head-nav-rigth" >
				<!-- <div class="shopcart-img" @click="goShopcart">
					<img src="../assets/购物车.png" class="auto-img"  alt="">
				</div> -->
			</div>
		
		</div>
		<div class="order-body">
			
			<van-list  v-model="isloading" :finished="isfinished" finished-text="没有更多了"  @load="loadData" >
			<!-- 订单详情内容区 -->
			<div class="order-conten" v-for="(item , index) in orderData" :key="index">
				<div class="order-conten-list">
					<div class="clearfix">
						<div class="fl">{{item.oid}}</div>
						<template v-if="item.status == 1">
							<div class="fr" @click="receive(item.oid ,index)">确认收货</div>
						</template>
						<template v-else>
							
							<div class="del fr" @click="removeOrder(item.oid , index)">
								<img src="../assets/del.png" class="auto-img" alt="">
							</div>
							<div class="fr">已完成</div>
							
						</template>
					</div>
					<div class="order-list-box clearfix">
						
						<!-- 订单列表 -->
						<div class="order-list" v-for="(value , i) in item.data" :key='i'>
							<div class="order-list-image fl" @click="goDetail(value.pid)">
								<img :src="value.smallImg" class="auto-img" alt="">
							</div>
							<div class="order-list-text fl">
								<div class="clearfix">
									<p class="fl">{{value.name}}</p>
									<span class="fr">￥{{value.price}}</span>
								</div>
								<div class="clearfix">
									<p class="fl">{{value.rule}}</p>
									<span class="fr">x{{value.count}}</span>
								</div>
							</div>
						</div>
						<!-- 订单列表  end-->

					</div>
					<div class="clearfix">
						<div class="fl">{{item.orderTime}}</div>
						<div class="fr">
							共{{item.count}}件商品 合计: <b>￥{{item.total}}</b>
						</div>
					</div>
				</div>
			</div>
			<!-- 订单详情内容区 end -->
			</van-list>
			
		</div>
	</div>
</template>

<script>
	import{utils} from '../utils/utils.js'
	
	import{mapState} from 'vuex'
	
	export default {
		name:"Order",
		
		data(){
			
			return {
				
				isloading: false,
			}
		},
		
		created(){
			
			
			//加载提示
			this.$toast.loading({
			  message: '加载中...',
			  duration: 0,
			  forbidClick: true
			});
			
			this.getOrder()
			
			this.$store.commit('orderModule/emptyData')
		
			
		},
		// 计算属性
		computed:{
			...mapState('orderModule' , ['orderData' , 'loadorderData','isfinished'])
		},
		methods:{
			
			//跳转详情页
			goDetail(pid){
				this.$router.push({name:"Detail" , params:{pid}} )
			},
			
			
			//懒加载
			loadData(){
				setTimeout(() => {
					
					this.isloading = false;
					//如果大于等于this.count，就没有数据可加载了
					if(this.orderData.length >= this.loadorderData.length){
						
						this.$store.commit("orderModule/changeData" , {key: "isfinished" , value: true})
						
						return;
					}
			
					//触底懒加载，在添加6条数据
					this.$store.commit("orderModule/loadData")
					
					
				},2000)
			},
			
			getOrder(){
				
				let tokenString = utils.getToken(this);
				
				this.axios({
					method:'GET',
					url:'/findOrder',
					params:{
						appkey:this.appkey,
						tokenString,
						status:0
					}
				}).then( result => {
					
					//获取所有的订单编号
					let orderData = [];
					
					
					//查询订单oid
					let orderNos = [];
					result.data.result.forEach( v => {
						
						if(orderNos.indexOf(v.oid) === -1){
							
							orderNos.push(v.oid)
						}
						
					})
					
					
					orderNos.forEach( v => {
						
						//当前订单数据
						let currentOrderData = {
							oid: v,
							//当前订单所有数据
							data:[],
							count:0,
							total:0,

						};
						
						
						result.data.result.forEach( item => {
							
							if(item.oid == v){
								
								currentOrderData.data.push(item);
								
								currentOrderData.count += item.count;
								
								currentOrderData.total += item.count * item.price;
							}
						
						})
						
						currentOrderData.orderTime = utils.formatDate(new Date(currentOrderData.data[0].createdAt) , 'yyyy-MM-dd hh:mm:ss')
						currentOrderData.status = currentOrderData.data[0].status
						
						orderData.push(currentOrderData);
						
					})
					
					
					orderData.sort((a , b) => {
						return new Date(b.orderTime) - new Date(a.orderTime)
					})
					this.$store.commit("changeData" , {key: "mianIsLoaded" , value:'order' })
					this.$store.commit('orderModule/changeData' , {key:'loadorderData' , value: orderData})
					//关闭提示
					this.$toast.clear();
					
					
				}).catch( err => {
					//关闭提示
					this.$toast.clear();
				})
				
			},
			
			//确认收货
			receive(oid , index){
				
				//加载提示
				this.$toast.loading({
				  message: '加载中...',
				  duration: 0,
				  forbidClick: true
				});
				
				
				let tokenString = utils.getToken(this);
				this.axios({
					method:'POST',
					url:'/receive',
					data:{
						appkey:this.appkey,
						tokenString,
						oid,
					},
					transformRequest:utils.transformData
				}).then( result => {
					//关闭提示
					this.$toast.clear();
					this.orderData[index].status = 2
					
				}).catch( err => {
					//关闭提示
					this.$toast.clear();
				})
			},
			
			
			//删除订单
			removeOrder(oid ,index){
				//加载提示
				this.$toast.loading({
				  message: '加载中...',
				  duration: 0,
				  forbidClick: true
				});
				let tokenString = utils.getToken(this);
				this.axios({
					method:'POST',
					url:'/removeOrder',
					data:{
						appkey:this.appkey,
						tokenString,
						oid,
					},
					transformRequest:utils.transformData
				}).then(result => {
					this.$store.commit('orderModule/removeOrderData' , index)
					//关闭提示
					this.$toast.clear();
				}).catch( err => {
					//关闭提示
					this.$toast.clear();
				})
				
			},
			
			//返回上一级
			goShopcart(){
				
				this.$router.push({name: "Shopcart"})
				this.$store.commit("changeData" , {key: "mianIsLoaded" , value:'shopcart' })
			},

		}
	}
</script>

<style lang="less" scoped>
	
	.del{
		width: 28px;
		margin-left: 10px ;
		margin-top:-4px ;
	}
	
	.order-conten{
		background: #f9f0f0;
		padding: 10px;
		box-sizing: border-box;
		border-radius: 10px;
		margin-bottom: 20px;
	}
	.order-conten-list{
		
		>div:nth-child(1){
			height: 30px;
			
			
			>div{
				height: 100%;
				// line-height: 30px;
				font-size:14px ;
				
			}
		}
		
		.order-list{
			height: 80px;
			padding: 5px;
			box-sizing: border-box;
			.order-list-image{
				width: 70px;
			}
			
			.order-list-text{
				width: calc(100% - 80px - 20px);
				margin-left: 20px;
				>div:nth-child(1){
					margin-bottom: 25px;
					font-size: 16px;
					
					>span{
						font-size: 14px;
						color: #a73535;
					}
				}
				
				>div:nth-child(2){
					color:#c1aea8 ;
					font-size: 14px;
					
					
				}
			}
		}
		
		>div:nth-child(3){
			height: 30px;
			border-bottom: 1px solid #c1aea8;
			
			>div{
				height: 100%;
				line-height: 30px;
				font-size:14px ;
				
				>b{
					font-size: 16px;
				}
				
			}
		}
		
	}
	
	.order-body{
		
		height: calc(100vh - 50px - 50px);
		background:#e9dfd6 ;
		margin-top: 50px;
		padding: 10px 10px 0px 10px;
		box-sizing: border-box;
		overflow: auto;
	}
	
	.order-head-nav{
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
		position: relative;
		
		.shopcart-img{
			width: 26px;
			position: absolute;
			top: 50%;
			right: 10px;
			margin-top: -13px;
		}
	}
</style>