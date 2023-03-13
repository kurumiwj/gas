<template>
    <div class="maintain">
        <el-table
            :data="tableData"
            border
            style="width: 100%"
            height="100%"
        >
<!--            <el-table-column prop="id" label="序号" width="200"> </el-table-column>-->
            <el-table-column prop="position_id" label="位号" align="center"> </el-table-column>
            <el-table-column prop="location" label="安装位置" align="center"> </el-table-column>
            </el-table-column>
            <el-table-column prop="" label="一级报警状态" align="center" width="200">
                <template slot-scope="scope">
                    <div :class="getStyle1(scope.row)"></div>
                </template>
            </el-table-column>
            <el-table-column prop="" label="二级报警状态" align="center" width="200">
                <template slot-scope="scope">
                    <div :class="getStyle2(scope.row)"></div>
                </template>
            </el-table-column>
            <el-table-column prop="time" label="时间" align="center" width="200">
            	<template slot-scope="scope">
            		{{getTime(scope.row)}}
            	</template>
            </el-table-column>
            <el-table-column label="是否确定" align="center" width="200">
                <template slot-scope="scope">
                    <el-button
                        @click="handleClick(scope.row)"
                        type="text"
                        size="small"
                        >确定</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import {handleTime} from "@/plugs/handleTime";
import {confirmAlarm,getAlarm,removeAlarm} from "@/plugs/alarm";
import {addLog} from "@/plugs/log";
import {getRealtimeDevice,getRealtimeDeviceBySensor} from "@/plugs/device";
export default {
    data() {
        return {
            tableData: [],
            areaList: [],
            numList: [],
			user:{},
			timerId:null,
        };
    },
    methods: {
        init() {
			this.tableData=[];
			getAlarm().then(res => {
				this.tableData=res.data.data;
			}).catch((err) => {
				console.error(err);
			});
        },
		refresh(){
			clearInterval(this.timerId);
			this.timerId=null;
			this.init();
			this.timerId=setInterval(()=>{
				this.init();
			},10000);
		},
        handleClick(row) {
			this.$confirm("是否确认解除该报警信息？","警告",{
				confrimTextButton:"确认",
				cancelTextButton:"取消",
				type:"warning",
				center:true
			}).then(()=>{
				confirmAlarm(row.id,row.position_id).then(res=>{
					if(res.data.error===0){
						this.$message({
							type:"success",
							message:"确认警报成功"
						});
					}
				}).then(()=>{
					getRealtimeDeviceBySensor(row.position_id).then(res=>{
						const data=res.data.data;
						console.log(data);
						const positionId=data[0].position_id;
						const gas=data[0].data;	//测量值
						const gasName=data[0].gas_name;	//检测气体
						const scope=data[0].scope;	//量程
						const firstAlarm=data[0].first_alarm;	//一级报警阈值
						const secondAlarm=data[0].second_alarm;	//二级报警阈值
						//判断实时数据是否正常，若正常则删除，否则继续保留
						if(gasName!=="H2"){
							//确认后依然超标
							if(gas>scope/0.3*firstAlarm*0.01){
								alert("浓度依然超标");
							}else{	//确认后恢复正常
								removeAlarm(positionId);
							}
						}else{
							//确认后依然超标
							if(gas>scope*firstAlarm*0.01){
								alert("浓度依然超标");
							}else{	//确认后恢复正常
								removeAlarm(positionId);
							}
						}
						this.reload();
					});
					let content=`${this.user.name}确认了${row.id}警报`;
					addLog(this.user.name,content);
				}).catch(err=>{
					console.error(err);
				});
			}).catch(()=>{
				this.$message({
					type:"info",
					message:"取消确认警报"
				});
			});
        },
        filterHandler(value, row, column) {
            const property = column["property"];
            return row[property] === value;
        },
		inject:["reload"]
    },
    computed: {
		//一级警报样式
        getStyle1(){
            return (row)=>{
                let style = 'safe';
                if(row.alarm_status>=1){
                    style += ' alarm1';
					//未确认过
					if(!row.checked){
						style+=" blip1";
					}
                }
                return style;
            }
        },
		//二级警报样式
        getStyle2(){
            return (row)=>{
                let style = 'safe';
                if(row.alarm_status===2){
					style += ' alarm2';
					//未确认过
					if(!row.checked){
						style+=" blip2";
					}
                }
                return style;
            }
        },
		getTime(){
			return row=>{
				return handleTime(row.time);
			}
		},
    },
    created() {
		this.user.id=JSON.parse(localStorage.getItem("gas_user")).id;
		this.user.name=JSON.parse(localStorage.getItem("gas_user")).name;
		this.user.permission=JSON.parse(localStorage.getItem("gas_user")).permission;
    },
	mounted(){
		this.refresh();
	},
	beforeDestroy(){
		clearInterval(this.timerId);
		this.timerId=null;
	},
	inject:["reload"]
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
  border: 1px solid #00E1E5 !important;
}
</style>
<style lang="less" scoped>
.maintain {
    width: 100%;
    height: 100%;
    overflow: scroll;

    @-webkit-keyframes redPulse {
        from {
            background-color: #bc330d;
        }
        50% {
            background-color: #FF1D1D;
        }
        to {
            background-color: #bc330d;
        }
    }
	@-webkit-keyframes yellowPulse{
		from {
            background-color: #bcdd00;
        }
        50% {
            background-color: #FFFF00;
        }
        to {
            background-color: #bcdd00;
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
    .blip1{
        animation: yellowPulse 300ms infinite;
        -webkit-animation: yellowPulse 300ms infinite;
    }
	.blip2{
		animation: redPulse 300ms infinite;
        -webkit-animation: redPulse 300ms infinite;
	}
    &::-webkit-scrollbar {
        display: none;
    }
}
</style>