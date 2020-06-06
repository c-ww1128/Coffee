<template>
	<div class="account">
		<div class="account-head-nav clearfix">
			<div class="head-nav-left" @click="back">
				<i>
					<img src="../assets/Arrow-1.png"  class="auto-img" alt="">
				</i>
				<span>返回</span>
			</div>
			<div class="head-nav-mid">账号管理</div>

		</div>
		<div class="account-body">
			<div class="account-conten">
				<div class="account-list">
					<div class="fl account-text" >头像</div>
					<div class="fr portrait-image">
						<img :src="userInfo.userImg" class="auto-img" alt="">
						<van-uploader class='v-image' :after-read="upload"/>
					</div>
				</div>
				<div class="account-list">
					<div class="fl account-text">用户名</div>
					<div class="fr account-usertext">{{userInfo.userId}}</div>
				<!-- 	<van-field
					  v-model="uservalue"
					  label="用户名"
					  placeholder="输入用户名"
					  input-align="right"
					/> -->
				</div>
				<div class="account-list">
					<div class="fl account-text">联系电话</div>
					<div class="fr account-usertext">{{userInfo.phone}}</div>
					<!-- <van-field
					  v-model="phonevalue"
					  label="联系电话"
					  placeholder="输入电话号码"
					  input-align="right"
					/> -->
				</div>
				<div class="account-list">
					<!-- <div class="fl account-text">昵称</div>
					<div class="fr account-usertext">猴子</div> -->
					<van-field
					  v-model="userInfo.nickName"
					  label="昵称"
					  placeholder="输入昵称"
					  input-align="right"
					  @change="changeUserInfo('/updateNickName' , 'nickName' , userInfo.nickName)"
					/>
				</div>
			
				<div class="account-list">
					<!-- <div class="fl account-text">简介</div>
					<div class="fr account-usertext">1360000001</div> -->
					<van-field
					  v-model="userInfo.desc"
					  rows="1"
					  autosize
					  label="留言"
					  type="textarea"
					  placeholder="请输入留言"
					  :maxlength="50"
					  @change = "changeUserInfo('/updateDesc' , 'desc' , userInfo.desc)"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {utils} from '../utils/utils.js'
	export default{
		name:"Account",
		
		data(){
			return {
				userInfo:{
					userImg:'',
					phone:'',
					userId:'',
					nickName:'',
					desc:''
				}
				
			}
		},
		created(){
			this.getUserInfo();
		},
		
		methods:{
			
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
					url:"/findAccountInfo",
					params:{
						appkey:this.appkey,
						tokenString
					}
				}).then( result => {
					
					// this.$store.commit("myModule/changeData" , {key: "userData" , value: result.data.result[0]})
					this.userInfo = result.data.result[0]
					
					this.$toast.clear();
				}).catch( err => {
					
					this.$toast.clear();
				})
			},
			
			//修改用户信息
			changeUserInfo( url , key ,value){
				
				//获取token字符串
				let tokenString = utils.getToken(this);
				
				this.axios({
					method:'POST',
					url,
					data:{
						appkey:this.appkey,
						tokenString,
						[key]:value
					},
					transformRequest:utils.transformData
				}).then( result =>{
					
				}).catch( err => {
					
				})
				
			},
			
			//返回上一级
			back(){
				this.$router.go(-1);
			},
			
			//上传文件
			upload(file){
				
				
				
				//控制上传图片大小不能超过300kb
				let imaSize = 300 * 1024;
				
				if(file.file.size > imaSize){
					
					this.$toast('上传图片不能超过300kB')
					return
				}
				
				//将图片上传到服务器
				
				//获取token字符串
				let tokenString = utils.getToken(this);
				
				let imgType = file.file.type.split('/')[1]
			
				
				//处理图片base64
				let serverBase64Img = file.content.replace(/data:image\/[A-Za-z]+;base64,/ , '')
				
				//加载提示
				this.$toast.loading({
				  message: '处理中...',
				  duration: 0,
				  forbidClick: true
				});
				
				this.axios({
					method:'POST',
					url:'/updateAvatar',
					data:{
						appkey:this.appkey,
						imgType,
						serverBase64Img,
						tokenString
					},
					transformRequest:utils.transformData
				}).then( result =>{
					
					this.userInfo.userImg = result.data.userImg;
					this.$toast.clear();
				}).catch( err => {
					
					this.$toast.clear();
				})
			}
				
			
		}
	}
</script>

<style lang="less" scoped>
	.account-head-nav{
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

	.van-cell{
		background: #f9f0f0;
		padding: 0px;
		font-size: 16px;
		padding:  10px 0px;
		
		/deep/ .van-field__control{
			color: #867f7d;
			
		}
		
		
	}
	
	.account-body{
		height: calc(100vh - 50px - 20px);
		margin-top: 50px;
		background: #e9dfd6;
		padding: 10px 0px;
		
		.account-conten{
			background: #f9f0f0;
			border-radius: 10px;
			.account-list:nth-child(1){
				border-top: 0;
			}
			.account-list{
				min-height:60px;
				padding: 5px 10px;
				box-sizing: border-box;
				border-top: 1px solid #b5a79e;
				.account-text{
					font-size: 15px;
					height: 100%;
					line-height: 50px;
				}
				.portrait-image{
					width: 50px;
					height: 50px;
					border-radius:50% ;
					overflow: hidden;
					border: 2px solid #ac4440;
					box-sizing: border-box;
					position: relative;
					.v-image{
						position: absolute;
						top: 0;
						left: 0;
						overflow: hidden;
						z-index: 2;
						opacity: 0;
					}
				}
				
				.account-usertext{
					font-size: 16px;
					height: 100%;
					line-height: 50px;
					color: #867f7d;
					// margin-right: 12px;
				}
			}
		}
		
	}

</style>
