<template>
    <div class="Register">
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
					placeholder="请输入6~18位密码，密码由字母数字组成且不能以数字开头"
					autocomplete="new-password"
					minlength=6
					maxlength=18
					show-password
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
           		<el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
            	<el-button type="primary" @click="resetForm('ruleForm')">重置</el-button>
           	</el-form-item>
        </el-form>
    </div>
</template>
<script>
import {register} from "@/api/user";
import {isValidPhone,isValidPassword,isValidUserName} from "@/utils/validate";
export default {
	name:"Register",
    data() {
        return {
			ruleForm:{
				name:"",
				password:"",
				tel:""
			},
			rules:{
				name:[
					{required:true,message:"用户名不能为空",trigger:"blur"},
					{min:2,max:20,message:"用户名在2~20位之间",trigger:"change"},
					{validator:isValidUserName,trigger:"blur"},
				],
				password:[
					{required:true,message:"密码不能为空",trigger:"blur"},
					{min:6,max:18,message:"密码在6~18位之间",trigger:"change"},
					{validator:isValidPassword,trigger:"blur"},
				],
				tel:[
					{required:true,message:"联系方式不能为空",trigger:"blur"},
					{validator:isValidPhone,trigger:"blur"},
				]
			},
        }
    },
    methods: {
        submitForm(formName){
			this.$refs[formName].validate(valid=>{
				if(valid){
					this.$confirm("确认注册？","提示",{
						confirmButtonText:"确定",
						cancelButtonText:"取消",
						type:"warning",
						center:true
					}).then(()=>{
						register(this.ruleForm).then(res=>{
                            console.log(res);
							if(res.code===200){
								this.$notify({
									title:"成功",
									message:"注册新用户成功",
									type:"success",
								});
								setTimeout(()=>{
									this.$router.go(-1);
								},2000);
							}else{
								this.$notify.info({
									title:"失败",
									message:"密码不合法"
								});
							}
						});
					}).catch(()=>{
						this.$notify.info({
							title:"失败",
							message:"已取消注册"
						});
					});
				}else return false;
			})
		},
		resetForm(formName){
			this.$refs[formName].resetFields();
		}
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
.Register{
    width: 100%;
    height: 100%;
	display: flex;
	z-index: 100;
    .form{
        margin: 0 auto;
        margin-top: 5%;
        width: 90%;
		z-index: 100;
		.input{
			width: 100%;
			z-index: 100;
		}
    }
}
</style>