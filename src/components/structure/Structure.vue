<template>

  <div class="d-flex flex-column text-start">

    <OrganizationChart v-if="this.data" :value="this.data">
      <template #default="slotProps">
        <span>{{ slotProps.node.name }}</span>
      </template>
    </OrganizationChart>

  </div>

</template>

<script lang="js">
import {defineComponent} from 'vue';
import axios from "axios";
import {useToast} from "vue-toastification";
import Button from 'primevue/button';
import OrganizationChart from 'primevue/organizationchart';

export default defineComponent({
    name: 'Structure',
    components: {
        Button,
        OrganizationChart
    },
    computed: {},
    data() {
        return {
            structure: null,
            data: {}
        }
    },
    methods: {
        prepareData(){

        }
    },
    async mounted() {
        await axios.get('/folders/structure',
            {
                headers: {
                    'X-Loading': true
                }
            }).then((response, error) => {
            if (response.status === 200) {
                this.data = response.data;
                this.prepareData();
            }
        });
    },
    setup() {
        // Get toast interface
        const toast = useToast();
        return {toast};
    },
});
</script>

<style scoped>

form {
    color: cornflowerblue;
}

</style>