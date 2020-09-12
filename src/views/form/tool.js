/* eslint-disable no-sequences */
/* eslint-disable no-return-assign */
import { propertyOf, isNil } from 'lodash'

export const timeList = Array.from({ length: 48 }, (_, idx) => `${`${~~(idx / 2) + 100}`.slice(1)}:${idx % 2 === 1 ? '30' : '00'}`)
// 原本设想为startTime和endTime的值为00:00，后来发现存的是数组索引
const hashMapIndx = timeList.reduce((h, s, idx) => (h[idx] = idx, h), {})
// const hashMapIndx = timeList.reduce((h, s, idx) => (h[s] = idx, h), {});
const timeIndexList = Array.from({ length: 48 }, (_, idx) => idx)

// interface PickedTimeRange {
//   startTime: string
//   endTime: string
// }

// interface IndexMap {
//   [key: string]: boolean;
// }

const getRange = (startIdx, endIdx) => {
  const safeStartIndex = startIdx % 48
  const safeEndIndex = endIdx % 48
  if (safeEndIndex > safeStartIndex) return timeIndexList.slice(safeStartIndex, safeEndIndex)
  return timeIndexList.slice(0, safeEndIndex).concat(timeIndexList.slice(safeStartIndex))
}

/**
 *
 * @param {*} pickedRangeList PickedTimeRange[]
 * @param {'start' | 'end'} sideType 'start' | 'end'
 * @param {string | undefined} otherSideVal?: string
 */
function getSelectableRangeTime (pickedRangeList, sideType, otherSideVal) {
  // 碰到 { startTime: '00:00', endTime: '00:00' }时直接结束
  if (!pickedRangeList.length) return timeIndexList
  if (pickedRangeList.length === 1 &&
    !isNil(pickedRangeList[0].startTime) &&
    pickedRangeList[0].startTime === pickedRangeList[0].endTime) return []
  // 如果没有otherSideVal, 则为寻找所有可以选择的时间idx
  if (isNil(otherSideVal)) {
    const rules = []
    pickedRangeList.forEach(({ startTime: iStartTime, endTime: iEndTime }) => {
      if (isNil(iStartTime) && isNil(iEndTime)) return
      const startTime = !isNil(iStartTime) ? iStartTime : iEndTime
      const endTime = !isNil(iEndTime) ? iEndTime : startTime

      const startIdx = hashMapIndx[startTime]
      const endIdx = hashMapIndx[endTime]
      rules.push((vIdx) => {
        if ((sideType === 'start' && vIdx === endIdx) ||
          (sideType === 'end' && vIdx === startIdx)) return false
        if (endIdx > startIdx) return vIdx >= startIdx && vIdx <= endIdx
        else return (vIdx >= startIdx) || (vIdx <= endIdx)
      })
    })

    const list = timeIndexList.filter(v => !rules.some(f => f(v)))
    return list
  }
  // 如果有otherSideVal, 则只找距离otherSideValIdx最近的两端即可
  const otherSideValIdx = hashMapIndx[otherSideVal]
  // if sideType === 'start' 找出距离otherSideVal最近的一个小于他的数
  let closestIndx = Infinity
  let closestDffVal = Infinity
  pickedRangeList.forEach(({ startTime: iStartTime, endTime: iEndTime }) => {
    if (isNil(iStartTime) && isNil(iEndTime)) return
    const startTime = !isNil(iStartTime) ? iStartTime : iEndTime
    const endTime = !isNil(iEndTime) ? iEndTime : startTime

    const idx = hashMapIndx[sideType === 'start' ? endTime : startTime]
    const diff = sideType === 'start' ? otherSideValIdx - idx : idx - otherSideValIdx
    // console.log(otherSideValIdx, idx, `min(${closestIndx}, ${diff < 0 ? diff + 48 : diff})`);
    if (Math.min(closestDffVal, diff < 0 ? diff + 48 : diff) !== closestDffVal) {
      closestIndx = idx
      closestDffVal = diff < 0 ? diff + 48 : diff
    }
  })

  return sideType === 'start'
    ? getRange(closestIndx, otherSideValIdx)
    : getRange(otherSideValIdx + 1, closestIndx + 1)
}

const constants = ['jian', 'feng', 'ping', 'gu']

const toMap = list => list.reduce((h, v) => (h[v] = true, h), {})

export function getSelectableRangeTimeIdxMap (jian, feng, ping, gu) {
  const totalList = jian.concat(feng, ping, gu)
  const hash = { jian: [], feng: [], ping: [], gu: [] };
  [jian, feng, ping, gu].forEach((list, idx) => {
    const key = constants[idx]
    const mapList = list.map(item => {
      const otherList = totalList.filter(i => i !== item)
      const start = getSelectableRangeTime(otherList, 'start', item.endTime)
      const end = getSelectableRangeTime(otherList, 'end', item.startTime)
      return { start: toMap(start), end: toMap(end) }
    })
    hash[key] = mapList
  })
  console.log(hash)
  return (key, index, sideType, timeIdx) => {
    // todo
    const flag = propertyOf(hash)(`${key}.${index}.${sideType}.${timeIdx}`)
    console.log(key, sideType, index, flag)
    return flag !== true
  }
}
