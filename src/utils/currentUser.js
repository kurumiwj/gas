export function getCurrentUser(){
	return JSON.parse(localStorage.getItem("gas_user"));
}

export function setCurrentUser(user){
	localStorage.setItem("gas_user",JSON.stringify(user));
}

export function removeCurrentUser(){
	localStorage.removeItem("gas_user");
}