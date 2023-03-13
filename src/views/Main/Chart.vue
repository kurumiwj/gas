<template>
    <div class="chart">
        <div class="devID">
           	<el-button
           		type="primary"
           		style="marginRight:0.5vw;"
           		@click="changePause"
           	>{{pause}}</el-button>
           	<el-select
           		style="marginRight:0.5vw;width:7vw;"
				v-model="areaValue"
           		placeholder="请选择区域"
           	>
           		<el-option
           			v-for="area in areaOptions"
           			:key="area.value"
           			:label="area.label"
           			:value="area.value"
           		></el-option>
           	</el-select>
           	<el-select
       			style="marginRight:0.5vw;width:7vw;"
       			v-model="positionId"
       			placeholder="请选择位号"
       		>
       			<el-option
       				v-for="position in positionIdOptions"
       				:key="position.value"
       				:label="position.label"
       				:value="position.value"
       			></el-option>
       		</el-select>
       		<el-select
       			style="marginRight:0.5vw;width:7vw;"
       			v-model="unitValue"
       			placeholder="传感器单位"
       		>
       			<el-option
       				v-for="unit in unitOptions"
       				:key="unit.value"
       				:label="unit.label"
       				:value="unit.value"
       			>
       			</el-option>
       		</el-select>
       		<el-select
       			style="marginRight:0.5vw;width:7vw;"
       			v-model="total"
       			placeholder="数据量"
       		>
       			<el-option
       				v-for="total in totalOptions"
       				:key="total.value"
       				:label="total.label"
       				:value="total.value"
       			>
       			</el-option>
       		</el-select>
       		<el-button type="primary" style="marginRight: 0.5vw" @click="change">确认</el-button>
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
        </div>
        <div class="location">
        	<span v-show="positionId" style="marginRight: 0.5vw">设备ID:{{devID}}</span>
        	<span style="marginLeft: 2vw" v-show="positionId">安装位置:{{location}}</span>
        </div>
        <div id="echarts" class="echarts" style="" ref="chart"></div>
    </div>
</template>
<script>
import {handleTime} from "@/utils/handleTime";
import {unitChange} from "@/utils/unitChange";
import {getHistory} from "@/api/history";
import {getPositionId,getSensorByArea,getSensorByPositionId,getSingleSensor} from "@/api/sensor";
import { getDeviceById } from "@/api/device";
import * as echarts from "echarts";
import {mapState,mapGetters,mapActions} from "vuex";
export default {
	name:"Chart",
    data() {
        return {
			area:"",	//指定位号传感器所在的区域
			areaValue:"",	//下拉显示的区域值
			areaOptions:[],	//区域列表
			atmosphere:"",	//压强
			devID: "",	//指定位号传感器对应的设备id
			gasList:[],
			gasName:"",	//记录检测的气体名称
			intervalId:null,	//定时器
			location:"",	//指定位号传感器所在的位置
			measureData:"",
			molecularWeight:"",	//一号传感器分子量
			myChart: null,
			option:"",
			pause:"暂停",	//控制动态数据更新与否的按钮
			positionId:"",	//位号
			positionIdOptions:[],	//存放筛选信息
			predictGasList:[],
			rawUnitValue:"",	//传感器原单位
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
			scope:"",
			singleIntervalId:null,	//单曲线定时器
			temperature:"",	//温度
			timeList:[],
			total:10,	//显示总数据量
			totalOptions:[
				{
					value:10,
					label:"10条",
				},
				{
					value:50,
					label:"50条",
				},
				{
					value:100,
					label:"100条",
				},
				{
					value:200,
					label:"200条",
				},
				{
					value:500,
					label:"500条",
				},
				{
					value:1000,
					label:"1000条",
				},
                {
                    value:1500,
                    label:"1500条"
                },
                {
                    value:2000,
                    label:"2000条"
                }
			],
			timeTotal:"",	//所选时间段内所有数据
			unitOptions:[
				{
					value:"ppm",
					label:"ppm",
				},
				{
					value:"mg/m3",
					label:"mg/m3",
				},
				{
					value:"%",
					label:"%",
				}
			],	//记录几种单位
			unitValue:"",	//显示传感器当前的单位
        };
    },
    computed:{
    	...mapState("area",["areaList"]),
    	...mapGetters(["name"])
    },
    methods: {
        ...mapActions("refresh",["getInterval"]),
		//初始化图表
        initChart() {
            this.clearChart();
            this.myChart = echarts.init(this.$refs.chart);
			let series = [
				{
					name: this.gasName,
					type: "line",
					smooth: true,
					symbol: "none",
					data: this.gasList,
					color: "yellow",
				},
				{
					name: this.gasName,
					type: "line",
					lineStyle:{
						color:"yellow",
						type:"dashed",
					},
					smooth: true,
					symbol: "none",
					data: this.predictGasList,
					color: "yellow",
				},
			];
			// 绘制图表
			this.option = {
				title: {
					text: "",
				},
				tooltip: {
					show: true,
					trigger: "axis",
					formatter:function(params){
						let str=params[0].name+'<br/>';
						for(let i=0;i<2;i++){
							if(i!==0) str+='<br/>';
							str+="<span style='display:inline-block;margin-right:4px;width:10px;height:10px;border-radius:10px;background-color:"+params[i].color+";'></span>"+"\t"+params[i].seriesName+":"+params[i].value;
						}
						return str;
					}
				},
				legend: {
					data: this.gasName,
					icon: "rect",
					textStyle: {
						fontSize: "18",
						color: "#fff",
					},
				},
				xAxis: {
					data: this.timeList,
					name: "时间",
					boundaryGap: false,
					nameTextStyle: {
						fontSize: "18",
						lineStyle: {
							color: "#fff",
						},
					},
					axisLabel:{
						show:true,
						interval:"auto",
						formatter:function(params){
							let xArr=params.split(" ");
							return xArr.join('\n');
						}
					},
					axisLine: {
						lineStyle: {
							color: "#fff",
						},
						onZero:false,
					},
				},
				yAxis:[
					{
						name: this.gasName+"量程 (单位:"+this.unitValue+")",
						type:"value",
						min:function(value){
							return (value.min/5).toFixed(4);
						},
						max:function(value){
							return (value.max*3).toFixed(4);
						},
						position:"left",
						nameTextStyle: {
							fontSize: "18",
							color: "#fff",
						},
						axisLabel: {
							textStyle: {
								fontSize: "18",
								color: "#fff",
							},
						},
					},
				],
				series: series,
			};
			this.myChart.setOption(this.option, true); //设置为ture表示数据不合并
			window.addEventListener("resize",this.myChart.resize);	//自动缩放
        },
		//初始化数据
		initData(positionId){
			this.areaList.forEach(area=>{
				this.areaOptions.push({
					label:area.area,
					value:area.area,
				});
			});
			if(positionId){
				this.clear();
				//获取指定设备id的传感器信息
				getSensorByPositionId(positionId).then(res=>{
					const data=res.data;
					this.unitValue=data[0].unit;
					this.gasName=data[0].gas_name;
					this.scope=data[0].scope;
				}).then(()=>{
					//获取指定设备id的历史数据最新total条
					getHistory(this.total,num).then(res => {
						console.log(res);
						this.clearData();
						this.predictGasList=new Array(this.total-3).fill(null);
						const data=res.data;
						let numGroup = data.splice(2);	//历史数据只显示8条，剩下2条留给预测数据
						numGroup.forEach(item=>{
							// let tempData=item[this.gasName.toLowerCase()]+Math.random()*0.5-0.2;
							let tempData=item[this.gasName.toLowerCase()];
							this.gasList.push(tempData);
							this.timeList.push(handleTime(item.time));
						})
						this.predictGasList.push(this.gasList[this.gasList.length-1]);
						this.timeList.push(handleTime(new Date(+new Date(this.timeList.slice(-1))+20000)));
						let predict=parseFloat(this.gasList.slice(-1));
						this.predictGasList.push(predict.toFixed(4));
					}).catch(err=>{
						console.error(err);
					}).finally(()=>{
						this.initChart();
					});
				});
			}else{
				this.unitValue=this.rawUnitValue;
			}
		},
		//更新指定位号的曲线
		updateSingleChart(){
			let series=[
				{
					name: this.gasName,
					type: "line",
					smooth: true,
					symbol: "none",
					data: this.gasList,
					color: "yellow",
				},
				{
					name: this.gasName,
					type: "line",
					lineStyle:{
						color:"yellow",
						type:"dashed",
					},
					smooth: true,
					symbol: "none",
					data: this.predictGasList,
					color: "yellow",
				},
			];
			this.option={
				title:{
					text:"",
				},
				tooltip:{
					show:true,
					trigger:"axis",
					formatter:function(params){
						let str=params[0].name+'<br/>';
						str+="<span style='display:inline-block;margin-right:4px;width:10px;height:10px;border-radius:10px;background-color:>"+params[0].color+";'></span>"+'\t'+params[0].seriesName+":"+params[0].value;
						return str;
					}
				},
				legend: {
					data: this.gasName,
					icon: "rect",
					textStyle: {
						fontSize: "18",
						color: "#fff",
					},
				},
				xAxis: {
					data: this.timeList,
					name: "时间",
					boundaryGap: false,
					nameTextStyle: {
						fontSize: "18",
						lineStyle: {
							color: "#fff",
						},
					},
					axisLabel:{
						show:true,
						interval:"auto",
						formatter:function(params){
							let xArr=params.split(" ");
							return xArr.join('\n');
						}
					},
					axisLine: {
						lineStyle: {
							color: "#fff",
						},
						onZero:false,
					},
				},
				yAxis:[
					{
						name: this.gasName+"量程 (单位:"+this.unitValue+")",
						type:"value",
						min:function(value){
							return ((value.min-2)/5).toFixed(4);
						},
						max:function(value){
							return ((value.max+2)*1.5).toFixed(4);
						},
						position:"left",
						nameTextStyle: {
							fontSize: "18",
							color: "#fff",
						},
						axisLabel: {
							textStyle: {
								fontSize: "18",
								color: "#fff",
							},
						},
					},
				],
				series,
			};
			this.myChart = echarts.init(this.$refs.chart);
			this.myChart.setOption(this.option,true);
			window.addEventListener("resize",this.myChart.resize);	//自动缩放
		},
		//更新单曲线数据
		refreshSingleData(id,positionId,newUnitValue=null){
			this.clearData();
			getSingleSensor(id,positionId).then(res=>{
				const data=res.data;
				this.rawUnitValue=data[0].unit;	//获取传感器原单位
				this.molecularWeight=data[0].molecular_weight;	//获取气体分子量
				this.gasName=data[0].gas_name;
				this.scope=data[0].scope;
				getDeviceById(id).then(res=>{
					const data=res.data;
					this.temperature=data[0].temperature;	//获取设备温度
					this.atmosphere=data[0].atmosphere;	//获取设备压强
				}).then(()=>{
					getHistory(id,this.total).then(res=>{
						this.clearData();
						this.predictGasList=new Array(this.total-3).fill(null);
						const data=res.data;
						let numGroup=data.slice(2);
						numGroup.forEach(item=>{
							// let tempData=item[this.gasName.toLowerCase()]+Math.random()*0.5-0.2;
							let tempData=item[this.gasName.toLowerCase()];
							//当前选择的单位与该传感器源单位相同则不用换算
                            let gas={
                                data:tempData,
                                unit:this.unitValue,
                                atmosphere:this.atmosphere,
                                temperature:this.temperature,
                                molecularWeight:this.molecularWeight
                            }
							this.gasList.push(unitChange(gas));
							this.timeList.push(handleTime(item.time));
						});
						this.predictGasList.push(this.gasList[this.gasList.length-1]);
						for(let i=0;i<2;i++){
							this.timeList.push(handleTime(new Date(+new Date(this.timeList.slice(-1))+20000)));
							let predict=parseFloat(this.gasList.slice(-1));
							this.predictGasList.push(predict.toFixed(4));
						}
					}).catch(err=>{
						console.error(err);
					}).finally(()=>{
						this.updateSingleChart();
					});
				});
			});
		},
		//定时更新单曲线数据
		refreshSingleDataInterval(id,positionId,newUnitValue=null){
			this.clearTimer();
			this.refreshSingleData(id,positionId,newUnitValue);
			this.singleIntervalId=setInterval(()=>{
				this.refreshSingleData(id,positionId,newUnitValue);
			},this.refreshValue);
		},
		//清空计时器
		clearTimer(){
			clearInterval(this.intervalId);
			clearInterval(this.singleIntervalId);
			this.intervalId=null;
			this.singleIntervalId=null;
		},
		//清空图表
		clearChart(){
			if (this.myChart != null && this.myChart != "" && this.myChart != undefined) {
                this.myChart.dispose(); //销毁
            }
		},
		clear(){
			this.clearChart();
			this.clearTimer();
			this.positionIdOptions=[];
			this.areaOptions=[];
			this.timeList=[];
		},	
		//清空数据
		clearData(){
			this.gasList=[];
			this.predictGasList=[];
			this.timeList=[];
		},
        change() {
			if(this.areaValue==="" || this.positionId===""){
				this.$confirm("请选择区域和传感器位号！","警告",{
					confirmButtonText:"确定",
					cancelButtonText:"取消",
					type:"warning",
					center:true
				}).then(()=>{
					this.$message({
						type:"success",
						message:"数据已重置，请重新选择"
					});
					this.positionId="";
					this.areaValue="";
				}).catch(()=>{
					this.$message({
						type:"info",
						message:"已取消"
					});
				});
			}else{
				this.clearData();
				this.gasName="";
				this.refreshSingleDataInterval(this.devID,this.positionId,this.unitValue);
			}
        },
		changePause(){
			if(this.pause==="暂停"){
				this.clearTimer();
				this.pause="继续";
			}else{
				this.clearData();
				this.gasName="";
				this.refreshSingleDataInterval(this.devID,this.positionId,this.unitValue);
				this.pause="暂停";
			}
		}
    },
	watch:{
		//监听区域
		areaValue:{
			handler(newValue){
				this.location="";
				this.positionIdOptions=[];
				getSensorByArea(newValue).then(res=>{
					const data=res.data;
					if(data.length>0){
						this.unitValue=this.rawUnitValue;
						//更新设备筛选列表
						for(let item of data){
							this.positionIdOptions.push({
								label:item.position_id,
								value:item.position_id,
							})
						}
					}else{
						this.positionId="";
						this.positionIdOptions="";
					}
				});
			}
		},
		//监听位号
		positionId:{
			handler(newValue,oldValue){
				getSensorByPositionId(newValue).then(res=>{
					const data=res.data;
					this.devID=data[0].id;
					this.location=data[0].location;
					this.unitValue=data[0].unit;
				});
			}
		},
	},
    mounted() {
		this.clear();
        this.getInterval().then(res=>{
            if(res.length>0){
                this.refreshValue=res[0].refresh*1000;
            }
        })
		this.$store.dispatch("area/getAreaList").then(()=>{
			if(this.$route.params.positionId){
				this.positionId=this.$route.params.positionId;
				getSensorByPositionId(this.positionId).then(res=>{
					const data=res.data;
					this.areaValue=data[0].area;
					this.rawUnitValue=data[0].unit;
				});
			}
			this.initData();
		});
    },
	beforeDestroy(){
		this.clearTimer();
		this.$route.params.positionId=undefined;
	},
};
</script>
<style lang="less" scoped>
.chart {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .echarts {
        width: 100%;
        height: 90%;
        margin-top: 2vh;
    }
    .devID {
        display: flex;
        align-items: center;
        white-space: nowrap;
        color: #fff;
    }
	.location{
		display: flex;
		color: #fff;
		padding-top: 1vh;
		font-size: 20px;
	}
}
</style>