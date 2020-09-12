<!-- 时间选择与预览组件 -->
<template>
  <div>
    <div class="legend">
      <span style="color: rgba(0,0,0,0.85);">时段预览</span>
      <div class="legend-item" v-for="key in Object.keys(colorsMap)" :key="key">
        <span class="icon" :style="{background: colorsMap[key].color}"></span>
        <span class="text">{{ colorsMap[key].text }}</span>
      </div>
    </div>
    <canvas width="695" height="22" ref="canvas" style="border-radius: 4px"></canvas>
    <canvas width="695" height="10" ref="canvas_text" style="margin-bottom: 24px"></canvas>
    <div class="row">
      <span class="row-text">尖时段(尖峰)</span>
      <a-button type="dashed" class="btn-add" @click="() => onAdd('jian')">
        <iconfont type="icontianjia" />添加时段
      </a-button>
      <div style="flex: 1">
        <div v-for="(item, index) in jian" :key="item.key" class="timepicker">
          <a-select
            :allowClear="false"
            v-model="item.startTime"
            @change="val => onStartTimeChange('jian', index)"
          >
            <iconfont slot="suffixIcon" type="iconTime" />
            <a-select-option
              v-for="(time, idx) in timeOptions"
              :disabled="optionFilter('jian', index, 'start', idx)"
              :key="idx"
              :value="idx"
            >{{ time }}</a-select-option>
          </a-select>~
          <a-select
            :allowClear="false"
            v-model="item.endTime"
            @change="val => onEndTimeChange('jian', index)"
          >
            <iconfont slot="suffixIcon" type="iconTime" />
            <a-select-option
              v-for="(time, idx) in timeOptions"
              :disabled="optionFilter('jian', index, 'end', idx)"
              :key="idx"
              :value="idx"
            >{{ time }}</a-select-option>
          </a-select>
          <iconfont
            type="iconshanchu"
            class="icon-delete"
            @click.native="() => onDelete('jian', index)"
          />
        </div>
      </div>
      <div class="price">
        <span>尖电价</span>
        <a-input-number
          placeholder="请输入"
          class="input-price"
          :min="0"
          :max="6"
          :precision="4"
          v-model="price.jian"
        />
        <span>元/度</span>
      </div>
    </div>
    <div class="row">
      <span class="row-text">峰时段(高峰)</span>
      <a-button type="dashed" class="btn-add" @click="() => onAdd('feng')">
        <iconfont type="icontianjia" />添加时段
      </a-button>
      <div style="flex: 1">
        <div v-for="(item, index) in feng" :key="item.key" class="timepicker">
          <a-select
            :allowClear="false"
            v-model="item.startTime"
            @change="val => onStartTimeChange('feng', index)"
          >
            <iconfont slot="suffixIcon" type="iconTime" />
            <a-select-option
              v-for="(time, idx) in timeOptions"
              :disabled="optionFilter('feng', index, 'start', idx)"
              :key="idx"
              :value="idx"
            >{{ time }}</a-select-option>
          </a-select>~
          <a-select
            :allowClear="false"
            v-model="item.endTime"
            @change="val => onEndTimeChange('feng', index)"
          >
            <iconfont slot="suffixIcon" type="iconTime" />
            <a-select-option
              v-for="(time, idx) in timeOptions"
              :disabled="optionFilter('feng', index, 'end', idx)"
              :key="idx"
              :value="idx"
            >{{ time }}</a-select-option>
          </a-select>
          <iconfont
            type="iconshanchu"
            class="icon-delete"
            @click.native="() => onDelete('feng', index)"
          />
        </div>
      </div>
      <div class="price">
        <span>峰电价</span>
        <a-input-number
          placeholder="请输入"
          class="input-price"
          :min="0"
          :max="6"
          :precision="4"
          v-model="price.feng"
        />
        <span>元/度</span>
      </div>
    </div>
    <div class="row">
      <span class="row-text">平时段(平段)</span>
      <a-button type="dashed" class="btn-add" @click="() => onAdd('ping')">
        <iconfont type="icontianjia" />添加时段
      </a-button>
      <div style="flex: 1">
        <div v-for="(item, index) in ping" :key="item.key" class="timepicker">
          <a-select
            :allowClear="false"
            v-model="item.startTime"
            @change="val => onStartTimeChange('ping', index)"
          >
            <iconfont slot="suffixIcon" type="iconTime" />
            <a-select-option
              v-for="(time, idx) in timeOptions"
              :disabled="optionFilter('ping', index, 'start', idx)"
              :key="idx"
              :value="idx"
            >{{ time }}</a-select-option>
          </a-select>~
          <a-select
            :allowClear="false"
            v-model="item.endTime"
            @change="val => onEndTimeChange('ping', index)"
          >
            <iconfont slot="suffixIcon" type="iconTime" />
            <a-select-option
              v-for="(time, idx) in timeOptions"
              :disabled="optionFilter('ping', index, 'end', idx)"
              :key="idx"
              :value="idx"
            >{{ time }}</a-select-option>
          </a-select>
          <iconfont
            type="iconshanchu"
            class="icon-delete"
            @click.native="() => onDelete('ping', index)"
          />
        </div>
      </div>
      <div class="price">
        <span>平电价</span>
        <a-input-number
          placeholder="请输入"
          class="input-price"
          :min="0"
          :max="6"
          :precision="4"
          v-model="price.ping"
        />
        <span>元/度</span>
      </div>
    </div>
    <div class="row">
      <span class="row-text">谷时段(低谷)</span>
      <a-button type="dashed" class="btn-add" @click="() => onAdd('gu')">
        <iconfont type="icontianjia" />添加时段
      </a-button>
      <div style="flex: 1">
        <div v-for="(item, index) in gu" :key="item.key" class="timepicker">
          <a-select
            :allowClear="false"
            v-model="item.startTime"
            @change="val => onStartTimeChange('gu', index)"
          >
            <iconfont slot="suffixIcon" type="iconTime" />
            <a-select-option
              v-for="(time, idx) in timeOptions"
              :disabled="optionFilter('gu', index, 'start', idx)"
              :key="idx"
              :value="idx"
            >{{ time }}</a-select-option>
          </a-select>~
          <a-select
            :allowClear="false"
            v-model="item.endTime"
            @change="val => onEndTimeChange('gu', index)"
          >
            <iconfont slot="suffixIcon" type="iconTime" />
            <a-select-option
              v-for="(time, idx) in timeOptions"
              :disabled="optionFilter('gu', index, 'end', idx)"
              :key="idx"
              :value="idx"
            >{{ time }}</a-select-option>
          </a-select>
          <iconfont
            type="iconshanchu"
            class="icon-delete"
            @click.native="() => onDelete('gu', index)"
          />
        </div>
      </div>
      <div class="price">
        <span>谷电价</span>
        <a-input-number
          placeholder="请输入"
          class="input-price"
          :min="0"
          :max="6"
          :precision="4"
          v-model="price.gu"
        />
        <span>元/度</span>
      </div>
    </div>
  </div>
</template>
<script>
import { timeList, getSelectableRangeTimeIdxMap } from './tool'
import { isNil } from 'lodash'
const constantsList = ['jian', 'feng', 'ping', 'gu']
const colorsMap = {
  jian: {
    color: '#F56C6C',
    text: '尖'
  },
  feng: {
    color: '#FFB54D',
    text: '峰'
  },
  ping: {
    color: '#67C23A',
    text: '平'
  },
  gu: {
    color: '#BCD2FF',
    text: '谷'
  },
  kong: {
    color: '#F3F3F3',
    text: '空'
  }
}
const timeOptions = timeList
export default {
  data () {
    return {
      colorsMap,
      timeOptions,
      disabledStartTimeArr: [],
      disabledEndTimeArr: [],
      jian: [],
      feng: [],
      ping: [],
      gu: [],
      price: {
        jian: null,
        feng: null,
        ping: null,
        gu: null
      }
    }
  },
  methods: {
    initData (data) {
      this.initCanvas()
      if (data) {
        const { jian, feng, ping, gu, price } = data
        this.jian = [...jian]
        this.feng = [...feng]
        this.ping = [...ping]
        this.gu = [...gu]
        this.price = price
        jian.forEach((data) => {
          this.updateCanvas(data, 'jian')
        })
        feng.forEach((data) => {
          this.updateCanvas(data, 'feng')
        })
        ping.forEach((data) => {
          this.updateCanvas(data, 'ping')
        })
        gu.forEach((data) => {
          this.updateCanvas(data, 'gu')
        })
      } else {
        this.jian = []
        this.feng = []
        this.ping = []
        this.gu = []
        this.price = {
          jian: null,
          feng: null,
          ping: null,
          gu: null
        }
      }
      this.genOptionFilter()
    },
    genOptionFilter () {
      this.optionFilter = getSelectableRangeTimeIdxMap(this.jian, this.feng, this.ping, this.gu)
    },
    disabledTime () {
      const startArr = [48]
      const endArr = [0]
      const total = [].concat(this.jian, this.feng, this.ping, this.gu)
      total.sort((a, b) => a.startTime - b.startTime)
      total.forEach((item, index) => {
        const preEndIdx = total[index - 1] ? total[index - 1].endTime : 0
        const curStartIdx = item.startTime
        const curEndIdx = item.endTime
        const nextStartIdx = total[index + 1] ? total[index + 1].startTime : 49
        const endFlag = curEndIdx < nextStartIdx ? curEndIdx - 1 : curEndIdx
        const startFlag = curStartIdx > preEndIdx ? curStartIdx + 1 : curStartIdx
        for (let i = curStartIdx; i <= endFlag; i++) {
          if (!startArr.includes(i)) {
            startArr.push(i)
          }
        }
        for (let i = startFlag; i <= curEndIdx; i++) {
          if (!endArr.includes(i)) {
            endArr.push(i)
          }
        }
      })
      this.disabledStartTimeArr = [...startArr]
      this.disabledEndTimeArr = [...endArr]
    },
    dropdownVisibleChange (open, param, index, type) {
      if (!open) return
      const startArr = this.disabledStartTimeArr
      const endArr = this.disabledEndTimeArr
      const { startTime, endTime } = this[param][index]
      if (type === 'start') {
        if (endTime !== null) {
          for (let i = endTime; i <= 48; i++) {
            if (!startArr.includes(i)) {
              startArr.push(i)
            }
          }
        }
        this.disabledStartTimeArr = [...startArr]
      } else if (type === 'end') {
        if (startTime !== null) {
          for (let i = 0; i <= startTime; i++) {
            if (!endArr.includes(i)) {
              endArr.push(i)
            }
          }
        }
        this.disabledStartTimeArr = [...endArr]
      }
    },
    onAdd (param) {
      const total = [].concat(this.jian, this.feng, this.ping, this.gu)
      if (total.find((item) => item.startTime === null || item.endTime === null)) {
        return this.$message.warning('请先完成上一项的时间区间选择')
      }
      if (this[param].length === 4) {
        return this.$message.warning('每个时段最多可以设置4个时间区间')
      } else if (total.length === 14) {
        return this.$message.warning('所有时段的时间区间个数上限为14个')
      }
      this[param].push({
        key: Date.now(),
        startTime: null,
        endTime: null
      })
      this.genOptionFilter()
    },
    onDelete (param, index) {
      const data = this[param][index]
      if (data.startTime !== null && data.endTime !== null) {
        // this.updateCanvas(data, 'kong')
        this[param].splice(index, 1)
      } else {
        this[param].splice(index, 1)
      }
      this.updateCanvas(data, 'kong')
      this.genOptionFilter()
    },
    onStartTimeChange (param, index) {
      const data = this[param][index]
      this.genOptionFilter()
      if (data.endTime === null) {
        return
      }
      this.updateCanvas(data, 'kong')
      this.updateCanvas(data, param)
    },
    onEndTimeChange (param, index) {
      const data = this[param][index]
      this.genOptionFilter()
      if (data.startTime === null) {
        return
      }
      this.updateCanvas(data, 'kong')
      this.updateCanvas(data, param)
    },
    drawRect (start, end, ctx, type) {
      ctx.beginPath()
      ctx.fillStyle = colorsMap[type].color
      for (let i = start; i < end; i++) {
        if (i % 2 === 0) {
          ctx.rect((29 * i) / 2, 0, 14, 22)
        } else {
          ctx.rect(14 + ((i - 1) / 2) * 29, 0, 14, 22)
        }
      }
      ctx.fill()
    },
    drawText (ctx) {
      ctx.beginPath()
      ctx.fillStyle = 'rgba(0,0,0,0.45)'
      ctx.fillText(0, 0, 10)
      for (let i = 1; i < 10; i++) {
        ctx.fillText(i, i * 29 - 3, 10)
      }
      for (let i = 10; i < 24; i++) {
        ctx.fillText(i, i * 29 - 6, 10)
      }
      ctx.fill()
    },
    updateCanvas (/* data, type */) {
      const canvas = this.$refs.canvas
      const ctx = canvas.getContext('2d')
      // const start = data.startTime
      // const end = data.endTime
      // if (start < end) {
      //   this.drawRect(start, end, ctx, type)
      // } else if (start === end) {
      //   this.drawRect(0, 48, ctx, type)
      // } else {
      //   this.drawRect(0, end, ctx, type)
      //   this.drawRect(start, 48, ctx, type)
      // }
      this.drawRect(0, 48, ctx, 'kong');
      [this.jian, this.feng, this.ping, this.gu].forEach((list, idx) => {
        const type = constantsList[idx]
        list.forEach(({ startTime, endTime }) => {
          if (isNil(startTime) || isNil(endTime)) return
          const start = startTime
          const end = endTime
          if (start < end) {
            this.drawRect(start, end, ctx, type)
          } else if (start === end) {
            this.drawRect(0, 48, ctx, type)
          } else {
            this.drawRect(0, end, ctx, type)
            this.drawRect(start, 48, ctx, type)
          }
        })
      })
    },
    initCanvas () {
      const canvas = this.$refs.canvas
      const ctx = canvas.getContext('2d')
      ctx.beginPath()
      ctx.fillStyle = '#F3F3F3'
      for (let i = 0; i < 48; i++) {
        if (i % 2 === 0) {
          ctx.rect((29 * i) / 2, 0, 14, 22)
        } else {
          ctx.rect(14 + ((i - 1) / 2) * 29, 0, 14, 22)
        }
      }
      ctx.fill()
      const ctx2 = this.$refs.canvas_text.getContext('2d')
      this.drawText(ctx2)
    },
    clearCanvas () {
      const ctx = this.$refs.canvas.getContext('2d')
      ctx.clearRect(0, 0, 695, 22)
      const ctx2 = this.$refs.canvas_text.getContext('2d')
      ctx2.clearRect(0, 0, 695, 10)
    }
  }
}
</script>
<style lang="less" scoped>
.legend {
  display: flex;
  margin-bottom: 13px;
  .legend-item {
    margin-left: 16px;
    .icon {
      display: inline-block;
      width: 14px;
      height: 12px;
      margin-right: 4px;
    }
    .text {
      color: rgba(0, 0, 0, 0.85);
      line-height: 22px;
    }
  }
}
.row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  .row-text {
    height: 32px;
    line-height: 32px;
  }
  .btn-add {
    margin-left: 13px;
    margin-right: 16px;
    padding: 5px 8px;
    color: rgba(0, 0, 0, 0.65);
    & > svg {
      width: 16px;
      height: 16px;
      margin-right: 4px;
    }
  }
  .timepicker {
    margin-bottom: 8px;
    ::v-deep .ant-select {
      width: 106px;
      svg {
        font-size: 16px;
        transform: translateY(-2px);
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
  .icon-delete {
    font-size: 24px;
    margin-left: 8px;
    transform: translateY(3px);
    color: red;
    cursor: pointer;
  }
  .price {
    width: 180px;
  }
  .input-price {
    width: 86px;
    margin: 0 8px;
  }
}
</style>
