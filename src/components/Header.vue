<template>
  <nav id="header" class="d-flex justify-content-between bg-primary border-bottom border-info sticky-top w-100">

    <Particles
      id="tsparticles"
      :particlesInit="particlesInit"
      :particlesLoaded="particlesLoaded"
      url="/particles.json"
      class="h-100"
    />

    <div class="d-flex flex-fill justify-content-evenly align-items-stretch z-1">

      <router-link :to="{path: '/home'}" class="nav-link h-100 btn-primary">
        <div class="d-flex flex-column text-center">
          <span class="fas fa-torii-gate"></span>
          Home
        </div>
      </router-link>

      <router-link v-if="this.isLogged" to="/structure" class="nav-link h-100 btn-primary">
        <div class="d-flex flex-column text-center">
          <span class="fas fa-archive"></span>
          Structure
        </div>
      </router-link>

      <div class="my-auto">
        <button v-if="this.isLogged" @click="logout" class="btn btn-primary z-1">
          Déconnexion
        </button>
        <button v-else @click="login" class="btn btn-primary z-1">
          Connexion
        </button>
      </div>

    </div>

  </nav>
</template>

<script lang="js">
import {computed, defineComponent} from 'vue';
import {useUserStore} from '../store/user';
import Button from 'primevue/button';
import Card from 'primevue/card';
import router, {HOME_PAGE_NAME} from "../router";
import {mapState} from "pinia";


export default defineComponent({
    name: 'Header',
    components: {
        Button,
        Card
    },
    computed: {
        // gives access to this.counter inside the component and allows setting it
        // this.counter++
        // same as reading from store.counter
        ...mapState(useUserStore, ['isLogged'])
    },
    methods: {
        login(){
            router.push({
                name: 'login'
            });
        },
        logout() {
            const userStore = useUserStore();
            userStore.logout();
            router.push({
                name: 'login'
            });
        }
    },
    mounted() {

    },
    setup() {
        const store = useUserStore();
        const isLoggedIn = computed(() => store.getters.isLogged);
        return {isLoggedIn};
    },
});
</script>

<style scoped>

#header {
    height: 60px;
    z-index: 1;
}

nav {
    max-height: 60px !important;
}

::v-deep(canvas) {
    max-height: 60px !important;
}

.thumbnail {
    height: 90%;
    width: 210px;
}

.section-separator {
    border-bottom: 4px double darkgrey;
    margin-top: 3px;
    margin-bottom: 3px;
}
</style>