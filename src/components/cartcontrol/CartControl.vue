<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart($event)">
        <transition name="inner">
          <span class="inner icon-remove_circle_outline icon-jian"></span>
        </transition>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-increase icon-add_circle" @click.stop.prevent="addCart($event)"></div>
  </div>
</template>
<script type="text/ecmascript-6">
import Vue from 'vue';

export default {
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    addCart(event) {
      if (!event._constructed) {
        return;
      }
      if (!this.food.count) {
        Vue.set(this.food, 'count', 1);
        this.food.count = 1;
      } else {
        this.food.count++;
      }
      this.$emit('increment', event.target); // 子组件通过 $emit触发父组件的方法
    },
    decreaseCart(event) {
      if (!event._constructed) {
        return;
      }
      if (this.food.count) {
        this.food.count--;
      }
    }
  }
};
</script>
<style lang="stylus" type="stylesheet/stylus">
  .cartcontrol
    font-size: 0
    .cart-decrease
      display: inline-block
      padding: 6px
      .inner
        line-height: 24px
        font-size: 24px
        color: rgb(0,160,220)
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 24px
      font-size: 10px
      color:rgb(147,153,159)
    .cart-increase
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0,160,220)
</style>
<style type="text/css">
  .move-enter-active, .move-leave-active {
    transition: all 0.4s linear;
  }
  .move-enter, .move-leave-active {
    opacity: 0;
    transform: translate3d(24px, 0, 0);
  }
  .inner-enter-active, .inner-leave-active {
    transition: all 0.4s linear;
    transform: rotate(0);
  }
  .inner-enter, .inner-leave-active {
    opacity: 0;
    transform: rotate(180deg);
  }
</style>
