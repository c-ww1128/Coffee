<template>
	<div class="login">
		<div class="register-bg"></div>
		<div class="register-obscure">
			<div class="register-box">
				<div class="register-user">
					<img src="../assets/user.png" class="auto-img" alt="">
				</div>
				<div class="register-form">
					<form method="get" @submit="login">
						<div class="account-number clearfix">
							<div class="fl account-number-image">
								<img src="../assets/envelope.png" class="auto-img" alt="">
							</div>
							<div class="fl account-number-inp">
								<input type="text" placeholder="账号 / 手机 / 用户名" v-model="userInfo.phone">
							</div>
						</div>
						<div class="account-number clearfix">
							<div class="fl account-number-image">
								<img src="../assets/sou.png" class="auto-img" alt="">
							</div>
							<div class="fl account-number-inp">
								<input type="password" placeholder="请输入密码" v-model="userInfo.password">
							</div>
						</div>
						<div class="register-check clearfix">
							<label class="fl" @change = 'changecheck'>
								<input type="checkbox" class="chenck" :checked="check">
								<div class="box-check fl">
									<img src="../assets/对勾.png" v-show="check" class="auto-img" alt="">
								</div>
								<div class="chenck-text fl">记住密码</div>
							</label>
							<div class="forget-password fr" @click="goEmail">
								忘记密码？
							</div>
						</div>
						<div class="register-submit">
							<button class="register-btn" type="submit">登录</button>
						</div>
					</form>
					<div class="register-mode">
						<div class="box-register clearfix">
							<span class="fr" @click="goRegister">快速注册>></span>
						</div>
						<div class="box-mode">
							<div class="box-mode-line">
								<i class="line-left"></i>
								<span>第三方软件登录</span>
								<i class="line-rigth"></i>
							</div>
							<div class="mode-register">
								<div class="box-mode-register clearfix">
									<div class="register-qq">
										<!-- <img src="../assets/qq.png" alt=""> -->
									</div>
									<div class="register-wx"></div>
									<div class="register-wb"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	//导入表单验证
	import{valid} from '../utils/valid'
	
	//导入公共方法模块
	import{utils} from '../utils/utils'
	export default{
		name:'Login',
		
		data(){
			
			return {
				
				check:false
				
			}
		},
		
		computed:{
			userInfo(){
				return this.$store.state.loginModule.loginInfo
			}
		},
		
		methods:{
			
			
			//跳转忘记密码
			goEmail(){
				
				this.$router.push({name:"Email"})
			},
			
			//跳转注册
			goRegister(){
				this.$router.push({name:"Register"})
			},
			
			login(){
				//判断成功后发送和用户信息
				if(valid.validForm(this.userInfo , this)){
					
					this.$toast.loading({
					  message: '登录中...',
					  duration: 0,
					  forbidClick: true
					});
					
					this.axios({
						method:'POST',
						url:'/login',
						data:{
							appkey:this.appkey,
							phone:this.userInfo.phone,
							password:this.userInfo.password
						},
						
						transformRequest:utils.transformData
						
					}).then( result =>{
						this.$toast.clear();
						
						
						
						//如果登录成功后，将token保存在cookie中
						
						if(result.data.code == 200 ){
							// this.$router.push({name:'Menu'})
							//将token分段保存，这样比较不容易看出 ，网页较安全
							// let tokenData = result.data.token.split(".");
							
							//cookie的过期时间要与后台相对应
							// let expires = 30 * 24 * 60 * 60 
							
							//循环存储cookie
							// tokenData.forEach( (v , i) => {
								
							// 	this.$cookies.set('t' + i , v , expires)
							// })
							
							
							//存储token字符串，在本地存储
							localStorage.setItem('_t', result.data.token)
							
							
							this.$router.push({name:"Menu"})
						}else{
							// 如果返回其他就返回指定提示
							this.$toast.loading({
							  message:result.data.msg,
							  forbidClick: true
							});
							
							for(let key in this.userInfo){
								this.userInfo[key] = "" 
							}
						}
					}).catch( err => {
						
					})
					
					
					
				}
				
				
		
			},
			
			//记住密码
			
			changecheck(){
				
				this.check = this.check ? false : true
				
			}
		}
		
		
		
		
	}
</script>

<style lang="less" scoped>
	.login{
		color: #fff;
		
	}
	.register-bg{
		position: fixed;
		top: 24px;
		bottom: 0;
		right: 0;
		left: 0;
		background: url(../assets/landbg-img.jpg) no-repeat;
		background-size:cover ;
	
	}
	
	.register-obscure{
		position: fixed;
		top: 24px;
		bottom: 0;
		right: 0;
		left: 0;
		background: rgba(0,0,0,0.5);
		// overflow: auto;
		
		
		.register-box{
			
			// background: #fff;
			.register-user{
				width: 120px;
				height: 120px;
				background: rgba(247,187,131 ,.5);
				overflow: hidden;
				margin: 0 auto;
				border-radius:50% ;
				margin-top: 50px;
				// background: url(../../public/user.png) no-repeat;
				background-size: cover;
				// border: 1px solid #fff;
			}
		}
		
	}
	
	.register-form{
		margin-top: 50px;
		height: 400px;
		// background: #fff;
		
		form{
			width: 80%;
			// background: red;
			margin: 0 auto 20px;
			
		}
	}
	
	.account-number{
		
		height: 50px;
		background: #ded1c9;
		padding-top: 15px ;
		box-sizing: border-box;
		margin-bottom: 25px;
		
		.account-number-image{
			margin:  0px 10px;
			// padding:5px;
			height: 30px;
			width: 30px;
			
		}
		
		.account-number-inp{
			width: calc(100% - 30px - 20px - 10px);
			height: 30px;
			margin-left:10px ;
			
			input{
				width: 100%;
				height: 100%;
				border: none;
				outline: none;
				background: #ded1c9;
				font-size: 16px;
				color: #000;
			}
		}
	}
	
	
	
	.register-check{
		margin-bottom: 25px;
		
		>label{
			font-size: 16px;
		}
		
		.chenck{
			display: none;
		}
		.chenck-text{
			
		}
		>div{
			font-size: 16px ;
		}
		
		.box-check{
			height: 15px;
			width: 20px;
			border: 2px solid #fff;
			border-radius: 6px;
			overflow: hidden;
			margin-right: 5px;
			// background: url(../../public/对勾.png) no-repeat;
			// background-size: cover;
			// padding: 2px;
			position: relative;
			
			>img{
				position: absolute;
				top: -3px;
				left: 0px;
			}
		}
	}

	.register-submit{
		height: 45px;
		// background: #fff;
		
		.register-btn{
			height: 45px;
			width: 100%;
			border: none;
			outline: none;
			font-size: 18px;
			background-image:linear-gradient(#3c120b, #882225 );
			color: #fff;
			letter-spacing:18px;
		}
		
		
	}

	.register-mode{
		width: 80%;
		margin: 0 auto;
		.box-register{
			font-size: 16px;
			
		}
			
		.box-mode{
			margin-top: 15px;
			
			.box-mode-line{
				position: relative;
			}
			.line-left{
				position: absolute;
				top: 50%;
				left: 0px;
				width: 28%;
				height: 1px;
				background: #fff;
				margin-left: -1px;
			}
			.line-rigth{
				position: absolute;
				top: 50%;
				right: 0px;
				width: 28%;
				height: 1px;
				background: #fff;
				margin-left: -1px;
			}
			.box-mode-line{
				text-align: center;
				font-size: 14px;
				letter-spacing:2px;
			}
		}
	}

	.mode-register{
		.box-mode-register{
			width: 55%;
			// background: #fff;
			margin: 15px auto 0px;
			
			
			>div{
				
				float: left;
				color: #000;
				width: 32px;
				height: 32px;
				margin-right: calc(55% / 3);
				background: #cdc1c0;
				border-radius:50% ;
			}
			.register-qq{
				background:#cdc1c0  url(../assets/qq.png)no-repeat;
				background-position: 50% 50%;
			}	
			.register-wb{
				margin-right: 0px;
				background:#cdc1c0  url(../assets/wb.png)no-repeat;
				background-position: 50% 50%;
			}
			.register-wx{
				
				background:#cdc1c0  url(../assets/wx.png)no-repeat;
				background-position: 50% 50%;
			}
			
		}
		
	}
</style>
