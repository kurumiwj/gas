<template>
    <div class="UpdateUser">
        <el-form class="form" :rules="rules" :model="ruleForm" ref="ruleForm">
           	<el-form-item class="elFormItem" prop="name" label="用户名">
           		<el-input
					class="input"
					type="text"
					v-model="ruleForm.name"
					placeholder="用户名"
				></el-input>
           	</el-form-item>
           	<el-form-item class="elFormItem" prop="password" label="密码">
           		<el-input
					class="input"
					type="password"
					v-model="ruleForm.password"
					placeholder="请输入6~18位密码，密码由字母数字以及下划线组成且不能以数字开头"
					autocomplete="new-password"
					minlength=6
					maxlength=18
					show-password
				></el-input>
           	</el-form-item>
           	<el-form-item class="elFormItem" prop="permission" label="权限">
           		<el-input
					class="input"
					type="text"
					v-model="ruleForm.permission"
					placeholder="权限(输入1~12之间的数字，中间用逗号分隔)"
				></el-input>
           	</el-form-item>
           	<el-form-item class="elFormItem" prop="tel" label="联系方式">
           		<el-input
					class="input"
					type="text"
					v-model="ruleForm.tel"
					placeholder="联系方式"
				></el-input>
           	</el-form-item>
           	<el-form-item class="elFormItem">
           		<el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
            	<el-button type="primary" @click="resetForm('ruleForm')">重置</el-button>
           	</el-form-item>
        </el-form>
    </div>
</template>
<script>
import {updateUser} from "@/api/user";
import {addLog} from "@/api/log";
import {mapState} from "vuex";
import {isValidPhone,isValidPermission,isValidPassword} from "@/utils/validate";
export default {
	name:"UpdateUser",
    data() {
        return {
			ruleForm:{
				id:"",
				name:"",
				password:"",
				permission:"",
				tel:""
			},
			rules:{
				name:[
					{required:true,message:"用户名不能为空",trigger:"blur"},
					{min:2,max:20,message:"用户名在2~20位之间",trigger:"change"},
				],
				password:[
					{required:true,message:"密码不能为空",trigger:"blur"},
					{min:6,max:18,message:"密码在6~18位之间",trigger:"change"},
					{validator:isValidPassword,trigger:"blur"},
				],
				permission:[
					{required:true,message:"权限不能为空",trigger:"blur"},
					{validator:isValidPermission,trigger:"blur"},
				],
				tel:[
					{required:true,message:"联系方式不能为空",trigger:"blur"},
					{validator:isValidPhone,trigger:"blur"},
				]
			},
        }
    },
	computed:{
		...mapState("user",["name"]),
	},
    methods: {
        submitForm(formName){
			this.$refs[formName].validate(valid=>{
				if(valid){
					updateUser(this.ruleForm).then(
						res=>{
							this.$router.go(-1);
						},
						error=>{console.error(error);}
					);
					let content=this.name+"修改了用户"+this.ruleForm.name;
					addLog(this.name,content);
				}else return false;
			})
		},
		resetForm(formName){
			this.$refs[formName].resetFields();
		},
		getUserInfoByRoute(){
			const data=this.$route.params.row;
			this.$set(this.ruleForm,"id",data.id);
			this.$set(this.ruleForm,"name",data.name);
			this.$set(this.ruleForm,"permission",data.permission);
			this.$set(this.ruleForm,"tel",data.tel);
		},
    },
	mounted(){
		this.getUserInfoByRoute();
	},
}
</script>
<style lang="less" scoped>
/deep/.el-input__inner{
    background-color: rgba(16, 44, 58, 0.8);
    color: #fff;
}
</style>
<style lang="less">
.UpdateUser{
    width: 100%;
    height: 100%;
    .form{
        margin: 0 auto;
        margin-top: 5%;
        width: 90%;
		.input{
			width: 100%;
		}
		.elFormItem .el-form-item__label{
			color: #ffffff;
		}
    }
}
</style>
