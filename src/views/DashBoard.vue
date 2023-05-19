<script lang="ts">
import { defineComponent, watch } from 'vue';
import Firebase from '@/firebase'
import ClassTile from '@/components/ClassTile.vue'

export default defineComponent({
	name: 'DashBoard',
    components: {
        ClassTile
    },
	data() {
		return {
            Firebase
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
	<main v-if="Object.keys(Firebase.dataBase).length > 0">
        <section>
            <button>New Class</button>
            <button>New Semester</button>
        </section>
        <section>
            <ClassTile course="ENSE602" :percent="10" />
        </section>
	</main>
</template>

<style scoped>

</style>
