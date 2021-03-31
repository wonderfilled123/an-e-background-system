<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 头部警告区域 -->
      <el-alert title="!只允许为三级分类设置参数" type="warning" closable></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row>
        <el-col class="cat_opt">
          <span>选择商品分类:</span>
          <el-cascader
    v-model="selectedCateKeys"
    :options="cateList"
    :props="cateProps"
    @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
      <!-- 标签页区域 -->
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <!-- 添加动态参数的面板 -->
    <el-tab-pane label="动态参数" name="many">
      <el-button type='primary' size='mini' :disabled='isBtnDisabled' @click="addDialogVisible=true">
        添加参数
      </el-button>
      <!-- 动态参数表格 -->
      <el-table :data='manyTableData' border stripe>
        <!-- 展开行 -->
         <el-table-column type='expand'>
           <template slot-scope="scope">

             <!-- 循环渲染tag标签 -->
             <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable>
               {{item}}
             </el-tag >
             <!-- 控制按钮与文本框的切换 -->
             <!-- 输入文本框 -->
            <el-input
  class="input-new-tag"
  v-if="scope.row.inputVisible"
  v-model="scope.row.inputValue"
  ref="saveTagInput"
  size="small"
  @keyup.enter.native="handleInputConfirm(scope.row)"
  @blur="handleInputConfirm(scope.row)"
>
       </el-input>
       <!-- 输入按钮 -->
       <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">+ New Tag</el-button>
           </template>
        </el-table-column>
        <el-table-column type='index'>
        </el-table-column>
         <el-table-column label='参数名称' prop='attr_name'>
        </el-table-column>
        <el-table-column label='操作'>
          <template slot-scope="scope">
            <el-button type='primary' icon='el-icon-edit' size='mini'
            @click="showEditDialog(scope.row.attr_id)">
              修改
            </el-button>
          <el-button type='danger' icon='el-icon-delete' size='mini'
          @click="removeParams(scope.row.attr_id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <!-- 添加静态属性的面板 -->
    <el-tab-pane label="静态属性" name="only">
      <el-button type='primary' size='mini' :disabled='isBtnDisabled' @click="addDialogVisible=true">
        静态属性
      </el-button>
          <!-- 静态属性面板 -->
          <el-table :data='onlyTableData' border stripe>
         <el-table-column type='expand'>
        </el-table-column>
        <el-table-column type='index'>
        </el-table-column>
         <el-table-column label='属性名称' prop='attr_name'>
        </el-table-column>
        <el-table-column label='操作'>
          <template slot-scope="scope">
            <el-button type='primary' icon='el-icon-edit' size='mini'
            @click="showEditDialog(scope.row.attr_id)">
              编辑
            </el-button>
          <el-button type='danger' icon='el-icon-delete' size='mini'
           @click="removeParams(scope.row.attr_id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
    </el-card>

    <!-- 添加动态参数对话框 -->
    <el-dialog
  :title="'添加'+titleTax"
  :visible.sync="addDialogVisible"
  width="50"
  @close='addDialogClosed'
  >
  <!-- 添加参数的表单 -->
  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
  <el-form-item :label='titleTax' prop="attr_name">
    <el-input v-model="addForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
</el-dialog>
<!-- 修改对话框按钮 -->
  <el-dialog
  :title="'修改'+titleTax"
  :visible.sync="editDialogVisible"
  width="50"
  @close='editDialogClosed'
  >
  <!-- 添加参数的表单 -->
  <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
  <el-form-item :label='titleTax' prop="attr_name">
    <el-input v-model="editForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editParams">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 获取到的数据列表
      cateList:[],
      //级联选择框的配置对象
      cateProps:{
        // 指定选中的值
        value:'cat_id',
        label:'cat_name',
        children:'children'
      },
      //级联选择框选中项双向绑定的数组
      selectedCateKeys:[],
      // 被激活的页签名称
      activeName:'only',
      // 动态参数数据
      manyTableData:[],
      //静态参数数据
      onlyTableData:[],
      // 控制添加对话框的显示与隐藏
      addDialogVisible:false,
      // 添加表单数据对象
      addForm:{
        attr_name:''
      },
      // 添加表单数据规则对象
      addFormRules:{
        attr_name:[{
          required:true,message:'请输入参数名称',trigger:'blur'
        }]
      },
      // 控制编辑框的显示隐藏
      editDialogVisible:false,
      //修改表单的数据对象
      editForm:{

      },
      //修改表单的验证规则对象
      editFormRules:{
      },
      // //控制文本框的显示与隐藏
      // inputVisible:'',
      // //文本框中输入内容
      // inputValue:''
    };
  },
  created() {
    //获取商品分类列表
    this.getCateList()
  },
  methods:{
    //获取所有的商品分类列表
    async getCateList()
    {
      const {data:res} =await this.$http.get('categories')
      if(res.meta.status!==200)
      {
        return this.$message.error('获取商品分类失败')
      }
      this.cateList=res.data
      console.log(this.cateList);
    },
    // 级联选择框选中项变化，就会触发这个函数
   handleChange()
    {
      this.getParamsData() 
    },
    // tab页标签点击事件函数
    handleTabClick()
    {
      this.getParamsData()
    },
    //获取参数的列表数据
    async getParamsData()
    {
        // console.log(this.selectedCateKeys);
      if(this.selectedCateKeys.length!==3)
      {
        this.selectedCateKeys= []
        return
      }
      //证明选择了三级分类,发起请求
      //根据所选分类的ID,和当前所属的面板获取对应的参数
      const {data:res}=await this.$http(`categories/${this.CateId}/attributes`,{params:{sel:this.activeName}})

      if(res.meta.status!=200)
      {
         return this.$message.error('获取参数列表失败')
      }

      if(this.activeName==='many')
      {
        this.manyTableData= res.data
      }
      else
      {
        this.onlyTableData=res.data
      }
       console.log(res.data);
       res.data.forEach(item => {

         //把服务器里的字符串分割重新存在attr_vals里
         item.attr_vals=item.attr_vals?item.attr_vals .split(','):[]
         item.inputVisible=false
         item.inputValue=''
       })
      // console.log(this.selectedCateKeys);
    },
    // 监听添加对话框的关闭事件
    addDialogClosed()
    {
      this.$refs.addFormRef.resetFields()
    },
    //添加参数
    addParams()
    {
      this.$refs.addFormRef.validate(
        async valid=>{
          if(!valid) return
          const {data:res}= await
          this.$http.post(`categories/${this.CateId}/attributes
          `,{
            attr_name:this.addForm.attr_name,
            attr_sel:this.activeName
          })
          if(res.meta.status!=201)
          {
            return this.$message.error('添加参数失败')
          }
          this.$message.success('添加参数成功!')
          this.addDialogVisible=false
          // 获取数据，刷新列表
          this.getParamsData()
        }
      )
    },
    // 修改参数的对话框
    async showEditDialog(attr_id)
    {
      // 查询当前参数的信息
      const {data:res}= await this.$http.get(`categories/${this.CateId}/attributes/${attr_id}`,{
        params:{attr_sel:this.activeName}
      })

      if(res.meta.status!=200)
      {
        return this.$message.error('获取参数信息失败')
      }
      this.editForm=res.data
      this.editDialogVisible=true
    },
    editDialogClosed()
    {
      //重置修改的表单
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮修改参数信息
    editParams(){
      this.$refs.editFormRef.validate(async valid=>{
        if(!valid) return
        const{data:res}=await this.$http.put(`categories/${this.CateId}/attributes/${this.editForm.attr_id}`,
        {
          attr_name:this.editForm.attr_name,
          attr_sel:this.activeName
        })
        if(res.meta.status!=200)
        {
          return this.$message.error('修改失败')
        }
        this.$message.success('修改成功')
        this.getParamsData()
        this.editDialogVisible=false
      })
    },
    //点击删除参数
    async removeParams(attr_id)
    {
      const confirmResult= await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)

        //用户取消了删除的操作
        if(confirmResult!=='confirm')
        {
          return this.$message.info('已取消删除')
        }
        //删除的业务逻辑
        const{data:res}=await this.$http.delete(` categories/${this.CateId}/attributes/${attr_id}`)

        if(res.meta.status!==200)
        {
          return this.$message.error('删除参数失败!')
        }
        this.$message.success('删除参数成功')
        this.getParamsData()
     },
    //  文本框失去焦点，或者按下enter都会触发
     handleInputConfirm(row)
     {
      // console.log('ok')
      row.inputVisible=false
     },
    //  点击按钮展示文本框
     showInput(row)
     {
      //  console.log('123')
      row.inputVisible=true
      //自动获取焦点
      row.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        })
     },




  },
  computed:{
    //如果按钮需要禁用就返回true,不需要就返回false
    isBtnDisabled()
    {
      if(this.selectedCateKeys.length!==3)
      {
        return true
      }
      return false
    },
    // 获取三级分类的id
    CateId(){
      if(this.selectedCateKeys.length===3)
      {
        return this.selectedCateKeys[2]
      }
      return null 
      },
      //动态计算标题文本
    titleTax()
      {
        if(this.activeName==='only')
        {
        return '静态属性'
        }
        return '动态参数'
      }
  }
};
</script>

<style lang="less" scoped>
.cat_opt
{
   margin: 15px 0;
}
.input-new-tag
{
  width: 80px;
}
</style>