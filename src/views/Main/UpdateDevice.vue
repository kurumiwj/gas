<template>
    <div class="UpdateDevice">
        <el-form class="form" :rules="rules" :model="ruleForm" ref="ruleForm">
           	<el-form-item class="elFormItem" prop="id" label="设备ID(禁止修改)">
           		<el-input class="input" v-model="ruleForm.id" placeholder="设备ID(由数字和小写字母组成,形如00xx00xx)" :disabled="true"></el-input>
           	</el-form-item>
           	<el-form-item class="elFormItem" prop="location" label="安装位置">
           		<el-input class="input" v-model="ruleForm.location" placeholder="安装位置"></el-input>
           	</el-form-item>
            <el-form-item class="elFormItem" prop="area" label="安装区域">
            	<el-select class="input" v-model="ruleForm.areaId" placeholder="安装区域">
            		<el-option
            			v-for="(option,index) in areaOptions"
            			:key="index"
            			:label="option.label"
						:value="option.value"
            		></el-option>
            	</el-select>
            </el-form-item>
            <el-form-item class="elFormItem" prop="temperature" label="温度">
            	<el-input class="input" v-model="ruleForm.temperature" placeholder="温度(0-1000)"></el-input>
            </el-form-item>
            <el-form-item class="elFormItem" prop="atmosphere" label="压强">
            	<el-input class="input" v-model="ruleForm.atmosphere" placeholder="压强(0-1000)"></el-input>
            </el-form-item>
            
            <el-form-item class="elFormItem" prop="sensor.position_id" label="位号">
            	<el-input class="input" v-model="ruleForm.sensor.position_id" placeholder="位号"></el-input>
            </el-form-item>
            <el-form-item class="elFormItem" prop="sensor.gas_name" label="检测气体">
            	<el-input class="input" v-model="ruleForm.sensor.gas_name" placeholder="检测气体"></el-input>
            </el-form-item>
            <el-form-item class="elFormItem" prop="sensor.scope" label="量程">
            	<el-input class="input" v-model="ruleForm.sensor.scope" placeholder="量程"></el-input>
            </el-form-item>
            <el-form-item class="elFormItem" prop="sensor.unit" label="单位">
            	<el-input class="input" v-model="ruleForm.sensor.unit" placeholder="单位(ppm,mg/m3,%)"></el-input>
            </el-form-item>
            <el-form-item class="elFormItem" prop="sensor.molecular_weight" label="分子量">
            	<el-input class="input" v-model="ruleForm.sensor.molecular_weight" placeholder="分子量(0-1000)"></el-input>
            </el-form-item>
            <el-form-item class="elFormItem" prop="sensor.alarmValue1" label="一级报警阈值">
            	<el-input class="input" v-model="ruleForm.sensor.alarmValue1" placeholder="一级报警阈值(0-100,百分比)"></el-input>
            </el-form-item>
            <el-form-item class="elFormItem" prop="sensor.alarmValue2" label="二级报警阈值">
            	<el-input class="input" v-model="ruleForm.sensor.alarmValue2" placeholder="二级报警阈值(0-100,百分比)"></el-input>
            </el-form-item>
            <el-divider content-position="left"></el-divider>
            <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
            <el-button type="primary" @click="resetForm('ruleForm')">重置</el-button>
        </el-form>
    </div>
</template>
<script>
import {addLog} from "@/api/log";
import {getAreaList} from "@/api/area";
import { addDevice,updateDevice } from "@/api/device";
import {isValidAlarmValue,isValidAtmosphere,isValidDeviceId,isValidMolecularWeight,isValidSensor,isValidTemperature,isValidUnit} from "@/utils/validate";
import {mapState,mapActions} from "vuex";
export default {
	name:"UpdateDevice",
    data() {
        return {
			areaOptions:[],
			oldDevice:{	//存放旧设备信息,判断修改了什么
				location:"",
				area:"",
                areaId:"",
				temperature:"",
				atmosphere:"",
				positionId:"",
				gasName:"",
				scope:"",
				unit:"",
				molecularWeight:"",
				firstAlarm:"",
				secondAlarm:"",
			},
			ruleForm:{
				id:"",
				location:"",
				area:"",
                areaId:"",
				temperature:"",
				atmosphere:"",
				sensor:{
					old_position_id:"",
					position_id:"",
					gas_name:"",
					scope:"",
					unit:"",
					molecular_weight:"",
					alarmValue1:"",
					alarmValue2:"",
				},
			},
			rules:{
				id:[
					{required:true,message:"设备id不能为空",trigger:"blur"},
					{min:8,max:8,message:"id只能为8位",trigger:"change"},
				],
				location:[
					{required:true,message:"安装位置不能为空",trigger:"blur"},
				],
				areaId:[
					{required:true,message:"安装区域不能为空",trigger:"blur"},
				],
				temperature:[
					{required:true,message:"温度不能为空",trigger:"blur"},
					{validator:isValidTemperature,trigger:"blur"},
				],
				atmosphere:[
					{required:true,message:"压强不能为空",trigger:"blur"},
					{validator:isValidAtmosphere,trigger:"blur"},
				],
				"sensor.position_id":[
					{required:true,message:"传感器位号不能为空",trigger:"blur"},
                    {validator:isValidSensor,trigger:"blur"}
				],
				"sensor.gas_name":[
					{required:true,message:"气体名称不能为空",trigger:"blur"},
				],
				"sensor.scope":[
					{required:true,message:"气体量程不能为空",trigger:"blur"},
				],
				"sensor.unit":[
					{required:true,message:"气体单位不能为空",trigger:"blur"},
					{validator:isValidUnit,trigger:"blur"},
				],
				"sensor.molecular_weight":[
					{required:true,message:"气体分子量不能为空",trigger:"blur"},
					{validator:isValidMolecularWeight,trigger:"blur"},
				],
				"sensor.alarmValue1":[
					{required:true,message:"一级报警阈值不能为空",trigger:"blur"},
					{validator:isValidAlarmValue,trigger:"blur"},
				],
				"sensor.alarmValue2":[
					{required:true,message:"二级报警阈值不能为空",trigger:"blur"},
					{validator:isValidAlarmValue,trigger:"blur"},
				],
			}
        }
    },
    computed:{
    	...mapState("user",["name"])
    },
    methods: {
        ...mapActions("area",["getAreaId"]),
		resetForm(formName){
			this.$refs[formName].resetFields();
		},
		submitForm(formName){
			this.$refs[formName].validate(async valid=>{
				if(valid){
					updateDevice(this.ruleForm).then(res=>{
						const id=this.ruleForm.id;
						if(this.ruleForm.location!=this.oldDevice.location){
							let content=this.name+"修改了设备"+id+"安装位置";
							addLog(this.name,content);
						}
						if(this.ruleForm.areaId!=this.oldDevice.areaId){
							let content=this.name+"修改了设备"+id+"安装区域";
							addLog(this.name,content);
						}
						if(this.ruleForm.temperature!=this.oldDevice.temperature){
							let content=this.name+"修改了设备"+id+"温度";
							addLog(this.name,content);
						}
						if(this.ruleForm.atmosphere!=this.oldDevice.atmosphere){
							let content=this.name+"修改了设备"+id+"压强";
							addLog(this.name,content);
						}
						if(this.ruleForm.sensor.position_id!=this.oldDevice.positionId){
							let content=this.name+"修改了设备"+id+"位号";
							addLog(this.name,content);
						}
						if(this.ruleForm.sensor.gas_name!=this.oldDevice.gasName){
							let content=this.name+"修改了设备"+id+"检测气体";
							addLog(this.name,content);
						}
						if(this.ruleForm.sensor.scope!=this.oldDevice.scope){
							let content=this.name+"修改了设备"+id+"量程";
							addLog(this.name,content);
						}
						if(this.ruleForm.sensor.unit!=this.oldDevice.unit){
							let content=this.name+"修改了设备"+id+"单位";
							addLog(this.name,content);
						}
						if(this.ruleForm.sensor.molecular_weight!=this.oldDevice.molecularWeight){
							let content=this.name+"修改了设备"+id+"分子量";
							addLog(this.name,content);
						}
						if(this.ruleForm.sensor.alarmValue1!=this.oldDevice.firstAlarm){
							let content=this.name+"修改了设备"+id+"一级报警阈值";
							addLog(this.name,content);
						}
						if(this.ruleForm.sensor.alarmValue2!=this.oldDevice.secondAlarm){
							let content=this.name+"修改了设备"+id+"二级报警阈值";
							addLog(this.name,content);
						}
						this.$router.back();
					})
				}else{
					this.$notify({
						type:"error",
						message:"数据未填写完整，请仔细核对！"
					});
					return false;
				}
			});
		},
		getDeviceInfoByRoute(){
			const data=this.$route.params.row;
			this.$set(this.ruleForm,"id",data.id);
			this.$set(this.ruleForm,"location",data.location);
			this.$set(this.oldDevice,"location",data.location);
			this.$set(this.ruleForm,"area",data.area);
			this.$set(this.oldDevice,"area",data.area);
            this.$set(this.ruleForm,"areaId",data.areaId);
            this.$set(this.oldDevice,"areaId",data.areaId);
			this.$set(this.ruleForm,"temperature",data.temperature);
			this.$set(this.oldDevice,"temperature",data.temperature);
			this.$set(this.ruleForm,"atmosphere",data.atmosphere);
			this.$set(this.oldDevice,"atmosphere",data.atmosphere);
			this.$set(this.ruleForm.sensor,"old_position_id",data.position_id);
			this.$set(this.ruleForm.sensor,"position_id",data.position_id);
			this.$set(this.oldDevice,"positionId",data.position_id);
			this.$set(this.ruleForm.sensor,"gas_name",data.gas_name);
			this.$set(this.oldDevice,"gasName",data.gas_name);
			this.$set(this.ruleForm.sensor,"scope",data.scope);
			this.$set(this.oldDevice,"scope",data.scope);
			this.$set(this.ruleForm.sensor,"unit",data.unit);
			this.$set(this.oldDevice,"unit",data.unit);
			this.$set(this.ruleForm.sensor,"molecular_weight",data.molecular_weight);
			this.$set(this.oldDevice,"molecularWeight",data.molecular_weight);
			this.$set(this.ruleForm.sensor,"alarmValue1",data.first_alarm);
			this.$set(this.oldDevice,"firstAlarm",data.first_alarm);
			this.$set(this.ruleForm.sensor,"alarmValue2",data.second_alarm);
			this.$set(this.oldDevice,"secondAlarm",data.second_alarm);
		}
    },
	mounted(){
		this.getDeviceInfoByRoute();
		getAreaList().then(res=>{
			const data=res.data;
			data.forEach(item=>{
				this.areaOptions.push({
					label:item.area,
					value:item.id
				})
			});
		});
	},
}
</script>
<style lang="less" scoped>
/deep/.el-input__inner{
    background-color: rgba(16, 44, 58, 0.8);
    color: #fff;
}
/deep/.el-input.is-disabled .el-input__inner{
	background-color: rgba(192,196,204,0.5);
    color: #fff;
}
</style>
<style lang="less">
.UpdateDevice{
    width: 100%;
    height: 100%;
    .form{
        margin: 0 auto;
        width: 90%;
        display: flex;
        flex-wrap: wrap;
/*        justify-content: space-between;*/
        .input{
            width: 18vw;
			margin-right: 2vw;
        }
		.elFormItem .el-form-item__label{
			color: #ffffff;
		}
    }
}
</style>