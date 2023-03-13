<template>
    <div class="CreateDevice">
        <el-form class="form" :rules="rules" :model="ruleForm" ref="ruleForm">
           	<el-form-item class="elFormItem" prop="id" label="设备ID">
           		<el-input class="input" v-model="ruleForm.id" placeholder="设备ID(由数字和小写字母组成,形如00xx00xx)"></el-input>
           	</el-form-item>
           	<el-form-item class="elFormItem" prop="location" label="安装位置">
           		<el-input class="input" v-model="ruleForm.location" placeholder="安装位置"></el-input>
           	</el-form-item>
            <el-form-item class="elFormItem" prop="area" label="安装区域">
            	<el-select class="input" v-model="ruleForm.area" placeholder="安装区域">
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
            
            <el-divider content-position="left">传感器1</el-divider>
            <!-- <p>传感器1</p> -->
            <el-form-item class="elFormItem" prop="sensor[0].position_id" label="位号">
            	<el-input class="input" v-model="ruleForm.sensor[0].position_id" placeholder="位号(例:GT-00110022-A)"></el-input>
            </el-form-item>
            <el-form-item class="elFormItem" prop="sensor[0].gas_name" label="检测气体">
            	<el-input class="input" v-model="ruleForm.sensor[0].gas_name" placeholder="检测气体"></el-input>
            </el-form-item>
            <el-form-item class="elFormItem" prop="sensor[0].scope" label="量程">
            	<el-input class="input" v-model="ruleForm.sensor[0].scope" placeholder="量程"></el-input>
            </el-form-item>
            <el-form-item class="elFormItem" prop="sensor[0].unit" label="单位">
            	<el-input class="input" v-model="ruleForm.sensor[0].unit" placeholder="单位(ppm,mg/m3,%)"></el-input>
            </el-form-item>
            <el-form-item class="elFormItem" prop="sensor[0].molecular_weight" label="分子量">
            	<el-input class="input" v-model="ruleForm.sensor[0].molecular_weight" placeholder="分子量(0-1000)"></el-input>
            </el-form-item>
            <el-form-item class="elFormItem" prop="sensor[0].alarmValue1" label="一级报警阈值">
            	<el-input class="input" v-model="ruleForm.sensor[0].alarmValue1" placeholder="一级报警阈值(0-100,百分比)"></el-input>
            </el-form-item>
            <el-form-item class="elFormItem" prop="sensor[0].alarmValue2" label="二级报警阈值">
            	<el-input class="input" v-model="ruleForm.sensor[0].alarmValue2" placeholder="二级报警阈值(0-100,百分比)"></el-input>
            </el-form-item>
            
            <el-divider content-position="left">传感器2</el-divider>
            <!-- <p>传感器2</p> -->
            <el-form-item class="elFormItem" prop="sensor[1].position_id" label="位号">
            	<el-input class="input" v-model="ruleForm.sensor[1].position_id" placeholder="位号(例:GT-00110022-B)"></el-input>
            </el-form-item>
            <el-form-item class="elFormItem" prop="sensor[1].gas_name" label="检测气体">
            	<el-input class="input" v-model="ruleForm.sensor[1].gas_name" placeholder="检测气体"></el-input>
            </el-form-item>
            <el-form-item class="elFormItem" prop="sensor[1].scope" label="量程">
            	<el-input class="input" v-model="ruleForm.sensor[1].scope" placeholder="量程"></el-input>
            </el-form-item>
            <el-form-item class="elFormItem" prop="sensor[1].unit" label="单位">
            	<el-input class="input" v-model="ruleForm.sensor[1].unit" placeholder="单位(ppm,mg/m3,%)"></el-input>
            </el-form-item>
            <el-form-item class="elFormItem" prop="sensor[1].molecular_weight" label="分子量">
            	<el-input class="input" v-model="ruleForm.sensor[1].molecular_weight" placeholder="分子量(0-1000)"></el-input>
            </el-form-item>
            <el-form-item class="elFormItem" prop="sensor[1].alarmValue1" label="一级报警阈值">
            	<el-input class="input" v-model="ruleForm.sensor[1].alarmValue1" placeholder="一级报警阈值(0-100,百分比)"></el-input>
            </el-form-item>
            <el-form-item class="elFormItem" prop="sensor[1].alarmValue2" label="二级报警阈值">
            	<el-input class="input" v-model="ruleForm.sensor[1].alarmValue2" placeholder="二级报警阈值(0-100,百分比)"></el-input>
            </el-form-item>
            
            <el-divider content-position="left"></el-divider>
            <el-button type="primary" @click="submitForm('ruleForm')">创建</el-button>
            <el-button type="primary" @click="resetForm('ruleForm')">重置</el-button>
        </el-form>
    </div>
</template>
<script>
import {addLog} from "@/api/log";
import {getAreaList} from "@/api/area";
import {mapState,mapActions} from "vuex";
import {isValidAlarmValue,isValidAtmosphere,isValidDeviceId,isValidMolecularWeight,isValidSensor,isValidTemperature,isValidUnit} from "@/utils/validate";
export default {
	name:"CreateDevice",
    data() {
        return {
			areaOptions:[],
			ruleForm:{
				id:"",
				location:"",
				area:"",
				temperature:"",
				atmosphere:"",
				sensor:[
					{
						position_id:"",
						gas_name:"",
						scope:"",
						unit:"",
						molecular_weight:"",
						alarmValue1:"",
						alarmValue2:"",
					},
					{
						position_id:"",
						gas_name:"",
						scope:"",
						unit:"",
						molecular_weight:"",
						alarmValue1:"",
						alarmValue2:"",
					},
				],
			},
			rules:{
				//设备校验规则
				id:[
					{required:true,message:"设备id不能为空",trigger:"blur"},
					{min:8,max:8,message:"id只能为8位",trigger:"change"},
					{validator:isValidDeviceId,trigger:"blur"},
				],
				location:[
					{required:true,message:"安装位置不能为空",trigger:"blur"},
				],
				area:[
					{required:true,message:"安装区域不能为空",trigger:"change"},
				],
				temperature:[
					{required:true,message:"温度不能为空",trigger:"blur"},
					{validator:isValidTemperature,trigger:"blur"},
				],
				atmosphere:[
					{required:true,message:"压强不能为空",trigger:"blur"},
					{validator:isValidAtmosphere,trigger:"blur"},
				],
				//传感器1校验规则
				"sensor[0].position_id":[
					{required:true,message:"传感器位号不能为空",trigger:"blur"},
                    {validator:isValidSensor,trigger:"blur"}
				],
				"sensor[0].gas_name":[
					{required:true,message:"气体名称不能为空",trigger:"blur"},
				],
				"sensor[0].scope":[
					{required:true,message:"气体量程不能为空",trigger:"blur"},
				],
				"sensor[0].unit":[
					{required:true,message:"气体单位不能为空",trigger:"blur"},
					{validator:isValidUnit,trigger:"blur"},
				],
				"sensor[0].molecular_weight":[
					{required:true,message:"气体分子量不能为空",trigger:"blur"},
					{validator:isValidMolecularWeight,trigger:"blur"},
				],
				"sensor[0].alarmValue1":[
					{required:true,message:"一级报警阈值不能为空",trigger:"blur"},
					{validator:isValidAlarmValue,trigger:"blur"},
				],
				"sensor[0].alarmValue2":[
					{required:true,message:"二级报警阈值不能为空",trigger:"blur"},
					{validator:isValidAlarmValue,trigger:"blur"},
				],
				//传感器2校验规则
				"sensor[1].position_id":[
					{required:true,message:"传感器位号不能为空",trigger:"blur"},
                    {validator:isValidSensor,trigger:"blur"}
				],
				"sensor[1].gas_name":[
					{required:true,message:"气体名称不能为空",trigger:"blur"},
				],
				"sensor[1].scope":[
					{required:true,message:"气体量程不能为空",trigger:"blur"},
				],
				"sensor[1].unit":[
					{required:true,message:"气体单位不能为空",trigger:"blur"},
					{validator:isValidUnit,trigger:"blur"},
				],
				"sensor[1].molecular_weight":[
					{required:true,message:"气体分子量不能为空",trigger:"blur"},
					{validator:isValidMolecularWeight,trigger:"blur"},
				],
				"sensor[1].alarmValue1":[
					{required:true,message:"一级报警阈值不能为空",trigger:"blur"},
					{validator:isValidAlarmValue,trigger:"blur"},
				],
				"sensor[1].alarmValue2":[
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
        ...mapActions("device",["addDevice"]),
		resetForm(formName){
			this.$refs[formName].resetFields();
		},
		submitForm(formName){
			this.$refs[formName].validate(valid=>{
				if(valid){
					this.addDevice(this.ruleForm).then(()=>{
                        this.$message({
                            type:"success",
                            center:true,
                            message:"创建设备成功！"
                        });
						this.$router.back();
					});
				}else{
					this.$notify({
						type:"error",
						message:"数据未填写完整，请仔细核对！"
					});
					return false;
				}
			});
			let content=this.name+"创建了设备"+this.ruleForm.id;
			addLog(this.name,content);
		}
    },
	mounted(){
		getAreaList().then(res=>{
			const data=res.data;
			data.forEach(item=>{
				this.areaOptions.push({
					label:item.area,
					value:item.id
				});
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
</style>
<style lang="less" scoped>
.CreateDevice{
    width: 100%;
    height: 100%;
    .form{
        margin: 0 auto;
        width: 90%;
		height: 100%;
        display: flex;
        flex-wrap: wrap;
		// overflow-y: scroll;
/*        justify-content: space-between;*/
        .input{
            width: 15vw;
			margin-right: 2vw;
        }
		
    }
}
</style>