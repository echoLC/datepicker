import locale from '../mixins/locale'
import { getYearMonthDate } from '../utils/index'

export default {
  name: 'panelMonth',

  mixins: [locale],

  props: {
    value: null,

    calendarYear: {
      default: getYearMonthDate().year
    },

    disabledMonth: Function
  },

  methods: {
    isDisabled (month) {
      if (typeof this.disabledMonth !== 'function') {
        return false
      }
      return this.disabledMonth(month)
    },

    selectMonth (month) {
      if (this.isDisabled(month)) {
        return
      }
      this.$emit('select', month)
    },

    getMonthCellClass (month) {
      const { year: currentYear, month: currentMonth } = getYearMonthDate(this.value)

      return {
        cell: true,
        actived: currentYear === this.calendarYear && currentMonth === month,
        disabled: this.isDisabled(month)
      }
    }
  },

  render (h) {
    let months = this.getLocalValue('months')
    months = months.map((monthText, monthVal) => {
      return <span
        class={{ ...this.getMonthCellClass(monthVal) }}
        onClick={this.selectMonth.bind(this, monthVal)}>
        {monthText}
      </span>
    })
    return <div class="mx-panel mx-panel-month">{months}</div>
  }
}
