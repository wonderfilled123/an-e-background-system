<template>
<div>
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>订单管理</el-breadcrumb-item>
  <el-breadcrumb-item>订单列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图 -->
<el-card>
  <!-- //输入框的搜索功能 -->
  <el-row>
    <el-col :span=8>
      <el-input placeholder="请输入内容"  class="input-with-select">
     <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </el-col>
  </el-row>

  <!-- 表格数据 -->
  <el-table
      :data="orderList"
      style="width: 100%" stripe border>
      <el-table-column
        type='index'>
      </el-table-column>
      <el-table-column
        prop="order_number"
        label="订单编号"
        width="500">
      </el-table-column>
      <el-table-column
        prop="order_price"
        label="订单价格"
        width='100'>
      </el-table-column>
       <el-table-column
        prop="order_pay"
        label="是否付款"
        width='100'>
        <template slot-scope="
        scope">
          <el-tag type='success' v-if="scope.row.order_pay='1'">已付款</el-tag>
          <el-tag type='danger' v-else>未付款</el-tag>
        </template>
      </el-table-column>
       <el-table-column
        prop="is_send"
        label="是否发货"
        width='100'>
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="下单时间"
        width='200'>
        <template slot-scope="scope">
          {{scope.row.create_time | dataFormat}}
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template>
  <el-button type="primary" icon="el-icon-edit" size='mini' @click="showAddressVisible"></el-button>
  <el-button  type="success"  icon="el-icon-share" size=mini @click="showProgressBox"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页功能模块 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[1, 5, 10, 20]"
      :current-page="queryInfo.pagenum"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>
    <!-- 修改地址对话框 -->
    <el-dialog
  title="提示"
  :visible.sync="editDialogVisible"
  width="30%"
  @close='addressDialogClosed'>
  <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRulesRef" label-width="100px" class="demo-ruleForm">
  <el-form-item label="省市区/县" prop="address1">
  <el-cascader :options='cityData' v-model="addressForm.address1" @close='addressDialogClosed'>
  </el-cascader>
  </el-form-item>
  <el-form-item label="详细地址" prop="address2">
    <el-input v-model="addressForm.address2">
    </el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
  </span>
   </el-dialog>

  <!-- 物流进度查询 -->
  <el-dialog
  title="提示"
  :visible.sync="progressVisible"
  width="30%"
  >
  <span>这是一段信息</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="progressVisible = false">取 消</el-button>
    <el-button type="primary" @click="progressVisible = false">确 定</el-button>
  </span>
</el-dialog>
</div>
</template>

<script>
import cityData from './citydata.js'
export default {
  data()
  {
    return{
      //请求参数
      queryInfo:{
        query:'',
        pagenum:2,
        pagesize:5
      },
      //订单的数据列表
      orderList:[],
      //页码条数
      currentPage4:'1',
      //总数据条数
      total:0,
      //控制显示与隐藏
      editDialogVisible:false,
      //添加地址的数据对象
      addressForm:{
        address1:[],
        address2:''
      },
      //数据验证规则对象
      addressFormRules:{
        address1:[
        { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        address2:[
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      //讲js文件放入里面
      cityData:cityData,
      //控制物流进度对话框的显示与隐藏 
       progressVisible:false,
       //物流信息
       progressInfo:[]
    }
  },
  created()
  {
    this.getOrderList()
  },
  methods:{
    //得到列表数据
    async getOrderList()
    {
      const {data:res}=await this.$http.get('orders',{
        params:this.queryInfo
      })
      if(res.meta.status!=200)
      {
        return this.$message.error('数据请求失败');
      }
      // console.log(res);
      this.orderList=res.data.goods
      this.total=res.data.total
      // console.log(this.orderList);
    },
    //每页条数改变时触发
    handleSizeChange(newsize)
    {
      this.queryInfo.pagesize=newsize
      this.getOrderList()
    },
    //页码改变时触发
    handleCurrentChange(newpage)
    {
      this.queryInfo.pagenum=newpage
      this.getOrderList()
    },
    //展示编辑的对话框
    showAddressVisible()
    {
      this.editDialogVisible=true
    },
    addressDialogClosed()
      {
        this.$refs.addressFormRulesRef.resetField()
      },
      //控制物流进度查询对话框显示与隐藏
    async showProgressBox()
    {
      const {data:res}=await this.$http.get('/kuaidi/1106975712662')
      if(res.meta.status!=200)
      {
        return this.$message.error('获取物流进度失败')
      }
      this.progressInfo=res.data
      console.log(this.progressInfo);
      this.progressVisible=true
    }
  }
}
</script>

<style>
  /* 分页功能的实现是借助于请求服务器数据的时候传递的参数不同
  展示的效果不同 */
</style>