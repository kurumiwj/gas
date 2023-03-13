import request from "@/utils/request";

// 确认警报
function confirmAlarm(id,positionId) {
    return new Promise((resolve, reject) => {
        request.put("/alarm/alarm", {id,positionId}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
    });
}
//通过设备id删除报警信息
function deleteAlarmById(id){
    return new Promise((resolve,reject)=>{
        request.delete("/alarm/deleteAlarmById",{data:{id}}).then(
            res=>{resolve(res);},
            err=>{reject(err);}
        );
    });
}
//通过位号删除报警信息
function deleteAlarmByPositionId(positionId){
    return new Promise((resolve,reject)=>{
        request.delete("/alarm/deleteAlarmByPositionId",{data:{positionId}}).then(
            res=>{resolve(res);},
            err=>{reject(err);}
        );
    });
}
//获取报警信息
function getAlarm(){
	return new Promise((resolve,reject)=>{
		request.get("/alarm/alarm").then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}

export {confirmAlarm,deleteAlarmById,deleteAlarmByPositionId,getAlarm};