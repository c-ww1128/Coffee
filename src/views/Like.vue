<template>
	<div class="like">
		<!-- 导航条 -->
		<div class="like-head-nav clearfix">
			<div class="head-nav-left" @click="back()">
				<i>
					<img src="../assets/Arrow-1.png"  class="auto-img" alt="">
				</i>
				<span>返回</span>
			</div>
			<div class="head-nav-mid">我的收藏</div>
			
		
		</div>
		
		<!--收藏列表  -->
		<div class="like-body">
			<van-list  v-model="isloading" :finished="isfinished" finished-text="没有更多了"  @load="loadData" >
				<div class="clearfix">
					<div class="like-body-list fl" v-for="(item , index) in loadLikeData" :key="index">
						<div class="body-list-item">
							<div class="list-item-image" @click="goPage(item.pid)">
								<img :src="item.smallImg" class="auto-img" alt="">
							</div>
							<div class="list-item-concent">
								<p>{{item.name}}</p>
								<div class="clearfix">
									<div class="fl">￥{{item.price}}</div>
									<div class="fr item-del" @click="removeLike(item.pid ,index)">
										<img src="../assets/shanchu.png" class="auto-img" alt="">
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</van-list>
		</div>
	</div>
</template>

<script>
	import {utils} from '../utils/utils.js'
	// 辅助函数
	import {mapState} from 'vuex'
	export default{
		name:"Like",
		
		data(){
			
			return{
				
				 isloading: false,
				
			}
		},
		
		created(){
			
			this.$store.commit('likeModule/emptyData')
			
			//加载提示
			this.$toast.loading({
			  message: '加载中...',
			  duration: 0,
			  forbidClick: true
			});
			
			
			
			this.getLikeData()
		},
		
		computed:{
			...mapState("likeModule" , ["count" ,"likeData" , "loadLikeData" , "isfinished"])
		},
		
		methods:{
			
			//懒加载
			loadData(){
				setTimeout(() => {
					
					this.isloading = false;
					//如果大于等于this.count，就没有数据可加载了
					if(this.loadLikeData.length >= this.likeData.length){
						
						this.$store.commit("likeModule/changeData" , {key: "isfinished" , value: true})
						
						return;
					}
			
					//触底懒加载，在添加6条数据
					this.$store.commit("likeModule/loadLikeData")
					
					
				},2000)
			},
			
			
			//获取我的收藏商品列表
			getLikeData(){
				
				let tokenString = utils.getToken(this);
				
				this.axios({
					method:"GET",
					url:"/findAllLike",
					params:{
						appkey:this.appkey,
						tokenString
					}
					
				}).then( result => {
					
					if(result.data.code == 2000){
						
						this.$store.commit("likeModule/changeData" ,{key : "likeData", value: result.data.result})
						
					}
					//关闭提示
					this.$toast.clear();
				}).catch( err =>{
					//关闭提示
					this.$toast.clear();
				})
				
				
				
				
			},
			
			
			//删除收藏列表
			removeLike(pid , index){
				
				let tokenString = utils.getToken(this);
				
				this.axios({
					method:'POST',
					url:'/notlike',
					data:{
						appkey:this.appkey,
						pid,
						tokenString
						
					},
					transformRequest:utils.transformData
					
				}).then( result =>{
					
					
					if(result.data.code == 900){
						this.$store.commit('likeModule/changeLikeData', index);
						
						//加载提示
						this.$toast({
						  message: '已删除...',
						});
						
					}
					
				}).catch( err =>{
					
					//关闭提示
					this.$toast.clear();
				})
				
			},
			
			
			//查看商品详情
			goPage(pid){
				
				this.$router.push({name:"Detail" , params:{pid}})	
			},
			
			//返回上一级
			back(){
				this.$router.go(-1);
			}
		}
		
		
	}
</script>

<style lang="less" scoped>
	
	.like-body{
		margin-top: 50px;
		padding-top: 10px;
		height: calc(100vh - 50px - 10px);
		overflow: auto;
		background:#e9dfd6 ;
		.like-body-list:nth-child(2n){
			margin-right: 0px;
		}
		.like-body-list{
			margin-right: 10px;
			margin-bottom: 10px;
			width: calc( 100% - 50% - 5px) ;
			background:#decece ;
			
			border-radius: 10px;
			padding-top: 10px;
			
			.body-list-item{
				width: 90%;
				margin: 0 auto;
				.list-item-image{
					
					width: 100%;
				}
				
				.list-item-concent{
					>p{
						height: 30px;
						line-height: 30px;
						font-size: 18px;
						margin-top: 10px;
					}
					>div{
						
						font-size: 16px;
						color: #a73535;
						margin-top: 5px;
						line-height: 30px;
						
						.item-del{
							width: 30px;
						}
					}
					
				}
			}
			
			
		}
	}
	
	
	.like-head-nav{
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


</style>
