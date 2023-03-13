<template>
    <div class="login">
        <p class="title">一种无线测量工厂危险气体系统</p>
        <div class="box">
            <div class="border_corner border_corner_left_top"></div>
            <div class="border_corner border_corner_right_top"></div>
            <div class="border_corner border_corner_left_bottom"></div>
            <div class="border_corner border_corner_right_bottom"></div>
            <div class="main">
                <el-form
                    ref="loginForm"
                    :model="loginForm"
                    :rules="loginRules"
                    class="login-form"
                    autocomplete="on"
                    label-position="left"
                >
                    <el-form-item prop="name">
                        <div class="input">
                            <span class="text">帐号:</span>
                            <el-input
                                v-model="loginForm.name"
                                placeholder="请输入账号"
                                name="name"
                                type="text"
                                tabindex="1"
                                maxlength="25"
                                autocomplete="on"
                            ></el-input>
                        </div>
                    </el-form-item>
                    <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
                        <el-form-item prop="password">
                            <div class="input" style="marginTop:1vh">
                                <span class="text">密码:</span>
                                <el-input
                                    v-model="loginForm.password"
                                    placeholder="请输入密码"
                                    :type="passwordType"
                                    ref="password"
                                    :key="passwordType"
                                    name="password"
                                    tabindex="2"
                                    autocomplete="on"
                                    @keyup.native="checkCapslock"
                                    @blur="capsTooltip=false"
                                    @keyup.enter.native="handleLogin"
                                ></el-input>
                                <span class="show-pwd" @click="showPwd">
                                    <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                                </span>
                            </div>
                        </el-form-item>
                    </el-tooltip>
                    <div class="operator">
                        <el-button
                            :loading="loading"
                            type="primary"
                            style="marginTop: 1.5vh;width:40%"
                            size="medium"
                            @click.native.prevent="handleLogin"
                        >登录</el-button>
                        <el-link style="marginTop:1.5vh;" href="/register" type="primary">点击注册</el-link>
                    </div>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
import { login } from "@/api/user";
import {setCurrentUser} from "@/utils/currentUser";
import {isValidUserName,isValidPassword} from "@/utils/validate";
import {Message} from "element-ui";
export default {
	name:"Login",
    data() {
        return {
            account: "",
            capsTooltip:false,
            loading:false,
            loginForm: {
                name: "",
                password: ""
            },
            loginRules: {
                name: [
                    {required: true,trigger: 'blur',message:"用户名不能为空"},
                    {validator:isValidUserName,trigger:"blur"},
                    {min:2,max:15,trigger:"blur",message:"用户名必须在2~15位之间"}
                ],
                password: [
                    {required: true,trigger: 'blur',message:"密码不能为空"},
                    {validator:isValidPassword,trigger:"blur"},
                    {min:6,max:18,trigger:"blur",message:"密码必须在6~18位之间"}
                ]
            },
            password: "",
            passwordType:"password",
            showDialog:false,
            redirect:"/main/measure",
        };
    },
    methods: {
        checkCapslock(e){
            const {key}=e;
            this.capsTooltip=key && key.length===1 && (key>='A'&&key<='Z');
        },
        handleLogin() {
            this.$refs.loginForm.validate(valid=>{
                if(valid){
                    this.loading=true;
                    this.$store.dispatch("user/login",this.loginForm).then(res=>{
                        setCurrentUser(this.loginForm.name);
                        this.$router.push({
                            path:this.redirect || "/"
                        });
                    }).catch(err=>{
                        Message.error("登录失败！");
                        console.log(err.message);
                    }).finally(()=>{
                        this.loading=false;
                    });
                }else{
                    console.log("账号或密码错误!");
                    return false;
                }
            }); 
        },
        showPwd(){
            if(this.passwordType==="password"){
                this.passwordType="";
            }else{
                this.passwordType="password";
            }
            this.$nextTick(()=>{
                this.$refs.password.focus();
            });
        }
    },
};
</script>
<style lang="less" scoped>
/deep/.el-input__inner{
    background-color: rgba(16, 44, 58, 0.8);
}
</style>
<style lang="less" scoped>
.login {
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: #fff;
    .title{
        font-size: 3.5rem;
        margin-bottom: 10vh;
        z-index: 1;
    }
    .box {
        height: 50vh;
        width: 50vw;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(8, 37, 41, 0.3);
        z-index: 1;
        .main {
            width: 80%;
            height: 80%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-around;

            .input {
                display: flex;
                align-items: center;
                white-space: nowrap;
                .text {
                    margin-right: 1vw;
                }
                .show-pwd {
                    position: absolute;
                    right: 10px;
                    top: 7px;
                    font-size: 16px;
                    color: red;
                    cursor: pointer;
                    user-select: none;
                    z-index:2;
                }
            }

            .operator{
                display:flex;
                justify-content:space-around;
            }
        }
        .border_corner {
            z-index: 2500;
            position: absolute;
            width: 8px;
            height: 8px;
            background: rgba(0, 0, 0, 0);
            border: 2px solid #22B1D1;
        }
        .border_corner_left_top {
            top: 0;
            left: 0;
            border-right: none;
            border-bottom: none;
        }
        .border_corner_right_top {
            top: 0;
            right: 0;
            border-left: none;
            border-bottom: none;
        }
        .border_corner_left_bottom {
            bottom: 0;
            left: 0;
            border-right: none;
            border-top: none;
        }
        .border_corner_right_bottom {
            bottom: 0;
            right: 0;
            border-left: none;
            border-top: none;
        }
    }
}
</style>
