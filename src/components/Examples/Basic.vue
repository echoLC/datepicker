<template>
  <div class="basic">
    <div class="date-wrapper">
      <span>basic date: </span>
      <datepicker v-model="date"/>
    </div>

    <div class="date-wrapper">
      <span>date range：</span>
      <datepicker v-model="rangeDate" range/>
    </div>

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
      date: '2019-11-01',
      rangeDate: ['2019-10-29', '2019-10-31']
    }
  },

  methods: {
    getCurrentDate () {
      console.log('date', this.date)
      console.log('range date', this.rangeDate)
    }
  }
}
</script>

<style lang="scss" scoped>
.basic {
  margin: 0;
  padding: 20px;
}

.date-wrapper {
  margin-bottom: 30px;
}

.button {
  margin: 20px 0;
}
</style>
