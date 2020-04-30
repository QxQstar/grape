<template>
<div>app1 about <el-input :value="inpute" @input='change' placeholder="请输入内容"/>
</div>
</template>

<script>
    import {cloneDeep} from 'loadsh'
    import {globalStatus} from '../libs'

    export default {
        data() {
            return {
                inpute:'444',
                aa:cloneDeep(['ddd'])
            }
        },
        methods:{
            change(value){
              globalStatus.setGlobalState({
                num:value
              })
                this.inpute = value
            }
        }

    }
</script>

<style scoped>

</style>
