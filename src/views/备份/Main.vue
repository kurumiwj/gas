<template>
    <div class="main">
        <div class="title">可燃有毒气体无线智能预警系统平台</div>
        <div class="container">
            <div class="nav">
                <div
                    :class="`nav_item ${
                        pageIndex == page.permission ? 'select' : ''
                    }`"
                    v-for="(page, index) in navList"
                    :key="index"
                    v-show="getPermission(page.permission)"
                    @click="pageTo(page.permission, page.url)"
                >
                    <!-- <img :src="baseUrl + 'icon/' + (pageIndex == item.permission?(item.icon+'_on'):item.icon) + '.png'" alt="" /> -->
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
import bus from "@/plugs/bus";
export default {
    data() {
        return {
            baseUrl: process.env.BASE_URL,
            navList: [
                {
                    name: "测量信息",
                    permission: 2,
                    url: "measure",
                    // icon: "measure",
					icon:"s-home",
                },
                {
                    name: "趋势信息",
                    permission: 3,
                    url: "chart",
                    // icon: "chart",
					icon:"s-data",
                },
                {
                    name: "报警信息维护",
                    permission: 4,
                    url: "maintain",
                    // icon: "chart",
                    icon: "warning",
                },
                {
                    name: "网络状态",
                    permission: 5,
					url:"network",
                    // icon: "network",
                    icon: "s-order",
                },
                {
                    name: "设备维护",
                    permission: 6,
                    url: "devMaintain",
                    // icon: "maintance",
                    icon: "s-check",
                },
                {
                    name: "报表生成",
                    permission: 7,
					url: "download",
                    // icon: "table",
                    icon: "download",
                },
                {
                    name: "风险区域识别",
                    permission: 8,
                    // icon: "area",
                    icon: "s-grid",
					url:"area"
                },
                {
                    name: "信息发布管理",
                    permission: 9,
                    // icon: "info",
					icon:"s-opportunity"
                },
                {
                    name: "数据外送",
                    permission: 10,
                    // icon: "data",
					icon:"folder",
                },
                {
                    name: "历史事件记录",
                    permission: 11,
                    url: "log",
                    icon: "s-claim",
                },
				{
					name:"用户信息",
					permission:12,
					url:"user",
					icon:"s-custom",
				}
            ],
            pageIndex: 2,
        };
    },
    computed: {
        getPermission() {
            return (index) => {
                let list = localStorage.getItem("userPermission");
                list = JSON.parse(list);
                let flag = false;
                for (let i = 0; i < list.length; i++) {
                    if (index == list[i]) {
                        flag = true;
                    }
                }
                return flag;
            };
        },
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
        pageTo(index, url) {
            if (url == "chart") {
                if (this.$route.path.indexOf("chart") != -1) {
                    return;
                } else {
                    alert("请选择设备!");
                    return;
                }
            }
            if (!url) {
                return;
            }
            this.pageIndex = index;
            this.$router.push("/main/" + this.$route.params.id + "/" + url);
        },
    },
    created() {
        bus.$on("Chart", () => {
            this.pageIndex = 3;
        });
        let path = this.$route.path;
        if (path.indexOf("chart") != -1) {
            this.pageIndex = 3;
        }
        if (path.indexOf("measure") != -1) {
            this.pageIndex = 2;
        }
        if (path.indexOf("maintain") != -1) {
            this.pageIndex = 4;
        }
        if (path.indexOf("devMaintain") != -1) {
            this.pageIndex = 6;
        }
		if(path.indexOf('download')!=-1){
			this.pageIndex=7;
		}
		if(path.indexOf('network')!=-1){
			this.pageIndex=5;
		}
		if(path.indexOf("user")!=-1){
			this.pageIndex=12;
		}
    },
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
        width: 85vw;
        height: 70vh;
        margin-top: 4vh;
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
        }
        .contents {
            width: 87.5%;
            height: 100%;
        }
    }
}
</style>