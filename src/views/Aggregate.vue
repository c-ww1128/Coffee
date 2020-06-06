<template>
	<div class="aggregate">
		<div class="aggregate-head-nav clearfix">
			<div class="head-nav-left" @click="back">
				<i>
					<img src="../assets/Arrow-1.png"  class="auto-img" alt="">
				</i>
				<span>返回</span>
			</div>
			<div class="head-nav-mid">订单详情</div>
			
		
		</div>
		
		<van-tabs v-model="activeName" color='#a73535' background='#f9f0f0'  @change="toggleTab">
		  <!-- <van-tab :title="item.title" :name="item.name" v-for="(item , index) in aggregateData" :key="index"></van-tab> -->
		    <van-tab title="待付款" name="-2">功能只开通待收货 ，待评价</van-tab>
		    <van-tab title="待发货" name="-1">功能只开通待收货 ，待评价</van-tab>
		    <van-tab title="待收货" name="1">
				<div class="order-body">
					<!-- 订单详情内容区 -->
					<div class="order-conten" v-for="(item , index) in orderData" :key="index">
						<div class="order-conten-list">
							<div class="clearfix">
								<div class="fl">{{item.oid}}</div>
								<template v-if="item.status == 1">
									<div class="fr" @click="receive(item.oid ,index)">确认收货</div>
								</template>
								<template v-else>
									<div class="del fr">
										<img src="../assets/del.png" class="auto-img" alt="">
									</div>
									<div class="fr">已完成</div>
									
								</template>
							</div>
							<div class="order-list-box clearfix">
								
								<!-- 订单列表 -->
								<div class="order-list" v-for="(value , i) in item.data" :key='i'>
									<div class="order-list-image fl">
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
				</div>
			</van-tab>
			<van-tab title="待评价" name="2">
				<div class="order-body">
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
									<div class="order-list-image fl">
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
				
					
				</div>
			</van-tab>
		
		</van-tabs>
		
		
		
	</div>
</template>

<script>
	import{utils} from '../utils/utils.js'
	import {mapState} from 'vuex'
	export default{
		name:"Aggregate",
		data(){
			return {
				activeName: '-2'
			}
		},
		
		created(){
			
			let query = this.$route.query
			
			this.activeName = query.name
			
			//加载提示
			this.$toast.loading({
			  message: '加载中...',
			  duration: 0,
			  forbidClick: true
			});
			
			this.$store.commit('aggregateModule/emptyData')
			
			
			this.getOrder(1)
			
		},
		computed:{
			...mapState('aggregateModule', ['aggregateData' ,'orderData'])
		},
		
		methods:{
			
			//订单数据
			getOrder(status){
				
				
				let tokenString = utils.getToken(this);
				
				this.axios({
					method:'GET',
					url:'/findOrder',
					params:{
						appkey:this.appkey,
						tokenString,
						status
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
					
				
					this.$store.commit('aggregateModule/changeData' , {key:'orderData' , value: orderData})
					
					
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
			
			toggleTab(status){
				this.getOrder(status)
			},
			
			//删除订单
			removeOrder(oid , index){
				
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
					this.$store.commit('aggregateModule/removeOrderData' , index)
				}).catch( err => {
				})
			},
			//返回上一级
			back(){
				this.$router.go(-1);
			}
		}
	}
</script>

<style lang="less" scoped>
	/deep/ .van-tab__pane{
		font-size: 16px;
	}
	/deep/ .van-tabs .van-tabs--line{
		top: 50px;
		left: 0;
	}
	
	.aggregate-head-nav{
		color: #fff;
		background-image:linear-gradient(#3c120b, #882225 );
		// position: fixed;
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
	
	/deep/ .van-tabs__content{
		
		height: calc(100vh - 45px - 20px - 50px) ;
		overflow: auto;
		background: #e9dfd6;
		padding: 10px;
		
	}
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
		
		// height: calc(100vh - 45px);
		// background:#e9dfd6 ;
		// margin-top: 50px;
		// padding: 10px 10px 0px 10px;
		// box-sizing: border-box;
		// overflow: auto;
	}
</style>
