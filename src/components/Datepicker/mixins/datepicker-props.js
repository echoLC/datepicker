/** mixins */
import locale from '../mixins/locale'

/** components */
import CalendarIcon from '../components/calendar-icon'
import CalendarPanel from '../components/calendar'

/** directives */
import clickoutside from '../directives/clickoutside'

/** utils */
import {
  isPlainObject,
  formatDate,
  parseDate,
  throttle,
  isValidDate,
  isDateObejct
} from '../utils/index'
import { transformDate } from '../utils/transform'

export default {
  pickerRoot: true,

  mixins: [locale],

  directives: {
    clickoutside
  },

  components: {
    CalendarIcon,
    CalendarPanel
  },

  props: {
    type: {
      type: String,
      default: 'date' // ['date', 'datetime', 'month', 'year', 'time']
    },

    placeholder: {
      type: String,
      default: ''
    },

    local: {
      type: [String, Object],
      default: 'zh'
    },

    format: {
      type: [String, Object],
      default: 'yyyy-MM-dd'
    },

    editable: {
      type: Boolean,
      default: true
    },

    disabled: {
      type: Boolean,
      default: false
    },

    clearable: {
      type: Boolean,
      default: false
    },

    inputName: {
      type: String,
      default: 'date'
    },

    inputClass: {
      type: [String, Array],
      default: 'mx-input'
    },

    confirmText: {
      type: String,
      default: '确认'
    },

    cancelText: {
      type: String,
      default: '取消'
    }
  },

  data () {
    return {
      currentValue: null,
      userInput: null,
      popupVisible: false,
      position: {}
    }
  },

  computed: {
    pickerInputClass () {
      let classes = this.inputClass || []
      if (!Array.isArray(classes)) {
        classes = classes.split(' ')
      }
      if (this.popupVisible) {
        classes.push('active')
      } else {
        classes = classes.filter(item => {
          return item !== 'active'
        })
      }
      return classes
    },

    computedWidth () {
      if (typeof this.width === 'number' || (typeof this.width === 'string' && /^\d+$/.test(this.width))) {
        return this.width + 'px'
      }
      return this.width
    },

    innerDateFormat () {
      if (typeof this.format !== 'string') {
        return 'yyyy-MM-dd'
      }
      if (this.innerType === 'date') {
        return this.format
      }
      return this.format.replace(/[Hh]+.*[msSaAZ]|\[.*?\]/g, '').trim() || 'yyyy-MM-dd'
    }
  },

  watch: {
    value: {
      immediate: true,
      handler: 'handleValueChange'
    },

    popupVisible (val) {
      if (val) {
        this.initCalendar()
      } else {
        this.userInput = null
        this.blur()
      }
    }
  },

  mounted () {
    this._displayPopup = throttle(() => {
      if (this.popupVisible) {
        this.displayPopup()
      }
    }, 200)
    window.addEventListener('resize', this._displayPopup)
    window.addEventListener('scroll', this._displayPopup)
    window.addEventListener('keydown', this.handleKeydown)
  },

  beforeDestroy () {
    if (this.popupElm && this.popupElm.parentNode === document.body) {
      document.body.removeChild(this.popupElm)
    }
    window.removeEventListener('resize', this._displayPopup)
    window.removeEventListener('scroll', this._displayPopup)
    window.removeEventListener('keydown', this.handleKeydown)
  },

  methods: {
    getPopupSize (element) {
      const originalDisplay = element.style.display
      const originalVisibility = element.style.visibility
      element.style.display = 'block'
      element.style.visibility = 'hidden'
      const styles = window.getComputedStyle(element)
      const width = element.offsetWidth + parseInt(styles.marginLeft) + parseInt(styles.marginRight)
      const height = element.offsetHeight + parseInt(styles.marginTop) + parseInt(styles.marginBottom)
      const result = { width, height }
      element.style.display = originalDisplay
      element.style.visibility = originalVisibility
      return result
    },

    displayPopup () {
      const dw = document.documentElement.clientWidth
      const dh = document.documentElement.clientHeight
      const InputRect = this.$el.getBoundingClientRect()
      const PopupRect = this._popupRect || (this._popupRect = this.getPopupSize(this.$refs.calendar))
      const position = {}
      let offsetRelativeToInputX = 0
      let offsetRelativeToInputY = 0

      if (
        dw - InputRect.left < PopupRect.width &&
        InputRect.right < PopupRect.width
      ) {
        position.left = offsetRelativeToInputX - InputRect.left + 1 + 'px'
      } else if (InputRect.left + InputRect.width / 2 <= dw / 2) {
        position.left = offsetRelativeToInputX + 'px'
      } else {
        position.left = offsetRelativeToInputX + InputRect.width - PopupRect.width + 'px'
      }
      if (
        InputRect.top <= PopupRect.height &&
        dh - InputRect.bottom <= PopupRect.height
      ) {
        position.top = offsetRelativeToInputY + dh - InputRect.top - PopupRect.height + 'px'
      } else if (InputRect.top + InputRect.height / 2 <= dh / 2) {
        position.top = offsetRelativeToInputY + InputRect.height + 'px'
      } else {
        position.top = offsetRelativeToInputY - PopupRect.height + 'px'
      }
      if (position.top !== this.position.top || position.left !== this.position.left) {
        this.position = position
      }
    },

    stringifyDate (date) {
      return (isPlainObject(this.format) && typeof this.format.stringifyDate === 'function')
        ? this.format.stringify(date)
        : formatDate(date, this.format)
    },

    parseDate (value) {
      return (isPlainObject(this.format) && typeof this.format.parse === 'function')
        ? this.format.parse(value)
        : parseDate(value, this.format)
    },

    isValidValue (value) {
      const { value2date } = transformDate.date
      return isValidDate(value2date(value))
    },

    toggleCalendarPopupVisible (visible) {
      if (this.disabled) {
        return
      }
      this.popupVisible = visible
    },

    emitDate (eventName) {
      const { date2value } = transformDate.date
      const value = date2value(this.currentValue)
      this.$emit(eventName, value)
    },

    isEqualDate (a, b) {
      return isDateObejct(a) && isDateObejct(b) && a.getTime() === b.getTime()
    },

    blur () {
      this.$refs.datePickerInput.blur()
    },

    handleBlur (event) {
      this.$emit('blur', event)
    },

    handleFocus (event) {
      if (!this.popupVisible) {
        this.toggleCalendarPopupVisible(true)
      }
      this.$emit('focus', event)
    },

    handleKeydown (event) {
      const keyCode = event.keyCode
      // Tab 9 or Enter 13
      if (keyCode === 9 || keyCode === 13) {
        // ie emit the watch before the change event
        event.stopPropagation()
        this.handleChange(event)
        this.userInput = null
        this.toggleCalendarPopupVisible(false)
      }
    },

    handleInput (event) {
      this.userInput = event.target.value
    },

    renderInput () {
      const { pickerInputClass, inputName, disabled, editable, inputText, inputPlaceholder } = this
      return (
        <input
          class={pickerInputClass}
          name={inputName}
          ref="datePickerInput"
          type="text"
          autocomplete="off"
          disabled={disabled}
          readonly={!editable}
          value={inputText}
          placeholder={inputPlaceholder}
          onKeydown={$event => this.handleKeydown($event)}
          onFocus={$event => this.handleFocus($event)}
          onBlur={$event => this.handleBlur($event)}
          onInput={$event => this.handleInput($event)}
          onChange={$event => this.handleChange($event)}
        />
      )
    },

    renderClearIcon () {
      return (
        <span
          class="mx-input-append mx-clear-wrapper"
          onClick={$event => this.clearDate($event) }>
          <slot name="mx-clear-icon">
            <i class="mx-input-icon mx-clear-icon"></i>
          </slot>
        </span>
      )
    }
  },

  render () {
    const { disabled, computedWidth, showClearIcon, toggleCalendarPopupVisible } = this
    const directives = [{ name: 'clickoutside', value: toggleCalendarPopupVisible.bind(null, false) }]
    const classObj = {
      'disabled': disabled,
      'mx-datepicker': true
    }
    return (
      <div
        class={classObj}
        style={{ width: computedWidth }}
        { ...{ directives } }>
        <div class="mx-input-wrapper" onClick={$event => this.toggleCalendarPopupVisible(true, $event) }>
          { this.renderInput() }
          { showClearIcon ? this.renderClearIcon() : null }
          <calendar-icon />
        </div>
        { this.renderDatePickerPopup() }
      </div>
    )
  }
}
