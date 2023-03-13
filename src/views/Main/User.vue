<template>
    <div class="maintain">
        <el-table
            :data="userList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            border
            style="width: 100%"
        >
            <el-table-column prop="id" label="用户id"> </el-table-column>
            <el-table-column prop="name" label="姓名"> </el-table-column>
<!--
            <el-table-column prop="password" label="密码">
            </el-table-column>
-->
            <el-table-column prop="permission" label="权限">
            </el-table-column>
            <el-table-column prop="tel" label="电话">
            </el-table-column>
            <el-table-column prop="time" label="注册(修改)时间">
            </el-table-column>
            <el-table-column prop="operation" label="操作" width="100">
            	<template slot-scope="scope">
					<el-button @click="handleUpdate(scope.row)" type="text" size="small">修改</el-button>
					<el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
				</template>
            </el-table-column>
        </el-table>
        <Footer
        	:handleSizeChange="handleSizeChange"
        	:handleCurrentChange="handleCurrentChange"
        	:currentPage="currentPage"
			:pageSize="pageSize"
			:total="userList.length"
        ></Footer>
        <el-button @click="addUser" type="primary">添加用户</el-button>
    </div>
</template>
<script>
import {addLog} from "@/api/log";
import {getUsers,deleteUser} from "@/api/user";
import Footer from "./components/Footer";
import {handleTime,handleUTCTime} from "@/utils/handleTime";
import {mapState} from "vuex";
export default {
	name:"User",
    data() {
        return {
			currentPage:1,
			total:0,
			pageSize:10,
        };
    },
	computed:{
		...mapState("user",["userList","name"]),
	},
    methods: {
        handleSizeChange(value){
			this.currentPage=1;
			this.pageSize=value;
		},
		handleCurrentChange(value){
			this.currentPage=value;
		},
		handleUpdate(row){
			this.$router.push({name:"UpdateUser",params:{row}});
		},
		handleDelete(row){
			this.$confirm("确认删除该用户？","警告",{
				confirmButtonText:"确定",
				cancelButtonText:"取消",
				type:"warning",
				center:true
			}).then(()=>{
				deleteUser(row.id).then(()=>{
					this.$message({
						type:"success",
						message:`删除用户${row.name}成功`
					});
					this.$store.dispatch("user/getUserList");
					this.reload();
				}).catch(err=>{
					console.error(err);
				});
				let content=this.name+"删除了用户"+row.name;
				addLog(this.name,content);
			}).catch(()=>{
				this.$message({
					type:"info",
					message:`取消删除用户${row.name}`
				});
			});
		},
		addUser(){
			this.$router.push({name:"CreateUser"});
		}
    },
    mounted(){
		this.$store.dispatch("user/getUserList");
	},
	components:{
		Footer
	},
	inject:["reload"],
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
</style>
<style lang="less" scoped>
.maintain {
    width: 100%;
    height: 100%;
    overflow: scroll;

    @-webkit-keyframes redPulse {
        from {
            background-color: #bc330d;
        }
        50% {
            background-color: #FF1D1D;
        }
        to {
            background-color: #bc330d;
        }
    }
    .safe {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background-color: #25FF1D;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }
    .alarm{
        background-color: #FF1D1D;
    }
    .blip{
        animation: redPulse 300ms infinite;
        -webkit-animation: redPulse 300ms infinite;
    }
    &::-webkit-scrollbar {
        display: none;
    }
}
</style>