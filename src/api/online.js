import request from '@/utils/request';

//修改离线间隔
function changeOffline(offline){
	return new Promise((resolve,reject)=>{
		request.put("/online/offline",{offline}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}

//修改设备联网状态
function changeOnline(idList,offline){
	return new Promise((resolve,reject)=>{
		request.put("/online/online",{idList,offline}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}

//获取离线间隔
function getOffline(){
	return new Promise((resolve,reject)=>{
		request.get("/online/offline").then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}

//获取掉线设备
function getOfflineDevice(){
	return new Promise((resolve,reject)=>{
		request.get("/online/offlineDevice").then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}

function updateNetwork(idList){
	return new Promise((resolve,reject)=>{
		request.put("/online/network",{idList}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}

export {getOfflineDevice,updateNetwork};