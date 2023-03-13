<template>
    <div class="measure">
       	<el-button @click="clearFilter" type="primary" style="margin-bottom:1vh">清除所有筛选</el-button>
   		<span style="marginLeft:1.2vw;color:#fff" v-if="name==='admin'">刷新间隔：</span>
		<el-select
			v-model="refreshValue"
			v-if="name==='admin'"
			placeholder="刷新间隔"
		>
			<el-option
				v-for="refresh in refreshOptions"
				:key="refresh.value"
				:label="refresh.label"
				:value="refresh.value"
			>
			</el-option>
		</el-select>
        <el-button v-if="name==='admin'" @click="changeRefreshInterval" type="primary" style="marginBottom:0vh;marginLeft:1vw;">修改全局间隔</el-button>
        <el-table
           	ref="filterTable"
            :data="deviceList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            border
            style="width: 100%"
            height="700"
        >
            <el-table-column type="index" label="序号" align="center" width="80"> </el-table-column>
            <el-table-column
            	prop="position_id"
            	label="位号"
				align="center"
            	:filters="positionIdList"
            	:filter-method="filterHandler"
            	width="200"
            ></el-table-column>
            <el-table-column
            	prop="gas_name"
            	label="测量组分"
            	align="center"
            	:filters="gasList"
            	:filter-method="filterHandler"
            	width="90"
            >
            	<template v-slot="scope">
            		{{scope.row.gas_name.toUpperCase()}}
            	</template>
            </el-table-column>
            <el-table-column prop="detect_gas" label="测量值" align="center" width="80">
                <template v-slot="scope">
                    {{ getDet(scope.row) }}
                </template>
            </el-table-column>
            <el-table-column prop="unit" label="单位" align="center" width="80"></el-table-column>
            <el-table-column
            	prop="location"
            	label="安装位置"
            	align="center"
            	:filters="locationList"
            	:filter-method="filterHandler"
            >
            </el-table-column>
            <el-table-column
                prop="area"
                label="安装区域"
                align="center"
                :filters="areaList"
                :filter-method="filterHandler"
                width="200"
            >
            </el-table-column>
            <el-table-column label="一级报警状态" align="center" width="110">
                <template v-slot="scope">
                    <div v-if="scope.row.is_online" :class="`safe ${isFirstAlarm(scope.row) ? 'alarm1' : ''}`"></div>
                    <div v-else style="textAlign:center">---</div>
                </template>
            </el-table-column>
            <el-table-column label="二级报警状态" align="center" width="110">
                <template v-slot="scope">
                    <div v-if="scope.row.is_online" :class="`safe ${isSecondAlarm(scope.row) ? 'alarm2' : ''}`"></div>
                    <div v-else style="textAlign:center">---</div>
                </template>
            </el-table-column>
            
            <el-table-column  label="查询趋势" align="center" width="90">
                <template v-slot="scope">
                    <el-button
                        @click="handleClick(scope.row)"
                        type="text"
                        size="small"
					>点击</el-button>
                </template>
            </el-table-column>
        </el-table>
		<Footer
			:handleSizeChange="handleSizeChange"
			:handleCurrentChange="handleCurrentChange"
			:currentPage="currentPage"
			:pageSize="pageSize"
			:total="deviceList.length"
		></Footer>
    </div>
</template>
<script>
import Footer from "./components/Footer";
import {unitChange} from "@/utils/unitChange";
import {mapState,mapGetters,mapActions} from "vuex";
import {updateAlarmSensor} from "@/api/sensor";
export default {
	name:"Measure",
	components:{
		Footer
	},
    data() {
        return {
			areaList: [],
			currentPage:1,
			gasList:[
				{
					text:"CO",
					value:"CO"
				},
				{
					text:"H2",
					value:"H2"
				},
				{
					text:"H2S",
					value:"H2S"
				},
				{
					text:"NH3",
					value:"NH3"
				},
				{
					text:"SO2",
					value:"SO2"
				},
			],
			locationList:[],
			numList: [],
			onlineList:[
				{
					text:"在线",
					value:1
				},
				{
					text:"离线",
					value:0
				}
			],
			pageSize:10,
			positionIdList:[],
			refreshOptions:[
				{
					label:"5",
					value:5000,
				},
				{
					label:"10",
					value:10000,
				},
				{
					label:"20",
					value:20000,
				},
				{
					label:"30",
					value:30000,
				},
			],
			refreshValue:"",
			timerId:null,
        };
    },
	computed: {
		...mapState("device",["deviceList"]),
		...mapGetters(["name"]),
		getDet() {
		    return row => {
                let gas={
                    data:row.data,
                    unit:row.unit,
                    atmosphere:row.atmosphere,
                    temperature:row.temperature,
                    molecularWeight:row.molecular_weight
                }
				if(row.is_online){
					return unitChange(gas);
				}else{
					return "NA";
				}
		    };
		},
        getGas() {
            return (str) => {
                str = str.replace("[", "");
                str = str.replace("]", "");
                let _str = str.split(",");
                let list = "";
                for (let i = 0; i < _str.length; i++) {
                    list += _str[i] + " ";
                }
                return list;
            };
        },
		getStyle(row){
			return "redPulse";
		}
    },
    methods: {
        ...mapActions("refresh",["changeInterval","getInterval"]),
        changeRefreshInterval(){
            this.changeInterval(this.refreshValue/1000).then(res=>{
                this.$message({
                    type:"success",
                    message:"更新间隔成功！",
                    center:true
                });
            }).catch(err=>{
                this.$message({
                    type:"error",
                    message:"更新间隔失败！",
                    center:true
                });
            });
        },
		clear(){
			clearInterval(this.timerId);
			this.timerId=null;
		},
		//清除所有筛选
		clearFilter(){
			this.$refs.filterTable.clearFilter();
		},
		//初始化筛选选项
		clearFilterOptions(){
			this.areaList=[];
			this.locationList=[];
			this.positionIdList=[];
		},
		//筛选通用写法
		filterHandler(value,row,column){
			const property=column['property'];
			return row[property]===value;
		},
		//获取所有筛选信息
		getAllFilterInfo(){
			this.clearFilterOptions();
			let areaSet=new Set();
			let positionIdSet=new Set();
			let locationSet=new Set();
			for(let item of this.deviceList){
				areaSet.add(item.area);
				positionIdSet.add(item.position_id);
				locationSet.add(item.location);
			}
			//去重
			let tmpAreaList=[...areaSet];
			let tmpPositionIdList=[...positionIdSet];
			let tmpLocationList=[...locationSet];
			//更新筛选列表
			this.updateFilterInfo(this.areaList,tmpAreaList);
			this.updateFilterInfo(this.locationList,tmpLocationList);
			this.updateFilterInfo(this.positionIdList,tmpPositionIdList);
		},
        handleClick(e) {
            this.$bus.$emit("Chart");
            this.$router.push(
                "/main/chart/" + e.position_id
            );
        },
		handleCurrentChange(value){
			this.currentPage=value;
		},
		handleSizeChange(value){
			this.currentPage=1;
			this.pageSize=value;
		},
		async init(){
			this.$store.dispatch("device/getDeviceList");
		},
		//判断是否一级警报
		isFirstAlarm(row){
			if(row.gas_name!="H2")
				return this.getDet(row)>=row.first_alarm*0.01*row.scope/0.3;
			else return this.getDet(row)>=row.first_alarm*0.01*row.scope;
		},
		//判断是否二级警报
		isSecondAlarm(row){
			if(row.gas_name!="H2")
				return this.getDet(row)>=row.second_alarm*0.01*row.scope/0.3;
			else return this.getDet(row)>=row.second_alarm*0.01*row.scope;
		},
		refresh(){
			this.clear();
			this.init();
			this.timerId=setInterval(()=>{
				this.init();
			},this.refreshValue);
		},
		//将list转换成筛选格式
		updateFilterInfo(target,list){
			for(let item of list){
				target.push({
					text:item,
					value:item
				});
			}
		},
    },
	watch:{
		deviceList:{
			deep:true,
			handler(newValue){
				this.deviceList.forEach(item=>{
					const id=item.id;
					const position_id=item.position_id;
					if(this.isFirstAlarm(item))
						updateAlarmSensor(id,position_id,1);
				});
				this.getAllFilterInfo();
			}
		},
		refreshValue:{
			handler(newValue){
				this.refresh();
			}
		}
	},
    mounted() {
        this.getInterval().then(res=>{
            if(res.length>0)
                this.refreshValue=res[0].refresh*1000;
        });
		this.refresh();
    },
	beforeDestroy(){
		clearInterval(this.timerId);
		this.timerId=null;
	},
};
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
.measure {
    width: 100%;
    height: 100%;
	overflow: scroll;
	@keyframes redPulse{
		from{
			background-color: red;
		}
		25%{
			background-color: #dd0000;
			opacity:0.75;
		}
		50%{
			background-color: #bc330d;
			opacity: 0.5;
		}
		75%{
			background-color: #dd0000;
			opacity: 0.75;
		}
		to{
			background-color: red;
		}
	}
    .safe {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background-color: #25FF1D;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }
	.alarm1{
		background-color: #FFFF00;
	}
    .alarm2{
        background-color: #FF1D1D;
    }
	.danger{
		animation:redPulse 500ms infinite;
	}
	&::-webkit-scrollbar {
		display:none;
	}
	.cell .el-table__column-filter-trigger .el-icon-arrow-down{
		background:#fff;
	}
}
</style>