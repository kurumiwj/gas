import request from "@/utils/request";

//下载
function download(positionId,start,end){
	return new Promise((resolve,reject)=>{
		request.get("/history/download",{params:{positionId,start,end}}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}
//历史信息
// 查询历史记录
function getHistory(id,total) {
    return new Promise((resolve, reject) => {
        request.get("/history/history", {params:{id,total}}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
    });
}
//获取指定id和位号的传感器历史数据
function getHistoryById(id,start,end){
	return new Promise((resolve,reject)=>{
		request.get("/history/history",{params:{id,start,end}}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}
//展示下载页面数据
function getHistoryByTime(start,end){
	return new Promise((resolve,reject)=>{
		request.get('/history/history',{params:{start,end}}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}
// 查询最新历史记录
function getNewest(id) {
    return new Promise((resolve, reject) => {
        request.get("/history/history", {params:{id,total:1}}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
    });
}

export {download,getHistory,getHistoryById,getHistoryByTime,getNewest};