<template>
	<div class="address">
		<div class="address-head-nav clearfix">
			<div class="head-nav-left" @click="back" >
				<i>
					<img src="../assets/Arrow-1.png"  class="auto-img" alt="">
				</i>
				<span>返回</span>
			</div>
			<div class="head-nav-mid">我的收货地址</div>
			<div class="head-nav-rigth"></div>
		</div>
		<div class="address-body">
			<van-address-list
				
			  v-model="chosenAddressId"
			  :list="list"
			  default-tag-text="默认"
			  @add="onAdd"
			  @edit="onEdit"
			  :switchable="false"
		
			>
			</van-address-list>
			
		</div>
	</div>
</template>

<script>
	import{mapState} from 'vuex'
	
	import {utils} from '../utils/utils.js'
	
	export default{
		name:"Address",
		data(){
			return{
				 chosenAddressId: '0',
				
			}
		},
		
		computed:{
			...mapState('addressModule' , ['list'])
		},
		
		created(){
			//加载提示
			this.$toast.loading({
			  message: '加载中...',
			  duration: 0,
			  forbidClick: true
			});
			
			
			//获取token字符串
			let tokenString = utils.getToken(this);
			
			this.axios({
				method:'GET',
				url:'/findAddress',
				params:{
					
					appkey:this.appkey,
					tokenString
				}
				
			}).then( result => {
				
				
				let list = [];
				result.data.result.forEach( (v , i) => {
					let o = {
						id:i,
						aid:v.aid,
						name:v.name,
						tel:v.tel,
						isDefault:Boolean(v.isDefault),
						address:v.province + v.city + v.county + v.addressDetail
					}

					if(o.isDefault){
						this.chosenAddressId = o.id
						
					}
					
					list.push(o)
					//修改vuex list
					this.$store.commit('addressModule/changeData' , {key: 'list' , value: list})
					
				})
				this.$toast.clear();
				
			}).catch( err => {
				
			})
			
		},
		
		methods:{
			
			
			onAdd() {
			    //isAdd: 1 ==> 新增地址 ， 0 ==> 编辑地址
				this.$router.push({name: "NewAddress" , query:{isAdd : 1}})
			},
				
			onEdit(item, index) {
				
				  //判断是否编辑 ， 还是新增
				  this.$router.push({name: "NewAddress" , query:{isAdd : 0 , aid : item.aid}});
			},
			//返回上一级
			back(){
				this.$router.push({name:'My'});
			}
		}
	}
</script>

<style lang="less" scoped>
	
	.address-body{
		height: calc(100vh - 50px);
		background: #e9dfd6;
		// #f9f0f0
		margin-top: 50px;
		overflow: auto;
		
		.van-address-item{
			background: #f9f0f0;
			
			.van-cell{
				background: #f9f0f0;
				
				
			}
			
		}
		
		/deep/ .van-address-item .van-radio__icon--checked .van-icon{
			background-color: #a73535;
			border-color:#a73535;
		}
		
		.van-address-list__bottom{
			background: #f9f0f0;
			.van-button{
				// background-image:linear-gradient(#3c120b, #882225 );
				background:#a73535 ;
				border: none;
			}
		}
	}
	
	/deep/ .van-tag--danger{
		background: #a73535;
	}
		
	
	
	
	.address-head-nav{
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
