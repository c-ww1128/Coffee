<template>
	<div class="email">
		<div class="email-head-nav clearfix">
			<div class="head-nav-left" @click="back">
				<i>
					<img src="../assets/Arrow-1.png"  class="auto-img" alt="">
				</i>
				<span>返回</span>
			</div>
			<div class="head-nav-mid">邮箱验证</div>
		 
		</div>
		
		<div class="email-body">
			<div class="email-body-form">
				<van-form @submit="next">
				  <van-field
				    v-model="userInfo.email"
				    name="邮箱"
				    label="邮箱"
				    placeholder="请输入邮箱"
				   
				  />
				  <div class="testEmail clearfix">
					  <div class="fl">
						  <van-field
						    v-model="userInfo.testEmail"
						    type="text"
						    name="邮箱验证码"
						    label="邮箱验证码"
						    placeholder="请输入邮箱验证码"
						    maxlength ='6'
						  />
					  </div>
					  <div class="fr">
						 <button class="btn" :disabled="userInfo.isSend" @click.prevent='sendValidCode'>{{userInfo.text}}</button>
					  </div>
					
				  </div>
				  
				  <div style="margin: 16px;">
				    <van-button round block type="info" native-type="submit" >
						下一步
				    </van-button>
				  </div>
				</van-form>
			</div>
		</div>
	</div>
</template>

<script>
	//导入表单验证模块
	import {valid} from '../utils/valid'
	//导入公共方法模块
	import {utils} from '../utils/utils'
	export default {
		name:'Email',
		
		data(){
			
			return {
				userInfo:{
					email: '',
					testEmail:'',
					isSend:false,
					text:'发送验证码'
				}
			}
		},
		
		methods:{
			
			//发送验证码
			sendValidCode(){
				
				//判断邮箱是否正确
				if(valid.validForm({email:this.userInfo.email}, this)){
					
					let time = 5 ;
					
					this.userInfo.isSend = true;
					this.userInfo.text = `${time}s重新发送`
					let timer = setInterval( ()=> {
						if(time == 0){
							clearInterval(timer)
							timer = null;
							this.userInfo.text='发送验证码'
							this.userInfo.isSend = false;
						}else{
							
							time--
							this.userInfo.text = `${time}s重新发送`
						}
					},1000)

					//加载提示
					this.$toast.loading({
					  forbidClick: true,
					  duration: 0,
					  message: "加载中..."
					});
					
					//发起请求
					this.axios({
						method: 'POST',
						url: '/emailValidCode',
						data: {
							appkey: this.appkey,
							email:this.userInfo.email
						},
						transformRequest:utils.transformData
						
					}).then(result => {
						
						this.$toast.clear();
						
						this.$toast(result.data.msg)
					}).catch( err => {
						this.$toast.clear();
					})
					
				}
			},
			
			//返回上一级
			back(){
				this.$router.go(-1);
			},
			
			//下一步
			next(){
				
				//验证验证码
				if(/^[0-9]{6}$/.test(this.userInfo.testEmail)){
					//加载提示
					this.$toast.loading({
					  forbidClick: true,
					  duration: 0,
					  message: "加载中..."
					});
					
					//发起请求
					this.axios({
						method: 'POST',
						url: '/checkValidCode',
						data: {
							appkey: this.appkey,
							validCode: this.userInfo.testEmail
						},
						transformRequest:utils.transformData
						
					}).then(result => {
						
						this.$toast.clear();
						if(result.data.code == 'K001'){
							
							this.$router.push({name: "Password"})
						}
						this.$toast(result.data.msg)
					}).catch( err => {
						this.$toast.clear();
					})
					
					
					
				}else{
					this.$toast('请输入6位验证码！！！')
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	
	.email-body{
		height: calc(100vh - 50px - 20px);
		margin-top: 50px;
		background:#e9dfd6 ;
		padding: 10px;
		
	}
	.testEmail{
		
		background: #f9f0f0;
		margin-top: 20px;
		border-radius:10px ;
		>div:nth-child(1){
			width:70%;
		}
		.btn{
			width: 100px;
			height: 44px;
			background:#f9f0f0;
			border-radius: 10px;
			box-sizing: border-box;
			border: 1px solid #a73535;
			text-align: center;
			line-height: 44px;
			font-size: 14px;
			color: #987474;
		}
	}
	/deep/ .van-button--info{
		background: #a73535;
		border: 1px solid #a73535;
		font-size: 15px;
		
	}
	
	/deep/ .van-cell {
		background:#f9f0f0 ;
		border-radius:10px ;
		font-size: 15px;
		padding-right:0px ;
	}
	/deep/ .van-form{
		margin-top: 10px;
	}

	.email-head-nav{
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
