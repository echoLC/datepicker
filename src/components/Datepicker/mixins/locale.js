import Languages from '../locale/languages'
import { isPlainObject } from '../utils/index'

const defaultLang = Languages.zh

export default {
  methods: {
    getLocalObject () {
      const component = this.getRootComponent()
      if (isPlainObject(component.local)) {
        return { ...defaultLang, ...component.local }
      }
      return Languages[component.local] || defaultLang
    },

    getRootComponent () {
      let component = this
      let pickerRoot = component.$options.pickerRoot
      while (component && !pickerRoot) {
        component = component.$parent
        if (component) {
          pickerRoot = component.$options.pickerRoot
        }
      }
      return component
    },

    getLocalValue (keyChain) {
      const localObj = this.getLocalObject()
      const keyArr = keyChain.split('.')

      return keyArr.reduce((acc, cur) => {
        acc = isPlainObject(acc) ? acc[cur] : acc
        return acc
      }, localObj)
    }
  }
}
