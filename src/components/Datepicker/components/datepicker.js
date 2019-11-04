/** mixins */
import datepickerProps from '../mixins/datepicker-props'

/** utils */
import { transformDate } from '../utils/transform'

export default {
  name: 'Datepicker',

  mixins: [datepickerProps],

  props: {
    value: {
      type: [String, Date],
      default: null
    }
  },

  computed: {
    inputPlaceholder () {
      if (this.placeholder) {
        return this.placeholder
      }
      return this.getLocalValue('placeholder.date')
    },

    inputText () {
      if (this.userInput !== null) {
        return this.userInput
      }
      const { value2date } = transformDate.date

      if (!this.range) {
        return this.isValidValue(this.value)
          ? this.stringifyDate(value2date(this.value))
          : ''
      }
    }
  },

  methods: {
    initCalendar () {
      this.handleValueChange(this.value)
      this.displayPopup()
    },

    handleValueChange (value) {
      const { value2date } = transformDate.date
      this.currentValue = this.isValidValue(value) ? value2date(value) : null
    },

    updateDate () {
      if (this.disabled) {
        return false
      }
      const isEqual = this.isEqualDate(this.value, this.currentValue)
      if (isEqual) {
        return false
      }
      this.emitDate('input')
      this.emitDate('change')
      return true
    },

    clearDate (event) {
      event.stopPropagation()
      this.currentValue = null
      this.updateDate()
      this.$emit('clear')
    },

    selectDate (date) {
      this.currentValue = date
      this.updateDate() && this.toggleCalendarPopupVisible(false)
    },

    selectTime (time) {
      this.currentValue = time
      this.updateDate() && this.toggleCalendarPopupVisible()
    },

    handleChange (event) {
      if (this.editable && this.userInput !== null) {
        const value = this.inputText
        const checkDate = this.$refs.calendarPanel.isDisabledTime
        if (!value) {
          this.clearDate(event)
          return
        }
        const date = new Date(value)
        if (this.isValidValue(date) && !checkDate(date, null, null)) {
          this.currentValue = date
          this.updateDate()
          this.toggleCalendarPopupVisible(false)
          return
        }
        this.$emit('input-error', value)
      }
    },

    renderCalendarPanel () {
      const index = -1
      const { innerDateFormat, currentValue, popupVisible, type } = this
      return (
        <calendar-panel
          ref="calendarPanel"
          index={index}
          type={type}
          date-format={innerDateFormat}
          value={currentValue}
          visible={popupVisible}
          on-select-date={ $event => this.selectDate($event) }
          on-select-time={ $event => this.selectTime($event) }/>
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
            { this.renderCalendarPanel() }
          </div>
        </div>
      )
    }
  }
}
