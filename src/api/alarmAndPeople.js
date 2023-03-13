import request from "@/utils/request";

//删除报警表中数据
function deletePeopleAlarm(id){
    return new Promise((resolve,reject)=>{
        request.delete("/alarmAndPeople/deletePeopleAlarm",{data:{id}}).then(
            res=>{resolve(res);},
            err=>{reject(err);}
        );
    });
}

//获取报警与人员信息
function getAlarmAndPeople(){
    return new Promise((resolve,reject)=>{
        request.get("/alarmAndPeople/alarmAndPeople").then(
            res=>{resolve(res);},
            err=>{reject(err);}
        );
    });
}

//获取报警人员信息
function getPeopleAlarm(){
    return new Promise((resolve,reject)=>{
        request.get("/alarmAndPeople/peopleAlarm").then(
            res=>{resolve(res);},
            err=>{reject(err);}
        );
    });
}

export {deletePeopleAlarm,getAlarmAndPeople,getPeopleAlarm};