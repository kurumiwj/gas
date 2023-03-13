<template>
	<div class="area">
		<div class="area_top">
			<div class="btns">
				<el-button @click="createArea" size="small" style="marginBottom:2.5vh">区域定义</el-button>
				<el-button v-show="url" size="small" @click="updateArea" style="marginBottom:2.5vh">区域修改</el-button>
				<el-button v-show="url" size="small" @click="deleteArea" style="marginBottom:2.5vh">区域删除</el-button>
				<el-select v-model="area" size="small" placeholder="请选择区域">
					<el-option
						v-for="item in areaOptions"
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
					ref="img"
					style="width:65vw;height:60vh;"
					:src="ip+url"
					v-show="url"
					fit="fill"
					@drop="drop"
					@dragover.prevent
                    @mouseup.native="handleMouseUp"
				>
				</el-image>
				<template v-for="item in pointList" v-if="pointList.length>0">
					<el-tooltip class="tooltip" effect="dark" placement="top">
						<div slot="content">id：{{item.id}}<br/>位号：{{item.position}}</div>
						<div class="tooltipTop" :class="getPointStyle(item)" :style="getPointPosition(item)" ref="point"></div>
					</el-tooltip>
				</template>
			</div>
		</div>
		<div class="area_table">
			<el-table
				:data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
				border
				style="width: 100%;"
				id="playList"
			>
				<el-table-column prop="id" label="id" align="center">
					<template slot-scope="scope">
						<div draggable="true" @dragstart="dragStart($event,scope.row)" @dragEnd="dragEnd">
							{{scope.row.id}}
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="position" label="位号" align="center">
				</el-table-column>
				<el-table-column prop="location" label="安装位置" align="center">
				</el-table-column>
				<el-table-column prop="" label="操作" align="center">
					<template slot-scope="{row}">
						<el-popconfirm
							width="200"
							confirm-button-text="确认"
							cancel-button-text="取消"
							icon="el-icon-info"
							icon-color="red"
							title="确认删除当前位号坐标?"
							trigger="click"
							@confirm="deletePoint(row)"
						>
							<el-button slot="reference" class="delete">删除</el-button>
						</el-popconfirm>
                        <el-button
                            type="primary"
                            size="small"
                            style="marginLeft:1vw"
                            v-show="url"
                            @mousedown.native="handleMousedown($event,row)"
                        >拖拽</el-button>
                        <div v-show="isDrag" :class="['base2']" ref="dragCircle"></div>
					</template>
				</el-table-column>
			</el-table>
			<el-dialog
				title="警告"
				:visible.sync="dialogVisible"
				width="30%"
				:append-to-body="true"
				:close-on-click-modal="false"
			>
				<span>该点坐标已存在</span>
				<span slot="footer" class="dialog-footer">
					<el-button size="small" @click="dialogVisible=false" class="cancel">取 消</el-button>
					<el-button size="small" type="primary" @click="dialogVisible=false" class="confirm">确 定</el-button>
				</span>
			</el-dialog>
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
import ip from "@/api/ip";
import {getRealtimeDeviceByArea} from "@/api/device";
import {getSingleSensor} from "@/api/sensor";
import Footer from "./components/Footer";
import {mapState,mapActions} from "vuex";
import {findCommonPosition} from "@/utils/commonPosition";
export default{
	name:"Area",
	data(){
		return {
            allList:[],
            area:"请选择区域",
            areaId:"",    //修改区域信息时的唯一标志
			areaOptions:[],
			currentPage:1,
			dialogVisible:false,	//判断是否重复添加点坐标的框
			drag:false,
			dragList:[],
            dragPoint:"",   //当前拖动的点信息
			ip:"",
            isDrag:false,   //判断是否在拖动
			pageSize:10,
            pointList:[],   //存放坐标点信息
            tableData:[],
			timerId:null,
			total:0,
			url:"",
		};
	},
	computed:{
		...mapState("area",["areaList"]),
        ...mapState("device",["deviceList"]),
		getPointStyle(){
			return item=>{
				let style="base breathe";
                if(item.is_alarm){
                    style+=" danger";
                }else{
                    style+=" safe";
                }
				return style;
			}
		}
	},
	methods:{
        ...mapActions("coordinates",["addPoint","deleteAllPoints","getPointByArea"]),
        ...mapActions("area",["getArea"]),
        change(area){
        	this.pointList=[];
            this.init().then(()=>{
                if(area!="全部"){
                    this.getArea(area).then(res=>{
                    	this.areaId=res[0].id;
                    	this.url=res[0].img;
                        this.getPointByArea(area).then(res1=>{
                            this.pointList=res1;
                        });
                    });
                }
            });
        },
        changePosition(deviceList){
            let list=[];
            for(let i=0;i<deviceList.length;i+=2){
                let item=deviceList[i];
                item.position=findCommonPosition(item.position_id);
                list.push(item);
            }
            return list;
        },
        clear(){
            clearInterval(this.timerId);
            this.timerId=null;
        },
        createArea(){
        	this.$router.push("/Main/CreateArea");
        },
        deleteArea(){
            this.$store.dispatch("area/deleteArea",this.areaId).then(()=>{
                this.$message({
                    type:"success",
                    message:"删除区域成功"
                });
                this.reload();
            }).catch(err=>{
                console.log("删除区域失败！");
            });
        },
        deletePoint(row){
        	const {id}=row;
        	this.$store.dispatch("coordinates/deletePoint",id).then(()=>{
        		this.change(this.area);
        	});
        },
        dragEnd(event){
        	event.dataTransfer.clearData();
        },
        dragStart(event,data){
        	let point=[data.id,data.position];
        	event.dataTransfer.setData("point",point);	//存储坐标信息
        },
        drop(event){
            console.log(event);
        	//获取图片宽高
        	let picX=Number.parseInt(window.innerWidth*0.65);
        	let picY=Number.parseInt(window.innerHeight*0.6);
            // console.log("picX:"+picX,"picY:"+picY);
        	//鼠标相比较于当前图片区域的左上角为参考点的坐标
        	let layerX=event.layerX;
        	let layerY=event.layerY;
            // console.log("layerX:"+layerX,"layerY:"+layerY);
        	//计算坐标相对比例
        	let rateX=(layerX/picX).toFixed(2);
        	let rateY=(layerY/picY).toFixed(2);
        	const point=event.dataTransfer.getData("point");
        	const [id,position]=point.split(',');
        	let isExist=false;	//判断该点是否存在标识
            for(let item of this.pointList){
                if(item.id===id && item.position===position){
                	this.dialogVisible=true;
                	isExist=true;
                    break;
                }
            }
        	if(!isExist){
                this.addPoint({id,position,rateX,rateY}).then(()=>{
                	this.change(this.area);
                });
            }
        },
        getPointPosition(item){
        	//返回图像对于主页面背景的偏移量
        	let imgL=this.$refs.img.$el.offsetLeft;
        	let imgT=this.$refs.img.$el.offsetTop;
        	//获取图片宽高
        	let picX=Number.parseInt(window.innerWidth*0.65);
        	let picY=Number.parseInt(window.innerHeight*0.6);
        	//获取坐标点的位置
        	let posX=imgL+item.pos_x*picX;  //imgL+layerX
        	let posY=imgT+item.pos_y*picY;  //imgT+layerY
        	let style={
        		left: posX+"px",
        		top: posY+"px",
        	}
        	return style;
        },
        handleCurrentChange(value){
        	this.currentPage=value;
        },
        handleMousedown(e,row){
            this.isDrag=true;
            this.dragPoint=row;
        },
        handleMouseUp(e){
            this.isDrag=false;
            //返回图像对于主页面背景的偏移量
            let imgL=this.$refs.img.$el.offsetLeft;
            let imgT=this.$refs.img.$el.offsetTop;
            //获取图片宽高
            let picX=Number.parseInt(window.innerWidth*0.65);
            let picY=Number.parseInt(window.innerHeight*0.6);
            //鼠标相比较于当前图片区域的左上角为参考点的坐标
            let layerX=e.layerX;
            let layerY=e.layerY;
            //计算坐标相对比例
            let rateX=(layerX/picX).toFixed(2);
            let rateY=(layerY/picY).toFixed(2);
            let isExist=false;	//判断该点是否存在标识
            for(let item of this.pointList){
                if(item.id===this.dragPoint.id){
                	this.dialogVisible=true;
                	isExist=true;
                    break;
                }
            }
            if(!isExist)
            	this.addPoint({id:this.dragPoint.id,position:this.dragPoint.position,rateX,rateY}).then(()=>{
            		this.change(this.area);
            	});
            this.dragPoint="";
        },
        handleSizeChange(value){
        	this.currentPage=1;
        	this.pageSize=value;
        },
		async init(){
			if(this.area==="请选择区域" || this.area==="全部"){
                this.url="";
				this.tableData=await this.changePosition(this.deviceList);
				this.allList=this.deviceList;
			}else{
				getRealtimeDeviceByArea(this.area).then(res=>{
					const data=res.data;
					if(res.code==200){
						this.tableData=this.changePosition(data);
						this.allList=data;
					}
				}).catch(err=>{
					console.error(err);
				});
			}
		},
		refresh(){
			this.clear();
            this.init();
			this.timerId=setInterval(()=>{
				this.init();
			},5000);
		},
		updateArea(){
			this.$router.push({name:"UpdateArea",params:{areaId:this.areaId,area:this.area,url:this.url}});
		}
	},
	mounted(){
		this.ip=ip+"/images/";
		this.$store.dispatch("area/getAreaList").then(()=>{
			this.areaList.forEach(area=>{
				this.areaOptions.push({label:area.area,value:area.area});
			});
			this.areaOptions.push({label:"全部",value:"全部"});
		});
		this.$store.dispatch("device/getDeviceList");
		window.addEventListener("resize",()=>{
			//区域坐标自刷新
			this.change(this.area);
		});
        setTimeout(()=>{this.init()},500);
	},
	beforeDestroy(){
		this.clear();
	},
	components:{
		Footer,
	},
	inject:["reload"]
}
</script>

<style lang="less" scoped>
/deep/.btns{
	.el-button--small{
		background-color: rgba(16, 44, 58, 0.8);
		color: #fff;
		width: 10vw;
		margin-left: 0;
	}
}
/deep/.delete{
	background-color: rgba(16, 44, 58, 0.8);
	color: #fff;
}
/deep/.el-input__inner {
    background-color: rgba(16, 44, 58, 0.8);
    color: #fff;
}
/deep/ .el-select{
	width: 10vw;
}
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
</style>
<style lang="less" scoped>
.area {
    width: 100%;
    height: 100%;
    .area_top {
        width: 100%;
        display: flex;
        .btns {
            width: 15%;
            height: 7.5vw;
            display: flex;
            flex-direction: column;
        }
    }
}
.base{
	width: 15px;
	height: 15px;
	border-radius: 50%;
	transform: translate(-50%,-50%);
	z-index: 999;
    margin:0;
	position: absolute;
}
.base2{
    width: 15px;
    height: 15px;
    border-radius: 50%;
    left: 0;
    top: 0;
    transform: translate(-50%,-50%);
    z-index: 999;
    margin:0;
    position: absolute;
    opacity:0.5;
}
.safe{
	background-color: #25FF1D;
}
.danger{
	background-color: #FF1D1D;
}
.people{
	background-color: blue;
}
.breathe{
	animation: breathe 2s linear infinite;
}
.jump{
	animation: jump 2s linear infinite;
}

@keyframes breathe{
	0%{
		transform: scale(1);
		opacity: 1;
	}
	25%{
		transform: scale(1.25);
		opacity: 0.5;
	}
	50%{
		transform: scale(1.5);
		opacity: 0;
	}
	75%{
		transform: scale(1.25);
		opacity: 0.5;
	}
	100%{
		transform: scale(1);
		opacity: 1;
	}
}

@keyframes jump{
	0%{
		opacity: 1;
		transform: scale(1.5) translateY(0);
		box-shadow:0 1px 2px rgba(255,255,255,0.1);
	}
	25%{
		opacity: 0.5;
		transform: scale(1.25) translateY(5px);
		box-shadow:0 1px 15px rgba(125,255,255,0.5);
	}
	50%{
		opacity: 0.25;
		transform: scale(1) translateY(10px);
		box-shadow:0 1px 30px rgba(0,255,255,1);
	}
	75%{
		opacity: 0.5;
		transform: scale(1.25) translateY(5px);
		box-shadow:0 1px 15px rgba(125,255,255,0.5);
	}
	100%{
		opacity: 1;
		transform: scale(1.5) translateY(0);
		box-shadow:0 1px 2px rgba(255,255,255,0.1);
	}
}

.tooltip{
	// margin: 4px;
	.tooltipTop{
		text-align: center;
	}
}
</style>
