<template>
    <div class="block" style="margin-top: 1vh;">
		<el-pagination
			align="center"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page="currentPage"
			:page-sizes="[1,5,10,20,50]"
			:page-size="pageSize"
			layout="prev,pager,next,jumper,->,sizes,total"
			:total="total"
		></el-pagination>
	</div>
</template>

<script>
    export default {
		name:"Footer",
        data () {
            return {
            }
        },
		props:["handleSizeChange","handleCurrentChange","currentPage","pageSize","total"],
    }
</script>


<style lang="less" scoped>
//分页效果
/deep/ .el-pagination__total,/deep/ .el-pagination__jump{
    color: #fff;
}
/deep/ .number{
    background-color: transparent;
    color: #fff;
}
/deep/ .btn-prev,/deep/ .btn-next{
	color:#fff;
    background-color: transparent !important;
}
/deep/ .more{
    background-color: transparent !important;
}
</style>