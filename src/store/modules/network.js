import {getLocationList,getReceiveport} from "@/api/device";
import {getCommonPositionId} from "@/api/sensor";
import {getAreaList} from "@/api/area";
import bus from "@/api/bus";
import {handleTime} from "@/utils/handleTime";

export default {
    namespaced:true,
    state:{
        allDeviceList:[],
        receiveportList:[],
    },
    actions:{
        async getAreaList({commit}){
        	const result=await getAreaList();
        	if(result.code===200){
        		const data=result.data;
        		data.forEach(area=>{
        			area.time=handleTime(area.time);
        		});
                return Promise.resolve(data);
        	}
        },
        async getDeviceList({commit}){
            const result=await getCommonPositionId();
            if(result.code===200){
                const data=result.data;
                commit("GET_DEVICE_LIST",data);
                return Promise.resolve(data);
            }
        },
        async getLocationList({commit}){
            const result=await getLocationList();
            if(result.code===200){
                const data=result.data;
                return Promise.resolve(data);
            }
        },
        async getReceiveportList({commit}){
            const result=await getReceiveport();
            if(result.code===200){
                const data=result.data;
                commit("GET_RECEIVEPORT_LIST",data);
                return Promise.resolve(data);
            }
        }
    },
    mutations:{
        GET_DEVICE_LIST(state,allDeviceList){
            state.allDeviceList=allDeviceList;
        },
        GET_RECEIVEPORT_LIST(state,receiveportList){
            state.receiveportList=receiveportList;
        }
    }
}
