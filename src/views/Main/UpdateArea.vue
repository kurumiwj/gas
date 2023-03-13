<template>
	<div class="updateArea">
		<div class="form">
			<el-input
				class="input"
				v-model="area"
				placeholder="安装区域"
			></el-input>
			<el-divider content-position="left"></el-divider>
			<el-upload
				ref="upload"
				class="avatar-uploader"
				action="/api/area/img"
				:show-file-list="false"
				:headers="headers"
				:on-success="handleAvatarSuccess"
				:before-upload="beforeAvatarUpload"
				drag
			>
				<img v-if="imageUrl" :src="imageUrl" class="avatar" />
				<i v-else class="el-icon-upload"></i>
				<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
  				<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过2MB</div>
			</el-upload>
			<el-divider content-position="left"></el-divider>
			<el-button type="primary" @click="update">修改区域</el-button>
		</div>
	</div>
</template>

<script>
import store from "@/store";
import {mapActions} from "vuex";
export default{
	name:"UpdateArea",
	data(){
		return {
			areaId:"",
			area:"",
			imageUrl:"",
			url:"",
			fits:["fill","contain","cover","none","scale-down"],
			headers:{
                Authorization:store.getters.token
            }
		};
	},
	methods:{
        ...mapActions("area",["updateArea"]),
		handleAvatarSuccess(res,file){
			this.$refs.upload.clearFiles();
			this.imageUrl=URL.createObjectURL(file.raw);
			this.url=file.response.data.fileName;
		},
		beforeAvatarUpload(file){
			const isImage=file.type==="image/jpeg"||file.type==="image/png";	//判断是否是图片
			const isLt2M=file.size/1024/1024<2;
			if(!isImage){
				this.$message.error("上传背景只能是图片！");
			}
			if(!isLt2M){
				this.$message.error("上传背景图片大小不能超过2MB！");
			}
			return isImage&isLt2M;
		},
		update(){
			if(!this.area||!this.url){
				alert("区域名称或者图片不能为空！");
				return ;
			}
			this.updateArea({id:this.areaId,area:this.area,img:this.url}).then(res=>{
				if(res.code===200){
					this.$message({
					    type:"success",
					    message:"修改区域成功"
					});
					this.$router.go(-1);
				}
			})
		},
	},
	mounted(){
		const data=this.$route.params;
		this.areaId=data.areaId;
		this.area=data.area;
		this.url=data.url;
	}
}
</script>

<style lang="less" scoped>
/deep/.el-input__inner {
    background-color: rgba(16, 44, 58, 0.8);
    color: #fff;
}
/deep/.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
/deep/.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
/deep/.avatar {
    width: 100%;
    height: 100%;
    display: block;
}
/deep/.el-upload__tip{
	color: aqua;
	font-size: 15px;
}
</style>
<style lang="less" scoped>
.updateArea {
    width: 100%;
    height: 100%;
    .form {
        margin: 0 auto;
        margin-top: 5%;
        width: 90%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .input {
            width: 49%;
            margin-bottom: 20px;
        }
    }
}
</style>
