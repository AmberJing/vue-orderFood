<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li v-for="(item,index) in goods" class="menu-item" :key="index" :class="{'current':currentIndex === index}" @click="selectMenu(index,$event)">
            <span class="text-wrapper border-1px">
              <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span><span>{{item.name}}</span>
            </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodsWrapper">
        <!-- 商品分类 -->
        <ul>
          <li v-for="(item,index) in goods" :key="index" class="food-list food-list-hook">
            <h1 class="title">{{item.name}}</h1>
            <!-- 商品列表 -->
            <ul>
              <li v-for="(food,index) in item.foods" :key="index" @click="selectFood(food,$event)"  class="food-item border-1px">
                <div class="icon">
                  <img :src="food.icon" alt="" width="57">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="sellCount">月售{{food.sellCount}}</span>
                    <span>好评率{{food.rating}}</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <CartControl :food="food" @increment="incrementTotal"></CartControl>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <ShopCart ref="shopcart" :selectFoods="selectFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></ShopCart>
    </div>
    <Food :food="selectedFood" ref="food"></Food>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll';
import ShopCart from '../shopcart/ShopCart.vue';
import CartControl from '../cartcontrol/CartControl.vue';
import Food from '../food/Food.vue';

const ERR_OK = 0;

export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFood: {}
    };
  },
  computed: {
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i;
        }
      }
      return 0;
    },
    selectFoods() {
      let foods = [];
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food);
          }
        });
      });
      return foods;
    }
  },
  created() {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];

    this.$http.get('/api/goods').then((response) => {
      response = response.body;
      if (response.errno === ERR_OK) {
        this.goods = response.data;
        // console.log(this.goods);
        // vue在更新DOM时是异步的，js语句加载完DOM可能还没变化，所以会有问题
        this.$nextTick(() => {
          this._initScroll();
          this._calculateHeight();
        });
      }
    });
  },
  methods: {
    selectMenu(index, event) {
      if (!event._constructed) {
        return;
      }
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
      let el = foodList[index];
      this.foodsScroll.scrollToElement(el, 300);
    },
    selectFood(food, event) {
      if (!event._constructed) {
        return;
      }
      this.selectedFood = food;
      this.$refs.food.show();
    },
    _initScroll() {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true
      });
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, { // 希望scroll在滚动时告诉滚动位置
        probeType: 3,
        click: true
      });
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y));
      });
    },
    _calculateHeight() {
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    incrementTotal(target) { // 调用shopcart的方法，将对象传过去[事件监听，取得cartcontrol传来的值]
      // 体验优化, 异步执行下落动画
      this.$nextTick(() => {
        this.$refs.shopcart.drop(target);
      });
    }
  },
  components: {
    ShopCart,
    CartControl,
    Food
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin"
.goods
  display: flex
  position: absolute // 通过绝对定位,设置距离上下的距离可以将中间内容区的视口固定
  top: 174px // header+tab 高度
  bottom: 46px // 预留购物车位置
  width: 100%
  overflow: hidden
  .menu-wrapper
    flex: 0 0 80px
    width: 80px
    background: #f3f5f7
    .menu-item
      display: table
      width: 56px
      height: 54px
      padding: 0 12px
      line-height: 14px
      &.current
        position: relative
        z-index: 10
        margin-top: -1px
        background: #fff
        font-weight: 700
        .text-wrapper
          border-none()
      .text-wrapper
        display: table-cell
        width: 56px
        vertical-align: middle
        border-1px(rgba(7,17,27,0.1))
        font-size: 12px
        .icon
          display: inline-block
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          vertical-align: top
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.special
            bg-image('special_3')
          &.invoice
            bg-image('invoice_3')
          &.guarantee
            bg-image('guarantee_3')
  .foods-wrapper
    flex: 1
    .title
      padding-left: 14px
      height: 26px
      line-height: 26px
      border-left: 2px solid #d9dde1
      font-size: 12px
      color: rgb(147,153,159)
      background: #f3f5f7
    .food-item
      display: flex
      margin: 18px
      padding-bottom: 18px
      border-1px(rgba(7,17,27,0.1))
      &.last-child
        border-none()
        margin-bottom: 0
      .icon
        flex: 0 0 57px
        margin-right: 10px
      .content
        flex: 1
        .name
          margin: 2px 0 8px
          height: 14px
          line-height:14px
          font-size: 14px
          color: rgb(7,17,27)
        .desc,.extra
          line-height: 10px
          font-size: 10px
          color: rgb(147,153,159)
        .desc
          margin-bottom: 8px
          line-height: 12px
        .extra
          font-size: 0
          span
            font-size: 10px
          .sellCount
            margin-right: 12px
        .price
          font-weight: 400
          line-height: 24px
          .now
            margin-right: 18px
            font-size: 14px
            color: rgb(240,20,20)
          .old
            text-decoration: line-through
            font-size: 10px
            color: rgb(147,153,159)
        .cartcontrol-wrapper
          position: absolute
          right: 0
          bottom: 12px
</style>
