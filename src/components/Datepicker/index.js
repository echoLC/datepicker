import Datepicker from './components/datepicker'
import DatepickerRange from './components/datepicker-range'

require('./index.scss')

Datepicker.install = function (Vue) {
  Vue.component(Datepicker.name, Datepicker)
}

DatepickerRange.install = function (Vue) {
  Vue.component(DatepickerRange.name, DatepickerRange)
}

Datepicker.Range = DatepickerRange

export default Datepicker
