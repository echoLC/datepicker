import { getYearMonthDate } from '../utils/index'

export default {
  name: 'panelYear',

  props: {
    value: null,

    firstYear: Number,

    disabledYear: Function
  },

  methods: {
    isDisabled (year) {
      if (typeof this.disabledYear !== 'function') {
        return false
      }
      return this.disabledYear(year)
    },

    selectYear (year) {
      if (this.isDisabled(year)) {
        return
      }
      this.$emit('select', year)
    },

    getYearCellClass (year) {
      const { year: currentYear } = this.value ? getYearMonthDate(this.value) : {}

      return {
        cell: true,
        actived: currentYear === year,
        disabled: this.isDisabled(year)
      }
    }
  },

  render (h) {
    // 获取当前年的往前十年
    const firstYear = Math.floor(this.firstYear / 10) * 10

    const years = Array.apply(null, { length: 10 }).map((_, i) => {
      const year = firstYear + i
      return <span
        class={{ ...this.getYearCellClass(year) }}
        onClick={this.selectYear.bind(this, year)}
      >{year}</span>
    })
    return <div class="mx-panel mx-panel-year">{years}</div>
  }
}
