<template>
	<div class="area">
		<div class="area_top">
			<div class="btns">
				<el-button @click="createArea" style="marginBottom:2.5vh">区域定义</el-button>
				<el-select v-model="area" placeholder="请选择区域">
					<el-option
						v-for="item in areaList"
						:key="item.value"
						:label="item.label"
						:value="item.value"
						@click.native="change(item.value)"
					>
					</el-option>
				</el-select>
			</div>
			<div class="pic">
				<el-image
					style="width:40vw;height:40vh;"
					:src="ip+url"
					v-show="url"
					fit="fill"
					@drop="drop"
					@dragover.prevent
				></el-image>
			</div>
		</div>
		<div class="area_table">
			<el-table
				:data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
				border
				style="width: 100%"
				id="playList"
				@row-click="selectAreaToMap"
			>
				<el-table-column prop="id" label="id" draggable="true" id="id" @dragstart="dragStart($event,id)" @dragend="dragEnd">
				</el-table-column>
				<el-table-column prop="position_id" label="位号" draggable="false">
				</el-table-column>
				<el-table-column prop="location" label="安装位置" draggable="false">
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
	</div>
</template>

<script>
import ip from "@/plugs/ip.js";
import draggable from "vuedraggable";
import {getAllDev,getArea,getAreaList} from "@/plugs/device";
import Footer from "./components/Footer";
export default{
	data(){
		return {
			tableData:[],
			areaList:[],
			area:"请选择区域",
			allList:[],
			url:"",
			ip:"",
			currentPage:1,
			total:0,
			pageSize:10,
			drag:false,
			dragList:[],
		};
	},
	methods:{
		init(){
			getAllDev().then(res=>{
				const data=res.data.data;
				if(res.data.error===0){
					this.tableData=data;
					this.allList=data;
				}
			}).catch(err=>{
				console.error(err);
			})
		},
		createArea(){
			this.$router.push("/Main/"+this.$route.params.id+"/CreateArea");
		},
		change(area){
			if(area==="全部"){
				this.init();
				this.url="";
				return;
			}
			this.tableData=this.allList.filter(item=>item.area===area);
			getArea(area).then(res=>{
				const data=res.data.data;
				this.url=data[0].img;
			})
		},
		selectAreaToMap(row,column,event){
			let x=0;	//相对于屏幕x坐标
			let y=0;	//相对于屏幕y坐标
			let l=0;	//相对于table栏左上角顶点left坐标
			let t=0;	//相对于table栏左上角顶点top坐标
			//鼠标按下事件
//			event.onmousedown=function(downEvent){
//				console.log(downEvent);
//			};
		},
		dragStart(event){
			let p={x:100,y:100};
			event.currentTarget.style.border="dashed";
//			event.dataTransfer.setData("text/plain",p);	//存储坐标信息
			event.dataTransfer.setData("item",p);	//存储坐标信息
		},
		dragEnd(event){
			event.dataTransfer.clearData();
			this.point={};
		},
		drop(event){
			console.log(event);
			const data=event.dataTransfer.getData("item");
			console.log(data);
		},
		handleSizeChange(value){
			this.currentPage=1;
			this.pageSize=value;
		},
		handleCurrentChange(value){
			this.currentPage=value;
		}
	},
	directives:{
		drag:{
			inserted:function(element,binding){
				console.log(element);
				let x=0,y=0,l=0,t=0;
				let isDown=false;
				//鼠标按下事件
				element.onmousedown=function(downEvent){
					console.log(element);
					//获取x坐标和y坐标
					x=downEvent.clientX;
					y=downEvent.clientY;
					//获取左部和顶部的偏移量
					l=element.offsetLeft;
					t=element.offsetTop;
					//开关打开
					isDown=true;
					//设置样式
					element.style.cursor="move";
				};
				//鼠标移动
				window.onmouseover=function(overEvent){
					if(isDown===false)
						return;
					//获取x和y
					let newX=overEvent.clientX;
					let newY=overEvent.clientY;
					//计算移动后的左偏移量和顶部的偏移量
					let newL=newX-(x-l);
					let newT=newY-(y-t);
					element.style.left=newL+"px";
					element.style.top=newT+"px";
				};
				//鼠标抬起事件
				element.onmouseup=function(upEvent){
					//开关关闭
					isDown=false;
					console.log(upEvent);
					element.style.cursor="default";
				}
			}
		}
	},
	created(){
		this.ip=ip+"/images/";
		this.init();
		getAreaList().then(res=>{
			const data=res.data.data;
			data.forEach(item=>{
				this.areaList.push({label:item.area,value:item.area});
			})
			this.areaList.push({label:"全部",value:"全部"});
		})
	},
	components:{
		Footer,
		draggable
	}
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
/deep/.el-input__inner {
    background-color: rgba(16, 44, 58, 0.8);
    color: #fff;
}
/deep/ .el-button--default {
    background-color: rgba(16, 44, 58, 0.8);
    color: #fff;
}
</style>
<style lang="less" scoped>
.area {
    width: 100%;
    height: 100%;
    .area_top {
        width: 100%;
        display: flex;
        .btns {
            width: 20%;
            height: 7.5vw;
            display: flex;
            flex-direction: column;
        }
        .pic{
            padding-left: 5%;
        }
    }
	.area_table{
		height: 50%;
		overflow-y: scroll;
	}
}
</style>
