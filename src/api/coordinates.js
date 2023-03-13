import request from "@/utils/request";

//给区域添加传感器坐标
function addPoint(id,position,rateX,rateY){
	return new Promise((resolve,reject)=>{
		request.post('/coordinates/addPoint',{id,position,rateX,rateY}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}
//移除坐标
function deletePoint(id){
	return new Promise((resolve,reject)=>{
		request.delete("/coordinates/deletePoint",{data:{id}}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}
//通过id删除区域坐标点
function deletePointById(id){
	return new Promise((resolve,reject)=>{
		request.delete("/coordinates/deletePointById",{data:{id}}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}
//获取当前区域所有传感器坐标
function getPointByArea(area){
	return new Promise((resolve,reject)=>{
		request.get('/coordinates/getPointByArea',{params:{area}}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}


export {addPoint,deletePoint,deletePointById,getPointByArea};