<template>
	<div class="newAddress">
		<div class="newAddress-head-nav clearfix">
			<div class="head-nav-left" @click="back" >
				<i>
					<img src="../assets/Arrow-1.png"  class="auto-img" alt="">
				</i>
				<span>返回</span>
			</div>
			<div class="head-nav-mid">{{title}}</div>
			
		</div>
		<div class="newAddress-body">
			<van-address-edit
			  :area-list="addressList"
			  :address-info="addressInfo"
			  :show-set-default="isDefault"
			  :show-delete="isDelete"
			  :show-postal = "isPastal"
			  :show-area="true"
			  detail-rows="2"
			  detail-maxlength="100"
			  save-button-text="保存地址"
			  delete-button-text="删除地址"
			  @save="saveAddress"
			  @delete="deleteAddress"
			/>
		</div>
	</div>
</template>

<script>
	//导入公共方法
	import {utils} from '../utils/utils.js'
	
	//辅助函数
	import {mapState} from 'vuex'
	
	export default{
		name:"NewAddress",
		
		data(){
			return {

				//初始化数据 编辑地址需要aid 
				addressInfo:{
					aid:"",
					name:"",
					tel:"",
					province:'',
					city:'',
					county:"",
					addressDetail:"",
					areaCode:"",
					postalCode:"",
					isDefault:false
				}
			}
		},
		
		created(){
			
			
			//截取查询参数
			let query = this.$route.query ;
			
		
			
			if(query.isAdd == 0){
				
				//加载提示
				this.$toast.loading({
				  message: '加载中...',
				  duration: 0,
				  forbidClick: true
				});
				
				//获取token字符串
				let tokenString = utils.getToken(this);
				
				this.axios({
					method: 'GET',
					url:'/findAddressByAid',
					params:{
						appkey:this.appkey,
						tokenString,
						aid:query.aid
					}
				}).then( result => {
					
					
					let data = result.data.result[0]
					
					data.isDefault = Boolean(data.isDefault);
					
					for(let key in this.addressInfo){
						
						this.addressInfo[key] = data[key]
					}
					
					//拷贝地址数据
					let addressDate = Object.assign({} , this.addressInfo);
					
					this.$store.commit('newAddressModule/changeData' ,{key: 'temporaryDate' , value:addressDate})
					
					
					this.$toast.clear();
					
				}).catch( err => {
					this.$toast.clear();
				})
			}
			
			this.$store.commit('newAddressModule/changeData' ,{key: 'isAdd' , value:query.isAdd})
			
			this.$store.commit('newAddressModule/changeData' ,{key: 'aid' , value:query.aid})
			
			this.$store.commit('newAddressModule/changeData' ,{key: 'isDelete' , value:!query.isAdd})
			
			this.$store.commit('newAddressModule/changeData' ,{key: 'title' , value:query.isAdd == 0 ? '编辑地址' : '新增地址'});
			
			//获取dom改变颜色
			this.$nextTick(() => {
				
				document.querySelector(".van-picker").style.background = "#f9f0f0"
				
				document.querySelector(".van-picker__cancel").style.color = "#3c110b"
				
				document.querySelector(".van-picker__confirm").style.color = "#3c110b"
			})
		},
		
		computed:{
			...mapState('newAddressModule' , [ 'temporaryDate','title' , "isAdd", "aid" , 'isDefault' ,'isDelete' ,'addressList','isPastal'])
		},
		methods:{
			
			//返回上一级
			back(){
				this.$router.go(-1);
			},
			
			//先判断当前地址数据和编辑的地址数据是否一样
			isSame(o1 ,o2){
				//o1 ： 当前地址数据
				//o2 : 编辑前的地址数据
				
				for(let key in o2){
					
					if(o2[key] != o1[key]){
						//存在数据不一样
						return false
					}
				}
				
				return true
				
			},
			
			//保存地址
			saveAddress(content){
				
				//content地址内容
				
				
				delete content.country
				
				
			
				//拷贝对象对象拷贝对象
				let data = Object.assign({} , content)

				let url = '' ;
				
				if(this.isAdd == 1){
					//新增地址
					delete data.aid;
					
					url = '/addAddress';
					
				}else{
					
					//编辑地址
					//先判断当前地址数据和编辑的地址数据是否一样
					
					if(this.isSame(content ,this.temporaryDate)){
						
						return 	this.$router.push({name:'Address'});
					}else{
						
						url = '/editAddress';
					}
					
					
					
				}
				
				//获取token字符串
				let tokenString = utils.getToken(this);
				
				data.tokenString = tokenString ;
				
				data.appkey = this.appkey ;
				
				
				//将isDefault 转化为number值
				data.isDefault = Number(data.isDefault)
				
				// delete data.country

				//加载提示
				this.$toast.loading({
				  message: '加载中...',
				  duration: 0,
				  forbidClick: true
				});
				
				this.axios({
					
					method: 'POST',
					
					url,
					
					data,
					
					transformRequest:utils.transformData
					
				}).then(result => {
					
					
					
					// this.$router.push({name:'Address'});
					this.back();
					this.$toast.clear();
				}).catch(err => {
					this.$toast.clear();
				})
				
				
			},
			
			
			//删除地址
			deleteAddress(item){
				
				//加载提示
				this.$toast.loading({
				  message: '删除中...',
				  duration: 0,
				  forbidClick: true
				});
				
				let tokenString = utils.getToken(this);
				
				this.axios({
					method: "POST",
					url:"/deleteAddress",
					data:{
						appkey:this.appkey,
						tokenString,
						aid:this.aid
					},
					transformRequest:utils.transformData
				}).then( result => {
					this.$router.push({name:'Address'});
					this.$toast.clear();
				}).catch( err => {
					this.$toast.clear();
				})
				
			}
			
			
		}
	}
</script>

<style lang="less" scoped>
	
	.newAddress-body{
		height: calc(100vh - 50px);
		background: #e9dfd6;
		// #f9f0f0
		margin-top: 50px;
		overflow: auto;
		
		/deep/ .van-cell{
			background: #f9f0f0;
		}
		
		/deep/ .van-button--danger{
			background:#a73535 ;
			border: 1px solid #a73535;
		}
		
		/deep/ .van-field__error-message{
			
			color:  #a73535;
		}
		
		/deep/ .van-switch{
			background: #eadddd;
		}
		
		/deep/.van-switch--on{
			background:#a73535 ;
		}
		
		/deep/ .van-button--default{
			background: #c1aea8;
		}
		/deep/ .van-switch__node{
			background: #f7eaea;
		}
		
		
		
		
	}
	
	/deep/ .van-picker__cancel, .van-picker__confirm{
		color: #a73535;
	}
	
	.newAddress-head-nav{
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