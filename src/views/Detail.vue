<template>
	<div class="detail">
		<!-- 头部导航 -->
		<div class="detail-nav clearfix">
			<div class="detail-nav-left" @click="back">
				<i>
					<img src="../assets/Arrow-1.png"  class="auto-img" alt="">
				</i>
				<span>返回</span>
			</div>
			<div class="detail-nav-mid">商品详情</div>
			<div class="detail-nav-rigth">
				<div class="detail-shopping-cart" @click="goShopcart">
					<img src="../assets/购物车.png"  class="auto-img" alt="">
				</div>
				<span class="shopping-cart-count" v-show="shopCount > 0">{{shopCount == 0 ? "" : shopCount >= 100 ? "99+" : shopCount}}</span>
			</div>
		</div>
		<!-- 商品图片 -->
		<div class="detail-commodity-image">
			<img :src="productDetailData.large_img" alt="" class="auto-img" />
		</div>
		
		<!-- 详情页 -->
		<div class="commodity-detail">
			<div class="detail-product-name clearfix">
				<div class="product-name fl">{{productDetailData.name}}</div>
				<div class="product-coll fr" :class="{com : isLike}" @click="like">
					<!-- <img src="../assets/no-love.png" alt=""> -->
				</div>
			</div>
			<div class="commodity-type">
				<div class="temperature-choice clearfix" v-for = "(item , index) in rules" :key="index">
					<div class="choice-left fl">
						{{item.title}}
					</div>
					<div class="choice-right fl" >
						<span :class="{com : itemArr.isActve}" v-for = "(itemArr , i) in item.rule" :key="i" @click="togSpecifications(itemArr , index)">{{itemArr.text}}</span>
						
					</div>
				</div>
			</div>
			
			<div class="detail-commodity-describe">
				<div class="commodity-describe">
					商品描述
				</div>
				<p v-for="(item ,index) in describe" :key="index">{{item}}</p>
				
				
			</div>
			
			<div class="commodity-price-choice clearfix">
				<div class="commodity-price fl">
					￥{{productDetailData.price}}
				</div>
				<div class="price-count fr">
					<span @click="reduce">
						<img src="../assets/reduce.png" alt="">
					</span>
					<span>{{count}}</span>
					<span @click="increase">
						<img src="../assets/plus.png" alt="">
					</span>
				</div>
			</div>
		</div>
		<div class="commodity-nav">
			<div class="commodity-nav-right fr">
				<div class="shopping-cart fl" @click="addShopcart">加入购物车</div>
				<div class="purchase fl" @click="buy">立即购买</div>
			</div>
		</div>
	</div>
</template>

<script>
	//辅助函数
	import {mapState} from 'vuex'
	// 导入公共方法
	import {utils} from "../utils/utils.js"
	
	export default {
		name:'Detail',
		
		computed:{
			
			...mapState("detailModule" , ["productDetailData" , "rules" , "describe" , "count" , "isLike" , "shopCount"])
		},
		
		created(){
			//加载提示
			this.$toast.loading({
			  forbidClick: true,
			  duration: 0,
			  message: "加载中..."
			});
			
			//每次进来置空数据
			this.$store.commit("detailModule/emptyData")
			
			//截取路由参数
			
			let pid = this.$route.params.pid;

			this.axios({
				method:"GET",
				url:"/productDetail",
				params:{
					appkey: this.appkey,
					pid
				}
				
			}).then( result => {
				if(result.data.code == 600){
				
					this.$store.commit("detailModule/changeproductDetailData" , result.data.result[0] )
					//查询收藏数据
					this.findlike()
					
					//查询购物车数量
					this.shopcartRows()
				}
				
				this.$toast.clear();
				
			}).catch( err => {
				this.$toast.clear();
			})
		},
		
		
		methods:{
			
			//增加数量
			increase(){
				let count = this.count + 1;
				this.$store.commit("detailModule/changeData" , {key:"count" , value:count})
			},
			
			//减少数量
			reduce(){
				
				let count = this.count - 1;
				
				if(count < 1){
					
					return;
				}
				this.$store.commit("detailModule/changeData" , {key:"count" , value:count})
			},
			
			//切换商品规则
			togSpecifications(item , index){
				
				if(item.isActve){
					return
				}
				
				let cuurentRule = this.rules[index];
				
				
				for(let i = 0 ; i<cuurentRule.rule.length ; i++){
					if(cuurentRule.rule[i].isActve){
						cuurentRule.rule[i].isActve = false;
						break;
					}
				}
				
				item.isActve = true ;
				//对象可以直接更改，数组不行需要提交在进行更改
			},
			
			//查看当前商品是否被收藏
			findlike(){
				let tokenString = utils.getToken(this)
				
				this.axios({
					method:"GET",
					url:"/findlike",
					params:{
						appkey:this.appkey,
						pid:this.productDetailData.pid,
						tokenString
					}
					
					
				}).then( result => {
					
					
					if(result.data.code == 1000){
						this.$store.commit("detailModule/changeData" , {key: "isLike" , value:result.data.result.length > 0} )
						//加载提示
						
					}
				}).catch( err => {
					this.$toast.clear();
				})
			},
			
			//收藏商品
			like(){
				
				let tokenString = utils.getToken(this)
				let url = this.isLike ? "/notlike" : "/like"
				this.axios({
					method:"POST",
					url,
					data:{
						appkey:this.appkey,
						pid:this.productDetailData.pid,
						tokenString
					},
					
					transformRequest:utils.transformData
					
				}).then( result =>{
					this.$toast({
					  message: result.data.msg
					});
					this.$store.commit("detailModule/changeData" , {key: "isLike" , value:!this.isLike} )
					
				}).catch( err => {
					this.$toast.clear();
				})
			},
			
			//加入购物车
			addShopcart(type){
				
				//获取token字符串
				let tokenString = utils.getToken(this);
				
				//商品规格整理
				let ruleData = []
				this.rules.forEach( v => {
					
					for( let i = 0 ; i < v.rule.length ; i++ ){
						if(v.rule[i].isActve){
							ruleData.push(v.rule[i].text)
							
							break;
						}
					}
					
				})
				
				
				this.axios({
					method:"POST",
					url:"/addShopcart",
					data:{
						pid:this.productDetailData.pid,
						appkey:this.appkey,
						count:this.count,
						rule:ruleData.join("/"),
						tokenString
					},
					transformRequest:utils.transformData
				}).then( result => {
					
					
					this.$toast({
					  message: result.data.msg
					});
					if(result.data.code == 3000){
						
						if(result.data.status == 1){
							//不能同规则商品才加一
							this.$store.commit("detailModule/changeData" , {key: "shopCount" , value:this.shopCount + 1} )
						}
						
						//如果是立即购买的时候，则跳转到结算页面,携带sid购物车唯一标识立即结算页面
						if(type == 'buy'){
							
							this.$router.push({name : 'Pay' , query:{sids:result.data.sid}});
						}
						
						
						
					}
					
				}).catch( err => {
					this.$toast.clear();
				})
				
			},
			
			//立即购买
			buy(){
				
				this.addShopcart('buy')
			},
			
			//获取购物车总商品数量
			shopcartRows(){
				let tokenString = utils.getToken(this)
				this.axios({
					
					method:"GET",
					url:"/shopcartRows",
					params:{
						appkey: this.appkey,
						tokenString
					}
				}).then( result =>{
					if(result.data.code == 8000){
						this.$store.commit("detailModule/changeData" , {key: "shopCount" , value:result.data.result} )
					}
				}).catch( err => {
				})
			},
			//返回上一级
			back(){
				this.$router.go(-1);
			},
			//调转到购物车
			goShopcart(){
				this.$router.push({name: "Shopcart"})
			}
		}
	}
</script>

<style lang="less" scoped>
	
	.detail{
		// margin-top: 24px;
	}
	.detail-nav{
		// position: sticky;
		// top: 24px;
		// left: 0;
		color: #fff;
		background-image:linear-gradient(#3c120b, #882225 );
		>div{
			float: left;
			height: 50px;
			line-height: 51px;
			padding: 0px 10px;
			box-sizing: border-box;
			font-size: 18px;
		}
		.detail-nav-left{
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
				margin-left: 10px;
			}
		}
		.detail-nav-mid{
			width: 50%;
			text-align: center;
			
		}
		.detail-nav-rigth{
			width: 25%;
			position: relative;
			
			.detail-shopping-cart{
				position: absolute;
				top: 50%;
				right: 10px;
				width: 26px;
				height: 26px;
				margin-top:-13px ;
			}
			
			.shopping-cart-count{
				
				position: absolute;
				top: 2px;
				right: 8px;
				min-width: 18px;
				height: 18px;
				background: #bf2a28;
				border-radius: 40%;
				text-align: center;
				line-height: 18px;
				font-size: 12px;
				
			}
		}
	}
	
	.detail-commodity-image{
		height: 278px;
		overflow: hidden;
	}
	
	.commodity-detail{
		// height: calc(100vh - 50px - 278px);
		
		background: #e9dfd6;
		font-size: 18px;
		color: #14100d;
		padding-bottom: 70px;
		
		
		.detail-product-name{
			height: 50px;
			border-bottom: 2px solid #ae9d95;
			padding: 12px;
			box-sizing: border-box;
			
			
			.product-name{
				letter-spacing:2px;
				
			}
			
			.product-coll{
				height: 25px;
				width: 25px;
				
				border-radius: 50%;
				background: url(../assets/no-love.png)no-repeat;
				background-size: cover;
				
				&.com{
					background: url(../assets/yes-love.png)no-repeat;
				}
			}
		}
		
	
		
		.commodity-type{
			// height: 95px;
			font-size: 16px;
			border-bottom: 2px solid #ae9d95;
			padding: 12px;
			padding-top: 0px;
			box-sizing: border-box;
			
			.temperature-choice{
				margin-top: 15px;
				.choice-left{
					width: 50px;
					height: 25px;
					line-height: 25px;
				}
				.choice-right{
					margin-left: 10px;
					>span{
						display: inline-block;
						width: 70px;
						height: 25px;
						line-height: 25px;
						background: #ae9d95;
						margin-right: 20px;
						border-radius: 15px;
						text-align: center;
						
						&.com{
							background:#a92928 ;
							color: #fff;
						}
					}
					
					
				}
			}
			
			.sugar-choice{
				margin-top: 20px;
				.sugar-left{
					width: 50px;
					height: 25px;
					line-height: 25px;
				}
				.sugar-right{
					margin-left: 10px;
					>span{
						display: inline-block;
						width: 70px;
						height: 25px;
						line-height: 25px;
						background: #ae9d95;
						margin-right: 20px;
						border-radius: 15px;
						text-align: center;
						
						&.com{
							background:#a92928 ;
							color: #fff;
						}
					}
				}
			}
		}
		
		
		.detail-commodity-describe{
			border-bottom: 2px solid #ae9d95;
			padding: 12px;
			box-sizing: border-box;
			>p{
				margin-top: 5px;
				font-size: 16px;
				color:#a79289;
			}
		}
	
		.commodity-price-choice{
			height: 55px;
			// border-bottom: 2px solid #ae9d95;
			padding: 12px;
			line-height: calc(55px - 24px);
			box-sizing: border-box;
			.commodity-price{
				color:#a92928 ;
			}
			.price-count{
				>span{
					float: left;
					height: 28px;
					width: 28px;
					// background: #ae9d95;
					margin-left:15px ;
					border-radius: 50%;
					text-align: center;
				}
			}
		}
	}
	
	.commodity-nav{
		height: 50px;
		background:#e9dfd6;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		.commodity-nav-right{
			// background: #000;
			width: 70%;
			height: 50px;
			
			>div{
				width: 50%;
				height: 50px;
				// background: #666;
				text-align: center;
				line-height: 50px;
				font-size: 18px;
				color: #fff;
				
				
				
			}
			>.shopping-cart{
				background:#ce7f5d;
			}
			>.purchase{
				background: #a92928;
			}
			
		}
	}
</style>
