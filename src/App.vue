<template>
    <div id="app">
        <router-view v-if="isRouterAlive" />
        <div class="pop"></div>
    </div>
</template>

<script>
export default{
	name:"App",
	data(){
		return{
			isRouterAlive:true,
		}
	},
	provide(){	//全局设置provide
		return{
			reload:this.reload,
		}
	},
	methods:{
		//刷新页面
		reload(){
			this.isRouterAlive=false;
			this.$nextTick(function(){
				this.isRouterAlive=true;
			})
		}
	}
}
</script>

<style lang="less">
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100vw;
    height: 100vh;
    background-image: url("../public/bj.jpeg");
    background-size: 100% 100%;
    position: relative;
    font-family: 'Medium';
	overflow: hidden;
    .pop {
        width: 100vw;
        height: 100vh;
        position: absolute;
        left: 0;
        top: 0;
        background-color: rgba(0, 0, 0, 0.4);
    }
}
.elFormItem .el-form-item__label{
	color: #ffffff;
}
.el-table__column-filter-trigger .el-icon-arrow-down{
	color: #ffffff;
}
</style>
