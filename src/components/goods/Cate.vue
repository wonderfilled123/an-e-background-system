<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        class="treetable"
        :data="cateList"
        :expand-type="false"
        :selection-type="false"
        :columns="columns"
        show-index
        border
      >
        <!-- //是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCaterules"
        ref="addCateFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <!-- 父级分类 -->
        <el-form-item label="父级分类">
          <!-- options用来指定数据元 -->
          <!-- cascaderProps用来指定数据对象 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return{
      //查询条件
      queryInfo:{
        type:3,
        pagenum:1,
        pagesize:5
      },
         //商品分类的数据列表，默认为空
      cateList:[],
      // 总数据条数用来实现分页
      total:0,
      // 为table指定列的定义
      columns:[
        {
          label:'分类名称',
          prop:'cat_name',
        },
         {
          label:'是否有效',
          // prop:'cat_name',
          type:'template',
          template:'isok'
        },
        {
          label:'排序',
          // prop:'cat_name',
          type:'template',
          template:'order'
        },
         {
          label:'操作',
          // prop:'cat_name',
          type:'template',
          template:'opt'
        }
      ],
      // 控制对话框的显示与隐藏
      addCateDialogVisible:false,
        // 添加分类的表单数据对象
       addCateForm: { 
        //  将要添加的分类名称
        cat_name:'',
        // 父级分类id
        cat_pid:0,
        //分类等级 默认添加一级分类
        cat_level:0
      },
      //添加分类的表单数据验证规则对象
      addCaterules:{
        cat_name:[
           { required: true, message: '请输入分类名称', trigger: 'blur' },
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }

        ]
      },
      // 父级分类的列表
      parentCateList:[],
      // 指定级联选择器的配置对象
       cascaderProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children',
        // expandTrigger:'hover'
        expandTrigger: 'hover'
      },
      // 选中的父级分类id数组
      selectedKeys:[]
          
      }
           },
  methods:{
    // 获取分类列表的数据
    async getCateList()
    {
      // get请求传递参数的方式
       const {data:res}=await this.$http.get('categories',{params:this.queryInfo})

       if(res.meta.status!=200)
       {
         return this.$message.error('获取商品分类失败');
       }
       console.log(res.data);
      // 把数据列表赋值
       this.cateList=res.data.result
      //  为总数据条数赋值
       this.total=res.data.total
       //

    },
    //监听 pagesize 改变的事件
    handleSizeChange(newSize)
    {
      this.queryInfo.pagesize=newSize
      this.getCateList()
    },
    //监听 pagenum 的改变
    handleCurrentChange(newPage)
    {
      this.queryInfo.pagenum=newPage
      this.getCateList()
    },
    // 显示对话框
    showAddDialog()
    {
      // 先获取父级的分类列表在展示对话框
      this.getParentCateList()
      this.addCateDialogVisible=true
    },
    //获取父级分类列表
    async getParentCateList()
    {
      const{data:res}=await this.$http.get('categories',{
        params:{type:3}
      })
      if(res.meta.status!=200)
      {
        return this.$message.error('获取数据失败')
      }
      console.log(res.data);
      this.parentCateList=res.data
    },
    // 选择项发生变化触发这个函数
    parentCateChanged()
    {
      if(this.selectedKeys.length>0)
      {
        //父级分类的Id
        this.addCateForm.cat_pid=this.selectedKeys[
          this.selectedKeys.length-1
        ]
        //为当前分类等级赋值
        this.addCateForm.cat_level=this.selectedKeys.length
        return
      }else
      {
        this.addCateForm.cat_pid=0,
        this.addCateForm.cat_level=0
      }

      },
      // 点击按钮添加新的分类
      addCate()
      {
        this.$refs.addCateFormRef.validate(async valid=>{
         const {data:res}= await this.$http.post('categories',this.addCateForm)
           if(res.meta.status!==201) return this.$message.error('添加分类失败');
                this.$message.success('添加成功')
                this.getCateList()
                this.addCateDialogVisible=false
                })
              

        // console.log(this.addCateForm);
      },
      // 监听对话框的关闭事件，重置表单数组
      addCateDialogClosed()
      {
        this.$refs.addCateFormRef.resetFields()
        this.selectedKeys=[]
        this.addCateForm.cat_level=0
        this.addCateForm.cat_pid=0
      }

  },
    created()
  {
    // 页面一创建就生成数据列表
    this.getCateList()
  }  
} 
    

  
</script>

<style lang='less' scoped>
.treetable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>