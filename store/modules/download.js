import {getAllSensor,getPositionIdList} from "@/api/sensor";

export default {
	namespaced:true,
	state:{
		sensorList:[],
	},
	actions:{
        //获取所有位号信息
        async getPositionIdList(){
            const result=await getPositionIdList();
            if(result.code===200){
                const data=result.data;
                return Promise.resolve(data);
            }else return Promise.reject(result);
        },
		async getSensorList({commit}){
			const result=await getAllSensor();
			if(result.code===200){
				const data=result.data;
				commit("GET_SENSOR_LIST",data);
			}
		}
	},
	mutations:{
		GET_SENSOR_LIST(state,sensorList){
			state.sensorList=sensorList;
		}
	}
}