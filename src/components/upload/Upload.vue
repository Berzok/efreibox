<template>
  <div class="">

    <form id="form_upload" class="d-flex flex-column text-start">

      <!--      <input id="file_input" name="image" class="align-self-center" type="file" @change="addFile">-->
      <FileUpload name="files[]" :multiple="true"
                  :showCancelButton="false"
                  @select="addFile"
                  :customUpload="true"
                  @uploader="upload"/>

      <div class="text-center">
        <Button label="Valider" icon="pi pi-check"
                @click="upload"
                class="p-button-success btn-outline-warning mt-5"/>
        <Button label="Annuler" icon="pi pi-times"
                @click="resetForm"
                class="p-button-warning btn-outline-warning mt-5"/>
      </div>

    </form>
  </div>

</template>

<script lang="js">
import {defineComponent} from 'vue';
import axios from "axios";
import {useToast} from "vue-toastification";
import Button from 'primevue/button';
import FileUpload from 'primevue/fileupload';

export default defineComponent({
    name: 'Upload',
    components: {
        Button,
        FileUpload
    },
    computed: {},
    data() {
        return {
            thumbnail: null,
            files: [],
            image: null,
            source: null
        }
    },
    props: {
        folder: null
    },
    methods: {
        addFile(event) {
            event.files.forEach((value) => {
                if(!this.files.includes(value)){
                    this.files.push(value);
                }
            });
        },
        createPreview(file) {
            let src = URL.createObjectURL(file);
            this.thumbnail = src;
            this.loadThumbnail(file);
        },
        resetForm(){
            this.files = [];
        },
        uploadHandler(event){
            this.upload();
        },
        loadThumbnail(file) {

        },
        async upload() {
            let formData = new FormData();
            formData.append("folder", this.folder.id);
            for(let f of this.files){
                formData.append("files[]", f, f.name);
            }

            // Display the key/value pairs
            await axios.post('/resource/upload', formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'X-Loading': true
                    }
                }).then((response, error) => {
                    if(response.status === 200){
                        this.toast.success('Upload réussi');
                        this.$emit('invalidate');
                        this.$emit('update:visible', false);
                    }
            });
            this.resetForm();
        }
    },
    async mounted() {
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