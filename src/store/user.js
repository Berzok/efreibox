import {defineStore, acceptHMRUpdate} from 'pinia';
import Cookies from 'js-cookie';
import axios from "axios";

const useUserStore = defineStore('user', {
    state: () => ({
        /** @type {'all' | 'finished' | 'unfinished'} */
        filter: 'all',
        // type will be automatically inferred to number
        username: '',
        password: '',
        user: {},
        logged: !!Cookies.get('efreibox.session'),
        token: Cookies.get('efreibox.session') || false
    }),
    getters: {
        getToken(){
            return this.token;
        },
        getTags(){
            return this.tags;
        },
        /**
         * Check if a user is logged;
         * @param state
         * @returns {boolean|*}
         */
        isLogged(state){
            return state.logged;
        }
    },
    actions: {
        checkToken(){
            return axios.post('/token/verify', {
                'token': this.token
            }).then((response, error) => {
                if(response.status === 200 && response.data.userData){
                    this.user = response.data.userData;
                    this.token = response.data.token;
                    this.logged = true;
                    Cookies.set('efreibox.session', response.data.token, {
                        expires: 5
                    });
                    return true;
                }
            });
        },
        /**
         *
         * @returns {Promise<boolean|AxiosResponse<any>>}
         */
        async login(){
            return axios.post('/login', {
                'username': this.username,
                'password': this.password
            }, {
                headers: {
                    'X-Loading': true
                }
            }).then((response) => {
                if(response.status === 200){
                    this.user = response.data.userData;
                    this.token = response.data.token;
                    Cookies.set('efreibox.session', response.data.token, {
                        domain: 'efreibox.arae.rest',
                        expires: 5
                    });
                    return this.checkToken();
                }

                return true;
            });
        },
        logout(){
            Cookies.remove('efreibox.session');
            Cookies.remove('efreibox.user');
            this.$reset();
        }
    },
});

// make sure to pass the right store definition, `useUserStore` in this case.
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}

export {useUserStore};