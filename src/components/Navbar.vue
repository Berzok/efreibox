<template>
  <div id="sidebar" class="">

    <div class="my-2 mx-3">
      <label for="tag_input" class="form-label">Tags to search</label>
      <input id="tag_input"
             autofocus
             @input="matchedTags($event, 'oui')"
             class="awesomplete w-100"/>
    </div>

    <div class="text-light text-start">
      <ul class="list-group list-group-flush ps-2">
        <template v-for="type in this.types" :key="type">

          <li class="list-group-item mt-2">
            <span>
              {{ type.name }}
            </span>
          </li>
          <li v-for="tag in type.tags" :key="tag" :class="'list-group-item tag-' + type.name.toLowerCase()">
            <span>?</span>
            {{ tag.name }}
          </li>

        </template>
      </ul>
    </div>

  </div>
</template>

<script lang="js">
import {computed, defineComponent} from 'vue';
import {useUserStore} from "../store/user";
import AutoComplete from 'primevue/autocomplete';

export default defineComponent({
    name: 'Navbar',
    components: {
        AutoComplete,
    },
    computed: {
        tagsName() {
            return this.tags.map(v => {
                return v.name;
            })
        }
    },
    data() {
        return {
            aw: {},
            filteredTags: [],
            selectedTags: [],
            tags: [],
            types: [],
            primevue: false
        }
    },
    methods: {
    },
    async mounted() {
    },
    setup() {
        const store = useUserStore();
        const isLoggedIn = computed(() => store.getters.isLogged);
        return {isLoggedIn};
    },
});
</script>

<style scoped>
#sidebar {
    border-right: 1px dashed grey;
    color: thistle;
    min-height: calc(100vh - 140px);
    min-width: 210px !important;
    max-width: 210px !important;
    font-family: "Lato", Helvetica, "Roboto", Arial, sans-serif;
}

::v-deep(.matched-part){
    background-color: moccasin;
}

::v-deep(.p-autocomplete-token) {
    padding: 0.25rem 0.5rem !important;
}

</style>