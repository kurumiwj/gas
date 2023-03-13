<template>
    <div class="history">
       	<div class="devID">
       		<el-select
           		style="marginRight:0.5vw;width:7vw;"
				v-model="areaValue"
           		placeholder="请选择区域"
           	>
           		<el-option
           			v-for="(area,index) in areaOptions"
           			:key="index"
           			:label="area.label"
           			:value="area.value"
           		></el-option>
           	</el-select>
<!--
			<el-select
				style="marginRight:0.5vw;width:8vw;"
				v-model="deviceValue"
				placeholder="请选择设备ID"
			>
				<el-option
					v-for="(device,index) in deviceOptions"
					:key="index"
					:label="device.label"
					:value="device.value"
				></el-option>
			</el-select>
-->
       		<el-select
       			style="marginLeft:0.5vw;width:7vw;"
       			v-model="positionId"
       			placeholder="请选择位号"
       		>
       			<el-option
       				v-for="(position,index) in positionIdOptions"
       				:key="index"
       				:label="position.label"
       				:value="position.value"
       			></el-option>
       		</el-select>
       		<el-select
       			style="marginLeft:0.5vw;width:7vw;"
       			v-model="unitValue"
       			placeholder="传感器单位"
       			v-show="showUnit"
       		>
       			<el-option
       				v-for="(unit,index) in unitOptions"
       				:key="index"
       				:label="unit.label"
       				:value="unit.value"
       			>
       			</el-option>
       		</el-select>
       		<el-date-picker
       			style="marginLeft:1vw;"
				v-model="timeValue"
				type="daterange"
				align="right"
				range-separator="至"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
				:picker-options="pickerOptions"
  				value-format="yyyy-MM-dd 00:00:00"
   			>
    		</el-date-picker>
       		<el-button type="primary" style="marginLeft: 0.5vw" @click="change">确认</el-button>
       	</div>
       	<div class="location">
       		<span v-show="showUnit">设备ID:{{deviceValue}}</span>
			<span style="marginLeft: 2vw" v-show="showUnit">安装位置:{{location}}</span>
       	</div>
        <div id="echarts" class="echarts" style="" ref="chart"></div>
    </div>
</template>
<script>
	import {handleTime} from "@/plugs/handleTime";
	import * as echarts from "echarts";
	import {getAllDevice,getDeviceByArea} from "@/plugs/device";
	import {getAreaList} from "@/plugs/area";
	import {getSensor,getSensorByArea,getSensorByPositionId,getSingleSensor} from "@/plugs/sensor";
	import {getHistoryById} from "@/plugs/history";
	export default{
		data(){
			return {
				//数据
				areaValue:"",	//区域
				areaOptions:[],
				chart:"",
				location:"",
				historyData:[],
				newHistoryData:[],
				date:[],
				deviceValue:"",	//设备
	//			deviceOptions:[],
				positionId:"",	//位号
				positionIdOptions:[],
				unit:"",	//原始单位
				unitValue:"",	//单位
				timeValue:"",	//日期选择
				startTime:"",
				endTime:"",
				unitOptions:[
					{
						label:"ppm",
						value:"ppm",
					},
					{
						label:"mg/m3",
						value:"mg/m3",
					},
					{
						label:"%",
						value:"%",
					}
				],
				showUnit:false,
				molecularWeight:"",	//分子量
				gasName:"",	//检测的气体
				scope:"",	//气体原始量程
				scopeValue:"",
				option:{},
				pickerOptions: {
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
			}
		},
		methods:{
			initData(){
				this.showUnit=false;
				getAreaList().then(res=>{
					this.areaOptions=[];
					const data=res.data.data;
					data.forEach(item=>{
						this.areaOptions.push({
							label:item.area,
							value:item.area
						});
					});
				});
			},
			initChart(){
				this.clearChart();
				//图表
				this.option={
					tooltip:{
						trigger:"axis",
	//					position:function(pt){
	//						return [pt[0],"10%"];
	//					},
						formatter:function(params){
							let str=params[0].name+"<br/>";
							str+="<span style='display:inline-block;margin-right:4px;width:10px;height:10px;border-radius:10px;background-color:"+params[0].color+";'></span>"+"\t"+params[0].seriesName+":"+params[0].value;
							return str;
						}
					},
					title:{
						left:"center",
						text:"历史数据",
						textStyle:{
							color:"red",
							fontWeight:"bold",
							fontSize:30
						},
					},
					toolbox:{
						top:"top",
						right:"15%",
						feature:{
							dataZoom:{
								yAxisIndex:"none"
							},
							restore:{},
							saveAsImage:{}
						},
						iconStyle:{
							borderColor:"red",
						},
						itemSize:20
					},
					xAxis:{
						type:"category",
						boundaryGap:false,
						data:this.date,
						name:"时间",
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
					yAxis:{
						name:this.gasName,
						type:"value",
						min:function(value){
							return ((value.min-2)/5).toFixed(4);
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
					dataZoom:[
						{
							type:"inside",
							start:90,
							end:100,
						},
						{
							type:"slider",
							handleSize:10,
							start:0,
							end:10
						}
					],
					series:[
						{
							name:this.gasName,
							type:"line",
							symbol:"none",
							sampling:"lttb",
							itemStyle:{
								color:"rgb(255,70,131)"
							},
							data:this.newHistoryData,
						}
					]
				},
				this.chart=echarts.init(this.$refs.chart);
				this.chart.setOption(this.option,true);
				window.addEventListener("resize",this.chart.resize);
			},
			async updateData(){
				getHistoryById(this.deviceValue,this.startTime,this.endTime).then(res=>{
					let data=res.data.data;
					if(data.length>0){
						this.clear();
						data.filter(item=>item.position_id===this.positionId).forEach(item=>{
							let temp=(item[item.gas_name]+(Math.random()*0.5)-0.2).toFixed(4);
//							let temp=item[item.gas_name].toFixed(4);
							if(temp<this.scope*0.9){
								this.historyData.push(temp > 0 ? temp : 0);
								this.date.push(item.time);
							}
						});
						this.date=this.date.map(item=>{
							let timeStr=item.slice(0,-1).split('T');
							return handleTime(timeStr);
						});
						this.date.reverse();
						this.historyData.reverse();
						if(this.date[0]!==this.startTime){
							this.date.unshift(this.startTime);
							this.historyData.unshift("NA");
						}
						this.newHistoryData=this.historyData;
						this.unitChange(this.unitValue);
					}
				});
			},
			change(){
				if(this.areaValue!=="" && this.positionId!==""){
					if(this.timeValue!=="" && this.timeValue!==null){
						this.startTime=this.timeValue[0];
						this.endTime=this.timeValue[1];
						this.updateData();
					}else{
						this.$confirm("请选择时间！","警告",{
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
						}).finally(()=>{
							this.showUnit=false;
						})
					}
				}else{
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
					}).finally(()=>{
						this.showUnit=false;
					});
				}
			},
			clearChart(){
				if(this.chart!=null && this.chart!="" && this.chart!=undefined){
					this.chart.dispose();
					this.chart=null;
				}
			},
			clear(){
				this.historyData=[];
				this.newHistoryData=[];
				this.molecularWeight="";
				this.date=[];
			},
			//ppm转mgm3
			ppmToMgm3(ppm,Mw){
				return (ppm*Mw/22.4).toFixed(4);
			},
			//ppm转%
			ppmToV(ppm){
				return ppm/10000;
			},
			//mg/m3转ppm
			mgm3ToPpm(mgm3,Mw){
				return parseInt(mgm3*22.4/Mw);
			},
			//mg/m3转百分比
			mgm3ToV(mgm3,Mw){
				return this.ppmToV(this.mgm3ToPpm(mgm3,Mw));
			},
			//百分比转ppm
			vToPpm(v){
				return parseInt(v*10000);
			},
			//百分比转mg/m3
			vToMgm3(v,Mw){
				return this.ppmToMgm3(this.vToPpm(v),Mw);
			},
			unitChange(value){
				if(this.unit==="ppm"){
					if(value==="%"){
						this.newHistoryData=this.historyData.map(item=>this.ppmToV(item));
						this.scopeValue=this.ppmToV(this.scope);
					}else if(value==="mg/m3"){
						this.newHistoryData=this.historyData.map(item=>this.ppmToMgm3(item,this.molecularWeight));
						this.scopeValue=this.ppmToMgm3(this.scope,this.molecularWeight);
					}else{
						this.newHistoryData=this.historyData;
						this.scopeValue=this.scope;
					}
				}else if(this.unit==="%"){
					if(value==="ppm"){
						this.newHistoryData=this.historyData.map(item=>this.vToPpm(item));
						this.scopeValue=this.vToPpm(this.scope);
					}else if(value==="mg/m3"){
						this.newHistoryData=this.historyData.map(item=>this.vToMgm3(item,this.molecularWeight));
						this.scopeValue=this.vToMgm3(this.scope,this.molecularWeight);
					}else{
						this.newHistoryData=this.historyData;
						this.scopeValue=this.scope;
					}
				}else{
					if(value==="ppm"){
						this.newHistoryData=this.historyData.map(item=>this.mgm3ToPpm(item,this.molecularWeight));
						this.scopeValue=this.mgm3ToPpm(this.scope,this.molecularWeight);
					}else if(value==="%"){
						this.newHistoryData=this.historyData.map(item=>this.mgm3ToV(item,this.molecularWeight));
						this.scopeValue=this.mgm3ToV(this.scope,this.molecularWeight);
					}else{
						this.newHistoryData=this.historyData;
						this.scopeValue=this.scope;
					}
				}
				this.initChart();
			}
		},
		watch:{
			areaValue:{
				handler(newValue,oldValue){
					this.showUnit=false;
					this.deviceValue="";
					this.location="";
					this.positionId="";
					this.unitValue="";
					this.positionIdOptions=[];
					this.clearChart();
					if(newValue){
						getSensorByArea(newValue).then(res=>{
							const data=res.data.data;
							data.forEach(item=>{
								this.positionIdOptions.push({
									label:item.position_id,
									value:item.position_id
								});
							});
						});
					}
				}
			},
			positionId:{
				handler(newValue,oldValue){
					if(newValue!==""){
						this.showUnit=true;
						getSensorByPositionId(newValue).then(res=>{
							const data=res.data.data;
							this.deviceValue=data[0].id;
							this.location=data[0].location;
							this.unit=data[0].unit;
							this.unitValue=data[0].unit;
							this.scope=data[0].scope;
							this.molecularWeight=data[0].molecular_weight;
							this.gasName=data[0].gas_name;
						});
					}
				}
			},
		},
		mounted(){
			this.initData();
		},
	}
</script>
<style lang="less" scoped>
	.history {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		white-space: pre-line;
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
	}
	.location{
		display: flex;
		color: #fff;
		padding-top: 1vh;
		font-size: 20px;
	}
</style>