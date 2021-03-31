<template>
  <div>
    <el-button type="primary" @click="addDialog">主要按钮</el-button>
    <el-dialog title="用户添加" :visible.sync="dialogVisible" width="30%">
      <!-- 对话框主体区域 -->
      <el-form ref="addFormRefs" :model="addForm" label-width="80px" :rules="addFormRules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addFormReset">取 消</el-button>
        <el-button type="primary" @click="adduser"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 控制对话框显示隐藏
      dialogVisible: false,
      //表单的数据对象
      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:""
      },
      addFormRules:{
        username:[
           { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password:[
           { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        email:[
           { required: true, message: '请输入邮箱', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        mobile:[
           { required: true, message: '请输入手机号', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }

    };
  },
  methods: {
    // 显示对话框
    addDialog() {
      this.dialogVisible = true;
    },
    addFormReset()
    {
      this.dialogVisible= false
      this.$refs.addFormRefs.resetFields()
    },
    //添加用户前进行预校验
    adduser()
    {
      this.$refs.addFormRefs.validateField(vaild=>{
        console.log(valid);
      })
    }
  },
};
</script>

<style>
</style>