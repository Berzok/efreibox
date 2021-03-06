import {createRouter, createWebHistory} from 'vue-router';
import {useUserStore} from '../store/user';
import Home from '../components/Home.vue';
import List from '../components/List';
import Upload from '../components/upload/Upload';
import Structure from '../components/structure/Structure';
import Folder from "../components/Folder";

export const LOGIN_PAGE_NAME = 'login';
export const HOME_PAGE_NAME = 'Home';

const routes = [
    {
        path: '/home',
        name: 'Home',
        alias: '',
        component: List,
        meta: {
            requiresAuth: false,
            title: 'Books'
        },
        children: [
            {
                path: ':fullpath*',
                alias: '',
                name: 'folder',
                meta: {requiresAuth: false},
                component: Folder,
            }
        ]
    },
    {
        path: '/upload',
        name: 'upload',
        component: Upload,
        meta: {
            requiresAuth: true,
            title: 'Upload'
        }
    },
    {
        path: '/structure',
        name: 'structure',
        component: Structure,
        meta: {
            requiresAuth: true,
            title: 'Structure',
            enabled: false
        }
    },
    {
        path: '/authenticate',
        name: 'authenticate',
        meta: {requiresAuth: false},
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('./../components/authenticate/Authenticate.vue'),
        children: [
            {
                path: 'login',
                name: LOGIN_PAGE_NAME,
                meta: {requiresAuth: false},
                component: () => import('./../components/authenticate/Login.vue'),
            }
        ],
    },

    //Redirections
    {
        path: '/login',
        redirect: {
            name: LOGIN_PAGE_NAME
        }
    }
];
const router = createRouter({
    history: createWebHistory(process.env.VUE_APP_BASE_URL),
    routes,
});
router.beforeEach((to, from, next) => {
    const user = useUserStore();

    // by defining in by negation (to.meta.requiresAuth !== false) every page which is not explicitly
    // defining to be without authentication needs to be authentication (security concerns)
    if (to.matched.some((record) => record.meta.requiresAuth !== false)) {
        if (user.isLogged) {
            console.dir('helloe');
            next();
        } else {
            next({name: LOGIN_PAGE_NAME});
        }
    } else {
        next();
    }
});

export default router;