<template>
<div class="list">app1 list</div>
</template>

<script>
    import {cloneDeep} from 'loadsh'
    export default {
        data() {
            return {}
        },
        created() {
            cloneDeep([444])
        }
    }
</script>

<style scoped>
    .list{
        color: red;
    }
</style>
