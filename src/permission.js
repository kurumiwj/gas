import NProgress from "nprogress";
import "nprogress/nprogress.css";
import router from "./router";
import store from "./store";
import {Message} from "element-ui";
import {getToken} from "./utils/auth";
import {hasPermission} from "./utils/permission";

NProgress.configure({
	showSpinner:false
});

//放行白名单
const whiteList=["/login","/register"];

router.beforeEach(async (to,from,next)=>{
	NProgress.start();
	const token=getToken();
	if(token){
		if(to.path==="/login"){
			next({path:"/"});
			NProgress.done();
		}else{
			const permission=store.getters.permission;
			if(permission.length!=0){
				next();
			}else{
				try{
					await store.dispatch("user/getInfo");
					next({
						...to,
						replace:true
					});
				}catch(error){
					//移除token
					await store.dispatch("user/resetToken");
					Message.error(error || "Error!");
					next(`/login?redirect=${to.path}`);
					NProgress.done();
				}
			}
		}
	}else{
		//白名单不需要校验
		if(whiteList.indexOf(to.path)!==-1){
			next();
		}else{
			next(`/login?redirect=${to.path}`);
			NProgress.done();
		}
	}
});

router.afterEach(()=>{
	NProgress.done();
});