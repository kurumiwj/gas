<template>
	<div class="table">
		<el-date-picker
			v-model="time"
			type="datetimerange"
			range-separator="至"
			start-placeholder="开始日期"
			end-placeholder="结束日期"
		></el-date-picker>
		<el-button @click="exportCurrentTable" type="primary" style="margin-left: 1.2vw;">下载当前页面数据</el-button>
		<el-button @click="exportAllTable" type="primary" style="margin-left:1.2vw;">下载全部数据</el-button>
		<el-autocomplete
			v-model="position_id"
			:fetch-suggestions="querySearchAsync"
			placeholder="请输入待查找传感器名称"
			@select="handleSelect"
			@keyup.enter="handleSelect"
			style="margin-left:1.2vw;"
			:highlight-first-item=true
		></el-autocomplete>
		<el-table
			:data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
			style="width: 100%;"
			ref="report-table"
			max-height="550"
		>
			<el-table-column
		    	prop="time"
		    	label="班报表"
		    	width="300"
		    	sortable
		    	:sort-by="['time']"
		    	key="-1"
		    >
			    <template slot-scope="scope">
			        {{ scope.row.time }}
			    </template>
			</el-table-column>
			<el-table-column label="位号">
			    <el-table-column
			        v-for="(item, index) in areaList"
			        :key="index"
			        :label="item.id"
			        :prop="item.id"
			        sortable
			        :sort-by="[item.id]"
			        :sort-orders="['ascending','descending',null]"
			    >
			        <template slot-scope="scope">
			            {{ scope.row[item.id]!==-1 ? scope.row[item.id] : "" }}
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
import {getHistoryByTime} from '@/plugs/history';
import Footer from "./components/Footer";
import {handleTime,handleUTCTime} from "@/plugs/handleTime";
import {saveAs} from 'file-saver';
import * as XLSX from 'xlsx';
export default{
	data(){
		return{
			//用来展示的数据
			tableData:[],
			//存放后台获取加工后的源数据
			rawTableData:[],
			//存放每个传感器的id和检测的气体，格式：[{gas:xxx,id:xxx}]
			areaList:[],
			//存放每个传感器最初的源数据,防止筛选后传感器id丢失，形式同上
			rawAreaList:[],
			//存放所有传感器的id名，格式：{xxx(id):xxx(gas),......}
			areaList2:{},
			numList:[],
			time:[],
			start:"",	//开始时间
			end:"",		//结束时间
			currentPage:1,
			total:0,
			pageSize:50,
			position_id:"",
			timeout:null,
		};
	},
	methods:{
		handleSizeChange(value){
			this.currentPage=1;
			this.pageSize=value;
		},
		handleCurrentChange(value){
			this.currentPage=value;
		},
		init(start,end){
			getHistoryByTime(start,end).then(ret=>{
				if(ret.data.error==0){	//获取到数据
					//将data中时间进行格式化
					const data=ret.data.data.map(item=>({...item,time:this.getLocal(item.time)}));
					//存放传感器名称并且每个传感器都初始化为false用作hash表处理
					let itemList={};
					//存放时间列表
					let timeList=[];
					//获取传感器名称
					data.forEach(item=>{
						if(!itemList.hasOwnProperty(item.position_id))	//	去重
							itemList[item.position_id]=false;
						if(timeList.indexOf(item.time)===-1)	//去重
							timeList.push(item.time);
					});
					this.rawAreaList=[];
					this.areaList2={};
					data.forEach(item=>{
						if(!itemList[item.position_id]){
							this.rawAreaList.push({
								gas:item.gas_name,
								id:item.position_id,
							})
							Object.assign(this.areaList2,{
								[item.position_id]:item.gas_name
							})
							//已经统计过该传感器的id
							itemList[item.position_id]=true;
						}
					})
					for(let item of timeList){
						this.rawTableData.push({
							time:item,
						});
						for(let key of Object.keys(this.areaList2)){
							Object.assign(this.rawTableData[this.rawTableData.length-1],{[key]:-1});
						}
					}
					let test_index=0;
					//由于数据是按照时间从大到小排序所以可以剪枝节省时间
					let start_index=0;
					for(let item of this.rawTableData){
						for(;start_index<data.length;start_index++){
							if(data[start_index].time===item.time){
								let obj={[data[start_index].position_id]:data[start_index][this.areaList2[data[start_index].position_id]]};
								Object.assign(item,obj);
							}else break;
						}
					}
					this.tableData=this.rawTableData;
					this.areaList=this.rawAreaList;
				}
			}).catch(err=>{
				console.error(err);
			})
		},
		exportCurrentTable(){
			try{
				const $e=this.$refs["report-table"].$el;
				let $table=$e.querySelector(".table");
				if(!$table){
					$table=$e;
				}
				const workBook=XLSX.utils.table_to_book($table,{raw:true});
				const workSheet=workBook.Sheets["Sheet1"];
				//设置固定列宽
				workSheet["!cols"]=[{wch:22}];
				XLSX.writeFile(workBook,"检测数据.xlsx");
			}catch(e){
				if(typeof console!=="undefined") console.error(e);
			}
		},
		exportAllTable(){
			//生成worksheet
			const workSheet=XLSX.utils.json_to_sheet(this.rawTableData);
			//修改表头
			XLSX.utils.sheet_add_aoa(workSheet,[["时间",...Object.keys(this.areaList2)]],{origin:"A1"});
			//设置固定列宽
			workSheet["!cols"]=[{wch:22}];
			//生成workbook
			const workBook=XLSX.utils.book_new();
			//将worksheet加入到workbook中且命名为data
			XLSX.utils.book_append_sheet(workBook,workSheet,"data");
			//导出到本地
			XLSX.writeFile(workBook,"检测数据.xlsx");
		},
		createStateFilter(queryString){
			return position_id=>{
				return position_id.toLowerCase().indexOf(queryString.toLowerCase())===0;
			}
		},
		querySearchAsync(queryString,callback){
			const data=Object.keys(this.areaList2);	//记录所有设备id
			data.unshift("全部");
			let results0=queryString ? data.filter(this.createStateFilter(queryString)) : data;	//格式[xxx,xxx,......]
			let results=[];
			results0.forEach(item=>{
				let obj={value:item};
				results.push(obj);
			})
			clearTimeout(this.timeout);
			this.timeout=setTimeout(()=>{
				callback(results);
			},1000);
		},
		handleSelect(item){
			if(item.value==="全部"){	//选择全部展示
				this.position_id="";	//将输入框置空
				this.currentPage=1;	//切回到第1页
				this.tableData=this.rawTableData;
				this.areaList=this.rawAreaList;
			}else{
				this.currentPage=1;	//切回到第1页
				this.tableData=[];
				let table0=this.rawTableData.filter(data=>data[item.value]!=-1);
				table0.map(data=>{
					let obj={time:data.time,[item.value]:data[item.value]};
					this.tableData.push(obj);
				});
				this.areaList=this.rawAreaList.filter(data=>data["id"]===item.value);
			}
			this.reloadPart();
		}
	},
	computed:{
		getDet(){
			return row=>{
				return row[row.gas_name];
			}
		},
		getLocal(timeStr) {
			return handleTime;
		},
	},
	watch:{
		time:function(newVal,oldVal){
			this.start=handleTime(newVal[0]);
			this.end=handleTime(newVal[1]);
			this.init(this.start,this.end);
		},
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
