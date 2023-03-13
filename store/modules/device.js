import {addDevice,deleteDevice,deleteRealtimeDevice,getLocationList,getOnlineDevice,getRealtimeDevice,getRealtimeDeviceBySensor,getTotalDevice} from "@/api/device";
import {deleteAlarmById} from "@/api/alarm";
import {deletePointById} from "@/api/coordinates";
import {deleteSensorById} from "@/api/sensor";
import {handleTime} from "@/utils/handleTime";

export default{
	namespaced:true,
	state:{
		deviceList:[],
	},
	actions:{
        //添加设备
        async addDevice(context,deviceInfo){
            const result=await addDevice(deviceInfo);
            if(result.code===200) return Promise.resolve(result);
            else return Promise.reject(result);
        },
        //删除设备
        async deleteDevice(context,id){
            let result=await deletePointById(id);
            let result1=await deleteSensorById(id);
            let result2=await deleteRealtimeDevice(id);
            let result3=await deleteAlarmById(id);
            if(result.code===200 && result1.code===200 && result2.code===200 && result3.code===200){
                let result4=await deleteDevice(id);
                if(result4.code===200) return Promise.resolve(result4);
                else return Promise.reject(result4);
            }else return Promise.reject({
                code:400,
                msg:"删除位号或坐标或实时数据或报警信息失败"
            });
        },
        //获取所有设备列表
		async getDeviceList({commit}){
			const result=await getRealtimeDevice();
			if(result.code===200){
				const data=result.data;
                data.forEach(item=>{
                    item.time=handleTime(item.time);
                });
				commit("GET_DEVICE_LIST",data);
                return Promise.resolve(data);
			}else return Promise.reject(result);
		},
        //获取所有设备位置信息
        async getLocationList({commit}){
            const result=await getLocationList();
            if(result.code===200){
                const data=result.data;
                return Promise.resolve(data);
            }
        },
        //获取全部在线设备数量
        async getOnlineDevice(){
            const result=await getOnlineDevice();
            if(result.code===200){
                const data=result.data;
                return Promise.resolve(data);
            }else return Promise.reject(result);
        },
        //通过位号获取实时设备列表
        async getRealtimeDeviceBySensor(context,positionId){
            const result=await getRealtimeDeviceBySensor(positionId);
            if(result.code===200){
                const data=result.data;
                return Promise.resolve(data);
            }else return Promise.reject(result);
        },
        //获取全部设备数量
        async getTotalDevice(){
            const result=await getTotalDevice();
            if(result.code===200){
                const data=result.data;
                return Promise.resolve(data);
            }else return Promise.reject(result);
        }
	},
	mutations:{
		GET_DEVICE_LIST(state,deviceList){
			state.deviceList=deviceList;
		},
	}
}
