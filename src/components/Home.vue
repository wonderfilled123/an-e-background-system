<template>
    <el-container class="home-container">
      <el-header>
        <!-- header -->
        <div>
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <el-container>
        <el-aside :width="isCollapse?'64px' : '200px' ">
          <!-- 侧边栏菜单区 -->
          <!-- 侧边栏折叠按钮 -->
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409EFF"
      unique-opened
      :collapse="isCollapse"
      :collapse-transition="true"
      router
      :default-active="activePath">
      <el-submenu :index="item.id+''" v-for='item in menulist' :key="item.id">
        <!-- 一级菜单的模板区域 -->
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单模板区域 -->
          <el-menu-item :index="'/'+subItem.path" 
          v-for="subItem in item.children" 
          :key='subItem.id'
          @click="saveNavState('/'+ subItem.path)">
             
            <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{subItem.authName}}</span>
            </template>
          </el-menu-item>
      </el-submenu>
    </el-menu>
  </el-col>
</el-row>
        </el-aside>
        <el-main>
          <router-view>     
          </router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
export default {
  data()
  {
    return{
      //左侧菜单数据
      menulist:[],
      
      isCollapse:false,
      //被激活的链接地址
      activePath:''
    }
  },
  created()
  {
    this.getMenuList()
    this.activePath=window.sessionStorage.getItem('activePath')
  },
  methods: {
    //退出登录
    logout() {
      // 销毁token
      window.sessionStorage.clear();
      // 重新定向到登录页
      this.$router.push("/login");
    },
    //获取所有的菜单
    async getMenuList()
    {
      const {data:res} = await this.$http.get('menus')
      if(res.meta.status!=200) return this.$message.error('res.mate.msg')
      this.menulist=res.data
    },
    // 点击按钮折叠展开
    toggleCollapse()
    {
      this.isCollapse=!this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState(activePath)
    {
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath=activePath
    }
  },
};
</script>

<style>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  font-size: 20px;
  color: white;
}
.el-aside {
  background-color: #333744;
  color: #333;
}

.el-main {
  background-color: #e9eef3;
}
.toggle-button
{
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.6em;
  cursor: pointer;
}
</style>