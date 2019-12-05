<template>
  <div class="home">
    app1

    <router-link to="/app1/about">to about</router-link>
  </div>
</template>

<script>
  import {cloneDeep} from 'loadsh'
export default {
  name: 'home',
  created() {
    cloneDeep('0000')
  }
}
</script>
