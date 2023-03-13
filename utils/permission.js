//查看当前路由有无权限访问
export function hasPermission(route,permissionList){
	if(route.meta && route.meta.permission){
		return permissionList.includes(route.meta.permission);
	}else{
		return true;
	}
}

//动态筛选路由
export const filterAsyncRoutes=(routes,permissionList)=>{
	const res=[];
	routes.forEach(route=>{
		const tmp={...route};
		if(hasPermission(tmp,permissionList)){
			if(tmp.children){
				tmp.children=filterAsyncRoutes(tmp.children,permissionList);
			}
			res.push(tmp);
		}
	});
	return res;
}