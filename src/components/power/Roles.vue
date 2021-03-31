<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRolesList">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 表格渲染区域 -->
      <el-table :data="roleList" border stripe>
        <!-- 索引列 -->
        <el-table-column type="expand"> 
          <template slot-scope="scope">
            <el-row v-for="(item1,index1) in scope.row.children" :key="item1.id" :class="['btmbd',index1===0 ?'topbd':'','vcenter']">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close='removeRightById(scope.row,item1.id)'>
                  {{item1.authName}}
                </el-tag>
                <i class="el-icon-arrow-right"></i>
              </el-col>
              <!-- 渲染二级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套二级权限 -->
                <el-row v-for="(item2,index2) in item1.children" :key="item2.id" :class="[index2===0?'':'topbd','vcenter']">
                  <el-col :span='6'>
                    <el-tag type='success' @close='removeRightById(scope.row,item2.id)'>
                      {{item2.authName}}
                    </el-tag>
                <i class="el-icon-arrow-right"></i>

                  </el-col>
                  <!-- 通过for循环渲染3级权限 -->
                  <el-col :span='18'>
                    <el-tag type='warning' v-for="item3 in item2.children" :key="item3.id" closable @close='removeRightById(scope.row,item3.id)'>
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 展开列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="editVisible(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-dalete" @click="removeRolesByid(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色列表"
      :visible.sync="addRolesDialogVisable"
      width="30%"
    >
      <!-- 添加角色列表的主体区域 -->
      <el-form
        :model="addRolesFrom"
        :rules="addRolesFromRules"
        ref="addRolesFromRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesFrom.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesFrom.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetRolesFrom">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限的对话框 -->
    <el-dialog
  title="分配权限"
  :visible.sync="setRightDialogVisible"
  width="50%"
  @close='setRightDialogClosed'
  >
  <!-- <span>这是一段信息</span> -->
  <!-- 树形控件 -->
  <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" :default-checked-keys='defkeys' ref="treeRef" :default-expand-all=true></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
   </el-dialog>

   <!-- 编辑角色对话对话框 -->
   <el-dialog
  title="提示"
  :visible.sync="editDialogVisible"
  width="30%"
  >
  <el-form :model="editForm" :rules="editFormRules" ref="editFormRefs" label-width="100px" class="demo-ruleForm">
    <!-- 角色名称 -->
  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="editForm.roleName"></el-input>
  </el-form-item>
  <!-- 角色描述 -->
    <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="editForm.roleDesc"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="ediRoleInfo">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //所有角色列表数据
      roleList: [],
      //添加角色列表对话框的显示隐藏
      addRolesDialogVisable: false,
      //添加角色列表的数据验证对象
      addRolesFrom: {
        roleName: "",
        roleDesc: "",
      },
      // 数据验证规则对象
      addRolesFromRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10个字符", trigger: "blur" },
        ],
      },
      //控制分配权限对话框的显示与隐藏
      setRightDialogVisible:false,
      // 所有权限的数据
      rightsList:[],
      // 树形控件的属性绑定对象
      treeProps:{
        label:'authName',
        children:'children'
      },
      // 默认选中节点的id值数组
      defkeys:[],
      // 当前即将分配权限的角色Id
      roleId:'',
      //控制编辑对话框的显示隐藏
      editDialogVisible:false,
      //编辑表单的对象
      editForm:{

      },
      //验证规则对象
      editFormRules:{
        roleName:[
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc:[
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    // 获取角色列表的方法
    async getRoleList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status != 200) {
        return this.$message.error("获取角色列表失败");
      }
      this.roleList = res.data;
      console.log(this.roleList);
    },
    //添加角色列表
    addRolesList() {
      this.addRolesDialogVisable = true;
    },
    //取消后重置表单方法
    resetRolesFrom() {
      this.$refs.addRolesFromRef.resetFields();
      this.addRolesDialogVisable = false;
    },
    // 确定后添加角色数据
    addRoles() {
      this.$refs.addRolesFromRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) return;
        const { data: res } = await this.$http.post("roles", this.addRolesFrom);
        // console.log(res);
        if (res.meta.status != 201) {
          return this.$message.error("添加角色失败，请重新尝试");
        }
        this.$message.success("添加用户成功");
        this.getRoleList();
        this.addRolesDialogVisable = false;
      });
      // this.$http.post('roles')
    },
    //点击编辑按钮，弹出编辑按钮对话框
    async editVisible(id)
    {
      const {data:res}=await this.$http.get('roles/'+ id )
      if(res.meta.status!=200)
      {
        return this.$message.error('查询参数失败')
      }
      this.editForm=res.data
      this.editDialogVisible=true
    },
    //点击确定按钮修改用户列表编辑用户提交
    async ediRoleInfo()
    {
      this.$refs.editFormRefs.validate(async valid=>{
        const {data:res}=await this.$http.put('roles/'+ this.editForm.roleId,{
          roleName:this.editForm.roleName,
          roleDesc:this.editForm.roleDesc
        })
      if(res.meta.status!=200)
      {
        return this.$message.error('编辑失败')
      }
      this.$message.success('成功')
      this.editDialogVisible=false
      this.getRoleList()

      })
      
    },
    //根据id删除用户的列表
    async removeRolesByid(id)
    {
      // 询问用户是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // console.log(res);

      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete("roles/" + id);
      if (res.meta.status != 200) {
        return this.$message.error("删除用户失败");
      }
      this.$message.success("删除用户成功");
      this.getRoleList()
    },
    // 根据id删除对应的权限
    async removeRightById(role,rightId)
    {
      // 弹框提示用户是否要删除
        const confirmResult =await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        // console.log(confirmResult);
        // 函数执行的返回值是正确或者错误
        if(confirmResult!=='confirm')
        {
          return this.$message.info('取消了删除')
        }
        // console.log('确认了删除用户');
        const {data:res}=await this.$http.delete(`roles/${role.id}/rights/${rightId}`)

        if(res.meta.status!=200)
        {
          return this.$message.error('删除权限失败')
        }
        // this.getRoleList();
        // 重新获取整个数据列表的时候数据会被重新渲染
        role.children=res.data
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role)
    {
      this.roleId=role.id
      // 获取所有权限的数据
      const {data:res}=await this.$http.get('rights/tree')
      if(res.meta.status!==200)
      {
        return this.$message.error('获取权限数据失败')
      }
      // 获取到的权限数据保存到data中
      this.rightsList=res.data
      // console.log(this.rightsList);
      this.getLeafKeys(role,this.defkeys)
      this.setRightDialogVisible=true
    },
    //通过递归形式,获取角色下三级权限的id保存defkeys到数组中
    getLeafKeys(node,arr)
    {
      if(!node.children)
      {
        return arr.push(node.id)
      }
      node.children.forEach(item => 
       this.getLeafKeys(item,arr) 
      );
    },
    // 当关闭树形控件的时候,使数组清空
    setRightDialogClosed()
    {
      this.defkeys=[]
    },
    // 点击为角色分配权限
    // 调用组件函数的时候要拿到组件的引用
    async allotRights()
    {
      const keys =[
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      console.log(keys)
      const idstr =keys.join(',')
      const {data:res} =await this.$http.post(`
      roles/{this.roleId}/rights`,{rids:idstr})
      if(res.meta.status!=200)
      {
        return this.$message.error('分配权限失败') 
      }
      this.$message.success('分配权限成功')
      this.getRoleList()
      this.setRightDialogVisible=false
    }  
  }
}
</script>

<style>
.el-tag
{
  margin: 7px;
}
.topbd
{
   border-top:1px solid #eee;
}
.btmbd
{
  border-bottom: 1px solid #eee;
}
.vcenter
{
  display: flex;
  align-items: center;
}
</style>