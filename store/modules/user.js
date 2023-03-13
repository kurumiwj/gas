import {getToken,setToken,removeToken} from "@/utils/auth";
import {getInfo,getUsers,login,logout} from "@/api/user";
import {handleTime} from "@/utils/handleTime";
import router from "@/router";
import {resetRouter} from "@/router";
import {constantRoutes,asyncRoutes} from "@/router/routes";
import {filterAsyncRoutes} from "@/utils/permission";

//对后台接收的权限进行格式化处理
const formatPermission=permission=>{
	return permission.split(",").map(item=>Number(item));
}

export default{
	namespaced:true,
	state:{
		allRoutes:constantRoutes,
		name:"",
		navList:[],
		newAsyncRoutes:[],
		permission:[],
		token:getToken(),
		userList:[],
	},
	actions:{
		async getUserList({commit}){
			const result=await getUsers();
			if(result.code===200){
				const data=result.data;
				data.forEach(user=>{
					user.time=handleTime(user.time);
				});
				commit("GET_USER_LIST",data);
			}
		},
		async getInfo({commit,state}){
			let result=await getInfo(state.token);
			if(result.code===200){
				const {data}=result;
				if(data.length===0){
					return Promise.reject("验证失败，请重新登录！");
				}
				data[0].permission=formatPermission(data[0].permission);
				commit("SET_USERINFO",data[0]);
				commit("SET_ROUTES",filterAsyncRoutes(asyncRoutes,data[0].permission));
				return Promise.resolve(data[0]);
			}else{
				return Promise.reject(new Error("获取用户信息失败！"));
			}
		},
		async getNavList({commit,state}){
			let result=await getInfo(state.token);
			if(result.code===200){
				commit("SET_NAVLIST",result.navList);
			}
		},
		async login({commit},userInfo){
			const {name,password}=userInfo;
			let result=await login(name.trim(),password);
			if(result.code===200){
				commit("SET_TOKEN",result.token);
				//设置cookies的token
				setToken(result.token);
				return Promise.resolve(result.data);
			}else{
				return Promise.reject(new Error("登录失败！"));
			}
		},
		async logout({dispatch}){
			let result=await logout();
		},
		async resetToken({commit}){
			return new Promise(resolve=>{
				commit("SET_TOKEN","");
				removeToken();
				//重置路由
				resetRouter();
				resolve("ok");
			});
		}
	},
	mutations:{
		GET_USER_LIST(state,userList){
			state.userList=userList;
		},
		SET_NAVLIST(state,navList){
			state.navList=navList;
		},
		SET_ROUTES(state,asyncRoutes){
			state.asyncRoutes=asyncRoutes;
			state.allRoutes=state.allRoutes.concat(asyncRoutes);
			router.addRoutes(state.asyncRoutes);
		},
		SET_TOKEN(state,token){
			state.token=token;
		},
		SET_USERINFO(state,userInfo){
			state.name=userInfo.name;
			state.permission=userInfo.permission;
		}
	}
}
