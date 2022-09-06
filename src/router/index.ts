import { createRouter, createWebHashHistory, RouteLocationNormalized } from "vue-router";

const routes = [
  { path: '/', name: 'Draft Room', component: ()=> import('../views/DraftRoom.vue') },
  { path: '/teams', name: 'Teams', component: ()=> import('../views/TeamsPreview.vue') },
  { path: '/league', name: 'League Settings', component: ()=> import('../views/LeagueSettings.vue') },
  
]


export const router = createRouter({
  history: createWebHashHistory(),
  routes
})
