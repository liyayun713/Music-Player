<template>
  <ul class="switches">
    <li class="switch-item"
        v-for="(item, index) in switches"
        :class="{'active': index === currentIndex}"
        @click="switchItem(index)">
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>

<script>
  export default {
    props: {
      switches: {
        type: Array,
        default: []
      },
      currentIndex: {
        type: Number,
        default: 0
      }
    },
    methods: {
      switchItem (index) {
        // 基础组件不做业务逻辑，直接派发事件即可
        this.$emit('switch', index);
      }
    }
  };
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .switches
    display flex
    align-item center
    margin 0 auto
    width 240px
    border 1px solid $color-highlight-background
    border-radius 5px
    .switch-item
      flex 1
      padding 8px
      text-align center
      font-size $font-size-medium
      color $color-text-d
      &.active
        background $color-highlight-background
        color $color-text
</style>
