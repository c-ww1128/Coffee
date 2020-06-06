<template>
	<div class="pay">
		<div class="pay-head-nav clearfix">
			<div class="head-nav-left" @click="back">
				<i>
					<img src="../assets/Arrow-1.png"  class="auto-img" alt="">
				</i>
				<span>返回</span>
			</div>
			<div class="head-nav-mid">提交订单</div>
		</div>
		<div class="pay-body">
			<!-- 请选择收货地址 -->
			<div class="pay-address" @click="isShowAddress">
				<div class="receiving-address" >
					{{address}}
				</div>
			</div>
			<div class="pay-order">
				<div class="pay-order-list">
					
					<div class="order-list clearfix" v-for="(item ,index) in orderData" :key="index">
						<div class="list-item fl">
							<div class="list-item-image" @click="goDetail(item.pid)">
								<img :src="item.small_img" class="auto-img" alt="">
							</div>
							
						</div>
						<div class="fl list-item-text">
							<div class="clearfix">
								<p class="fl">{{item.name}}</p>
								<span class="fr">￥{{item.price}}</span>
							</div>
							<div class="clearfix">
								{{item.enname}}
							</div>
							<div class="clearfix">
								<p  class="fl">{{item.rule}}</p>
								<span class="fr">x{{item.count}}</span>
							</div>
						</div>
						
					</div>

				</div>
				
				<div class="pay-agg-commodity">
					<div class="fr">共<span>{{orderDesc.count}}</span>件商品合计: <b>￥{{orderDesc.total}}</b></div>
				</div>
				
			</div>
		</div>
		
		<van-action-sheet v-model="isShow" title="请选择收获地址">
		  <div class="select-address">
			  <van-address-list
			  	
			    v-model="chosenAddressId"
			    :list="list"
			    default-tag-text="默认"
			    :switchable="true"
			  	@select = 'selectAddress'
				@add="goNewAddress"
			  >
			  </van-address-list>
			  
		  </div>
		</van-action-sheet>
	
		<div class="pay-payment">
			<div class="fl">
				应付合计：<span>￥{{orderDesc.total}}</span>
			</div>
			<div class="fr" @click="pay">
				立即结算
			</div>
		</div>
	</div>
</template>

<script>
	import {utils} from '../utils/utils.js'
	import {mapState} from 'vuex'
	export default {
		name: 'Pay',
		
		data(){
			
			return{
				
				isShow: false,
				
				 chosenAddressId:'0' ,
				 
				 
			}
		},
		
		created(){
			
			this.$store.commit('payModule/emptyData')
			
			//截取查询参数
			let sids = this.$route.query.sids.split('-');
			
			
			this.$store.commit('payModule/changeData' , {key: 'sids' , value: sids} )
			
			//根据sid查询需要购买
			this.commitShopcart(sids);
			
			this.getAddress();
		},
		computed:{
			
			...mapState('payModule' , ['orderData' , 'orderDesc' , 'isSelect','list' ,'address' , 'sids'])
		},
		
		methods:{
			
			//根据sid查询需要购买
			commitShopcart(sids){
				//加载提示
				this.$toast.loading({
				  message: '加载中...',
				  duration: 0,
				  forbidClick: true
				});
				
				let tokenString = utils.getToken(this);
				
				this.axios({
					method:'GET',
					url:'/commitShopcart',
					params:{
						appkey:this.appkey,
						tokenString,
						sids:JSON.stringify(sids)
					}
				}).then( result => {
					
					
					//重置为0
					this.orderDesc.count = 0;
					this.orderDesc.total = 0;
					
					result.data.result.forEach( v => {
						this.orderDesc.count += v.count;
						
						this.orderDesc.total += v.count * v.price ;
					})
					
					this.$store.commit('payModule/changeData' , {key: 'orderData' , value: result.data.result} )
					
					//关闭提示
					this.$toast.clear();
					
				}).catch( err => {

					//关闭提示
					this.$toast.clear();
				})
				
			},
			
			//获取收货地址
			getAddress(){
				
				let tokenString = utils.getToken(this);
				
				this.axios({
					method:'GET',
					url:'/findAddress',
					params:{
						appkey:this.appkey,
						tokenString
					}
				}).then( result => {
					// this.chosenAddressId = result.data.result[0].id + ''
					let list = []
					result.data.result.forEach( (v , i)=> {
						let o = {
							id : i + '',
							name: v.name,
							tel: v.tel,
							address: v.province + v.city + v.county + v.addressDetail,
							isDefault: Boolean(v.isDefault) 
						}
						
						list.push(o)
						
						if(v.isDefault == 1){
							
							this.$store.commit('payModule/changeData' , {key: 'isSelect' , value:true} )
							
							this.$store.commit('payModule/changeData' , {key: 'address' , value:o.address} )
							
							this.chosenAddressId = i + ''
						}
						
					})
					
					
					this.$store.commit('payModule/changeData' , {key: 'list' , value:list} )
					
					
					
					
				}).catch( err => {
				})
			},
			
			//选择地址
			selectAddress(item , index){
				
				if(!this.isSelect){
					
					this.$store.commit('payModule/changeData' , {key: 'isSelect' , value:true} )
					
					
				}
				
				this.$store.commit('payModule/changeData' , {key: 'address' , value:item.address} )
				
				this.isShow = false ;
				
			},
			
			//收货地址
			isShowAddress(){
				this.isShow = true ;
			},
			
			//新增地址
			goNewAddress(){
				this.$router.push({name:'NewAddress', query:{isAdd : 1}})
			},
			
			//返回上一级
			back(){
				this.$router.go(-1);
			},
			
			//结算
			pay(){
				
				if(!this.isSelect){
					
					this.$toast('请选择收货地址')
					
					return
				}
				
				//加载提示
				this.$toast.loading({
				  message: '加载中...',
				  duration: 0,
				  forbidClick: true
				});
				
				let tokenString = utils.getToken(this);
				
				let sids = this.sids.concat();
				
				this.axios({
					method: 'POST',
					url:'/pay',
					data:{
						appkey:this.appkey,
						tokenString,
						sids:JSON.stringify(sids),
						phone:this.list[this.chosenAddressId].tel,
						address:this.list[this.chosenAddressId].address,
						receiver:this.list[this.chosenAddressId].name
					},
					
					transformRequest:utils.transformData
				}).then(result => {
					
					if(result.data.code == 60000){
						this.$router.push({name:'Order'})
						this.$store.commit("changeData" , {key: "mianIsLoaded" , value:'order' })
					}
					
					//关闭提示
					this.$toast.clear();
				}).catch( err => {
					
					//关闭提示
					this.$toast.clear();
				})
			
				
				
			},
		
			//跳转详情页
			goDetail(pid){
				this.$router.push({name:"Detail" , params:{pid}} )
			},
		}
		
	}
</script>

<style lang='less' scoped>
	
	
	.van-popup{
		background: #e9dfd6;
		.van-address-item{
			background: #f9f0f0;
			.van-cell{
				background: #f9f0f0;
			}
		}

	}
	.van-address-list__bottom{
		background: #f9f0f0;
		
		.van-button--danger{
			background: #a73535;
			border: 1px solid #a73535;
		}
	}
	/deep/ .van-address-item .van-radio__icon--checked .van-icon{
		background: #a73535;
		border: 1px solid #a73535;
	}
	
	/deep/ .van-address-item__edit{
		display: none;
	}
	
	/deep/ .van-action-sheet__header{
		
		position: sticky;
		top: 0;
		left: 0;
		background: #e9dfd6;
	}
	
	.select-address{
		padding: 10px;
	}
	
	.pay-body{
		height: calc(100vh - 50px - 20px);
		background: #e9dfd6;
		margin-top: 50px;
		padding: 10px;
		overflow: auto;
		
		.pay-address{
			padding: 5px;
			margin-top: 10px;
			/* height: 40px; */
			background-color: #f9f0f0;
			line-height: 24px;
			font-size: 14px;
			color: #3c110b;
			padding-left: 10px;
			border-radius: 10px;
			margin-bottom: 40px;
		}
		.pay-order{
			background: #f9f0f0;
			
			border-radius: 10px;
			padding: 10px;
			margin-bottom: 100px;
			.order-list{
				
				height: 80px;
				padding: 10px;
				box-sizing: border-box;
				
				
				.list-item{
					width: 60px;
				}
				
				.list-item-text{
					margin-left: 20px;
					width: calc(100% - 20px - 60px ) ;
					>div:nth-child(1){
						margin-bottom: 2px;
						
						>p{
							font-size: 16px;
						}
						>span{
							font-size: 14px;
							color: #641510;
						}
					}
					>div:nth-child(2){
						color: #c1aea8;
						font-size: 14px;
					}
					>div:nth-child(3){
						color: #c1aea8;
						font-size: 14px;
					}
				}
				
				
			}
			
			
			.pay-agg-commodity{
				
				height: 40px;
				border-bottom: 1px solid #c1aea8;
				>div{
					font-size: 15px;
					line-height: 50px;
					>b{
						font-size: 16px;
					}
				}
			}
		}
		
		
			
	}
	
	.pay-payment{
		height: 45px;
		background:#f9f0f0;
		position: fixed;
		padding: 0px 0px 0px 10px;
		box-sizing: border-box;
		bottom: 0px;
		left: 0px;
		width: 100%;
		
		>div:nth-child(1){
			height: 45px;
			line-height: 45px;
			font-size: 14px;
			>span{
				font-size: 16px;
				color: #641510;
			}
		}
		
		>div:nth-child(2){
			
			width: 100px;
			height: 45px;
			background:#a73535 ;
			
			font-size: 16px;
			color: #fff;
			line-height: 45px;
			text-align: center;
		}
	}
	
	.pay-head-nav{
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
		
</style>
