<template>
  <div class="home">
    app1

    <router-link to="/app1/about">to about</router-link>
    <router-link to="/app1/detail">to detail</router-link>
    <router-link to="/app1/list">to list</router-link>
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
