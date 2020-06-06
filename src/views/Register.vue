<template>
	<div class="register">
		<div class="register-bg"></div>
		<div class="register-obscure">
			<div class="register-box">
				<div class="register-user">
					<img src="../assets/user.png" class="auto-img" alt="">
				</div>
				<div class="register-form" >
					<form @submit="register">
						<div class="account-number clearfix">
							<div class="fl account-number-image">
								<img src="../assets/envelope.png" class="auto-img" alt="">
							</div>
							<div class="fl account-number-inp">
								<input type="text" placeholder="请输入11位手机号码" v-model="userInfo.phone">
							</div>
						</div>
						<div class="account-number clearfix">
							<div class="fl account-number-image">
								<img src="../assets/头像.png" class="auto-img" alt="">
							</div>
							<div class="fl account-number-inp">
								<input type="text" placeholder="请输入昵称1-8个字符" v-model="userInfo.nickName">
							</div>
						</div>
						<div class="account-number clearfix">
							<div class="fl account-number-image">
								<img src="../assets/sou.png" class="auto-img" alt="">
							</div>
							<div class="fl account-number-inp">
								<input type="text" placeholder="请输入密码" v-model="userInfo.password">
							</div>
						</div>
						<div class="register-submit" >
							<button class="register-btn" type="submit" >注册</button>
						</div>
						<div class="gologin clearfix">
							<span class="fr" @click="goLogin">已有账号快速登录>></span>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import{valid} from '../utils/valid'
	
	import{utils} from '../utils/utils'
	
	export default{
		name:'Register',
		
		
		computed:{
			userInfo(){
				return this.$store.state.registerModule.userInfo
			}
		},
		
		methods:{
			//跳转登录界面
			goLogin(){
				
				//跳转登录界面
				this.$router.push({name:'Login'})
			},
			
			register(){
				//判断成功后发送和用户信息
				if(valid.validForm(this.userInfo , this)){
					
					this.$toast.loading({
					  message: '注册中...',
					  duration: 0,
					  forbidClick: true
					});

					
					this.axios({
						method:'POST',
						url:'/register',
						// 请求体参数
						data:{
							appkey:this.appkey,
							nickName:this.userInfo.nickName,
							password: this.userInfo.password,
							phone: this.userInfo.phone
						},
						
						transformRequest:utils.transformData
						
					}).then( result => {
						
						this.$toast.clear();
						
						//如果注册成功
						if(result.data.code == 100){
							
							
							//跳转登录界面
							this.$router.push({name:'Login'})
						
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

			}
		}
	}
</script>

<style lang="less" scoped>
	.gologin{
		font-size: 16px;
		margin-top: 15px;
		height: 45px;
		// background-image:linear-gradient(#3c120b, #882225 );
		color: #d4bbbb;
	}
	
	.register{
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
