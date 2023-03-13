<template>
    <div class="maintenance">
        <el-table
           class="table"
           :data="deviceList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
           border
           style="width: 100%"
           height="700"
		>
            <el-table-column prop="id" label="ID" width="100"></el-table-column>
            <el-table-column prop="position_id" label="位号" width="200"></el-table-column>
            <el-table-column prop="gas_name" label="测量组分" width="100"></el-table-column>
            <el-table-column prop="unit" label="单位" width="100"></el-table-column>
            <el-table-column prop="molecular_weight" label="分子量" width="70"></el-table-column>
            <el-table-column label="量程" width="100">
                <template slot-scope="scope">
                    0 - {{scope.row.scope}}
                </template>
            </el-table-column>
            <el-table-column prop="location" label="安装位置"></el-table-column>
            <el-table-column
            	prop="area"
            	label="安装区域"
            	width="160"
			></el-table-column>
           <el-table-column
            	prop="temperature"
            	label="温度"
            	width="80"
			></el-table-column>
           <el-table-column
            	prop="atmosphere"
            	label="压强"
            	width="80"
			></el-table-column>
            <el-table-column prop="first_alarm" label="一级报警阈值(%)" width="80"></el-table-column>
            <el-table-column prop="second_alarm" label="二级报警阈值(%)" width="80"></el-table-column>
            <el-table-column label="操作" width="100">
                 <template slot-scope="scope">
                   	<el-button
                   		@click="handleUpdate(scope.row)"
                   		type="text"
                   		size="small"
                   	>修改</el-button>
                    <el-button
                       	@click="handleDelete(scope.row.id)"
                        type="text"
                        size="small"
                    >删除</el-button>
                    <!-- <el-button type="text" size="small">确定</el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <Footer
        	:handleSizeChange="handleSizeChange"
        	:handleCurrentChange="handleCurrentChange"
        	:currentPage="currentPage"
        	:pageSize="pageSize"
        	:total="deviceList.length"
        ></Footer>
        <br>
        <el-button @click="addDevice" type="primary">添加设备</el-button>
    </div>
</template>
<script>
import {addLog} from "@/api/log";
import Footer from "./components/Footer";
import {mapState,mapActions} from "vuex";
export default {
	name:"Maintenance",
    data() {
        return {
			currentPage:1,
			pageSize:20,
        }
    },
	computed:{
		...mapState("device",["deviceList"]),
        ...mapState("user",["name"])
	},
    methods:{
        ...mapActions("device",["deleteDevice"]),
		handleSizeChange(value){
			this.currentPage=1;
			this.pageSize=value;
		},
		handleCurrentChange(value){
			this.currentPage=value;
		},
        addDevice(){
            this.$router.push({name:"CreateDevice"});
        },
		handleUpdate(row){
			this.$router.push({name:"UpdateDevice",params:{row}});
		},
        handleDelete(id){
			this.$confirm(`将删除设备${id}，是否确认？`,"警告",{
				confirmButtonText:"确定",
				cancelButtonText:"取消",
				type:"warning",
				center:true
			}).then(()=>{
				this.deleteDevice(id).then(()=>{
                    this.$message({
                        type:"success",
                        message:"删除成功"
                    });
                    let content=this.name+"删除了设备"+id;
                    addLog(this.name,content);
				}).catch(err=>{
					console.log(err);
				}).finally(()=>{
					this.reload();
					// this.$store.dispatch("device/getDeviceList");
				});
			}).catch(()=>{
				this.$message({
					type:"info",
					message:"已取消删除"
				});
			});
        },
    },
	mounted(){
		this.$store.dispatch("device/getDeviceList");
	},
	components:{
		Footer
	},
	inject:["reload"],
}
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
.maintenance{
    width: 100%;
    height: 100%;
	overflow: scroll;
    .table{
        width: 100%;
    }
    &::-webkit-scrollbar {display:none}
}
</style>