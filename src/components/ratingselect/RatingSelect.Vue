<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span class="block positive"
            :class="{'active':selectType === 2}"
            @click="select(2, $event)">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span class="block positive"
            :class="{'active':selectType === 0}"
            @click="select(0, $event)">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
      <span class="block negative"
            :class="{'active':selectType === 1}"
            @click="select(1, $event)">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
    </div>
    <div class="switch" @click="toggleContent($event)" :class="{'on':onlyContent}">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;

export default {
  props: {
    ratings: {
      type: Array,
      default() {
        return [];
      }
    },
    selectType: {
      type: Number,
      default: ALL
    },
    onlyContent: {
      type: Boolean,
      default: false
    },
    desc: {
      type: Object,
      default() {
        return {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        };
      }
    }
  },
  data() {
    return {
      oContent: this.onlyContent,
      ratingType: this.selectType
    };
  },
  computed: {
    positives() { // 自动过滤rateType(正向的rate)
      return this.ratings.filter((rating) => { // js的filter函数会返回一个处理后的(为true)结果的结果数组
        return rating.rateType === POSITIVE;
      });
    },
    negatives() { // 自动过滤rateType(反向的rate)
      return this.ratings.filter((rating) => {
        return rating.rateType === NEGATIVE;
      });
    }
  },
  methods: {
    select(type, event) {
      if (!event._constructed) {
        return;
      }
      this.ratingType = type;
      this.$emit('select', type); // 子组件通过 $emit触发父组件的方法
    },
    toggleContent(event) {
      if (!event._constructed) {
        return;
      }
      this.oContent = !this.oContent;
      this.$emit('toggle', this.oContent); // 子组件通过 $emit触发父组件的方法
    }
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"
  .ratingselect
    .rating-type
      padding: 18px 0px
      margin: 0 18px
      border-1px(rgba(7,17,27,0.1))
      font-size: 0
      .block
        display: inline-block
        padding: 8px 12px
        margin-right: 8px
        border-radius: 1px
        font-size: 12px
        color: rgb(77,85,93)
        &.active
          color: #fff
        &.positive
          background: rgba(0,160,220,0.2)
          &.active
            background: rgb(0,160,220)
        &.negative
          background: rgba(77,85,93,0.2)
          &.active
            background: rgb(77,85,93)
        .count
          margin-left: 2px
          line-height: 16px
          font-size: 8px
    .switch
      padding: 12px 18px
      line-height: 24px
      font-size: 0
      color: rgb(147, 153, 159)
      border: 1px solid rgba(1, 17, 27, 0.1)
      &.on
        .icon-check_circle
          color: #00c850
      .icon-check_circle
        display: inline-block
        margin-right: 4px
        vertical-align: top
        font-size: 24px
      .text
        font-size: 12px
</style>
