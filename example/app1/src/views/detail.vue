<template>
<div class="detail"> app1 detail</div>
</template>

<script>
    import {cloneDeep} from 'loadsh'
    export default {
        data() {
            return {}
        },
        created() {
            cloneDeep('333')
        }
    }
</script>

<style scoped>
    .detail{
        color: aqua;
    }
</style>
