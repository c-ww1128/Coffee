<template>
	<div class="sign">
		
	</div>
</template>

<script>
	import {utils} from '../utils/utils.js'
	export default{
		name:"Sign",
		
		created(){
			this.SignOut();
			
			//获取dom改变颜色
			this.$nextTick(() => {

				document.querySelector(".van-dialog").style.background = "#f9f0f0"
				document.querySelector(".van-button").style.background = "#f9f0f0"
				document.querySelector(".van-hairline--left").style.background = "#f9f0f0"
				document.querySelector(".van-hairline--left").style.color = "#b5a79e"
				document.querySelector(".van-dialog__message").style.fontSize = "16px"
				document.querySelector(".van-dialog__message").style.color = "#a73535"
			})
			
		},
		
		methods:{
			
			SignOut(){
				
				this.$dialog.confirm({
					
				  message: '是否确认退出登录！！！！！',
				}).then( a => {
					//获取token字符串
					let tokenString = utils.getToken(this);
					
					this.axios({
						method:'POST',
						url:"/logout",
						data:{
							appkey:this.appkey,
							tokenString
						},
						transformRequest:utils.transformData
					}).then( result => {
						if(result.data.code == "F001"){
							
							//跳转登录界面
							this.$router.push({name:'Login'})
							
						}else{
							//跳转登录界面
							this.$router.push({name:'My'})
						}
					}).catch(err => {
						
					})
				}).catch(b => {
					//跳转登录界面
					this.$router.push({name:'My'})
				})
			}
			
		}
	}
</script>

<style lang="less" scoped>
	/deep/ .van-dialog__message{
		font-size: 16px;
	}
</style>
