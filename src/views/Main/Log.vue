<template>
    <div class="log">
        <el-table
            :data="logList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            border
            style="width: 100%"
        >
            <el-table-column type="index" width="150" label="事件序号"></el-table-column>
            <el-table-column prop="operator" label="操作人员" width="200"></el-table-column>
            <el-table-column prop="content" label="内容"></el-table-column>
            <el-table-column prop="time" label="事件时间" width="300"></el-table-column>
        </el-table>
   		<Footer
   			:handleSizeChange="handleSizeChange"
   			:handleCurrentChange="handleCurrentChange"
   			:currentPage="currentPage"
   			:pageSize="pageSize"
   			:total="logList.length"
   		></Footer>
    </div>
</template>
<script>
import Footer from "./components/Footer";
import {mapState} from "vuex";
export default {
	name:"Log",
    data() {
        return {
            areaList:[],
			currentPage:1,
			total:0,
			pageSize:10,
        };
    },
    methods: {
		handleSizeChange(value){
			this.currentPage=1;
			this.pageSize=value;
		},
		handleCurrentChange(value){
			this.currentPage=value;
		}
    },
    computed:{
		...mapState("log",["logList"])
    },
    mounted(){
		this.$store.dispatch("log/getLogList");
	},
	components:{
		Footer
	}
};
</script>
<style lang="less" scoped>
/*最外层透明*/
/deep/ .el-table, /deep/ .el-table__expanded-cell{
	background-color: transparent;
}
/* 表格内背景颜色 */
/deep/ .el-table th,
/deep/ .el-table tr,
/deep/ .el-table td {
	background-color: transparent;
	color: #fff;
}
/deep/.el-table tbody tr:hover>td {
    background-color: rgba(156, 158, 158, 0.575) !important;
}
/deep/.el-table td, .el-table th.is-leaf,.el-table--border, .el-table--group{
	border-color: #00E1E5; 
}
/deep/.el-table--border::after, .el-table--group::after, .el-table::before{
	background-color: #00E1E5;
}
// 头部的下边框
/deep/.el-table--border th,
.el-table--border th.gutter:last-of-type {
	border: 1px solid #00E1E5 !important;
}
//分页样式
/deep/ .el-input__inner{
    background-color: transparent;
    color: #fff;
}
</style>
<style lang="less" scoped>
.log {
    width: 100%;
    height: 100%;
    overflow: scroll;
    &::-webkit-scrollbar {
        display: none;
    }
}
</style>