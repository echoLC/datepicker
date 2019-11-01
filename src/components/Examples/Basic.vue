<template>
  <div class="basic">
    <datepicker v-model="date"/>

    <div class="button">
      <button @click="getCurrentDate">get current date</button>
    </div>
  </div>
</template>

<script>
import Datepicker from '../Datepicker/datepicker'

export default {
  name: 'Basic',

  components: {
    Datepicker
  },

  data () {
    return {
      date: '2019-11-01'
    }
  },

  methods: {
    getCurrentDate () {
      console.log(this.date)
    }
  }
}
</script>

<style lang="scss" scoped>
.basic {
  margin: 0;
  padding: 20px;
}
.button {
  margin-top: 20px;
}
</style>
