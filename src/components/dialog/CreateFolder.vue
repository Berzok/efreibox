<template>

  <!--  <Breadcrumb :home="this.menu.home" :model="this.menu.items"/>-->
  <div v-show="this.visible" class="modal-background">
    <div class="niwa-modal-content d-flex flex-column">

      <h2 class="mx-auto">Folder name?</h2>

      <input v-model="this.folder.name" class="form-control mb-2" @keyup.enter="this.createFolder" autofocus>
      <div class="d-flex flex-fill justify-content-center">
        <button class="btn btn-primary btn-outline-warning w-50" @click="this.closeModal">
          <span class="fas fa-times"></span>
          Annuler
        </button>
        <button class="btn btn-primary btn-outline-success w-50" @click="this.createFolder">
          <span class="fas fa-check"></span>
          Valider
        </button>
      </div>

    </div>
  </div>

</template>

<script>
import {defineComponent} from 'vue';
import axios from 'axios';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import {useToast} from "vue-toastification";

export default defineComponent({
    name: "CreateFolder",
    components: {
        Button,
        Dialog,
        InputText
    },
    emits: ['update:visible'],
    props: {
        visible: false,
        parent_folder: Number
    },
    data(){
        return {
            modalVisible: this.visible,
            toast: useToast(),
            folder: {
                name: null,
                id_parent: null
            }
        }
    },
    updated() {
        this.folder.id_parent = this.getParentId();
    },
    methods: {
        getParentId(){
            return this.parent_folder;
        },
        closeModal(){
            this.$emit('update:visible', false);
            this.$emit('invalidate');
        },
        createFolder() {
            if (this.folder) {
                axios.put('/folder/create', this.folder, {
                    headers: {
                        'X-Loading': true
                    }
                }).then((response, error) => {
                    if (response.status === 200) {
                        this.toast.success('Folder creation complete');
                        this.closeModal();
                    }
                });
            }
        },
    }
})
</script>

<style scoped>

.modal-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.niwa-modal-content {
    position: relative;
    background-color: var(--bs-secondary);
    border: 1px solid #3e1046;
    border-radius: 9px;
    margin-left: auto;
    margin-right: auto;
    padding: 15px;
    top: 40%;
    width: 20%;
}
</style>