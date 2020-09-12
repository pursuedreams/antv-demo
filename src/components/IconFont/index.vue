<template>
  <svg class="iconfont">
    <use :xlink:href="`#${type}`" />
  </svg>
</template>

<script>

export default {
  name: 'Iconfont',
  props: {
    type: {
      type: String,
      default: '',
      required: true
    }
  }
}
</script>
<style lang="less" scoped>
.iconfont {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
}
</style>
