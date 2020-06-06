<template>
	<div class="main">
		
		<!-- 二级路由插座 -->
		<router-view></router-view>
		
	
			<van-tabbar
			v-model="tabbarName"
			active-color="#fff"
			inactive-color="#c1aea8"
			@change = "ischange"
			>
			<van-tabbar-item 
			v-for="(item , index) in tardarData" 
			:key="index" :name="item.name" 
			:to="item.name"
			:icon="item.icon" >{{item.text}}</van-tabbar-item>
			 
			</van-tabbar>
		
		
		
	</div>
</template>

<script>
	export default{
		name:'Main',
		
		data(){
			return {
				tabbarName: 'menu',
			}
		},
		
		created(){
			
			
			this.tabbarName = this.mianIsLoaded
			
			
		},
		computed:{
			
			mianIsLoaded(){
				return this.$store.state.mianIsLoaded
			},
			
			tardarData(){
				
				return this.$store.state.mainModule.tardarData;
			}
		},
		
		methods:{
			//跳转路由
			gopage(item){
				
				this.$router.push({name: item.routeName})
			},
			
			ischange(active){
				
				this.$store.commit("changeData" , {key: "mianIsLoaded" , value:active })
				
			}
		}
	}
</script>

<style lang="less" scoped>
	.van-hairline--top-bottom {
		transform: translateZ(0);
		background-image:linear-gradient(#3c120b, #882225 );
	}
	
	
</style>
