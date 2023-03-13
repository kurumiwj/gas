const getters={
	areaList:state=>state.area.areaList,
	deviceList:state=>state.area.deviceList,
	realtimeDeviceList:state=>state.device.realtimeDeviceList,
	sensorList:state=>state.download.sensorList,
	logList:state=>state.log.logList,
	allDeviceList:state=>state.network.allDeviceList,
	name:state=>state.user.name,
	navList:state=>state.user.navList,
	permission:state=>state.user.permission,
	token:state=>state.user.token,
	userList:state=>state.user.userList,
    alarmAndPeopleList:state=>state.alarmAndPeople.alarmAndPeopleList
};

export default getters;