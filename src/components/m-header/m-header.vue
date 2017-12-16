<template>
  <div class="m-header">
    <div class="icon"></div>
    <div class="text">歪歪音乐</div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'

  .m-header
    position relative
    height 44px
    text-align center
    color $color-theme
    font-size 0
    .icon
      display inline-block
      margin 6px 9px 0 0
      vertical-align top
      width 30px
      height 32px
      bg-image('logo')
      background-size 30px 32px
    .text
      display inline-block
      vertical-align top
      line-height 44px
      font-size $font-size-large
</style>
