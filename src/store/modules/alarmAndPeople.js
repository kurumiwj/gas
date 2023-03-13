import {deletePeopleAlarm,getAlarmAndPeople,getPeopleAlarm} from "@/api/alarmAndPeople";
import {getAllDeviceId} from "@/api/device";

export default{
    namespaced:true,
    state:{
        alarmAndPeopleList:[],
        peopleAlarmList:[]
    },
    actions:{
        //删除报警信息
        async deletePeopleAlarm({commit},id){
            const result=await deletePeopleAlarm(id);
            if(result.code===200){
                const data=result.data;
                return Promise.resolve(data);
            }else return Promise.reject(result);
        },
        //获取报警与人员信息
        async getAlarmAndPeopleList({commit}){
            const result=await getAlarmAndPeople();
            if(result.code===200){
                const data=result.data;
                commit("GET_ALARMANDPEOPLE_LIST",data);
            }
        },
        //获取报警人员信息
        async getPeopleAlarm({commit}){
            const result=await getPeopleAlarm();
            if(result.code===200){
                const data=result.data;
                commit("GET_PEOPLEALARM_LIST",data);
                return Promise.resolve(data);
            }else return Promise.reject(result);
        }
    },
    mutations:{
        GET_ALARMANDPEOPLE_LIST(state,alarmAndPeopleList){
            state.alarmAndPeopleList=alarmAndPeopleList;
        },
        GET_PEOPLEALARM_LIST(state,peopleAlarmList){
            state.peopleAlarmList=peopleAlarmList;
        }
    }
}