import request from "@/utils/request";

//区域api
//增加区域
function addArea(area,img){
	return new Promise((resolve,reject)=>{
		request.post('/area/area',{area,img}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}
//删除指定区域
function deleteArea(areaId){
	return new Promise((resolve,reject)=>{
		request.delete("/area/deleteArea",{data:{areaId}}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}
//查询指定区域
function getArea(area){
	return new Promise((resolve,reject)=>{
		request.get('/area/area',{params:{area}}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}
//获取区域名对应的id
function getAreaId(area){
    return new Promise((resolve,reject)=>{
        request.get("/area/areaId",{params:{area}}).then(
            res=>{resolve(res);},
            err=>{reject(err);}
        );
    });
}
//查询所有区域
function getAreaList(){
	return new Promise((resolve,reject)=>{
		request.get('/area/area').then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}
//更新区域信息
function updateArea(id,area,img){
	return new Promise((resolve,reject)=>{
		request.put('/area/area',{id,area,img}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}

export {addArea,getArea,getAreaId,getAreaList,deleteArea,updateArea};