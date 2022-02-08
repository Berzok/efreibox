<template>

  <!--  <Breadcrumb :home="this.menu.home" :model="this.menu.items"/>-->
  <div class="d-flex flex-column px-4">

    <Toolbar>
      <template v-if="this.user.creation" #start>
        <Button label="Nouveau dossier" icon="pi pi-plus" @click="this.openDialogCreateFolder" class="mr-2"/>
        <Button label="Upload" icon="pi pi-upload" @click="this.openDialogUpload" class="p-button-success"/>
      </template>
    </Toolbar>

    <hr/>

    <button class="btn btn-primary text-start"
            @click="openFolder(this.folder.parent_folder, true)">
      <span class="fas fa-folder pe-2"></span>...
    </button>

    <hr/>

    <div v-for="c in this.childrens" :key="c" class="d-flex">
      <button class="btn btn-primary text-start niwa-file-link flex-fill"
              @click="openFolder(c, false)">
        <span class="fas fa-folder pe-2"></span>{{ c.name }}
      </button>

      <button v-if="this.user.deletion"
              class="btn btn-danger niwa-file-link text-end"
              @click="this.openDialogDelete(c, 'folder')">
        <span class="fas fa-trash"></span>
      </button>
    </div>

    <div v-for="f in this.files" :key="f" class="d-flex">
      <a :href="f.url"
         target="_blank"
         class="btn btn-primary niwa-file-link text-start flex-fill">
        <span class="fas fa-file-pdf pe-2"></span>{{ f.name }}
      </a>

      <button v-if="this.user.deletion"
              class="btn btn-danger niwa-file-link text-end"
              @click="this.openDialogDelete(f, 'resource')">
        <span class="fas fa-trash"></span>
      </button>

    </div>
  </div>

  <CreateFolder v-model:visible="displayCreateFolder" :parent_folder="this.getCurrentFolderId"
                @invalidate="this.fetchData"></CreateFolder>

  <Dialog header="Upload" v-model:visible="displayUpload" :style="{width: '50vw'}">
    <Upload :folder="this.folder" @invalidate="this.fetchData"></Upload>
  </Dialog>

  <!--  <Dialog header="Delete" v-model:visible="displayDelete" :style="{width: '50vw'}">-->
  <!--    <Delete :resource="this.resourceToDelete"></Delete>-->
  <!--  </Dialog>-->

  <Delete v-model:visible="displayDelete" :item="this.itemToDelete" @invalidate="this.fetchData"></Delete>


</template>

<script>
import {defineComponent} from 'vue';
import axios from 'axios';
import Breadcrumb from 'primevue/breadcrumb';
import Button from 'primevue/button';
import DataView from 'primevue/dataview';
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions';
import Dialog from 'primevue/dialog';
import Toolbar from 'primevue/toolbar';
import {mapState, mapWritableState} from "pinia";
import Upload from './upload/Upload';
import Delete from './dialog/Delete';
import CreateFolder from './dialog/CreateFolder';
import {useUserStore} from '../store/user';
import Cookies from "js-cookie";


export default defineComponent({
    name: "Folder",
    components: {
        CreateFolder,
        Breadcrumb,
        Button,
        DataView,
        DataViewLayoutOptions,
        Dialog,
        Toolbar,
        Delete,
        Upload
    },
    created() {
        this.$watch(
            () => this.refreshNeeded,
            (toParams, previousParams) => {
                // react to route changes...
                this.fetchData();
            }
        )
    },
    computed: {
        // gives access to this.counter inside the component
        // this.counter++
        // same as reading from store.counter
        ...mapState(useUserStore, ['user']),
        getCurrentFolderId(){
            return this.folder.id;
        },
        path() {
            let path = '';
            for (let p of this.$route.params.fullpath ?? []) {
                path += '/' + p;
            }
            return path.slice(1);
        },
        previousPath() {
            const previous = this.$route.fullPath.split('/');
            previous.pop();
            return previous.join('/');
        }
    },
    data() {
        return {
            folder: {
                id: 1
            },
            content: [],
            childrens: [],
            files: [],
            displayCreateFolder: false,
            displayUpload: false,
            displayDelete: false,
            itemToDelete: {},
            userStore: null,
            refreshNeeded: false
        }
    },
    async mounted() {
        this.userStore = useUserStore();
        if(this.$route.params.fullpath.length >= 1){
            await this.fetchFolderByPath();
        }
        this.fetchData();
    },
    methods: {
        openFolder(folder, is_parent) {
            if (folder) {
                this.folder = folder;
                if(is_parent){
                    this.$router.push(this.previousPath);
                } else{
                    this.$router.push(this.$route.path + '/' + this.folder.name);
                }
                this.fetchData();
            }
        },
        fetchFolderByPath(){
            return axios.get('/folder/resolve_path/' + this.path).then((response, error) => {
                this.folder.id = response.data.id
            });
        },
        fetchData() {
            axios.get('/folder/get/' + this.folder.id, {
                headers: {
                    'X-Loading': true
                }
            }).then((response, error) => {
                if (response.status === 200) {
                    const data = response.data;
                    this.folder = data;
                    this.files = data.content;
                    this.childrens = data.children_folder;
                }
            });
        },
        openDialogUpload() {
            this.displayUpload = true;
        },
        openDialogDelete(item, type) {
            this.itemToDelete = item;
            this.itemToDelete.type = type;
            this.displayDelete = true;
        },
        openDialogCreateFolder() {
            this.displayCreateFolder = true;
        }
    }
})
</script>

<style scoped>


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