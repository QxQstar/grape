<template>
<div>app1 about <el-input/></div>
</template>

<script>
    import {cloneDeep} from 'loadsh'
    export default {
        data() {
            return {
                aa:cloneDeep(['ddd'])
            }
        }
    }
</script>

<style scoped>

</style>
