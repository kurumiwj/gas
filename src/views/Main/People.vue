<template>
    <div class="people">
       	<div class="location">
       		<span >设备ID:{{deviceId}}</span>
			<span style="marginLeft: 2vw">安装位置:{{location}}</span>
       	</div>
        <div id="echarts" class="echarts" style="" ref="chart"></div>
    </div>
</template>
<script>
	import {handleTime,handleUTCTime} from "@/utils/handleTime";
	import * as echarts from "echarts";
	import {getHistory} from "@/api/history";
	export default{
		name:"People",
		data(){
			return {
				chart:"",
				date:[],
				deviceId:"",	//设备
				location:"",
				peopleData:[],
				positionId:"",	//位号
			}
		},
		methods:{
			initChart(){
				this.clearChart();
				//图表
				this.option={
					tooltip:{
						trigger:"axis",
						formatter:function(params){
							let str=params[0].name+"<br/>";
							str+="<span style='display:inline-block;margin-right:4px;width:10px;height:10px;border-radius:10px;background-color:"+params[0].color+";'></span>"+"\t"+params[0].seriesName+":"+params[0].value;
							return str;
						}
					},
					title:{
						left:"center",
						text:"人员信息",
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
						position:"bottom",
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
						name:"人员信息",
						type:"value",
						min:-1,
						max:3,
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
							name:"是否有人",
							type:"line",
							symbol:"none",
							sampling:"lttb",
							itemStyle:{
								color:"rgb(255,70,131)"
							},
							data:this.peopleData,
						}
					]
				},
				this.chart=echarts.init(this.$refs.chart);
				this.chart.setOption(this.option,true);
				window.addEventListener("resize",this.chart.resize);
			},
			updateData(){
				getHistory(this.deviceId,1000).then(res=>{
					const data=res.data;
					if(data.length>0){
						this.clear();
						data.forEach(item=>{
							this.date.push(item.time);
							this.peopleData.push(item.people);
						});
						this.date=this.date.map(item=>{
							let timeStr=item.slice(0,-1).split('T');
							return handleUTCTime(timeStr);
						});
					}
				}).then(()=>{
					this.initChart();
				});
			},
			clearChart(){
				if(this.chart!=null && this.chart!="" && this.chart!=undefined){
					this.chart.dispose();
					this.chart=null;
				}
			},
			clear(){
				this.peopleData=[];
				this.date=[];
			},
		},
		mounted(){
			this.deviceId=this.$route.query.id;
			this.positionId=this.$route.query.position_id;
			this.location=this.$route.query.location;
			this.updateData();
		},
		beforeDestroy(){
			this.$route.params.positionId=undefined;
		}
	}
</script>
<style lang="less" scoped>
	.people {
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
	}
	.location{
		display: flex;
		color: #fff;
		padding-top: 1vh;
		font-size: 20px;
	}
</style>