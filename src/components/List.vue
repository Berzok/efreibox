<template>

  <div class="">

    <router-view></router-view>

    <div class="d-flex mt-5 mb-3 mx-4 border-top">
      <div class="flex-fill mx-3 mt-3 border-bottom"></div>
    </div>

  </div>

</template>

<script>
import {defineComponent} from 'vue';
import axios from 'axios';
import Breadcrumb from 'primevue/breadcrumb';
import DataView from 'primevue/dataview';
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions';
import Folder from './Folder';

export default defineComponent({
    name: "List",
    components: {
        Folder,
        Breadcrumb,
        DataView,
        DataViewLayoutOptions
    },
    data() {
        return {
            files: null,
            layout: 'list',
            sortKey: null,
            sortOrder: null,
            sortField: null,
            sortOptions: [
                {label: 'Price High to Low', value: '!price'},
                {label: 'Price Low to High', value: 'price'},
            ]
        }
    },
    mounted() {
        axios.get('/files', {
            headers: {
                'X-Loading': true
            }
        }).then((response, error) => {
            if (response.status === 200) {
                this.files = response.data;
                if (this.layout === 'grid') {
                    this.loadThumbnail();
                }
            }
        });
    },
    methods: {
        onSortChange(event) {
            const value = event.value.value;
            const sortValue = event.value;

            if (value.indexOf('!') === 0) {
                this.sortOrder = -1;
                this.sortField = value.substring(1, value.length);
                this.sortKey = sortValue;
            } else {
                this.sortOrder = 1;
                this.sortField = value;
                this.sortKey = sortValue;
            }
        },
        loadThumbnail(event) {
            this.files.forEach((value, key) => {

            });
        }
    }
})
</script>

<style scoped>

@keyframes pulse {
    0% {
        box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.7);
    }
    25% {
        box-shadow: 0 0 8px 6px rgba(0, 0, 0, 0.7);
    }
    50% {
        box-shadow: 0 0 8px 12px rgba(0, 0, 0, 0.7);
    }
    75% {
        box-shadow: 0 0 8px 6px rgba(0, 0, 0, 0.7);
    }
    100% {
        box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.7);
    }
}

div.niwa-container:hover {
    opacity: 1;
}

.niwa-category-title {
    color: #a31545;
}

.niwa-file-link {
    font-size: 1.3rem;
    margin-top: 0.6rem;
    text-decoration: none;
}

.niwa-file-link:hover {
    text-shadow: 0 0 9px #c92860;
}

</style>