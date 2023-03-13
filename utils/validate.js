import request from "@/utils/request";

//校验规则
//校验设备ID
function validateDeviceId(id){
	return new Promise((resolve,reject)=>{
		request.get("/validate/validate",{params:{id}}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}
//校验用户名
function validateUserName(userName){
	return new Promise((resolve,reject)=>{
		request.get("/validate/validate",{params:{userName}}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}


//用户校验
//用户名重复校验
function isValidDuplicateUserName(rules,value,callback){
	if(value!==""){
		validateUserName(value).then(res=>{
			if(res.code!==200){
				callback(new Error("用户名已存在！"));
			}
			callback();
		})
	}
}
//用户名校验
function isValidUserName(rules,value,callback){
	const reg=/[\w]{2,15}/;
	if(value!==""){
		if(!reg.test(value.trim())){
			callback(new Error("用户名不合法！"));
		}
		callback();
	}else{
		callback(new Error("用户名不能为空！"));
	}
}
//密码校验
function isValidPassword(rule,value,callback){
	const reg=/^(([a-zA-Z0-9]){6,18})$/;	//校验密码规则
	if(value=="" || value==undefined || value==null){
		callback(new Error("密码不能为空！"));
	}else{
		if(value!="" && (!reg.test(value))){
			callback(new Error("密码不合法！"));
		}
	}
	callback();
}
//权限校验
function isValidPermission(rule,value,callback){
	const reg=/^((1[0-3])|[1-9])(,((1[0-3])|[1-9]))*$/;	//校验权限规则
	if(value=="" || value==undefined || value==null){
		callback(new Error("权限不能为空！"));
	}else{
		if(value!="" && (!reg.test(value))){
			callback(new Error("请输入正确的权限格式！"));
		}
	}
	callback();
}
//电话校验
function isValidPhone(rule,value,callback){
	const reg=/^((0\d{2,3}-\d{7,8})|(1[345789]\d{9}))$/;	//校验电话和手机号规则
	if(value=="" || value==undefined || value==null){
		callback(new Error("手机号或者电话号码不能为空！"));
	}else{
		if(value!="" && (!reg.test(value))){
			callback(new Error("请输入正确的电话号码或者电话号码！"));
		}
	}
	callback();
}

//设备校验
//设备id校验
function isValidDeviceId(rule,value,callback){
	const reg=/^(00([0-9a-z]{2}))(00([0-9a-z]{2}))$/;	//校验id规则
	if(value=="" || value==undefined || value==null){
		callback(new Error("设备id不能为空！"));
	}else{
		if(value!="" && (!reg.test(value))){
			callback(new Error("请输入正确的设备id格式！"));
		}else{
			validateDeviceId(value).then(res=>{
				if(res.code!==200)
					callback(new Error("设备id已存在！"));
				callback();
			});
		}
	}
}
//位号校验
function isValidSensor(rule,value,callback){
    //若位号中不存在-则不允许创建或者修改
    if(value.indexOf("-")==-1){
        callback(new Error("位号中必须含有-"));
    }else{
        callback();
    }
}
//温度校验
function isValidTemperature(rule,value,callback){
	if(Number(value)>0 && Number(value)<1000){	//校验温度规则
		callback();
	}else{
		callback(new Error("输入温度在0~1000之间"));
	}
}
//压强校验
function isValidAtmosphere(rule,value,callback){
	if(Number(value)>0&&Number(value)<1000){	//校验压强规则
		callback();
	}else{
		callback(new Error("输入压强在0~1000之间"));
	}
}

//传感器校验
//分子量校验
function isValidMolecularWeight(rule,value,callback){
	if(Number(value)>0 && Number(value)<1000){	//校验分子量规则
		callback();
	}else{
		callback(new Error("输入分子量在0~1000之间"));
	}
}
//单位校验
function isValidUnit(rule,value,callback){
	if(value==="mg/m3" || value==="ppm" || value==="%"){
		callback();
	}else{
		callback(new Error("单位必须为'mg/m3','ppm','%'中的一种"));
	}
}
//报警阈值校验
function isValidAlarmValue(rule,value,callback){
	if(Number(value)>0 && Number(value)<100){
		callback();
	}else{
		callback(new Error("报警阈值在0~100之间"));
	}
}

function isExternal(path){
	return /^(https?:|mailto:|tel:)/.test(path);
}

export {isExternal,isValidAlarmValue,isValidAtmosphere,isValidDeviceId,isValidDuplicateUserName,isValidMolecularWeight,isValidPassword,isValidPermission,isValidPhone,isValidSensor,isValidTemperature,isValidUnit,isValidUserName};