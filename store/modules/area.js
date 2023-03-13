import {addArea,deleteArea,getArea,getAreaId,getAreaList,updateArea} from "@/api/area";
import {getRealtimeDevice,getRealtimeDeviceByAreaId} from "@/api/device";
import {handleTime} from "@/utils/handleTime";

export default {
	namespaced:true,
	state:{
		areaList:[],	//存放所有区域
	},
	actions:{
        //增加区域
        async addArea(context,{area,img}){
            const result=await addArea(area,img);
            if(result.code===200) return Promise.resolve(result);
            else return Promise.reject(result);
        },
        //删除指定区域
        async deleteArea({dispatch},areaId){
            const result=await getRealtimeDeviceByAreaId(areaId);
            if(result.code===200){
                const data=result.data;
                for(let i=0;i<data.length;i+=2){
                    //跨模块调用dispatch
                    await dispatch("device/deleteDevice",data[i].id,{root:true});
                }
                await deleteArea(areaId);
                return Promise.resolve({
                    code:200,
                    msg:"删除区域成功！"
                });
            }else return Promise.reject(result);
        },
        //查询指定区域
        async getArea(context,area){
            const result=await getArea(area);
            if(result.code===200){
                const data=result.data;
                return Promise.resolve(data);
            }else return Promise.reject(result);
        },
        //获取区域名对应的id
        async getAreaId(context,area){
            const result=await getAreaId(area);
            if(result.code===200){
                const data=result.data;
                return Promise.resolve(data);
            }else return Promise.reject(result);
        },
        //查询所有区域
		async getAreaList({commit}){
			const result=await getAreaList();
			if(result.code===200){
				const data=result.data;
				data.forEach(area=>{
					area.time=handleTime(area.time);
				});
				commit("GET_AREA_LIST",data);
                return Promise.resolve(data);
			}
		},
        //更新区域信息
        async updateArea(context,{id,area,img}){
            const result=await updateArea(id,area,img);
            if(result.code===200) return Promise.resolve(result);
            else return Promise.reject(result);
        }
	},
	mutations:{
		GET_AREA_LIST(state,areaList){
			state.areaList=areaList;
		}
	}
}
