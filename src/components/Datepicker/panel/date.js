import locale from '../mixins/locale'
import { formatDate, getDateClearHours, getYearMonthDate } from '../utils/index'

const { year, month } = getYearMonthDate()

export default {
  name: 'panelDate',

  mixins: [locale],

  props: {
    value: null,

    leftDate: null,

    rightDate: null,

    dateFormat: {
      type: String,
      default: 'YYYY-MM-DD'
    },

    calendarMonth: {
      type: [Number, String],
      default: month
    },

    calendarYear: {
      type: [Number, String],
      default: year
    },

    firstDayOfWeek: {
      default: 7,
      type: Number,
      validator: val => val >= 1 && val <= 7
    },

    disabledDate: {
      type: Function,
      default: () => {
        return false
      }
    }
  },

  methods: {
    selectDate ({ year, month, day }) {
      const date = new Date(year, month, day)
      if (this.disabledDate(date)) {
        return
      }
      this.$emit('select', date)
    },

    getDays () {
      const days = this.getLocalValue('days')
      const firstday = parseInt(this.firstDayOfWeek, 10)
      return days.concat(days).slice(firstday, firstday + 7)
    },

    getDates (year, month, firstDayOfWeek) {
      const arr = []
      const time = new Date(year, month)

      time.setDate(0) // 把时间切换到上个月最后一天
      const lastMonthLength = (time.getDay() + 7 - firstDayOfWeek) % 7 + 1 // time.getDay() 0是星期天, 1是星期一 ...
      const lastMonthfirst = time.getDate() - (lastMonthLength - 1)
      for (let i = 0; i < lastMonthLength; i++) {
        arr.push({ year, month: month - 1, day: lastMonthfirst + i })
      }

      time.setMonth(time.getMonth() + 2, 0) // 切换到这个月最后一天
      const curMonthLength = time.getDate()
      for (let i = 0; i < curMonthLength; i++) {
        arr.push({ year, month, day: 1 + i })
      }

      time.setMonth(time.getMonth() + 1, 1) // 切换到下个月第一天
      const nextMonthLength = 42 - (lastMonthLength + curMonthLength)
      for (let i = 0; i < nextMonthLength; i++) {
        arr.push({ year, month: month + 1, day: 1 + i })
      }

      return arr
    },

    getCellClasses ({ year, month, day }) {
      const cellTime = new Date(year, month, day).getTime()
      const today = getDateClearHours(new Date())

      const classObj = {
        'last-month': month < this.calendarMonth,
        'next-month': month > this.calendarMonth,
        'cur-month': month === this.calendarMonth,
        'today': cellTime === today,
        'disabled': this.disabledDate(cellTime)
      }

      // 如果是当前月份
      if (classObj['cur-month']) {
        classObj['actived'] = this.isSelectedTime(cellTime)
        classObj['inrange'] = this.isRangeTime(cellTime)
      }

      return classObj
    },

    isSelectedTime (cellTime) {
      const { value, leftDate, rightDate } = this
      const [curTime, startTime, endTime] = [value, leftDate, rightDate].map(getDateClearHours)
      return cellTime === curTime || cellTime === startTime || cellTime === endTime
    },

    isRangeTime (cellTime) {
      const minDate = this.leftDate || this.value
      const maxDate = this.rightDate || this.value
      const [minTime, maxTime] = [minDate, maxDate].map(getDateClearHours)
      return cellTime >= minTime && cellTime <= maxTime
    },

    getCellTitle ({ year, month, day }) {
      return formatDate(new Date(year, month, day), this.dateFormat)
    },

    renderTableHeader () {
      const ths = this.getDays().map(day => {
        return <th>{day}</th>
      })
      return (
        <thead>
          <tr>{ths}</tr>
        </thead>
      )
    },

    renderTableBody () {
      const dates = this.getDates(this.calendarYear, this.calendarMonth, this.firstDayOfWeek)
      const tbody = Array.apply(null, { length: 6 }).map((week, i) => {
        const tds = dates.slice(7 * i, 7 * i + 7).map(date => {
          return (
            <td
              class={{ ...this.getCellClasses(date), cell: true }}
              data-year={date.year}
              data-month={date.month}
              title={this.getCellTitle(date)}
              onClick={this.selectDate.bind(this, date)}>
              {date.day}
            </td>
          )
        })
        return <tr>{tds}</tr>
      })

      return (
        <tbody>{tbody}</tbody>
      )
    }
  },

  render (h) {
    return (
      <table class="mx-panel mx-panel-date">
        { this.renderTableHeader() }
        { this.renderTableBody() }
      </table>
    )
  }
}
