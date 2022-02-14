<template>
  <div id="authenticate" class="d-flex align-items-center flex-fill">
    <router-view class="mx-auto"/>
  </div>
</template>

<script lang="js">
import {defineComponent} from 'vue';

export default defineComponent({
    name: 'Authenticate',
    components: {},
    props: {},
});
</script>

<style>
#authenticate{
    height: 75vh;
}
</style>