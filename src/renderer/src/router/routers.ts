import Home from '../components/Home.vue'
import Remd from '../components/Remd.vue'
import Dynamic from '../components/Dynamic.vue'
import Set from '../components/Set.vue'
import Search from '../components/Search.vue'
const routes = [
    {
        path:'/',
        component:Remd
    },
    {
        path:'/wallStore',
        component:Home
    },
    {
        path:'/dynamic',
        component:Dynamic
    },
    {
        path:'/set',
        component:Set
    },
    {
        path:'/search/:key',
        component:Search
    }
]
export default routes