<template>
<div>app1 about <el-input :value="inpute" @input='change' placeholder="请输入内容"/>
</div>
</template>

<script>
    import {cloneDeep} from 'loadsh'
    export default {
        data() {
            return {
                inpute:'444',
                aa:cloneDeep(['ddd'])
            }
        },
        methods:{
            change(value){
                this.inpute = value
            }
        }

    }
</script>

<style scoped>

</style>
