<template>
  <div class="assstrategylist">
    <timeBar ref="timebar" />
    <button @click="onOk"> 提交 </button>

    <div class="assstrategylist-head" v-if="false">
      <a-form layout="inline" :form="form" @submit="handleSubmit">
        <div class="padding3060">
          <a-row class="form-row" :gutter="18">
            <a-col :span="10">
              <template>
                <a-form-item
                  :colon="false"
                  label="电度电价"
                >
                  <a-radio-group
                    v-decorator="['calculateMethod', { rules: [{ required: true, message: '请输入电度电价!' }], initialValue: 1}]"
                  >
                    <a-radio :value="1">
                      单费率
                    </a-radio>
                    <a-radio :value="2">
                      复费率
                    </a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item
                  :colon="false"
                  label=""
                  :labelCol="{xs: {span: 9}}"
                  :wrapperCol="{xs: {span: 24}}"
                  style="margin-left:80px;"
                  v-if="form.getFieldValue('calculateMethod') ==2"
                >
                  <div class="compoundrate">
                    <div class="compoundrate-item" v-for="(item, index) in compoundrate" :key="index">
                      <div class="compoundrate-item__type">{{ item.type }}</div>
                      <div class="compoundrate-item__type">
                        <a-form-item>
                          <a-button type="dashed" @click="add(index+1)">
                            <a-icon type="plus" /> 添加时段
                          </a-button>
                        </a-form-item>
                      </div>
                      <div style="display:flex;width:200px;margin-left:30px;flex-wrap: wrap;">
                        <div>{{
                          form.getFieldValue(`compoundrateKey${index+1}`)
                        }}</div>
                        <a-form-item
                          v-for="k in form.getFieldValue(`compoundrateKey${index+1}`)"
                          :key="k"
                          :required="false"
                          :labelCol="{xs: {span: 9}}"
                          :wrapperCol="{xs: {span: 24}}"
                        >
                          <div style="display:flex;width:200px;flex-wrap: wrap;">
                            <a-form-item>
                              <a-time-picker
                                format="HH:mm"
                                v-decorator="[
                                  `starttime_${index + 1}[${k}]`, { rules: [{ required: true, message: '请选择开始时间！' }]}]"
                                style="width:80px"
                                :minuteStep="30"
                                @change="handleChangeStartTime(`endtime_${index + 1}[${k}]`)"
                              />
                            </a-form-item>
                            ~
                            <a-form-item>
                              <a-time-picker
                                format="HH:mm"
                                v-decorator="[
                                  `endtime_${index + 1}[${k}]`,
                                  {
                                    rules:[
                                      { required: true, message: '请选择结束时间！' },
                                      { validator: (rule, value, callback) => {validatorEndTime(`starttime_${index + 1}[${k}]`, rule, value, callback)} }
                                    ]
                                  }
                                ]"
                                style="width:80px"
                                :minuteStep="30"
                                :disabledHours="() => handleDisableHours(`starttime_${index + 1}[${k}]`)"
                                :disabledMinutes="(selectedHour) => handleDisableMinutes(selectedHour, `starttime_${index + 1}[${k}]`)"
                              />
                            </a-form-item>
                            <a-icon
                              v-if="form.getFieldValue(`compoundrateKey${index+1}`).length > 1"
                              class="dynamic-delete-button"
                              type="minus-circle-o"
                              :disabled="form.getFieldValue(`compoundrateKey${index+1}`).length === 1"
                              @click="() => remove(k,(index+1))"
                              style="margin-top:10px;margin-left:10px;"
                            />
                          </div>
                        </a-form-item>
                      </div>
                      <div class="compoundrate-item__price">
                        尖电价<a-input
                          placeholder="请输入"
                          style="width:70px;margin:0 10px;"
                          v-decorator="[ `${item.price}`, { rules: [{ required: false }]}]"
                        />元/度
                      </div>
                    </div>
                  </div>
                </a-form-item>
              </template>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="10">
              <a-form-item
                label=" "
                :colon="false"
              >
                <a-button type="primary" style="margin-right:10px;" html-type="submit">保存</a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import timeBar from './timeBar'
const timeOptions = ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30']
let id = 0
export default {
  name: 'AddStrategy',
  components: {
    timeBar
  },
  data () {
    return {
      value: 1,
      // form: this.$form.createForm(this),
      extraQuery: {},
      areaData: [],
      voltageLevel: [],
      companyList: [],
      queryDeviceListByStationId: [],
      cyclepriceJune: ['1月', '2月', '3月', '4月', '5月', '6月'],
      cyclepriceDecember: ['7月', '8月', '9月', '10月', '11月', '12月'],
      datelist: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
      compoundrate: [
        { type: '尖时段(尖峰)', key: 'tipTime', price: 'tipPrice' },
        { type: '峰时段(高峰)', key: 'peakTime', price: 'peakPrice' },
        { type: '平时段(平段)', key: 'flatTime', price: 'flatPrice' },
        { type: '谷时段(低谷)', key: 'valleyTime', price: 'valleyPrice' }
      ],
      deviceIdList: [],
      startTime: undefined,
      endTime: undefined,
      modalType: ''
    }
  },
  computed: {
    // ...mapGetters(['userInfo'])
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'dynamic_form_item' })
    this.form.getFieldDecorator('compoundrateKey1', { initialValue: [], preserve: true })
    this.form.getFieldDecorator('compoundrateKey2', { initialValue: [], preserve: true })
    this.form.getFieldDecorator('compoundrateKey3', { initialValue: [], preserve: true })
    this.form.getFieldDecorator('compoundrateKey4', { initialValue: [], preserve: true })
  },
  created () {
    // this._getBaseInfo()
    // this._getInitData()
    // this._getCompanyList()
    // this._queryDeviceListByStationId()

		this.onShow('edit', {
			tipTimePeriods: [
				{
				startTime: '00:00',
				endTime: '00:30'
				},
				{
				startTime: '00:00',
				endTime: '00:30'
				}
			],
			peakTimePeriods: [
				{
				startTime: '00:30',
				endTime: '10:30'
				}
			],
			flatTimePeriods: [
				{
				startTime: '10:30',
				endTime: '18:30'
				}
			],
			valleyTimePeriods: [
				{
				startTime: '18:30',
				endTime: '23:30'
				}
			],
			tipPrice: 10,
			peakPrice: 5,
			flatPrice: 8,
			valleyPrice: 9
		})
  },
  mounted () {
		this.computedHours()
  },
   methods: {
			computedHours () {
			const arrList = [
			['00:00-00:30', '00:30-08:00'],
			['08:00-12:30', '12:30-13:00'],
			['13:00-15:30', '15:30-19:00'],
			['19:00-20:30', '20:30-24:00']
			]

			let hours = 0
			arrList.forEach(area => {
				area.forEach(item => {
					// eslint-disable-next-line prefer-const
					let [start, end] = item.split('-')
					end = end === '00:00' ? '24:00' : end
					const asHours = moment.duration(moment(end, 'HH:mm') - moment(start, 'HH:mm'), 'ms').asHours()
					hours += asHours
				})
			})
			console.log(hours, '===========hours')
			},
      onChange (time, timeString) {
        console.log(time, timeString)
      },
      categoryHandle (val) {
        this.form.resetFields(['applyType', 'capacity', 'capacityprice', 'demand', 'demandprice', 'powerFactorAssess', 'singleprice', 'price1',
                              'tipPrice', 'peakPrice', 'flatPrice', 'valleyPrice', 'singlerateprice' ])
      },
      stationNameHandle (val) {
        this.deviceIdList.push(val)
      },
      handleSubmit (e) {
        e.preventDefault()
        this.form.validateFields((err, fieldsValue) => {
          console.log(fieldsValue, '1717171717171717171717171717171717171717')

          if (err) { return false }
          if (this.checkTimeHasEmpty(fieldsValue)) return this.$message.error('请选择时间')

          const timeArr = this.formatTime(fieldsValue)
          console.log(timeArr)

        //   this.doAddSiteAction(fieldsValue)
        })
      },
      formatTime (data) {
        const timeRangeList = this.formatTimeToRange(data)
        console.log(timeRangeList)
        const flat1 = timeRangeList.flat()
        // const totalRange = this.totalRange(flat1)
        // if (totalRange !== 24) {
        //   this.$message.error('复费率的时段相加最终结果不能超过或小于24小时')
        //   return undefined
        // }
        const hasRepeat = this.checkRangeHasRepeat(flat1)
        if (hasRepeat) {
          this.$message.error(hasRepeat)
        } else {
          return this.formatTimeArrayToArrayStr(timeRangeList)
        }
      },
      formatTimeToRange (data) {
        const timeRangeList = []
        for (let i = 0; i < 4; i++) {
          const startTimeArr = data[`starttime_${i + 1}`]
            ? data[`starttime_${i + 1}`].filter(item => item)
            : []
          const endTimeArr = data[`endtime_${i + 1}`]
            ? data[`endtime_${i + 1}`].filter(item => item)
            : []

          // timeRangeList[i] = startTimeArr.map((start, index) => [start, endTimeArr[index]])

          timeRangeList[i] = startTimeArr.map((start, index) => {
            return [start, endTimeArr[index]]
          })
        }
        return timeRangeList
      },
      formatTimeArrayToArrayStr (timeRangeList) {
        const timeArrStr = timeRangeList.map((list) => {
          // return list.map(([start, end]) => {
          //   return `${moment(start).format('HH:mm')}-${moment(end).format('HH:mm')}`
          // })
           return list.map(([start, end]) => `${moment(start).format('HH:mm')}-${moment(end).format('HH:mm')}`)
        })
        return timeArrStr
      },
      /**
       * 检查时间是否重复
       */
      checkRangeHasRepeat (flat1) {
        let msg = ''
        const hasRepeat = flat1.some(item => {
          return flat1.some(([start, end]) => {
            if (moment(item[0]).isBetween(start, end) || moment(item[1]).isBetween(start, end)) {
              msg = `${moment(item[0]).format('HH:mm')}-${moment(item[1]).format('HH:mm')}与${moment(start).format('HH:mm')}-${moment(end).format('HH:mm')}时段重复或交叉`
              return true
            }
          })
        })
        if (hasRepeat) return msg
      },
      /**
       * 计算时段合
       */
      totalRange (flat1) {
        let total = 0
        flat1.forEach(([startTime, endTime]) => {
          total += moment.duration(endTime.diff(startTime)).asHours()
        })
        return total
      },
      /**
       * 校验结束时间，结束时间大于开始时间30m
       */
      validatorEndTime (startKey, rule, value, callback) {
        const startTime = this.form.getFieldValue(startKey)
        if (value && moment.duration(value.diff(startTime)).asMinutes() < 30) {
            // eslint-disable-next-line standard/no-callback-literal
            callback('结束时间必须大于开始时间30分钟')
        }

        // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
        callback()
      },
      checkTimeHasEmpty (data) {
        // for (let i = 0; i < 4; i++) {
        //   const element = data[`compoundrateKey${i + 1}`]
        //   if (!element || element.length === 0) return true
        // }
      },

      remove (k, inx) {
        const { form } = this
        // can use data-binding to get
        const compoundrateKey = form.getFieldValue(`compoundrateKey${inx}`)
        // We need at least one passenger
        if (compoundrateKey.length === 1) {
          return
        }

        // can use data-binding to set
        form.setFieldsValue({
          [`compoundrateKey${inx}`]: compoundrateKey.filter(key => key !== k)
        })
      },
      add (inx) {
        const { form } = this
        const compoundrateKey = form.getFieldValue(`compoundrateKey${inx}`)
        const nextKeys = compoundrateKey.concat(id++)
        console.log(id, nextKeys, '11111111111111111111111111')
        form.setFieldsValue({
          [`compoundrateKey${inx}`]: nextKeys
        })
      },
      handleChangeStartTime (endTime) {
        const { form } = this
        form.setFieldsValue({
            [endTime]: undefined
          })
        console.log(endTime, 'endTime')
      },
      handleDisableHours (startTimeKey) {
        const hoursArr = []
        const startTime = this.form.getFieldValue(startTimeKey)
        const disabledHours = moment(startTime).add(29, 'm').hours() // 加30分钟控制 选择的小时
        for (let i = 0; i < disabledHours; i++) {
          hoursArr.push(i)
        }
        return hoursArr
      },
      handleDisableMinutes (selectedHour, startTimeKey) {
        const startTime = this.form.getFieldValue(startTimeKey)
        const disabledTime = moment(startTime).add(29, 'm')
        const hours = moment(disabledTime).hours()
        const minute = moment(disabledTime).minute()
        const minutesArr = []

        if (selectedHour === hours) {
          for (let i = 0; i <= minute; i++) {
            minutesArr.push(i)
          }
        }
        return minutesArr
      },
      validatorStartTime (rule, value, callback) {

        // const { getFieldValue } = this.props.form
        // if (value && value !== getFieldValue('newPassword')) {
        //   // eslint-disable-next-line standard/no-callback-literal
        //   callback('两次输入不一致！')
        // }

        // // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
        // callback()
      },
      // formatTime (data) {
      //   const startTimeArr = []
      //   const endTimeArr = []
      //   for (let i = 0; i < 4; i++) {
      //     startTimeArr[i] = data[`starttime_${i + 1}`]
      //       ? data[`starttime_${i + 1}`].filter(item => item)
      //       : []
      //     endTimeArr[i] = data[`endtime_${i + 1}`]
      //       ? data[`endtime_${i + 1}`].filter(item => item)
      //       : []
      //   }
      //   const timeArrStr = []
      //   const timelimitArrStr = []
      //   for (let i = 0; i < 4; i++) {
      //     const startGroup = startTimeArr[i]
      //     const endIGroup = endTimeArr[i]
      //     timeArrStr[i] = startGroup.map((start, index) => {
      //       const end = endIGroup[index]
      //       timelimitArrStr.push(this.checkTime(start, end))
      //       return `${moment(start).format('HH:mm')}-${moment(end).format('HH:mm')}`
      //     })
      //   }
      //   if (data.category === 2 && data.calculateMethod === 2 && this.TwentyfourLimit(timelimitArrStr) !== 24) {
      //     return this.$message.error('复费率的时段相加最终结果不能超过或小于24小时')
      //   }
      //   return timeArrStr
      // },
      // checkTime (startTime, endTime) {
      //   if (moment(startTime).format('HH:mm') > moment(endTime).format('HH:mm')) {
      //     return this.$message.error('复费率的时段结束时间要小于等于开始时间')
      //   } else {
      //       return this.limitHours(startTime, endTime)
      //   }
      // },
      // limitHours (startTime, endTime) {
      //   let timelimit = moment.duration(endTime.diff(startTime)).asHours()
      //   return timelimit
      // },
      // TwentyfourLimit (arr) {
      //   let sum = null
      //   for (var i = 0; i < arr.length; i++) {
      //     sum += arr[i]
      //   }
      //   return sum
      // },
      // checkTimeHasEmpty (data) {
      //   for (let i = 0; i < 4; i++) {
      //     const element = data[`compoundrateKey${i + 1}`]
      //     if (!element || element.length === 0) return true
      //   }
      // },

      // 新的方法
      onShow (type, data = {}) {
        this.modalType = type
        this.visible = true
        let timeBarData = null
        if (type === 'edit') {
          const { id, name, provinceCode, provinceName, cityCode, cityName, areaCode, areaName, privateFee, insideFee, commonFee, tipPrice, peakPrice, flatPrice, valleyPrice, tipTimePeriods, peakTimePeriods, flatTimePeriods, valleyTimePeriods, remark } = data
          this.rateId = id
          this.provinceName = provinceName
          this.cityName = cityName
          this.areaName = areaName
          this.formData = {
            name,
            addressCodeArr: [provinceCode, cityCode, areaCode],
            privateFee,
            insideFee,
            commonFee
          }
          this.remark = remark
          timeBarData = {
            jian: tipTimePeriods.map((item, index) => ({
              key: Date.now() + index,
              startTime: timeOptions.findIndex(time => time === item.startTime),
              endTime: timeOptions.findIndex(time => time === item.endTime)
            })),
            feng: peakTimePeriods.map((item, index) => ({
              key: Date.now() + index,
              startTime: timeOptions.findIndex(time => time === item.startTime),
              endTime: timeOptions.findIndex(time => time === item.endTime)
            })),
            ping: flatTimePeriods.map((item, index) => ({
              key: Date.now() + index,
              startTime: timeOptions.findIndex(time => time === item.startTime),
              endTime: timeOptions.findIndex(time => time === item.endTime)
            })),
            gu: valleyTimePeriods.map((item, index) => ({
              key: Date.now() + index,
              startTime: timeOptions.findIndex(time => time === item.startTime),
              endTime: timeOptions.findIndex(time => time === item.endTime)
            })),
            price: {
              jian: tipPrice,
              feng: peakPrice,
              ping: flatPrice,
              gu: valleyPrice
            }
          }
        }
        this.$nextTick(() => {
          this.$refs.timebar.initData(timeBarData)
        })
      },
      initModal () {
        this.$refs.formData.resetFields()
        this.$refs.formData2.resetFields()
        this.formData = {
          name: '',
          addressCodeArr: [],
          privateFee: null,
          commonFee: null,
          insideFee: null
        }
        this.$refs.timebar.initData()
        this.$refs.timebar.clearCanvas()
        this.remark = ''
        this.rateId = null
        this.$refs.modalBody.scrollTop = 0
      },
      onCancel () {
        this.visible = false
        this.initModal()
      },
      onOk () {
        console.log(this.$refs.timebar, 'this.$refs.timebar')
        const { jian, feng, ping, gu, price } = this.$refs.timebar
        console.log(jian, feng, ping, gu, price, 'jian, feng, ping, gu, price')

        console.log({
            tipTimePeriods: jian.map(item => ({ startTime: timeOptions[item.startTime], endTime: timeOptions[item.endTime] })),
                peakTimePeriods: feng.map(item => ({ startTime: timeOptions[item.startTime], endTime: timeOptions[item.endTime] })),
                flatTimePeriods: ping.map(item => ({ startTime: timeOptions[item.startTime], endTime: timeOptions[item.endTime] })),
                valleyTimePeriods: gu.map(item => ({ startTime: timeOptions[item.startTime], endTime: timeOptions[item.endTime] }))
        })
        // this.$refs.formData.validate(valid => {
        //   if (!valid) return
        //   this.$refs.formData2.validate(valid2 => {
        //     if (!valid2) return
        //     // const { modalType, companyId, rateId, formData: { name, addressCodeArr, privateFee, commonFee, insideFee }, provinceName, cityName, areaName, remark } = this
        //     const { jian, feng, ping, gu, price } = this.$refs.timebar
        //     if (price.jian === null || price.feng === null || price.ping === null || price.gu === null) {
        //       return this.$message.error('请输入电价')
        //     }
            if (this.modalType === 'add') {
              // addRate({
              //   request: {
              //     companyId,
              //     name,
              //     provinceCode: addressCodeArr[0],
              //     provinceName,
              //     cityCode: addressCodeArr[1] || null,
              //     cityName,
              //     areaCode: addressCodeArr[2] || null,
              //     areaName,
              //     privateFee,
              //     commonFee,
              //     insideFee,
              //     tipPrice: price.jian,
              //     peakPrice: price.feng,
              //     flatPrice: price.ping,
              //     valleyPrice: price.gu,
              //     tipTimePeriods: jian.map(item => ({ startTime: timeOptions[item.startTime], endTime: timeOptions[item.endTime] })),
              //     peakTimePeriods: feng.map(item => ({ startTime: timeOptions[item.startTime], endTime: timeOptions[item.endTime] })),
              //     flatTimePeriods: ping.map(item => ({ startTime: timeOptions[item.startTime], endTime: timeOptions[item.endTime] })),
              //     valleyTimePeriods: gu.map(item => ({ startTime: timeOptions[item.startTime], endTime: timeOptions[item.endTime] })),
              //     remark
              //   }
              // }).then(res => {
              //   if (!res.code) {
              //     this.$message.success('新增费率成功')
              //     this.onCancel()
              //     this.$emit('onOk')
              //   } else {
              //     this.$message.error(res.message || '新增费率失败')
              //   }
              // })
            } else if (this.modalType === 'edit') {
              // updateRate({
              //   request: {
              //     id: rateId,
              //     companyId,
              //     name,
              //     provinceCode: addressCodeArr[0],
              //     provinceName,
              //     cityCode: addressCodeArr[1] || null,
              //     cityName,
              //     areaCode: addressCodeArr[2] || null,
              //     areaName,
              //     privateFee,
              //     commonFee,
              //     insideFee,
              //     tipPrice: price.jian,
              //     peakPrice: price.feng,
              //     flatPrice: price.ping,
              //     valleyPrice: price.gu,
              //     tipTimePeriods: jian.map(item => ({ startTime: timeOptions[item.startTime], endTime: timeOptions[item.endTime] })),
              //     peakTimePeriods: feng.map(item => ({ startTime: timeOptions[item.startTime], endTime: timeOptions[item.endTime] })),
              //     flatTimePeriods: ping.map(item => ({ startTime: timeOptions[item.startTime], endTime: timeOptions[item.endTime] })),
              //     valleyTimePeriods: gu.map(item => ({ startTime: timeOptions[item.startTime], endTime: timeOptions[item.endTime] })),
              //     remark
              //   }
              // }).then(res => {
              //   if (!res.code) {
              //     this.$message.success('编辑费率成功')
              //     this.onCancel()
              //     this.$emit('onOk')
              //   } else {
              //     this.$message.error(res.message || '编辑费率失败')
              //   }
              // })
            }
        //   })
        // })
      }

  }
}
</script>

<style lang="less" scoped>
.assstrategylist {

  .assstrategylist-head{
    background: #ffffff;
    /deep/ .ant-form-item-label{
      min-width:80px;
    }

    .padding3060 {
      padding: 30px 60px;
    }

    .assstrategylist-head__title {
      font-size: 14px;
      font-weight: bold;
      color: rgba(0,0,0,0.85);
      margin-bottom: 25px;
    }
  }

  .splint {
    width:100%;height:16px;background:#f0f2f5
  }

  .cycleprice {
    display: flex;
    .cycleprice-title {
      width:150px;
      text-align:right;
      margin-right:10px;
    }
    .cycleprice-content {
      .cycleprice-content__month {
        display:flex;
        background:rgba(0,0,0,0.02);
        border-top:rgba(0,0,0,0.06);
        border-bottom:rgba(0,0,0,0.06);
        font-weight:bold;
        font-size:14px;
        > span {
          display:inline-block;
          width:70px;
          text-align:center;
          margin-right:10px;
        }
      }
    }
  }

  .compoundrate {
    .compoundrate-item {
      display:flex;margin-bottom:15px;
      .compoundrate-item__type {
        font-size:14px;font-weight:bold;margin-right:10px;float:left;width:90px;
      }
      .compoundrate-item__price {
        display:flex;font-size:14px;font-weight:bold;margin-right:10px;width:300px;margin-left:50px;
      }
    }
  }
}
</style>
