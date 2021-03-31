<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <!-- <div class="avatar_box">
        <img src="" alt="" />
      </div> -->
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" class="login_form" :model="loginForm" :rules='loginFormRules' label-width="0px">
        <!-- 用户名 -->
        <el-form-item prop="username"> 
          <el-input   prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input   prefix-icon="el-icon-shopping-bag-2" v-model="loginForm.password" type='password'></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      // 表单的数据绑定对象
      // 一般由接口文档来定义
      loginForm:{
        username:'admin',
        password:'123456'
      },
      // 表单的数据验证对象
      loginFormRules:{
        // 验证用户名是否合法
        username:[
          { required: true, message: '请输入登录名称', trigger: 'blur' },
           { min: 3, max: 10, message: '长度在 3 到 10 个字符之间', trigger: 'blur' }
        ],
        //验证密码是否合法
        password:[
          { required: true, message: '请输入登录密码', trigger: 'blur' },
           { min: 6, max: 15, message: '长度在 3 到 10 个字符之间', trigger: 'blur' }
    
        ]
      }
    }
  },
  methods:{
    //点击按钮，重置登录表单
    resetLoginForm()
    {
      //拿到表单的dom
      // ref 作用在组件标签上就是指向组件对象，作用在普通 DOM 标签上就是普通 DOM
      // console.log(this.$refs.loginFormRef);
      this.$refs.loginFormRef.resetFields();
    },
    // 实现登录请求
    login()
    {
      this.$refs.loginFormRef.validate(async valid=>{
        // 判断是否预验证通过
        // 不通过就返回
        if(!valid) return;
        // 发起网络请求
        const {data:res}=await this.$http.post('login',this.loginForm)
        // console.log(res);
        //判断请求是否成功
        if(res.meta.status!==200) return this.$message.error("登录失败");
        
        this.$message.success("登录成功")

        // console.log(res);
        // 将用户的信息保存到sessionStorage里面
        window.sessionStorage.setItem('token',res.data.token);
        // 进行路由跳转
        this.$router.push('/home');
      })
    }
  }
};
</script>

<style lang="less" scoped>

.login_container {
  height: 100%;
  background-color: #2b4b6b;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  // transform: translateY(-50%);
  // transform: translateX(-50%);
}
.login_form
{
  position: absolute;
  width: 100%;
  padding: 50px 20px;
  box-sizing: border-box;
}
.btns
{
  display: flex;
  justify-content:flex-end;
}
</style>

