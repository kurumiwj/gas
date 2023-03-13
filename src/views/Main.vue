<template>
    <div class="main">
        <div class="title">一种无线测量工厂危险气体系统</div>
        <div class="quit">
            <el-button type="danger" @click="quit">退出</el-button>
        </div>
        <div class="container">
            <div class="nav">
                <div
                    :class=getStyle(page)
                    v-for="(page, index) in navList"
                    v-show="page.name!='数据外送'&&page.name!='信息发布管理'"
                    :key="index"
                    @click="pageTo(page.permission, page.url)"
                >
					<i :class="'el-icon-'+page.icon"></i>
					{{ page.name }}
                    <img :src="getPicture(page.permission)" alt="" class="arrow" />
                </div>
            </div>
            <div class="contents">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<script>
import {getAlarmSensor} from "@/api/sensor";
import {getRealtimeDevice} from "@/api/device";
import {getOfflineDevice} from "@/api/online";
import bus from "@/api/bus";
import {Message} from "element-ui";
import {mapState,mapActions} from "vuex";
export default {
	name:"Main",
    data() {
        return {
            baseUrl: process.env.BASE_URL,
            pageIndex: 2,
			totalAlarm:0,	//记录报警传感器总数
            totalOffline:0, //总掉线设备
			totalOnline:0,   //总在线设备
            totalDevice:0,  //总设备
			timerId:null,
        };
    },
    computed: {
        ...mapState("user",["navList"]),
        getPicture() {
            return (index) => {
                let src = this.baseUrl + "icon/right.png";
                if (this.pageIndex == index) {
                    src = this.baseUrl + "icon/down.png";
                } else {
                    src = this.baseUrl + "icon/right.png";
                }
                return src;
            };
        },
    },
    methods: {
        ...mapActions("user",["logout"]),
        pageTo(index, url) {
			if (!url) {
                return;
            }
            if (url == "chart") {
                getRealtimeDevice().then(res=>{
					const data=res.data;
					this.$router.push("/main/"+url+'/'+data[0].position_id);
				})
            }else{
				this.$router.push("/main/" + url);
			}
            this.pageIndex = index;
        },
        async getNavList(){
            await this.$store.dispatch("user/getNavList");
        },
		getStyle(page){
			let style="nav_item ";
			if(this.pageIndex===page.permission){
				style+="select ";
			}
			if(page.url==="alarm" && this.totalAlarm>0){
				style+="danger ";
			}
			if(page.url==="network" && this.totalOffline>0){
				style+="danger2 ";
			}
			return style;
		},
        quit(){
            this.$store.dispatch("user/resetToken").then(()=>{
                this.$router.push("/");
                Message.warning("退出成功");
                this.logout();
            });
        }
    },
	mounted(){
        this.getNavList();
		getAlarmSensor().then(res=>{
			const data=res.data;
			this.totalAlarm=data.length;
		});
		getOfflineDevice().then(res=>{
			const data=res.data;
			this.totalOffline=data.length;
		});
        this.$bus.$on("changeNetworkStyle",({online,total})=>{
            this.totalOnline=online;
            this.totalDevice=total;
            this.totalOffline=total-online;
        });
        this.$bus.$on("changeAlarmStyle",({total})=>{
            this.totalAlarm=total;
        });
	},
    created() {
        bus.$on("Chart", () => {
            this.pageIndex = 3;
        });
        let path = this.$route.path;
		if(path.indexOf("measure") != -1) {
            this.pageIndex=2;
        }else if(path.indexOf("chart") != -1) {
            this.pageIndex=3;
        }else if(path.indexOf("history")!=-1){
			this.pageIndex=4;
		}else if(path.indexOf("alarmAndPeople")!=-1){
            this.pageIndex=5;
        }else if(path.indexOf("alarm") != -1) {
            this.pageIndex = 6;
        }else if(path.indexOf('network')!=-1){
			this.pageIndex=7;
		}else if(path.indexOf("device") != -1) {
            this.pageIndex=8;
        }else if(path.indexOf('download')!=-1){
			this.pageIndex=9;
		}else if(path.indexOf("area")!=-1){
			this.pageIndex=10;
		}else if(path.indexOf("log")!=-1){
			this.pageIndex=11;
		}else if(path.indexOf("user")!=-1){
			this.pageIndex=12;
		}
    },
	beforeDestroy(){
		clearInterval(this.timerId);
		this.timerId=null;
	},
	inject:["reload"],
};
</script>
<style lang="less" scoped>
.main {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
	@keyframes redPulse{
		from{
			background-color: red;
		}
		25%{
			background-color: #dd0000;
			opacity:0.75;
		}
		50%{
			background-color: #bc330d;
			opacity: 0.5;
		}
		75%{
			background-color: #dd0000;
			opacity: 0.75;
		}
		to{
			background-color: red;
		}
	}
    .pop {
        width: 100vw;
        height: 100vh;
        position: absolute;
        left: 0;
        top: 0;
        background-color: rgba(0, 0, 0, 0.4);
    }
    .title {
        font-size: 3.5rem;
        color: #ffffff;
        z-index: 10;
    }
    .container {
        width: 95vw;
        height: 85vh;
        margin-top: 2vh;
        display: flex;
        justify-content: space-between;
        z-index: 10;
        .nav {
            width: 10%;
            height: 100%;
            display: flex;
            flex-direction: column;
            .nav_item {
                height: 8%;
                width: 100%;
                display: flex;
                align-items: center;
                color: #ffffff;
                background-color: #131d2c;
                position: relative;
                img {
                    height: 20%;
                    margin-right: 4%;
                    margin-left: 4%;
                }
                .arrow{
                    position: absolute;
                    right: 2.5%;
                    width: 10px;
                }
                &:hover {
                    cursor: pointer;
                    background-color: #00e1e5;
                    color: #121a27;
                }
            }
            .select {
                background-color: #00e1e5;
                color: #121a27;
            }
			.danger{
				animation: redPulse 1000ms infinite;
			}
			.danger2{
				background-color:#dd0000;
			}
        }
        .contents {
            width: 87.5%;
            height: 100%;
        }
    }
    .quit{
        height:40px;
        width:1500px;
        display:flex;
        justify-content:flex-end;
        z-index:10;
    }
}
</style>
<style>
.el-table .el-table__cell{
    padding:0;
}
</style>