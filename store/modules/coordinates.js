import {addPoint,deletePoint,deletePointById,getPointByArea} from "@/api/coordinates";

export default{
    namespaced:true,
    states:{},
    actions:{
        async addPoint(context,{id,position,rateX,rateY}){
            const result=await addPoint(id,position,rateX,rateY);
            if(result.code===200){
                return Promise.resolve(result);
            }else return Promise.reject(result);
        },
        async deleteAllPoints(context,area){
            getPointByArea(area).then(res=>{
            	const data=res.data;
                for(let item of data){
                    deletePointById(item.id);
                }
                return Promise.resolve({
                    code:200,
                    msg:"删除全部坐标成功！"
                });
            }).catch(err=>{
                return Promise.reject({
                    code:400,
                    msg:"删除全部坐标失败！"
                });
            });
        },
        async deletePoint(context,id){
            const result=await deletePoint(id);
            if(result.code===200){
                return Promise.resolve(result);
            }else return Promise.reject(result);
        },
        async getPointByArea({commit},area){
            const result=await getPointByArea(area);
            if(result.code===200){
                const data=result.data;
                return Promise.resolve(data);
            }else return Promise.reject(result);
        }
    },
    mutations:{}
}