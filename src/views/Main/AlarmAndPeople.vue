<template>
    <div class="alarmAndPeople">
        <el-table
            border
            height="700"
            style="width:100%"
            :data="alarmAndPeopleList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        >
            <el-table-column
                type="index"
                label="序号"
                align="center"
                width="80"
            ></el-table-column>
            <el-table-column
                label="位号"
                prop="position_id"
                align="center"
                width="150"
            ></el-table-column>
            <el-table-column
                prop="area"
                label="区域"
                align="center"
            ></el-table-column>
            <el-table-column
                label="安装位置"
                prop="location"
                allign="center"
                width="400"
            ></el-table-column>
            <el-table-column
                label="一级报警状态"
                align="center"
                width="110"
            >
                <template v-slot="scope">
                    <div
                        v-if="scope.row.is_online"
                        :class="`safe ${isAlarm(scope.row,1) ? 'alarm1' : ''}`"
                    ></div>
                    <div v-else style="textAlign:center">---</div>
                </template>
            </el-table-column>
            <el-table-column
                label="二级报警状态"
                align="center"
                width="110"
            >
                <template v-slot="{row}">
                    <div
                        v-if="row.is_online"
                        :class="`safe ${isAlarm(row,2) ? 'alarm2' : ''}`"
                    ></div>
                    <div v-else style="textAlign:center">---</div>
                </template>
            </el-table-column>
            <el-table-column
                label="人员"
                align="center"
                width="110"
            >
                <template v-slot="{row}">
                    <div v-if="row.is_online!=0" :class="getPeopleStatus(row)"></div>
                    <div v-else>---</div>
                </template>
            </el-table-column>
            <el-table-column
                label="查询人员变化"
                align="center"
                width="150"
            >
                <template v-slot="{row}">
                    <el-button
                        @click="handleClick(row)"
                        type="text"
                        size="small"
                    >跳转</el-button>
                </template>
            </el-table-column>
        </el-table>
        <Footer
            :handleSizeChange="handleSizeChange"
            :handleCurrentChange="handleCurrentChange"
            :currentPage="currentPage"
            :pageSize="pageSize"
            :total="alarmAndPeopleList.length"
        ></Footer>
    </div>
</template>

<script>
import {mapState,mapActions} from "vuex";
import {getPeopleLastTime} from "@/api/alarmAndPeople";
import {isAlarm,ppmToMgm3,ppmToV,unitChange} from "@/utils/unitChange";
import Footer from "./components/Footer";
import {handleTime} from "@/utils/handleTime";
export default{
    name:"AlarmAndPeople",
    components:{
        Footer
    },
    data(){
        return {
            currentPage:1,
            isActive:false,
            lastTime:"",
            pageSize:10,
            peopleStatus:{
                safe:true,
                alarm1:false,
                alarm2:false
            },
        }
    },
    computed:{
        ...mapState("alarmAndPeople",["alarmAndPeopleList","peopleAlarmList"]),
        getPeopleStatus(){
            return row=>{
                let style="safe";
                //如果报警表中存在该设备则一定报红灯
                for(let item of this.peopleAlarmList){
                    if(item.device_id===row.id){
                        style+=" alarm2";
                        return style;
                    }
                }
                //附近有人则判断间隔，没人返回safe
                if(row.people){
                    //若该设备附近有人但没有呆到2分钟则报黄灯
                    let interval=+new Date()-(+new Date(row.lastTime));
                    if(interval<120000){
                        style+=" alarm1";
                    }
                }
                return style;
            }
        }
    },
    methods:{
        ...mapActions("alarmAndPeople",["deletePeopleAlarm"]),
        handleClick(row){
            this.deletePeopleAlarm(row.id);
            this.$route.params.positionId=row.position_id;
            this.$router.push(`/main/people?id=${row.id}&position_id=${row.position_id}&location=${row.location}`);
        },
        handleCurrentChange(value){
            this.currentPage=value;
        },
        handleSizeChange(value){
            this.currentPage=1;
            this.pageSize=value;
        },
        isAlarm(row,level){
            let gas={
                gasName:row.gas_name,
                data:row.data,
                unit:row.unit,
                scope:row.scope,
                atmosphere:row.atmosphere,
                temperature:row.temperature,
                molecularWeight:row.molecular_weight
            };
            if(level===1){
                gas.alarm=row.first_alarm;
            }else gas.alarm=row.second_alarm;
            return isAlarm(gas);
        }
    },
    mounted(){
        this.$store.dispatch("alarmAndPeople/getAlarmAndPeopleList");
        this.$store.dispatch("alarmAndPeople/getPeopleAlarm");
    }
}
</script>

<style lang="less" scoped>
/*最外层透明*/
/deep/ .el-table, /deep/ .el-table__expanded-cell{
  background-color: transparent;
}
/* 表格内背景颜色 */
/deep/ .el-table th,
/deep/ .el-table tr,
/deep/ .el-table td {
  background-color: transparent;
  color: #fff;
}
/deep/.el-table tbody tr:hover>td {
    background-color: rgba(156, 158, 158, 0.575) !important;
}
/deep/.el-table td, .el-table th.is-leaf,.el-table--border, .el-table--group{
  border-color: #00E1E5; 
}
/deep/.el-table--border::after, .el-table--group::after, .el-table::before{
  background-color: #00E1E5;
}
// 头部的下边框
/deep/.el-table--border th,
.el-table--border th.gutter:last-of-type {
  border-bottom: 1px solid #00E1E5 !important;
  border-right: 1px solid #00E1E5 !important;
}
</style>
<style lang="less" scoped>
.alarmAndPeople{
    width: 100%;
    height: 100%;
    .safe{
        width: 15px;
        height: 15px;
        border-radius:50%;
        background-color: #25FF1D;
        position:absolute;
        left:50%;
        bottom:45%;
        transform:translate(-50%,50%);
    }
    .alarm1{
        background-color: #FFFF00;
    }
    .alarm2{
        background-color: #FF1D1D;
    }
}
</style>