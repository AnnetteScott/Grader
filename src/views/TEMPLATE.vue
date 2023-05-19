<script lang="ts">
import { defineComponent, watch } from 'vue';
import Firebase from '@/firebase'

export default defineComponent({
	name: 'TEMPLATE',
	data() {
		return {

		};
	},
	mounted() {
		if(Object.keys(Firebase.dataBase).length > 0){
			// Code here
		}
		watch(Firebase.dataBase, async () => {
			//CODE HERE
		})
	},
	methods: {

	},

})

</script>

<template>
	<main>

	</main>
</template>

<style scoped>

</style>
