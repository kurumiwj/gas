import request from '@/utils/request';

// 添加设备
function addDevice(deviceInfo){
    return new Promise((resolve, reject) => {
        request.post("/device/device", {deviceInfo}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
    });
}
// 删除设备
function deleteDevice(id) {
    return new Promise((resolve, reject) => {
        request.delete("/device/deleteDevice", {data:{id}}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
    });
}
//删除实时设备
function deleteRealtimeDevice(id){
	return new Promise((resolve,reject)=>{
		request.delete("/device/deleteRealtimeDevice",{data:{id}}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}
//获取所有设备
function getAllDevice(){
	return new Promise((resolve,reject)=>{
		request.get('/device/device').then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}
//获取所有设备
function getAllDeviceId(){
    return new Promise((resolve,reject)=>{
        request.get("/device/allDeviceId").then(
            res=>{resolve(res);},
            err=>{reject(err);}
        );
    });
}
//获取指定区域的设备id数据
function getDeviceByArea(area){
	return new Promise((resolve,reject)=>{
		request.get('/device/device',{params:{area}}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}
//获取指定id的设备信息
function getDeviceById(id){
	return new Promise((resolve,reject)=>{
		request.get('/device/device',{params:{id}}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}
//获取所有设备的位置信息
function getLocationList(){
    return new Promise((resolve,reject)=>{
        request.get("/device/locationList").then(
            res=>{resolve(res);},
            err=>{reject(err);}
        );
    });
}
//获取在线设备数量
function getOnlineDevice(){
    return new Promise((resolve,reject)=>{
        request.get("/device/onlineDevice").then(
            res=>{resolve(res);},
            err=>{reject(err);}
        );
    });
}
//获取实时设备列表
function getRealtimeDevice(){
	return new Promise((resolve,reject)=>{
		request.get("/device/realtimeDevice").then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}
//通过区域名获取实时设备列表
function getRealtimeDeviceByArea(area){
	return new Promise((resolve,reject)=>{
		request.get("/device/realtimeDevice",{params:{area}}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}
//通过区域id获取设备列表
function getRealtimeDeviceByAreaId(areaId){
    return new Promise((resolve,reject)=>{
        request.get("/device/realtimeDevice",{params:{areaId}}).then(
            res=>{resolve(res);},
            err=>{reject(err);}
        );
    });
}
//通过位号获取实时设备列表
function getRealtimeDeviceBySensor(positionId){
	return new Promise((resolve,reject)=>{
		request.get("/device/realtimeDevice",{params:{positionId}}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}
//获取中继器信息
function getReceiveport(){
	return new Promise((resolve,reject)=>{
		request.get("/device/receiveport").then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}
//获取全部设备数量
function getTotalDevice(){
    return new Promise((resolve,reject)=>{
        request.get("/device/totalDevice").then(
            res=>{resolve(res);},
            err=>{reject(err);}
        );
    });
}
//更新设备
function updateDevice(deviceInfo){
	const {id,location,areaId,sensor,temperature,atmosphere}=deviceInfo;
	const {old_position_id,position_id,gas_name,scope,unit,molecular_weight,alarmValue1,alarmValue2}=sensor;
	return new Promise((resolve,reject)=>{
		request.put("/device/device",{id,location,areaId,temperature,atmosphere,old_position_id,position_id,gas_name,scope,unit,molecular_weight,alarmValue1,alarmValue2}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}

export {addDevice,deleteDevice,deleteRealtimeDevice,getAllDevice,getAllDeviceId,getDeviceByArea,getDeviceById,getLocationList,getOnlineDevice,getRealtimeDevice,getRealtimeDeviceByArea,getRealtimeDeviceByAreaId,getRealtimeDeviceBySensor,getReceiveport,getTotalDevice,updateDevice};