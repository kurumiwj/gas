import request from '@/utils/request';

//创建用户信息
function createUser(userInfo){
	const {name,password,permission,tel}=userInfo;
	return new Promise((resolve,reject)=>{
		request.post("/user/user",{name,password,permission,tel}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}

//删除用户信息
function deleteUser(id){
	return new Promise((resolve,reject)=>{
		request.delete("/user/user",{data:{id}}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}

function getInfo(token){
	return request.get("/user/userinfo",{params:token});
}

//获取用户信息
function getUsers(){
	return new Promise((resolve,reject)=>{
		request.get("/user/user").then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}

//修改用户信息
function updateUser(userInfo){
	const {id,name,password,permission,tel}=userInfo;
	return new Promise((resolve,reject)=>{
		request.put("/user/user",{id,name,password,permission,tel}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}

//登录
function login(name, password) {
    return new Promise((resolve, reject) => {
        request.post("/login/login", {name,password}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
    });
}

//退出登录
function logout(){
	return new Promise((resolve,reject)=>{
		request.get("/login/logout").then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}

//注册用户信息
function register(userInfo){
	const {name,password,tel}=userInfo;
	const permission="1,2,3,4,5,6";
	return new Promise((resolve,reject)=>{
		request.post("/login/register",{name,password,permission,tel}).then(
			res=>{resolve(res);},
			err=>{reject(err);}
		);
	});
}

export {createUser,deleteUser,getInfo,getUsers,login,logout,register,updateUser};