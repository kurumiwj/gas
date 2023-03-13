<template>
	<div class="network">
		<el-tag type="success">在线设备数量:{{online}}</el-tag>
		<el-tag style="marginLeft:1.2vw">设备总数量:{{total}}</el-tag>
		<el-tag style="marginLeft:1.2vw">中继器{{receiveportId}}:{{receiveportOnline}}</el-tag>
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
		<el-table
            :data="allDeviceList"
            border
            style="width: 100%;marginTop:1vh"
            ref="filterTable"
        >
			<el-table-column prop="position" label="位号" align="center" width="150"> </el-table-column>
			<el-table-column
                prop="location"
                label="位置"
                align="center"
                :filters="locationList"
                :filter-method="filterHandler"
            > </el-table-column>
			<el-table-column
                prop="area"
                label="安装区域"
                align="center"
                :filters="areaList"
                :filter-method="filterHandler"
            ></el-table-column>
			<el-table-column prop="battery" label="电池电量" align="center" width="80">
				<template v-slot="{row,$index}">
					<div :class="`${row.battery<=20 ? 'danger' : ''}`">{{row.battery}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="is_online" label="网络状态" align="center" width="120">
				<template slot-scope="scope">
					<div
						:class="`dot ${scope.row.is_online ? '' : 'alarm'}`"
					></div>
					{{ scope.row.is_online ? "在线" : "离线" }}
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
import {getReceiveport} from "@/api/device";
import {mapState,mapActions,mapGetters} from "vuex";
export default{
	name:"Network",
	data(){
		return {
            areaList:[],
            filterTable:[],
            locationList:[],
			online:0,
			total:0,
			timerId:null,
			receiveportId:"",
			receiveportOnline:"",
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
		};
	},
	computed:{
		...mapState("network",["allDeviceList","receiveportList"]),
		...mapGetters(["name"]),
	},
	methods:{
		...mapActions("network",["getAreaList","getDeviceList","getLocationList","getReceiveportList"]),
        ...mapActions("refresh",["getInterval"]),
        ...mapActions("device",["getOnlineDevice","getTotalDevice"]),
		clear(){
			clearTimeout(this.timerId);
			this.timerId=null;
		},
        //重置筛选
        clearFilter(){
            this.$refs.filterTable.clearFilter();
        },
        //初始化筛选选项
        clearFilterOptions(){
            this.areaList=[];
            this.locationList=[];
        },
        filterHandler(value,row,column){
            const property=column["property"];
            return row[property]===value;
        },
        //获取筛选信息
        async getFilterInfo(){
            this.clearFilterOptions();
            this.getAreaList().then(res=>{
                res.forEach(item=>{
                    this.areaList.push({
                        text:item.area,
                        value:item.area
                    });
                });
            });
            this.getLocationList().then(res=>{
                res.forEach(item=>{
                    this.locationList.push({
                        text:item.location,
                        value:item.location
                    });
                });
            });
        },
		async init(){
			// await this.$store.dispatch("network",["getDeviceList","getReceiveportList"]);
			this.clear();
            this.getTotalDevice().then(res=>{
                this.total=res[0].totalDevice;
            });
            this.getOnlineDevice().then(res=>{
                this.online=res[0].onlineDevice;
            });
			this.getDeviceList().then(res=>{
				this.getReceiveportList().then(res2=>{
					this.receiveportId=res2[0].id;
					this.receiveportOnline=res2[0].is_online!==0 ? "在线" : "离线";
					this.$bus.$emit("changeNetworkStyle",{online:this.online,total:this.total});
				});
			});
            this.getFilterInfo();
		},
		refresh(){
			this.refresh_timeout();
		},
        refresh_timeout(){
            this.clear();
            this.init();
            this.timerId=setTimeout(this.refresh_timeout,this.refreshValue);
        },
		sleep(timeout=1000){
			return new Promise((resolve,reject)=>{
				setTimeout(resolve,timeout);
			});
		},
        beforyDestroy(){
            this.clear();
        }
	},
	watch:{
		refreshValue:{
			handler(newValue){
                this.clear();
                this.refresh();
			}
		}
	},
	mounted(){
        this.getInterval().then(res=>{
            if(res.length>0)
                this.refreshValue=res[0].refresh*1000;
        });
        this.init();
	},
	beforeDestroy(){
		this.clear();
	}
}
</script>

<style lang="less" scoped>
/deep/ .el-table,
/deep/ .el-table__expanded-cell {
    background-color: transparent;
}
/* 表格内背景颜色 */
/deep/ .el-table th,
/deep/ .el-table tr,
/deep/ .el-table td {
    background-color: transparent;
    color: #fff;
}
/deep/.el-table tbody tr:hover > td {
    background-color: rgba(156, 158, 158, 0.575) !important;
}
/deep/.el-table td,
.el-table th.is-leaf,
.el-table--border,
.el-table--group {
    border-color: #00e1e5;
}
/deep/.el-table--border::after,
.el-table--group::after,
.el-table::before {
    background-color: #00e1e5;
}
// 头部的下边框
/deep/.el-table--border th,
.el-table--border th.gutter:last-of-type {
    border: 1px solid #00e1e5 !important;
}
</style>
<style lang="less" scoped>
.network {
    width: 100%;
    height: 100%;
    overflow: scroll;
    @-webkit-keyframes redPulse {
        from {
            background-color: #bc330d;
        }
        50% {
            background-color: #ff1d1d;
        }
        to {
            background-color: #bc330d;
        }
    }
    .dot {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background-color: #25ff1d;
        position: absolute;
        left: 20%;
        top: 30%;
        // transform: translate(-50%, -50%);
    }
    .alarm {
        background-color: #ff1d1d;
    }
    .blip {
        animation: redPulse 300ms infinite;
        -webkit-animation: redPulse 300ms infinite;
    }
    .danger{
		animation:redPulse 500ms infinite;
	}
    &::-webkit-scrollbar {
        display: none;
    }
}
</style>
