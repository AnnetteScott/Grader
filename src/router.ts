import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			name: 'DashBoard',
			component: () => import('@/views/DashBoard.vue'),
            meta: { requiresAuth: true }
		},
		{
			path: '/login',
			name: 'Login',
			component: () => import('@/views/LoginUser.vue'),
		},
		{
			path: '/register',
			name: 'Register',
			component: () => import('@/views/TEMPLATE.vue'),
		}
	]
})

export default router
