import axios from "axios";
// import nprogress from "nprogress";
import store from "@/store";
import {getToken} from "@/utils/auth";
import {MessageBox,Message} from "element-ui";
// import "nprogress/nprogress.css";

const request=axios.create({
	baseURL:process.env.VUE_APP_BASE_API,
	timeout:5000
});

request.defaults.retry=4;
request.defaults.retryDelay=1000;

request.interceptors.request.use(
	config=>{
		if(store.getters.token){
			config.headers["Authorization"]=getToken();
		}
		return config;
	},
	error=>{
		console.log(error);
		return Promise.reject(error);
	}
);

request.interceptors.response.use(
	response=>{
		const res=response.data;
		if(res.code!==200){
			if(res.code===405){
				store.dispatch("user/resetToken").then(()=>{
					location.reload();
				});
			}else{
				Message({
					message:res.message || "Error",
					type:"error",
					duration:5*1000
				});
			}
			return Promise.reject(new Error(res.message || "Error"));
		}else{
			return res;
		}
	},
	error=>{
		console.log("Error:"+error);
		Message({
			message:error.message,
			type:"error",
			duration:5*1000
		});
		return Promise.reject(error);
	}
);

export default request;