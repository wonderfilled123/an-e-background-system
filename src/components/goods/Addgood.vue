<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-alert title="添加商品信息" type="info" :closable="false" center></el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 左侧的标签页 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs :tab-position="tabPosition" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click='tabClicked' >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>

            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>

            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop='goods_cat'>
              <el-cascader
    v-model="addForm.goods_cat"
    :options="cateList"
    :props="cateProps"
    @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->

          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce">

            </quill-editor>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return (
      {
        //控制标签的左右
        tabPosition: "left",
        //默认的激活选项
        activeIndex: "0",
        //控制标签页的显示隐藏
        addForm: {
          goods_name: "",
          goods_price: 0,
          goods_weight: "",
          goods_number: 0,
          //商品所属于的分类数组
          goods_cat:[],
          //商品的详情描述
          goods_introduce:''
        },
        //表达数据验证对象
        addFormRules: {
          goods_name: [
            { required: true, message: "请输入商品名称", trigger: "blur" },
          ],
          goods_price: [
            { required: true, message: "请输入商品价格", trigger: "blur" },
          ],
          goods_weight: [
            { required: true, message: "请输入活商品重量", trigger: "blur" },
          ],
          goods_number: [
            {
              required: true,message: "请输入活商品重量",trigger: "blur",
            },
          ],
          goods_cat:[
            {
              required: true,message: "请输入活商品重量",trigger: "blur",
            }
          ]
        },
        //商品的数据列表
        cateList:'',
        // 级联选择器的配置项
        cateProps:{
          // 分类名称
          value:'cat_id',
          label:'cat_name',
          children:'children',
        },

      }
    )
  },
  created()
  {
    this.getCateList()
  },
  methods:{
    //获取商品的分类的数据列表
    async getCateList(){
      const {data:res} = await this.$http.get('categories')
      if(res.meta.status!=200)
      {
        return this.$message.error('获取数据失败')
      }
      this.cateList=res.data
    },
    //级联选择器选中项变化触发这个函数
    handleChange(){
      // console.log(this.addForm.goods_cats);
      if(this.addForm.goods_cat.length!=3)
      {
        this.addForm.goods_cat = [] 
      }
    },
    //在切换前触发
    beforeTabLeave(activeName,oldActiveName)
    {
       if(oldActiveName==='0'&&this.addForm.goods_cat.length!==3)
       {
         this.$message.error('请  先选择商品分类')
         return false
       }
    },
    //切换tab栏的时候触发
    async tabClicked(){
      if(this.activeIndex=='1')
      {
        // console.log('动态参数面板');
       const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'many'}
        })

        if(res.meta.status!==200)
        {
          return this.$message.error('获取动态参数列表失败')
        }

        console.log(res);
      }
    },

  },
  computed:{
    cateId()
    {
      if(this.addForm.goods_cat.length===3)
      {
        return  this.addForm.goods_cat[2]
      }

      return null 
    }
  }
};
</script>

<style>
</style>