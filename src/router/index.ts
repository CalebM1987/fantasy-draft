import { createRouter, createWebHashHistory, RouteLocationNormalized } from "vue-router";

const routes = [
  { path: '/', name: 'Draft Room', component: ()=> import('../views/DraftRoom.vue') },
  
]


export const router = createRouter({
  history: createWebHashHistory(),
  routes
})
