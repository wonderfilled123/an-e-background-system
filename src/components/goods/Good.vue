<template>
  <div>
        <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 表头的搜索功能 -->
      <el-row :gutter="20">
        <el-col :span=8>
          <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable  @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
        <el-col :span=4>
          <el-button type='primary' @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格数据 -->
      <el-table
      :data="goods"
      style="width: 100%">
      <el-table-column
      type="index"
      width="50"
      border
      stripe
      >
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格(元)"
        width="180">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量">
      </el-table-column>
      <el-table-column
        prop="add_time"
        label="创建时间">
        <template slot-scope="scope">
          {{scope.row.add_time | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" ></el-button>
          <el-button type="danger" icon="el-icon-delete" @click="removeGood(scope.row.goods_id)"></el-button>
          <!-- <el-button type="primary" icon="el-icon-delete"></el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页的组件 -->
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>

    <!-- 根据id删除商品数据对话框-->

  </div>
</template>

<script>
export default {
  data()
  {
    return{
      queryInfo:{
        //查询参数名
        query:'',
        // 页码
        pagenum:1,
        // 每页有几条数据
        pagesize:5
      },
      //表格数据
      goods:[],
      // 搜索的数据
      // searchgood:'',

      // 总数据条数
      total:0,
      removeDialogVisible:false
    }
  },
  created()
  {
    //获取商品列表数据
    this.getGoodsList()
  },
  methods:{
    //获取商品的列表数据
    async getGoodsList()
    {
      const {data:res}=await this.$http.get('goods',{params:this.queryInfo})
      if(res.meta.status!=200) return this.$messages.error('请求服务失败')
      //保存数据
      this.goods=res.data.goods
      this.total=res.data.total
    
      console.log(this.goods);

    },
    //搜索商品
    search()
    {
      // this.queryInfo=this.searchgood
      this.getGoodsList()
    },
    // 每页条数
    handleSizeChange(pageSize)
    {
      //
      this.queryInfo.pagesize=pageSize
      this.getGoodsList()
    },
    //检测页面变化函数
    handleCurrentChange(pageNum)
    {
      this.queryInfo.pagenum=pageNum
      this.getGoodsList()
    },
    // 根据商品的id删除商品
    async removeGood(goodid)
    {
      // 弹出商品删除 
       const confirmResult =await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)

        if(confirmResult!='confirm')
        {
          return this.$message.info('已经取消删除')
        }
        const {data:res}=await this.$http.delete(`goods/${goodid}`)

        if(res.meta.status!==200)
        {
          return this.$message.error('删除用户失败')
        }
        this.$message.success('删除成功')
        this.getGoodsList()

      this.removeDialogVisible=true
    },
    //添加按钮跳转
    addGoods()
    {
      this.$router.push('/goods/add')
    }   
  },

}
</script>

<style>

</style>