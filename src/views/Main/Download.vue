<template>
	<div class="table">
		<el-date-picker
			v-model="time"
			type="datetimerange"
			range-separator="至"
			start-placeholder="开始日期"
			end-placeholder="结束日期"
			:picker-options="pickerOptions"
			value-format="yyyy-MM-dd HH:mm:ss"
		></el-date-picker>
		<el-button @click="exportAllTable" type="primary" style="margin-left:1.2vw;">下载全部数据</el-button>
		<el-table
			v-loading="loading"
			element-loading-text="拼命加载中"
			element-loading-spinner="el-icon-loading"
			element-loading-background="rgba(0, 0, 0, 0.8)"
			:data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
			style="width: 100%;"
			ref="report-table"
			max-height="550"
		>
			<el-table-column
		    	prop="time"
		    	label="班报表"
		    	width="200"
		    	key="-1"
		    	align="center"
		    >
			    <template slot-scope="scope">
			        {{ scope.row.time }}
			    </template>
			</el-table-column>
			<el-table-column
                label="位号"
                align="center"
            >
			    <el-table-column
			        v-for="(item, index) in positionIdList"
			        :key="index"
			        :label="item.positionId"
			        :prop="item.positionId"
			        align="center"
			    >
			        <template slot-scope="scope">
			            {{ scope.row.data[item.positionId] }}
			        </template>
			    </el-table-column>
			</el-table-column>
		</el-table>
		<Footer
			:handleSizeChange="handleSizeChange"
			:handleCurrentChange="handleCurrentChange"
			:currentPage="currentPage"
			:pageSize="pageSize"
			:total="tableData.length"
		></Footer>
	</div>
</template>

<script>
import {download,getHistoryByTime} from '@/api/history';
import Footer from "./components/Footer";
import {saveAs} from 'file-saver';
import * as XLSX from 'xlsx';
import {mapState,mapActions} from "vuex";
export default{
	name:"Download",
	data(){
		return{
			currentPage:1,
			//结束时间
			end:"",
			loading:false,
			pageSize:50,
			pickerOptions:{
				disabledDate(time) {
					return time.getTime() > Date.now();
				},
				shortcuts: [
					{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					},
					{
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					},
					{
						text: '最近三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						}
					}
				]
			},
			position_id:"",
            // //位号筛选列表
            // positionIdFilterList:[],
			//存放所有传感器位号
			positionIdList:[],
			//单个传感器数据
			positionIdData:[],
			//后台获取到的数据
			rawData:[],
			//开始时间
			start:"",
			//用来展示的数据
			tableData:[],
			time:[],
			timeout:null,
			//存放所有事件集合
			timeSet:new Set(),
			total:0,
		};
	},
	computed:{
		...mapState("download",["sensorList"]),
	},
	methods:{
        ...mapActions("download",["getPositionIdList"]),
		clear(){
			this.positionIdList=[];
			this.tableData=[];
			this.rawData=[];
			this.timeSet=new Set();
		},
        // //重置筛选
        // clearFilter(){
        //     this.$refs.report-table.clearFilter();
        // },
        // //初始化筛选选项
        // clearFilterOptions(){
        //     this.positionIdList=[];
        // },
		exportAllTable(){
			let downloadData=[];
			this.tableData.forEach(item=>{
				let obj={};
				obj.time=item.time;
				for(let [key,value] of Object.entries(item.data)){
					obj[key]=value;
				}
				downloadData.push(obj);
			});
			let header=[];
			this.positionIdList.forEach(item=>{
				header.push([item.positionId]);
			});
			//生成worksheet
			const workSheet=XLSX.utils.json_to_sheet(downloadData);
			//修改表头
			XLSX.utils.sheet_add_aoa(workSheet,[["时间"]],{origin:"A1"});
			//设置固定列宽
			workSheet["!cols"]=[{wch:22}];
			//生成workbook
			const workBook=XLSX.utils.book_new();
			console.log(workBook);
			//将worksheet加入到workbook中且命名为data
			XLSX.utils.book_append_sheet(workBook,workSheet,"data");
			//导出到本地
			XLSX.writeFile(workBook,"检测数据.xlsx");
		},
        // filterHandler(value,row,column){
        //     const property=column["property"];
        //     return row[property]===value;
        // },
        // //获取筛选信息
        // async getFilterInfo(){
        //     this.clearFilterOptions();
        //     this.getPositionIdList().then(res=>{
        //         res.forEach(item=>{
        //             this.positionIdFilterList.push({
        //                 text:item.position_id,
        //                 value:item.position_id
        //             });
        //         });
        //     });
        // },
		handleCurrentChange(value){
			this.currentPage=value;
		},
		handleSizeChange(value){
			this.currentPage=1;
			this.pageSize=value;
		},
		init(start,end){
			this.clear();
			this.loading=true;
			this.sensorList.forEach(sensor=>{
				this.positionIdList.push({positionId:sensor.position_id});
			});
			this.positionIdList.forEach(item=>{
				download(item.positionId,start,end).then(res=>{
					const data=res.data;
					data.forEach(item=>{
						//若该时间未出现过
						if(!this.timeSet.has(item.time)){
							this.timeSet.add(item.time);
							let obj={time:item.time,data:{[item.position_id]:item[item.gas_name]}};
							this.rawData.push(obj);
						}else{
							this.rawData.forEach(tableItem=>{
								//找到tableData中出现过的这个时间
								if(tableItem.time===item.time){
									tableItem.data[item.position_id]=item[item.gas_name];
								}
							});
						}
					});
				}).then(()=>{
					this.rawData=this.rawData.sort((a,b)=>{
						return new Date(a.time).getTime()-new Date(b.time).getTime();
					});
				});
			});
			setTimeout(()=>{
				this.tableData=this.rawData;
				this.loading=false;
			},3000);
		},
	},
	watch:{
		time:function(newValue){
			if(newValue!==null){
				this.start=newValue[0];
				this.end=newValue[1];
				console.log(this.start);
				console.log(this.end);
				this.init(this.start,this.end);
			}
		},
	},
	mounted(){
		this.$store.dispatch("download/getSensorList");
	},
	components:{
		Footer
	},
}
</script>

<style lang="less" scoped>
/*最外层透明*/
/deep/ .el-table,
/deep/ .el-table__expanded-cell {
    background-color: transparent;
}
/* 表格内背景颜色 */
/deep/ .el-table th,
/deep/ .el-table tr,
/deep/ .el-table td {
    background-color: transparent;
    color: rgb(255, 255, 255);
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
    border-bottom: 1px solid #00e1e5 !important;
    border-right: 1px solid #00e1e5 !important;
}
/deep/ .el-table thead.is-group th.el-table__cell {
    background-color: transparent;
}
//分页样式
/deep/ .el-input__inner{
    background-color: transparent;
    color: #fff;
}
</style>
<style lang="less" scoped>
.table {
    width: 100%;
    height: 100%;
    overflow: scroll;
    @-webkit-keyframes redPulse {
        from {
            background-color: #bc330d;
            -webkit-box-shadow: 0 0 9px #333;
        }
        50% {
            background-color: #e33100;
            -webkit-box-shadow: 0 0 18px #e33100;
        }
        to {
            background-color: #bc330d;
            -webkit-box-shadow: 0 0 9px #333;
        }
    }
    .safe {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background-color: #25ff1d;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        // animation: redPulse 600ms infinite;
        // -webkit-animation: redPulse 600ms infinite;
    }
    .alarm {
        background-color: #ff1d1d;
    }
    &::-webkit-scrollbar {
        display: none;
    }
}
</style>
