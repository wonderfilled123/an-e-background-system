<template>
  <div>
    <!-- 报表组件 -->
     <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
<div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
//1. 导入 echarts
let echarts= require('echarts')
export default {
  data(){
    return{
    
    }
  },
  created()
  {

  },
  //当dom元素加载完毕时才会执行此函数
  async mouted()
  {
    // 2.基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.getElementById('main'))
           // 基于准备好的dom，初始化echarts实例
         
         //基于时间统计的数据图
    const {data:res} = await this.$http.get('reports/type/1') 
    if(res.meta.status)
    {
      return this.$message.error('获取折线图数据失败')
    }
    console.log(res);
      
        var myChart = echarts.init(document.getElementById('main'));

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);


  },
  methods:{

  },

}
</script>

<style>

</style>