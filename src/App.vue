<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style lang="less">
	*{
		margin: 0;
		padding: 0;
		list-style: none;
	}
	
	.fr{
		float: right;
	}
	
	.fl{
		float: left;
	}
	
	.auto-img{
		display: block;
		width: 100%;
	}
	
	.clearfix::after{
		content: "";
		display: block;
		clear: both;
	}

</style>
