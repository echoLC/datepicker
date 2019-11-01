import Languages from '../locale/languages'
import { ROOT_COMPONENT_NAME } from '../utils/constants'
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
      let name = component.$options.name
      while (component && (name !== ROOT_COMPONENT_NAME)) {
        component = component.$parent
        if (component) {
          name = component.$options.name
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
