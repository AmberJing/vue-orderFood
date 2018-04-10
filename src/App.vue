<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!-- 保持选购物品状态 -->
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">

import Header from './components/header/Header.vue';
import {urlParse} from 'common/js/utils.js';

const ERR_OK = 0;

export default {
  name: 'App',
  data() {
    return {
      seller: {
        id: (() => { // 立即执行函数 从url中提取id
          let queryParam = urlParse();
          console.log(queryParam);
          return queryParam.id;
        })()
      }
    };
  },
  created() {
    this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
      response = response.body;
      if (response.errno === ERR_OK) {
        // console.log(this.seller);
        this.seller = Object.assign({}, this.seller, response.data); // 给对象扩展属性
        // console.log(this.seller.id);
      }
    });
  },
  components: {
    'v-header': Header
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
/* 1.布局样式放前面[display,position]
   2.宽高等会refloat和不能被继承的往前放
   4.字体 颜色等可被继承的往后放 */
/* 由于物理像素是设备像素的两倍(iphone6下),所以以下设置px都需要是草稿图的一半 */
@import "/common/stylus/mixin.styl"
  #app
    .tab
      display:flex
      width:100%
      height:40px
      line-height:40px
      /*border-bottom:1px solid rgba(7,17,27,0.1)
        在pc端看没问题,但手机端由于dpi的原因就不是1px了*/
      border-1px(rgba(7,17,27,0.1))
      .tab-item
        flex:1
        text-align:center
        & > a
          display:block
          font-size:14px
          color:rgb(77,85,93)
          &.active
            color:rgb(240,20,20)
</style>
