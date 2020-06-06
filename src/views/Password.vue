<template>
	<div class="password">
		<div class="password-head-nav clearfix">
			<div class="head-nav-left" @click="back">
				<i>
					<img src="../assets/Arrow-1.png"  class="auto-img" alt="">
				</i>
				<span>返回</span>
			</div>
			<div class="head-nav-mid">忘记密码</div>
		 
		</div>
		<div class="password-body">
			<van-form @submit="commit">
			  <van-field
			    v-model="userInfo.phone"
			    name="手机号"
			    label="手机号"
			    placeholder="请输入手机号"
			   
			  />
			  <van-field
			    v-model="userInfo.password"
			    type="text"
			    name="新密码"
			    label="新密码"
			    placeholder="密码(6-16个字符)"
			   
			  />
			  <div style="margin: 16px;">
			    <van-button round block type="info" native-type="submit">
			      提交
			    </van-button>
			  </div>
			</van-form>
		</div>
	</div>
</template>

<script>
	//导入表单验证模块
	import {valid} from '../utils/valid'
	//导入公共方法模块
	import {utils} from '../utils/utils'
	export default {
		name:'Password',
		data(){
			return {
				userInfo:{
					phone:'',
					password:''
				}
			}
		},
		methods:{
			//返回上一级
				back(){
					this.$router.go(-1);
				},
				
				commit(){
					if(valid.validForm(this.userInfo, this)){
						
						
						//加载提示
						this.$toast.loading({
						  forbidClick: true,
						  duration: 0,
						  message: "加载中..."
						});
						
						//发起请求
						this.axios({
							method: 'POST',
							url:'/retrievePassword',
							data: {
								appkey: this.appkey,
								phone: this.userInfo.phone,
								password: this.userInfo.password
							},
							transformRequest:utils.transformData
							
						}).then(result => {
							
							if(result.data.code == 'L001'){
								
								this.$router.push({name: "Login"})
							}
							this.$toast.clear();
							this.$toast(result.data.msg)
						}).catch( err => {
							this.$toast.clear();
						})
						
					}
						
				}
			}
	}
	
</script>

<style lang="less" scoped>
	
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
		margin-top: 20px;
	}
	/deep/ .van-form{
		margin-top: 10px;
	}
	.password-body{
		height: calc(100vh - 50px - 20px);
		margin-top: 50px;
		background:#e9dfd6 ;
		padding: 10px;
	}
	.password-head-nav{
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
