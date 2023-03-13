export const constantRoutes=[
    {
        path: '/',
        name: 'Home',
        redirect:"/main",
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue'),
    },
    {
        path: "/register",
        name: "Register",
        component: () => import("../views/Register.vue"),
    }
];

export const asyncRoutes=[
    {
        path: '/main',
        component: () => import('../views/Main.vue'),
        children: [
            {
                path: "",
                redirect: "measure",
            },
            {
                path: 'measure', //测量信息页面
                name: "Measure",
                component: () => import('../views/Main/Measure.vue'),
                meta: { permission: 2 },
            },
            {
                path: "chart",
                redirect: "chart",
            },
            {
                path: 'chart/:positionId', //图表页面
                name: "Chart",
                component: () => import('../views/Main/Chart.vue'),
                meta: { permission: 3 },
            },
            {
                path: 'history', //历史数据页面
                name: "History",
                component: () => import('../views/Main/History.vue'),
                meta: { permission: 4 },
            },
            {
                path:"alarmAndPeople",  //报警与人员定位
                name:"AlarmAndPeople",
                component:()=>import("../views/Main/AlarmAndPeople.vue"),
                meta:{permission:5}
            },
            {
                path: 'alarm', //报警信息维护页面
                name: "Alarm",
                component: () => import('../views/Main/Alarm.vue'),
                meta: { permission: 6 },
            },
            {
                path: 'network', //网络状态页面
                name: 'Network',
                component: () => import('../views/Main/Network.vue'),
                meta: { permission: 7 },
            },
            {
                path: 'device', //设备维护页面
                name: "Device",
                component: () => import('../views/Main/Device.vue'),
                meta: { permission: 8 },
            },
            {
                path: 'createDevice', //添加设备页面
                name: "CreateDevice",
                component: () => import('../views/Main/CreateDevice.vue'),
                meta: { permission: 8 },
            },
            {
                path: 'updateDevice',
                name: "UpdateDevice",
                component: () => import('../views/Main/UpdateDevice.vue'),
                meta: { permission: 8 },
            },
            {
                path: 'download', //报表生成页面
                name: 'Download',
                component: () => import('../views/Main/Download.vue'),
                meta: { permission: 9 },
            },
            {
                path: 'area', //风险区域识别页面
                name: "Area",
                component: () => import('../views/Main/Area.vue'),
                meta: { permission: 10 },
            },
            {
                path: 'createArea', //创建区域页面
                name: 'CreateArea',
                component: () => import('../views/Main/CreateArea.vue'),
                meta: { permission: 10 },
            },
            {
                path: 'updateArea', //更新区域页面
                name: 'UpdateArea',
                component: () => import('../views/Main/UpdateArea.vue'),
                meta: { permission: 10 },
            },
            {
                path: 'people',
                name: "People",
                component: () => import('../views/Main/People.vue'),
                meta: { permission: 10 },
            },
            {
                path: 'log', //历史事件记录页面
                name: "Log",
                component: () => import('../views/Main/Log.vue'),
                meta: { permission: 11 },
            },
            {
                path: "user", //用户信息页面
                name: "User",
                component: () => import("../views/Main/User.vue"),
                meta: { permission: 12 },
            },
            {
                path: "createUser", //创建用户页面
                name: "CreateUser",
                component: () => import("../views/Main/CreateUser.vue"),
                meta: { permission: 12 },
            },
            {
                path: "updateUser", //更新用户信息页面
                name: "UpdateUser",
                component: () => import("../views/Main/UpdateUser.vue"),
                meta: { permission: 12 },
            }
        ]
    },
];

