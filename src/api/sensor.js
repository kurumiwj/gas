import request from "@/utils/request";

//通过设备id删除位号
function deleteSensorById(id){
    return new Promise((resolve,reject)=>{
        request.delete("/sensor/deleteSensorById",{data:{id}}).then(
            res=>{resolve(res);},
            err=>{reject(err);}
        );
    });
}
//获取所有报警的传感器
function getAlarmSensor(){
	return new Promise((resolve,reject)=>{
		request.get("/sensor/alarmSensor").then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}
//获取全部传感器
function getAllSensor(){
	return new Promise((resolve,reject)=>{
		request.get("/sensor/sensor").then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}
//获取位号公共前缀，以-结尾
function getCommonPositionId(){
    return new Promise((resolve,reject)=>{
        request.get("/sensor/commonPositionId").then(
            res=>{resolve(res);},
            err=>{reject(err);}
        );
    });
}
//获取指定id对应的传感器
function getPositionId(id){
	return new Promise((resolve,reject)=>{
		request.get("/sensor/sensor",{params:{id}}).then(
			res=>{resolve(res);},
			err=>{reject(err)}
		);
	});
}
//获取全部位号信息
function getPositionIdList(){
    return new Promise((resolve,reject)=>{
        request.get("/sensor/positionIdList").then(
            res=>{resolve(res);},
            err=>{reject(err);}
        );
    });
}
//获取指定设备的信息
function getSensor(id){
	return new Promise((resolve,reject)=>{
		request.get("/sensor/sensor",{params:{id}}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}
//通过区域获取设备位号
function getSensorByArea(area){
	return new Promise((resolve,reject)=>{
		request.get("/sensor/sensor",{params:{area}}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}
//通过位号获取传感器信息
function getSensorByPositionId(positionId){
	return new Promise((resolve,reject)=>{
		request.get("/sensor/sensor",{params:{positionId}}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}
//获取指定位号传感器的信息
function getSingleSensor(id,position_id){
	return new Promise((resolve,reject)=>{
		request.get("/sensor/sensor",{params:{id,position_id}}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}
//更新传感器警报信息
function updateAlarmSensor(id,position_id,alarm){
	return new Promise((resolve,reject)=>{
		request.put("/sensor/alarmSensor",{id,position_id,alarm}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}

export {deleteSensorById,getAlarmSensor,getAllSensor,getCommonPositionId,getPositionId,getPositionIdList,getSensor,getSensorByArea,getSensorByPositionId,getSingleSensor,updateAlarmSensor};