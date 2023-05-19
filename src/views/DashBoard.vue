<script lang="ts">
import { defineComponent, watch } from 'vue';
import ClassTile from '@/components/ClassTile.vue';
import NewSemesterDialog from '@/components/NewSemesterDialog.vue';
import NewCourseDialog from '@/components/NewCourseDialog.vue';
import firebase from '@/firebase';
import type { Assessment } from '@/types';

export default defineComponent({
	name: 'DashBoard',
	components: {
		ClassTile,
		NewSemesterDialog,
		NewCourseDialog
	},
	data() {
		return {
			firebase,
			showSemDialog: false,
			showCourseDialog: false,
			currentSem: 0
		};
	},
	mounted() {
		if(Object.keys(firebase.dataBase).length > 0){
			// Code here
		}
		watch(firebase.dataBase, async () => {
			//CODE HERE
		})
	},
	computed: {
		todoAss (): Assessment[] {
			const todoAsses = [] as Assessment[];
			for (const course of firebase.dataBase.semesters[this.currentSem].courses) {
				for (const ass of course.assessments) {
					if (typeof ass.result !== 'number') {
						todoAsses.push(ass);
					}
				}
			}
			todoAsses.sort((a, b) => a.dueDate > b.dueDate ? 1 : -1);
			return todoAsses;
		}
	}
});
</script>

<template>
	<main v-if="Object.keys(firebase.dataBase).length > 0">
		<section>
			<button @click="showCourseDialog = true">New Course</button>
			<button @click="showSemDialog = true">New Semester</button>
			<label for="selectedSemester">
				Semester
				<select name="selectedSemester" id="selectedSemester" v-model="currentSem">
					<option
						v-for="semester, index in firebase.dataBase.semesters"
						:key="index"
						:value="index"
					>{{ new Date(semester.startDate).getFullYear() }} - {{ semester.name }}</option>
				</select>
			</label>
		</section>
		<section>
			<ClassTile 
				v-for="course, index in firebase.dataBase.semesters[currentSem].courses" :key="index"
				:courseIndex="index" 
				:semIndex="currentSem"
			/>
		</section>
		<section>
			<p>Todo</p>
			<ul class="todo_list">
				<li v-for="ass, index in todoAss" :key="index">
					<span>{{ new Date(ass.dueDate).toLocaleDateString() }}</span>
					<span>{{ ass.name }}</span>
				</li>
			</ul>
		</section>
		<br>
		<NewSemesterDialog v-model="showSemDialog" />
		<NewCourseDialog v-model="showCourseDialog" />
	</main>
</template>

<style scoped>
main {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: auto 1fr;
	justify-content: flex-start;
	align-items: flex-start;
	max-width: 800px;
	margin: 0 auto;
	padding: 1ch 1ch;
}

section:nth-of-type(1) {
	grid-area: 1 / 1 / 2 / 3;
	display: flex;
	flex-flow: row wrap;
	justify-content: flex-start;
	align-items: center;
	gap: 1ch;
}

section:nth-of-type(2) {
	display: flex;
	flex-flow: column nowrap;
	gap: 0.8rem;
}

section:nth-of-type(3) {
	background-color: #eee;
	border-radius: 8px;
}
section:nth-of-type(3) > p {
	padding: 0.4em 0 0.3em 1ch;
	font-weight: bold;
}

@media only screen and (max-width: 600px) {
	main {
		grid-template-columns: 100%;
		grid-template-rows: 2em auto auto;
	}
	section:nth-of-type(1) {
		grid-area: 1 / 1 / 2 / 2;
	}
}

.todo_list {
	margin-top: 0;
}
.todo_list li > span:nth-of-type(1) {
	margin-right: 0.8ch;
	padding: 0 0.5ch;
	background-color: #dadada;
	border-radius: 0.5em;
}
</style>
