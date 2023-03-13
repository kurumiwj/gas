import request from "@/utils/request";

//添加日志信息
function addLog(user,content){
	return new Promise((resolve,reject)=>{
		request.post("/log/log",{user,content}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}
//查询操作日志
function getLog() {
    return new Promise((resolve, reject) => {
        request.get("/log/log").then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
    });
}

export {addLog,getLog};