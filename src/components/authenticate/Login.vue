<template>

  <div class="card">

    <form @submit.prevent="">
      <div class="card-body">
        <div class="input-group">
          <label id="loginLabel" class="col-4 col-form-label input-group-text">
            Login
          </label>
          <input v-model="username" id="login" class="form-control"/>
        </div>

        <div class="input-group">
          <label id="passwordLabel" class="col-4 col-form-label input-group-text">
            Password
          </label>
          <input v-model="password" id="password" type="password" class="form-control"/>
        </div>
      </div>

      <div class="card-footer">
        <button class="btn btn-outline-info w-100" @click="this.auth">Login</button>
      </div>
    </form>

  </div>
</template>

<script lang="js">
import {useToast} from 'vue-toastification';
import {defineComponent} from 'vue';
import {useUserStore} from '../../store/user';
import router, {HOME_PAGE_NAME} from './../../router';
import {mapActions, mapState, mapWritableState} from "pinia";

export default defineComponent({
    name: 'Login',
    components: {},
    setup() {
        // Get toast interface
        const toast = useToast();

        /** @type {userStore} userStore **/
        const userStore = useUserStore();
        return {toast, userStore};
    },
    computed: {
        // gives access to this.counter inside the component and allows setting it
        // this.counter++
        // same as reading from store.counter
        ...mapWritableState(useUserStore, ['token', 'username', 'password'])
    },
    data() {
        return {
            // login: '',
            // password: '',
        };
    },
    methods: {
        // gives access to this.increment() inside the component
        // same as calling from store.increment()
        //...mapActions(useUserStore, ['login']),
        async auth() {
            if(this.userStore.token){
                let yap = await this.userStore.checkToken();
                if(yap){
                    router.push({
                        name: 'folder'
                    });
                }
                console.dir(yap);
                return;
            }
            let yap = await this.userStore.login();

            if (!yap) {
                this.toast.error('Authentication failed');
                return;
            }
            //this.toast.success(`Welcome ${this.login}`);

            router.push({
                name: 'folder'
            });
        },
    },
    mounted() {
        this.auth();
    }
});
</script>

<style scoped>
.input-group {
    margin-top: 9px;
}
</style>
