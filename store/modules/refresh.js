import {changeRefreshInterval,getRefreshInterval} from "@/api/refresh";

export default{
    namespaced:true,
    state:{},
    actions:{
        async changeInterval({dispatch},interval){
            const data=await dispatch("getInterval");
            if(data.length>0){
                let result=await changeRefreshInterval(interval);
                if(result.code===200)
                    return Promise.resolve(result);
                else return Promise.reject(result);
            }else{
                return Promise.reject({
                    code:401,
                    type:"error",
                    msg:"不存在刷新间隔，更新失败！"
                });
            }
        },
        async getInterval(){
            const result=await getRefreshInterval();
            if(result.code===200){
                const data=result.data;
                return Promise.resolve(data);
            }else return Promise.reject(result);
        }
    },
    mutations:{}
}