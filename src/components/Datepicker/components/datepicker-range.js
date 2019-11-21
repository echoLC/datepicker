/** mixins */
import datepickerProps from '../mixins/datepicker-props'

/** constants */
import {
  ONE_DAY_MILLION_SECONDS,
  ONE_WEEK_MILLION_SECONDS,
  THIRTY_DAYS_MILLION_SECONDS
} from '../utils/constants'

/** utils */
import {
  nextMonth,
  isValidRangeDate
} from '../utils/index'
import { transformDate } from '../utils/transform'

export default {
  name: 'DatepickerRange',

  pickerRoot: true,

  mixins: [datepickerProps],

  props: {
    value: {
      type: Array,
      default: () => ([null, null])
    },

    rangeSeparator: {
      type: String,
      default: '~'
    },

    confirm: {
      type: Boolean,
      default: false
    },

    width: {
      type: [Number, String],
      default: 230
    },

    shortcuts: {
      type: [Boolean, Array],
      default: true
    }
  },

  data () {
    return {
      currentValue: [null, null],
      minDate: '',
      maxDate: '',
      clickCount: 0
    }
  },

  computed: {
    inputText () {
      if (this.userInput !== null) {
        return this.userInput
      }
      const { value2date } = transformDate.date

      return this.isValidRangeValue(this.value)
        ? `${this.stringifyDate(value2date(this.value[0]))} ${this.rangeSeparator} ${this.stringifyDate(value2date(this.value[1]))}`
        : ''
    },

    inputPlaceholder () {
      if (this.placeholder) {
        return this.placeholder
      }
      return this.getLocalValue('placeholder.dateRange')
    },

    innerShortcuts () {
      if (Array.isArray(this.shortcuts)) {
        return this.shortcuts
      }
      if (this.shortcuts === false) {
        return []
      }
      const pickers = this.getLocalValue('pickers')
      const arr = [
        {
          text: pickers[0],
          onClick (self) {
            self.currentValue = [new Date(Date.now() + ONE_DAY_MILLION_SECONDS), new Date(Date.now() + ONE_WEEK_MILLION_SECONDS)]
            self.updateDate()
          }
        },
        {
          text: pickers[1],
          onClick (self) {
            self.currentValue = [new Date(Date.now() + ONE_DAY_MILLION_SECONDS), new Date(Date.now() + THIRTY_DAYS_MILLION_SECONDS)]
            self.updateDate()
          }
        },
        {
          text: pickers[2],
          onClick (self) {
            self.currentValue = [new Date(Date.now() - ONE_WEEK_MILLION_SECONDS), new Date()]
            self.updateDate()
          }
        },
        {
          text: pickers[3],
          onClick (self) {
            self.currentValue = [new Date(Date.now() - THIRTY_DAYS_MILLION_SECONDS), new Date()]
            self.updateDate()
          }
        }
      ]
      return arr
    },

    showClearIcon () {
      return !this.disabled && this.clearable && this.isValidRangeValue(this.value)
    }
  },

  watch: {
    clickCount (val) {
      if (this.confirm) {
        return
      }
      if (val === 2) {
        this.toggleCalendarPopupVisible(false)
        this.clickCount = 0
      }
    }
  },

  methods: {
    initCalendar () {
      this.handleValueChange(this.value)
      this.initLeftAndRightDate()
      this.displayPopup()
    },

    initLeftAndRightDate () {
      let [minDate, maxDate] = this.currentValue
      if (!minDate || !maxDate) {
        return
      }
      const diff = new Date(maxDate).getTime() - new Date(minDate).getTime()
      if (diff <= THIRTY_DAYS_MILLION_SECONDS) {
        maxDate = nextMonth(minDate)
      }
      this.minDate = minDate
      this.maxDate = maxDate
    },

    handleValueChange (value) {
      const { value2date } = transformDate.date
      this.currentValue = this.isValidRangeValue(value) ? value.map(value2date) : [null, null]
    },

    getDefaultRangeValue () {
      let date = new Date()
      date = date.setMonth(date.getMonth() + 1)
      return [new Date(), new Date(date)]
    },

    isValidRangeValue (value) {
      const { value2date } = transformDate.date
      return Array.isArray(value) && value.length === 2 && this.isValidValue(value[0]) &&
        this.isValidValue(value[1]) && (value2date(value[1]).getTime() >= value2date(value[0]).getTime())
    },

    selectRangeDate (date, index) {
      if (this.clickCount === 0) {
        this.currentValue = []
      }
      this.clickCount += 1
      if (this.clickCount === 1) {
        this.$set(this.currentValue, index, date)
        return
      }
      if (this.clickCount === 2) {
        index = this.currentValue[0] ? 1 : 0
        if (this.confirm) {
          this.clickCount = 0
        }
      }
      this.$set(this.currentValue, index, date)
      this.currentValue.sort((a, b) => new Date(a) - new Date(b))
      this.updateDate()
    },

    updateDate () {
      if (this.disabled) {
        return false
      }
      const equal = this.isEquaRangeDate(this.value, this.currentValue)
      if (equal) {
        return false
      }
      this.emitDate('input')
      this.emitDate('change')
      return true
    },

    confirmDate () {
      const valid = isValidRangeDate(this.currentValue)
      if (valid) {
        this.updateDate()
      }
      this.emitDate('confirm')
      this.toggleCalendarPopupVisible(false)
    },

    isEquaRangeDate (a, b) {
      return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((item, index) => this.isEqualDate(item, b[index]))
    },

    selectStartDate (date) {
      this.selectRangeDate(date, 0)
    },

    selectEndDate (date) {
      this.selectRangeDate(date, 1)
    },

    selectShortcut (range) {
      if (typeof range.onClick === 'function') {
        const close = range.onClick(this)
        if (close !== false) {
          this.toggleCalendarPopupVisible()
        }
      } else {
        this.currentValue = [new Date(range.start), new Date(range.end)]
        this.updateDate()
        this.toggleCalendarPopupVisible(false)
      }
    },

    handleChange (event) {
      if (!this.editable || !this.userInput) {
        return
      }

      const value = this.inputText
      if (!value) {
        this.clearDate(event)
        return
      }
      const range = value.split(` ${this.rangeSeparator} `)
      if (range.length === 2) {
        const start = new Date(range[0])
        const end = new Date(range[1])
        if (this.isValidValue(start) && this.isValidValue(end)) {
          this.currentValue = [start, end]
          this.updateDate()
          this.toggleCalendarPopupVisible(false)
          return
        }
      }
      this.$emit('input-error', value)
    },

    clearDate (event) {
      event.stopPropagation()
      const date = [null, null]
      this.currentValue = date
      this.updateDate()
      this.$emit('clear')
    },

    renderPickerFooter () {
      const { confirmDate, toggleCalendarPopupVisible, confirmText, confirm, cancelText } = this
      if (confirm) {
        return (
          <slot name="picker-footer" confirm={confirmDate}>
            <div class="mx-datepicker-footer">
              <button type="button"
                class="mx-datepicker-btn mx-datepicker-btn-cancel"
                onClick={ $event => toggleCalendarPopupVisible(false, $event) }>{ cancelText }</button>
              <button type="button"
                class="mx-datepicker-btn mx-datepicker-btn-confirm"
                onClick={ $event => confirmDate($event) }>{ confirmText }</button>
            </div>
          </slot>
        )
      }
      return (
        <slot name="picker-footer" confirm={confirmDate}></slot>
      )
    },

    renderPickerShortcuts () {
      if (!this.innerShortcuts.length) {
        return
      }
      const vnodes = this.innerShortcuts.map((range, index) => {
        return (
          <li
            class="mx-shortcuts"
            key={index}
            onClick={$event => this.selectShortcut(range, $event)}>
            { range.text }
          </li>
        )
      })
      return (
        <ul
          class="mx-shortcuts-wrapper">
          { vnodes }
        </ul>
      )
    },

    renderRangeCalendarPanel () {
      const { type, innerDateFormat, currentValue, popupVisible, minDate, maxDate } = this
      const [startIndex, endIndex] = [0, 1]
      return (
        <div class="mx-range-wrapper">
          <calendar-panel
            style="box-shadow:1px 0 rgba(0, 0, 0, .1)"
            ref="calendarPanel"
            index={startIndex}
            type={type}
            date-format={innerDateFormat}
            value={currentValue[0]}
            right-date={currentValue[1]}
            left-date={null}
            min-date={minDate}
            visible={popupVisible}
            on-select-date={ $event => this.selectStartDate($event) }/>
          <calendar-panel
            index={endIndex}
            type={type}
            date-format={innerDateFormat}
            value={currentValue[1]}
            left-date={currentValue[0]}
            right-date={null}
            max-date={maxDate}
            visible={popupVisible}
            on-select-date={ $event => this.selectEndDate($event) }/>
        </div>
      )
    },

    renderDatePickerPopup () {
      const { innerPopupStyle, popupVisible } = this

      return (
        <div class="mx-datepicker-popup"
          style={innerPopupStyle}
          v-show={popupVisible}
          OnClick={($event) => { $event.stopPropagation(); $event.preventDefault() }}
          ref="calendar">
          <div class="mx-datepicker-content">
            { this.renderRangeCalendarPanel() }
            { this.renderPickerShortcuts() }
          </div>
          { this.renderPickerFooter() }
        </div>
      )
    }
  }
}
