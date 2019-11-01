<template>
  <div class="basic">
    <datepicker v-model="date">

    <button @click="getCurrentDate"></button>  
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
      date: new Date()
    }
  },

  getCurrentDate () {
    console.log(this.date)
  }
}
</script>

<style lang="scss" scoped>
.basic {
  margin: 0;
  padding: 20px;
}
</style>