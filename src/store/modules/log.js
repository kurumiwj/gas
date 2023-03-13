import {getLog} from "@/api/log";
import {handleTime} from "@/utils/handleTime";

export default {
	namespaced:true,
	state:{
		logList:[],
	},
	actions:{
		async getLogList({commit}){
			const result=await getLog();
			if(result.code===200){
				const data=result.data;
				data.forEach(log=>{
					log.time=handleTime(log.time);
				});
				commit("GET_LOG_LIST",data);
			}
		}
	},
	mutations:{
		GET_LOG_LIST(state,logList){
			state.logList=logList;
		}
	}
}
