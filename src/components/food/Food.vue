<template>
  <transition name="slide">
    <div v-show="showFlag" class="food" >
      <div class="food-wrapper" ref="foodEL">
        <div class="food-content">
          <div class="image-header">
            <img :src="food.image" alt="">
            <div class="back-button" @click="hide">
              <i class="icon-arrow_lift"></i>
            </div>
          </div>
          <div class="content">
            <h1 class="title">{{food.name}}</h1>
            <div class="detail">
              <span class="sell-count">月售{{food.sellCount}}份</span>
              <span class="rating">好评率{{food.rating}}%</span>
            </div>
            <div class="price">
              <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
            </div>
            <div class="cartcontrol-wrapper">
              <CartControl :food="food"></CartControl>
            </div>
            <transition name="buy">
              <div class="buy" v-show="!food.count || food.count === 0" @click.stop.prevent="addFirst($event)">加入购物车</div>
            </transition>
          </div>
        </div>
        <Split v-show="food.info"></Split>
        <div class="food-info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <Split></Split>
        <div class="food-rating">
          <h1 class="title">商品评价</h1>
          <RatingSelect @select="selectRating" @toggle="toggleContent" :selectType="selectType" :onlyContent="onlyContent" :desc="desc" :ratings="food.ratings"></RatingSelect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-show="needShow(rating.rateType,rating.text)" v-for="(rating,index) in food.ratings" :key="index" class="rating-item border-1px">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img :src="rating.avatar" alt="" class="avatar" width="12" height="12">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <i :class="{'icon-thumb_up':rating.rateType === 0,'icon-thumb_down':rating.rateType === 1}"></i>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script type="text/ecmascript-6">
import Vue from 'vue';
import BScroll from 'better-scroll';
import CartControl from '../cartcontrol/CartControl.vue';
import RatingSelect from '../ratingselect/RatingSelect.vue';
import Split from '../split/Split.vue';
import {formatDate} from '../../common/js/date.js';

// const POSITIVE = 0;
// const NEGATIVE = 1;
const ALL = 2;

export default {
  props: {
    food: {
      type: Object
    }
  },
  data() {
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    };
  },
  methods: {
    show() {
      this.showFlag = true;
      this.selectType = ALL;
      this.onlyContent = true;
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$el, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    hide() {
      this.showFlag = false;
    },
    addFirst(event) {
      if (!event._constructed) {
        return;
      }
      Vue.set(this.food, 'count', 1);
    },
    needShow(type, text) {
      if (this.onlyContent && !text) { // 判断是否选择了只显示内容
        return false;
      }
      if (this.selectType === ALL) { // 判断是全部?好评?
        return true;
      } else {
        return type === this.selectType;
      }
    },
    selectRating(type) {
      this.selectType = type;
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    },
    toggleContent(onlyContent) {
      this.onlyContent = onlyContent;
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    }
  },
  filters: {
    formatDate(time) {
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM--dd hh:mm');
    }
  },
  components: {
    CartControl,
    RatingSelect,
    Split
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"
  .food
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    z-index: 30
    width: 100%
    background: #fff
    &.slide-enter-active, &.slide-leave-active{
      transition: all 0.2s linear
      transform: translate3d(0, 0, 0)
    }
    &.slide-enter, &.slide-leave-active{
      transform: translate3d(100%, 0, 0)
    }
    .food-content
      .image-header
        position: relative
        width: 100%
        height: 0
        padding-top: 100% // 使用padding制造一个宽高相等的容器
        img // 提前设置图片大小 以免图片异步加载,会导致下面的内容下移空出图片位置而产生的抖动
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%
        .back-button
          position: absolute
          top: 10px
          left: 0
          .icon-arrow_lift
            display: block
            padding: 10px
            font-size: 20px
            color: #fff
      .content
        position: relative
        padding: 18px
        .title
          margin-bottom: 8px
          line-height: 14px
          font-size: 14px
          font-weight: 700
          color: rgb(7,17,27)
        .detail
          margin-bottom: 18px
          height: 10px
          line-height: 10px
          font-size: 0px
          .sell-count,.rating
            font-size: 10px
            color: rgb(147,153,159)
          .sell-count
            margin-right: 12px
        .price
          font-weight: 700px
          line-height: 24px
          .now
            margin-right: 8px
            font-size: 14px
            color: rgb(240, 20, 20)
          .old
            font-size: 10px
            color: rgb(147, 153, 159)
            text-decoration: line-through
        .cartcontrol-wrapper
          position: absolute
          right: 12px
          bottom: 12px
        .buy
          position: absolute
          right: 18px
          bottom: 18px
          z-index: 10
          height: 24px
          line-height: 24px
          padding: 0 12px
          box-sizing: border-box
          font-size: 10px
          color: #ff
          border-radius: 12px
          background: rgb(0,160,220)
          &.buy-enter-active, &.buy-leave-active{
            transition: all 0.2s
            opacity: 2
          }
          &.buy-enter, &.buy-leave-active{
            opacity: 0
          }
    .food-info
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 6px
        font-size: 14px
        color: rgb(7,17,27)
      .text
        line-height: 24px
        padding: 0 8px
        font-size: 12px
        color: rgb(7,17,27)
    .food-rating
      padding-top: 18px
      .title
        line-height: 14px
        margin-left: 18px
        font-size: 14px
        color: rgb(7,17,27)
      .rating-wrapper
        padding: 0 18px
        .rating-item
          position: relative
          padding: 16px 0
          border-1px(rgba(7,17,27,0.1))
          .user
            position: absolute
            right: 0
            top: 16px
            line-height: 12px
            font-size: 0
            .name
              display: inline-block
              margin-right: 6px
              vertical-align: top
              font-size: 10px
              color: rgb(147,153,159)
            .avatar
              border-radius: 50%
              font-size: 14px
          .time
            margin-bottom: 6px
            line-height: 12px
            font-size: 10px
            color: rgb(147,153,159)
          .text
            line-height: 16px
            font-size: 12px
            color: rgb(7,17,27)
            .icon-thumb_up,.icon-thumb_down
              margin-right: 14px
            .icon-thumb_up
              color: rgb(0,160,220)
            .icon-thumb_down
              color: rgb(147,153,159)
        .no-rating
          padding: 16px 0
          font-size: 12px
          color: rgb(147,153,159)
</style>
