import { createRouter, createWebHistory } from 'vue-router'
import Login from '@views/login/index.vue'
import Home from '@views/home/index.vue'
import ProfessionalSearch from '@views/professionalSearch/index.vue'
import searchResults from '@views/searchResults/index.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home },
  { path: '/professional', component: ProfessionalSearch },
  { path: '/search-results', component: searchResults },
  { path: '/sentence/detail/:id', component: ProfessionalSearch },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router