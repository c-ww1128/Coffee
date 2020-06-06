<template>
	<div class="install">
		<div class="install-head-nav clearfix">
			<div class="head-nav-left" @click="back">
				<i>
					<img src="../assets/Arrow-1.png"  class="auto-img" alt="">
				</i>
				<span>返回</span>
			</div>
			<div class="head-nav-mid">设置</div>
		</div>
		<div class="install-body">
			<div class="password" @click="isShowAction">修改密码</div>
			<div class="cancellation" @click="destroyAccount">注销账号</div>
		</div>
		<van-action-sheet v-model="isShow" title="修改密码">
		  <div class="password-content">
			  <van-form  @submit="updatePassword">
			    <van-field
			      v-model="userInfo.oldPassword"
			      type="text"
			      name="密码"
			      label="旧密码"
			      placeholder="旧密码-(6-16)"
			     
			    />
			    <van-field
			      v-model="userInfo.password"
			      type="text"
			      name="密码"
			      label="新密码"
			      placeholder="新密码-(6-16)"
			      
			    />
			    <div style="margin: 16px;">
			      <van-button round block type="info" native-type="submit">
			        提交
			      </van-button>
			    </div>
			  </van-form>
		  </div>
		</van-action-sheet>
	</div>
</template>

<script>
	
	import{valid} from '../utils/valid'
	
	import{utils} from '../utils/utils'
	
	export default{
		name:"Install",
		data(){
			return {
				isShow:false,
				userInfo:{
					oldPassword:'',
					password: ''
				}
			}
		},
		methods:{
			//返回上一级
			back(){
				this.$router.go(-1);
			},
			
			isShowAction(){
				this.isShow = true 
			},
			
			//判断密码是否成功
			updatePassword(){
				
				if(valid.validForm(this.userInfo , this)){
					//通过验证
					
					//判断密码是否一致
					if(this.userInfo.oldPassword == this.userInfo.password){
						
						//加载提示
						this.$toast('新密码不能和旧密码一致');
						
						return
					}
					
					//加载提示
					this.$toast.loading({
					  message: '处理中...',
					  duration: 0,
					  forbidClick: true
					});
					
					//获取token字符串
					let tokenString = utils.getToken(this);
					
					
					this.axios({
						method:'POST',
						url:"/updatePassword",
						data:{
							appkey:this.appkey,
							tokenString,
							password: this.userInfo.password,
							oldPassword: this.userInfo.oldPassword
						},
						transformRequest:utils.transformData
					}).then( result => {
						
						if(result.data.code == "E001"){
							//清除token
							localStorage.removeItem('_t');
							
							//跳转登录界面
							this.$router.push({name:'Login'})
							
							
							
							this.isShow = false
						}else{
							//加载提示
							this.$toast( '修改密码失败...');
						}
						this.$toast.clear();
						
					}).catch( err => {
						this.$toast.clear();
					})
				}
			},
			
			//注销账号
			destroyAccount(){
				
				//加载提示
				this.$toast.loading({
				  message: '处理中...',
				  duration: 0,
				  forbidClick: true
				});
				
				//获取token字符串
				let tokenString = utils.getToken(this);
				
				
				this.axios({
					method:'POST',
					url:"/destroyAccount",
					data:{
						appkey:this.appkey,
						tokenString,
					},
					transformRequest:utils.transformData
				}).then(result => {
					this.$toast.clear();
				}).catch(err => {
					this.$toast.clear();
				})
			}
			
		}
	}
</script>

<style lang="less" scoped>
	
	.password-content{
		padding: 30px 10px;
		background: #e9dfd6 ;

		/deep/ .van-cell{
			background: #f9f0f0;
			border-radius:10px ;
			margin-bottom: 10px;
		}
		/deep/ .van-button--info{
			background: #a73535;
			border: 1px solid #a73535;
		}
	}
	
	/deep/ .van-action-sheet__header{
		background: #e9dfd6 ;
	}
	.install-body{
		height: calc(100vh - 50px);
		margin-top: 50px;
		background:#e9dfd6 ;
		overflow: auto;
		padding: 10px;
		box-sizing: border-box;
		
		>div{
			font-size: 16px;
			text-align: center;
			height: 50px;
			background: #f9f0f0;
			line-height: 50px;
			border-radius:10px ;
			color: #a73535;
			margin-bottom: 20px;
		}
	}
	
	.install-head-nav{
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