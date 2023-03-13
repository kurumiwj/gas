<template>
	<div class="network">
		<el-tag type="success">在线设备数量:{{online}}</el-tag>
		<el-tag style="marginLeft:1.2vw">设备总数量:{{total}}</el-tag>
		<el-tag style="marginLeft:1.2vw">中继器{{receiveportId}}:{{receiveportOnline}}</el-tag>
		<span style="marginLeft:1.2vw;color:#fff">刷新间隔：</span>
		<el-select
			v-model="refreshValue"
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
		<el-table :data="deviceList" border style="width: 100%;marginTop:1vh">
			<el-table-column prop="id" label="设备id" align="center"> </el-table-column>
			<el-table-column prop="location" label="位置" align="center"> </el-table-column>
			<el-table-column prop="is_online" label="网络状态" align="center">
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
import {getReceiveport,sendId} from "@/plugs/device";
import {updateNetwork} from "@/plugs/online";
import mqtt from "mqtt";
import {mapState} from "vuex";
export default{
	data(){
		return {
			idList:[],
			flag:true,	//判断数组是否需要逆转
			offlineList:[],
			online:0,
			total:0,
			timerId:null,
			receiveportOnline:"",
			receiveportId:"",
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
			refreshValue:20000,
		};
	},
	computed:{
		...mapState("Network",["deviceList","receiveportList"]),
	},
	methods:{
		async init(){
			this.online=0;
			this.total=0;
			this.idList=[];
			this.offlineList=[];
			this.deviceList.forEach(item=>{
				this.total++;
				this.idList.push(item.id);
				if(item.is_online){
					this.online++;
				}else{
					this.offlineList.push(item.id);
				}
			});
			if(this.flag){
				this.offlineList=this.offlineList.reverse();
			}
			this.flag=!this.flag;
			this.receiveportId=this.receiveportList[0].id;
			this.receiveportOnline=this.receiveportList[0].is_online!==0 ? "在线" : "离线";
		},
		async sendSingleId(offlineList,timeout){
			for(let item of offlineList){
				sendId(item);
				await this.sleep(3000);
			}
		},
		clear(){
			clearInterval(this.timerId);
			this.timerId=null;
		},
		refresh(){
			this.clear();
			this.timerId=setInterval(()=>{
				this.init().then(()=>{
					this.sendSingleId(this.offlineList,3000);
				});
			},this.refreshValue);
		},
		sleep(timeout=1000){
			return new Promise((resolve,reject)=>{
				setTimeout(resolve,timeout);
			});
		},
		async sendAllId(idList,timeout){
			for(let id of idList){
				sendId(id);
				await this.sleep(timeout);
			}
		}
	},
	watch:{
		refreshValue:{
			handler(newValue){
				this.refresh();
			}
		}
	},
	mounted(){
		this.$store.dispatch("Network/getDeviceList").then(()=>{
			this.$store.dispatch("Network/getReceiveportList").then(()=>{
				this.init().then(()=>{
					let idList=[];
					this.deviceList.forEach(item=>{
						idList.push(item.id);
					});
					this.sendAllId(idList,3000);
					setTimeout(()=>{
						updateNetwork(idList);
					},20000);
				}).then(()=>{
					this.refresh();
				});
			});
		});
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
        left: 43%;
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
    &::-webkit-scrollbar {
        display: none;
    }
}
</style>
