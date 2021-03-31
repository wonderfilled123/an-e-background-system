<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUserDialog">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <!-- 表格的操作按钮 -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <!-- 警告按钮 -->
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      <!-- 添加用户的Dialog区域 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisable"
        width="30%"
        @close="addDialogClosed"
      >
        <!-- 中间的主体区域 -->
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormref"
          label-width="70px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>

        <!-- 底部按钮区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisable = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户的Dialog区域 -->

      <!-- 每次的需求不一样,当需要展示所有的表格数据,请求全部的数据,当只需要请求一个表格对象数据,只需要请求单独的数据 -->
      <el-dialog
        title="修改用户的对话框"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
      >
        <!-- 修改用户表单 -->
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="70px"
        >
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>

    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
    >
      <div>
        <p>当前的用户:{{ userInfo.username }}</p>
        <p>当前的角色:{{ userInfo.role_name }}</p>
        <p>
          分配新角色
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList "
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (regEmail.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };
    //验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的手机号"));
    };
    return {
      //根据文档来定义参数
      //获取用户列表的参数对象
      queryInfo: {
        //搜索关键字
        query: "",
        // 当前页数
        pagenum: 1,
        //当前每页显示多少条数据
        pagesize: 1,
      },
      //用户列表
      userlist: [],
      //用户总数
      total: 0,
      //swich
      addDialogVisable: false,
      //添加用户表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      //添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10个字符", trigger: "blur" },
          {
            validator: checkEmail,
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 3, max: 11, message: "长度在 3 到 11个字符", trigger: "blur" },
          {
            validator: checkMobile,
            trigger: "blur",
          },
        ],
      },
      //控制修改对话框的显示隐藏
      editDialogVisible: false,
      //查询到的用户信息对象
      //此对象里面的值是动态变化的,
      // 具体的值和键需要在接口文档中返回的数据项里查看
      editForm: {},
      // 修改表单的数据规则对象
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10个字符", trigger: "blur" },
          {
            validator: checkEmail,
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 3, max: 11, message: "长度在 3 到 11个字符", trigger: "blur" },
          {
            validator: checkMobile,
            trigger: "blur",
          },
        ],
      },
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 需要被分配的用户信息
      userInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      //已选中的角色id值
      selectedRoleId:''
    };
  },
  created() {
    //发起用户列表的数据请求
    this.getUserList();
  },
  methods: {
    //得到用户列表数据
    async getUserList() {
      //get 请求第一个参数是请求路径 第二个参数是一个对象
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败");
      }
      // console.log(res);
      this.userlist = res.data.users;
      this.total = res.data.total;
    },
    //每页数据量发生改变的时候重新请求数据
    //监听 数据量 改变事件
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    //页码改变的时候重新请求数据

    //监听页码值改变事件
    handleCurrentChange(newPage) {
      // console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    //监听 switch 状态改变事件
    async userStateChanged(userinfo) {
      // console.log(userinfo);
      const { data: res } = await this.$http.put(
        `
       users/${userinfo.id}/state/${userinfo.mg_state}
       `);
      if (res.meta.status!== 200) {
         userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("更新用户状态失败");
      }
       
      this.$message.success("添加用户成功");
    },

    //点击添加用户按钮触发添加用户对话框
    addUserDialog() {
      this.addDialogVisable = true;
    },
    //关闭对话框重置事件
    addDialogClosed() {
      this.$refs.addFormref.resetFieleds();
    },

    //点击按钮，添加新用户
    // 当预校验通过的时候就添加用户
    //将用户输入的数据返回数据库保存
    //表单预验证,必须让用户输入规定规格的字符串
    addUser() {
      this.$refs.addFormref.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status != 201) {
          this.$message.error("添加用户失败");
        }
        this.$message.success("添加用户成功");
        this.addDialogVisable = false;
        // 重新获取数据列表
        this.getUserList();
      });
    },
    //点击编辑按钮触发此函数
    // 每一行都是一个表单数据对象,当要对每一行的数据项进行操作的时候,通过作用域插槽把本数据对象的值传过来
    async showEditDialog(id) {
      this.editDialogVisible = true;
      // console.log(id);
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户信息失败");
      }
      this.editDialogVisible = true;
      this.editForm = res.data;
    },
    // 监听修改对话框关闭事件
    editDialogClosed() {
      // 对于关闭的表单进行重置操作
      this.$refs.editFormRef.resetFieleds();
    },
    //修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        const { data: res } = await this.$http.put("/user" + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile,
        });
        if (res.meta.status != 200)
          // 失败提示
          return this.$message.error("更新用户信息失败!");
        // 关闭对话框
        this.editDialogVisible = false;
        // 刷新数据列表 重新调用数据列表
        this.getUserList();
        // 提示修改成功
        this.$message.success("更新用户信息成功");
      });
    },
    //通过id删除用户的信息
    async removeUserById(id) {
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
      const { data: res } = await this.$http.delete("users/" + id);
      if (res.meta.status != 200) {
        return this.$message.error("删除用户失败");
      }
      this.$message.success("删除用户成功");
      this.getUserList();
    },
    //展示分配角色对话框
    async setRole(userInfo) {
      this.userInfo = userInfo;
      //  在展示对话框之前获取所有的角色列表
      // 在展示对话框之前获取所有角色列表
      const { data: res} =await this.$http.get("roles");
      if (res.meta.status!=200) {
        return this.$message.error("获取角色列表失败");
      } 
      this.rolesList = res.data;
      this.setRoleDialogVisible = true;
    },
    // 点击按钮分配角色
    async saveRoleInfo()
    {
      if(!this.selectedRoleId)
      {
        return this.$message.error('请选择需要分配的角色!')
      }
      const {data:res}=await this.$http.put('users/${this.userInfo.id}/role',{
        rid:this.selectedRoleId
      })
      if(res.meta.status!=200)
      {
        return this.$message.error('更新角色失败')
      }
      this.$message.success('更新角色成功!')
      // 更新当前角色列表
      this.getUserList()
      //隐藏对话框
      this.setRoleDialogVisible=false
    }
  },
};
</script>

<style lang="less" scoped>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}
</style>