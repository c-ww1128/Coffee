<template>
	<div class="my">
		<!-- 导航条 -->
		<div class="my-nav">
			<div class="my-head-nav clearfix">
				<div class="head-nav-left" >
					<i>
						<!-- <img src="../assets/Arrow-1.png"  class="auto-img" alt=""> -->
					</i>
					<!-- <span>返回</span> -->
				</div>
				<div class="head-nav-mid">我的</div>
				<div class="head-nav-rigth">
					<!-- <div class="shopcart-img" @click="goShopcart">
						<img src="../assets/购物车.png" class="auto-img"  alt="">
					</div> -->
				</div>
			</div>
		</div>
		
		<div class="my-body">
			
			<div class="my-top">
				<div class="clearfix" @click="gofrom">
					<div class="my-top-headportrait fl">
						<img :src="userData.userImg" class="auto-img" alt="">
					</div>
					<div class="fl login-register">
						<!-- 点击登录/注册 -->
						{{isLogin ? userData.nickName :'点击登录/注册' }}
					</div>
					<div class="fr my-rigth-arrow">
						<div class="my-arrow">
							<img src="../assets/youjiantou.png" class="auto-img" alt="">
						</div>
					</div>
				</div>
				
			</div>
			
			<!-- <div class="my-order clearfix"  @click='goOrder' >
				<div class="fl my-order-img">
					<img src="../assets/dingdan.png" class="auto-img order-img" alt="">
				</div>
				<div class="fl my-order-text" >全部订单</div>
				<div class="fr my-order-arrow">
					<img src="../assets/youjiantou.png" class="auto-img arrow-img" alt="">
				</div>
			</div> -->
			
			<div class="my-order-nav">
				<div class="" @click="goAggregateA">
					<div class="my-order-nav-img">
						<img src="../assets/daifukuan.png" class="auto-img" alt="">
					</div>
					<div class="my-order-nav-text">
						待付款
					</div>
				</div>
				<div class="" @click="goAggregateB">
					<div class="my-order-nav-img">
						<img src="../assets/daifahuo.png" class="auto-img" alt="">
					</div>
					<div class="my-order-nav-text">
						待发货
					</div>
				</div>
				<div class="" @click="goAggregateC">
					<div class="my-order-nav-img">
						<img src="../assets/daishouhuo.png" class="auto-img" alt="">
					</div>
					<div class="my-order-nav-text">
						待收货
					</div>
				</div>
				<div class="" @click="goAggregateD">
					<div class="my-order-nav-img">
						<img src="../assets/pingjia.png" class="auto-img" alt="">
					</div>
					<div class="my-order-nav-text">
						待评价
					</div>
				</div>
			</div>
		
			<div class="my-address" @click="goAddress" >
				<div class="my-address-img fl">
					<img src="../assets/xing.png" class="auto-img" alt="">
				</div>
				<div class="my-address-text fl">
					我的收获地址
				</div>
				<div class="my-address-arrow fr">
					<img src="../assets/youjiantou.png" class="auto-img" alt="">
				</div>
			</div>
						
			<div class="my-address" @click="goLike">
				<div class="my-address-img fl">
					<img src="../assets/shouchang.png" class="auto-img" alt="">
				</div>
				<div class="my-address-text fl">
					我的收藏
				</div>
				<div class="my-address-arrow fr">
					<img src="../assets/youjiantou.png" class="auto-img" alt="">
				</div>
			</div>
			
			
			<div class="my-address" @click="goAccount">
				<div class="my-address-img fl">
					<img src="../assets/zhanghaoguanli.png" class="auto-img" alt="">
				</div>
				<div class="my-address-text fl">
					账号管理
				</div>
				<div class="my-address-arrow fr">
					<img src="../assets/youjiantou.png" class="auto-img" alt="">
				</div>
			</div>
			
			<div class="my-address" @click="goInstall">
				<div class="my-address-img fl">
					<img src="../assets/shezhi.png" class="auto-img" alt="">
				</div>
				<div class="my-address-text text-letter fl">
					设置
				</div>
				<div class="my-address-arrow fr">
					<img src="../assets/youjiantou.png" class="auto-img" alt="">
				</div>
			</div>
			
			<div class="my-address" @click="goSign">
				<div class="my-address-img fl">
					<img src="../assets/tuichu.png" class="auto-img" alt="">
				</div>
				<div class="my-address-text text-letter fl">
					退出
				</div>
				<div class="my-address-arrow fr">
					<img src="../assets/youjiantou.png" class="auto-img" alt="">
				</div>
			</div>
			
			
		</div>
	</div>
</template>

<script>
	import {utils} from '../utils/utils.js'
	//辅助函数
	import {mapState} from 'vuex'
	export default {
		name:"My",
		
		computed:{
			
			isLogin(){
				return this.$store.state.isLogin
			},
			
			...mapState('myModule' , ["userData" , "isstate"])
		},
		
		created(){
			
			
			
			this.$store.commit("myModule/emptyData")
			
			this.getUserInfo();
			
			
		},
		
		methods:{
			
			//没登录的跳转页面
			gofrom(){
				
				if(!this.isLogin){
					//跳转登录界面
					this.$router.push({name:'Login'}) 
				}else{
					this.$router.push({name:'Account'})
				}
				
			},
			
		
			//获取用户信息
			getUserInfo(){
				//加载提示
				this.$toast.loading({
				  message: '处理中...',
				  duration: 0,
				  forbidClick: true
				});
				
				//获取token字符串
				let tokenString = utils.getToken(this);
				
				this.axios({
					method:'GET',
					url:"/findMy",
					params:{
						appkey:this.appkey,
						tokenString
					}
				}).then( result => {
					this.$toast.clear();
					this.$store.commit("changeData" , {key: "isLogin" , value: result.data.code != 700})
					if(result.data.code == 700){
						return
					}
					
					this.$store.commit("myModule/changeData" , {key: "userData" , value: result.data.result[0]})
					
					
				}).catch( err => {
					this.$toast.clear();
				})
			},
			//待付款
			goAggregateA(){
				this.$router.push({name: "Aggregate" , query: {name: -2}})
				
				
			},
			//待发货
			goAggregateB(){
				this.$router.push({name: "Aggregate" , query: {name: -1}})
				
				
			},
			//待收货
			goAggregateC(){
				this.$router.push({name: "Aggregate" , query: {name: 1}})
				
				
			},
			//待评价
			goAggregateD(){
				this.$router.push({name: "Aggregate" , query: {name: 2}})
				
			},
			
			//查看所有订单
			goOrder(){
				this.$router.push({name: "Order"})
			},
			//跳转购物车
			goShopcart(){
				this.$router.push({name: "Shopcart"})
			},
			//收货地址
			goAddress(){
				this.$router.push({name: "Address"})
			},
			
			//我的收藏
			goLike(){
				this.$router.push({name: "Like"})
			},
			
			//账号管理
			goAccount(){
				this.$router.push({name: "Account"})
			},
			
			//设置
			goInstall(){
				this.$router.push({name: "Install"})
			},
			
			//设置
			goSign(){
				this.$router.push({name: "Sign"})
			}
			
		}
	}
</script>

<style lang="less" scoped>
	
	
	.my-head-nav{
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

	.my-body{
		height: calc(100vh - 100px);
		background: #e9dfd6;
		margin-top: 50px;
		
		.my-top{
			height: 110px;
			border-bottom: 4px solid #c2afa9;
			box-sizing: border-box;
			padding:  23px 20px 0px 35px;
			position: relative;
			
			.my-top-headportrait{
				width: 70px;
				height: 70px;
				border: 2px solid #a22b27;
				border-radius: 50%;
				overflow: hidden;
			}
			
			.login-register{
				height: 74px;
				font-size: 15px;
				line-height: 60px;
				margin-left: 30px;
				color: #5b564f;
			}
			
			.my-rigth-arrow{
				height: 100%;
				
				.my-arrow{
					width: 20px;
					position: absolute;
					top: 50%;
					right: 20px;
					margin-top: -10px;
				}
			}
			
			
		}
		
		
		.my-order{
			position: relative;
			height: 60px;
			border-bottom: 2px  solid #b5a79e;
			box-sizing: border-box;
			padding:  0px 20px;
			.my-order-img{
				height: 100%;
				width: 40px;
				position: relative;
				.order-img{
					position: absolute;
					top: 50%;
					left: 0px;
					// transform: translate(-50%, -50%);
					margin-top:-20px ;
				}
			}
			
			.my-order-text{
				height: 100%;
				margin-left: 40px;
				line-height:60px ;
				font-size: 16px;
				color: #5b564f;
			}
			
			.my-order-arrow{
				width: 20px;
				position: absolute;
				top: 50%;
				right: 20px;
				margin-top: -10px;
			}
		}
	
		.my-order-nav{
			height: 80px;
			padding: 15px 8px 0px;
			border-bottom: 2px  solid #b5a79e;
			box-sizing: border-box;
			display: flex;
			>div{
				margin: 0 auto;
				
				.my-order-nav-img{
					width: 30px;
					margin: 0 auto;
				}
				.my-order-nav-text{
					font-size: 12px;
					color:#87827c ;
					margin-top: 4px;
				}
			}
		}
		
		.my-address{
			height: 50px;
			border-bottom: 2px  solid #b5a79e;
			box-sizing: border-box;
			padding: 12px 20px;
			
			.my-address-img{
				width: 25px;
				
			}
			.my-address-text{
				font-size: 16px;
				line-height:24px ;
				margin-left: 30px;
				color:#87827c ;
			}
			.text-letter{
				
				letter-spacing:10px;
			}
			.my-address-arrow{
				width: 20px;
				margin-top: 2px;
			}
			
		}
	}
</style>