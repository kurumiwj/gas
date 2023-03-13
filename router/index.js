import Vue from 'vue';
import Router from 'vue-router';
import {constantRoutes,asyncRoutes} from "./routes";

Vue.use(Router);

const originPush = Router.prototype.push;
const originReplace=Router.prototype.replace;

//重写push方法
Router.prototype.push = function(location,resolve,reject){
	if(resolve&&reject){
		originPush.call(this,location,resolve,reject);
	}else{
		originPush.call(this,location,()=>{},()=>{});
	}
}

//重写replace方法
Router.prototype.replace=function(location,resolve,reject){
	if(resolve&&reject){
		originReplace.call(this,location,resolve,reject);
	}else{
		originReplace.call(this,location,()=>{},()=>{});
	}
}

const createRouter =()=>new Router({
	mode:"history",
	routes:constantRoutes,
	scrollBehavior(to,from,savedPosition){
		return {y:0};
	}
});

const router=createRouter();

//重置路由
export function resetRouter(){
	const newRouter=createRouter();
	router.matcher=newRouter.matcher;
}

export default router;