<script lang="ts">
import { defineComponent, watch } from 'vue';
import ClassTile from '@/components/ClassTile.vue';
import NewSemesterDialog from '@/components/NewSemesterDialog.vue';
import NewCourseDialog from '@/components/NewCourseDialog.vue';
import firebase from '@/firebase';
import type { Assessment, Course, Grade } from '@/types';
import { Grades, gradeWorth, letterGrade } from '@/types'

interface ToDoList extends Assessment {
	courseCode: string,
	colour: string
}

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
			currentSem: -1,
			breakNum: -2,
			loaded: false
		};
	},
	mounted() {
		if(Object.keys(firebase.dataBase).length > 0){
			this.currentSemester()
			this.load()
		}
		watch(firebase.dataBase, async () => {
			if(!this.loaded){
				this.currentSemester()
				this.loaded = true;
			}
			this.load()
		})
	},
	methods: {
		currentSemester(){
			const today = new Date();
			let index = 0;
			for(const sem of firebase.dataBase.semesters){
				const date = new Date(sem.endDate);
				if(today.getTime() < date.getTime()){
					this.currentSem = index;
					break;
				}
				index++;
			}

			if(this.currentSem == -1){
				this.currentSem = firebase.dataBase.semesters.length - 1
			}
		},
		load(){
			this.breakNum = -2;
			this.$nextTick(() => {
				this.breakNum = this.weekNum(new Date(firebase.dataBase.semesters[this.currentSem].breakDate)) as number
				this.gpa();
			})
		},
		weekNum(date: Date): number | string | undefined{
			const startDate = new Date(firebase.dataBase.semesters[this.currentSem].startDate);
			const endDate = new Date(firebase.dataBase.semesters[this.currentSem].startDate);
			endDate.setDate(endDate.getDate() + 6);
			startDate.setHours(1);
			endDate.setHours(23);
			for(let i = 1; i < 18; i++){
				if(date.getTime() >= startDate.getTime() && date.getTime() <= endDate.getTime()){
					if(this.breakNum === -2){
						return i;
					}
					const output = i === this.breakNum ? 'Break 1' : i === this.breakNum + 1 ? 'Break 2' : i < this.breakNum ? 'Week ' + i : i > this.breakNum && i < 15 ? 'Week ' + (i - 2) : 'Exam ' + ((i - 2) % 13 + 1)
					return output;
				}
				startDate.setDate(startDate.getDate() + 7);
				endDate.setDate(endDate.getDate() + 7);
				startDate.setHours(1);
				endDate.setHours(23);
			}
			return undefined;
		},
		daysTill(date: Date) {
			const today = new Date()
			const oneDay = 24 * 60 * 60 * 1000;

			return Math.round(Math.abs((today.getTime() - date.getTime()) / oneDay));
		},
		gpa() {
			let classes = ['ENSE891', 'ENSE892', 'ENSE810', 'COMP826', 'COMP712', 'COMP700'];
			let grades = new Grades();
			let totals = {'6': 0, '7': 0, '8': 0} as {[key: string]: number}
			let classesTotal = {'6': 0, '7': 0, '8': 0} as {[key: string]: number}
			
			for(const sem of firebase.dataBase.semesters){
				for(const course of sem.courses){
					let percent = this.percent(course);
					let grade = letterGrade(percent)
					let level = course.courseCode.charAt(4);
					if(level == '5'){
						continue;
					}
					grades.grades[level][grade]++
					classesTotal[level]++;
				}
			}

			for(const [level, data] of Object.entries(grades.grades)){
				for(const [grade, amount] of Object.entries(data)){
					totals[level] += gradeWorth(grade as Grade) * amount;
				}
			}

			totals['7'] *= 2;
			totals['8'] *= 3;

			const score = Object.values(totals).reduce((acc, val) => acc + val, 0);
			const maxScore = classesTotal['6'] * 9 + classesTotal['7'] * 9 * 2 + classesTotal['8'] * 9 * 3;

			const gpa = score/maxScore * 9;
			if(gpa < 4.50){
				return `No Honours ${gpa.toFixed(2)}`
			}
			else if(gpa < 5.50){
				return `Second Division ${gpa.toFixed(2)}`
			}
			else if(gpa < 6.50){
				return `First Division ${gpa.toFixed(2)}`
			}
			else {
				return `First Class ${gpa.toFixed(2)}`
			}

		},
		percent(course: Course) {
			let amount = 0;
			course.assessments.forEach((assessment) => {
				if (assessment.result == null) {
					return;
				}
				amount += (assessment.result * assessment.weight) / 100;
			});
			return parseFloat(amount.toFixed(2));
		}

	},
	computed: {
		todoAss (): {[week: string]: ToDoList[]} {
			const todoAsses:{[week: string]: ToDoList[]} = {};
			for(let i = 1; i < 18; i++){
				if(i === this.breakNum){
					todoAsses['Break 1'] = []
				}
				else if(i === this.breakNum + 1){
					todoAsses['Break 2'] = []
				}
				else if(i < this.breakNum){
					todoAsses['Week ' + i] = []
				}
				else if(i > this.breakNum && i < 15){
					todoAsses['Week ' + (i - 2)] = []
				}
				else{
					todoAsses['Exam ' + ((i - 2) % 13 + 1)] = []
				}
			}

			let index = 0;
			for (const course of firebase.dataBase.semesters[this.currentSem].courses) {
				for (const ass of course.assessments) {
					if (typeof ass.result !== 'number' && !ass.submitted) {
						const weekNum = this.weekNum(new Date(ass.dueDate)) ?? 'Exam 3';
						
						todoAsses[weekNum].push({
							...ass,
							courseCode: course.courseCode,
							colour: firebase.colours[index]
						});
						todoAsses[weekNum].sort((a, b) => {
							if (a.dueDate < b.dueDate) {
								return -1;
							} else if (a.dueDate > b.dueDate) {
								return 1;
							} else {
								return a.name.localeCompare(b.name);
							}
						});
					}
				}
				index++;
			}

			const currentWeek = this.weekNum(new Date()) ?? 'Week 1';
			const currentIndex = Object.keys(todoAsses).indexOf(currentWeek.toString());

			for(const [index, [week, arr]] of Object.entries(Object.entries(todoAsses))){
				if(parseInt(index) < currentIndex && arr.length === 0){
					delete todoAsses[week];
				}
			}
			return todoAsses;
		}
	}
});
</script>

<template>
	<main v-if="Object.keys(firebase.dataBase).length > 0">
		<section>
			<button @click="showCourseDialog = true">
				<span class="material-symbols-rounded">history_edu</span>
				<span class="text">New Course</span>
			</button>
			<button @click="showSemDialog = true">
				<span class="material-symbols-rounded">calendar_month</span>
				<span class="text">New Semester</span>
			</button>
			<label for="selectedSemester">
				<select name="selectedSemester" id="selectedSemester" v-model="currentSem" @change="load()">
					<option
						v-for="semester, index in firebase.dataBase.semesters"
						:key="index"
						:value="index"
					>{{ new Date(semester.startDate).getFullYear() }} - {{ semester.name }}</option>
				</select>
			</label>
			{{ gpa() }}
		</section>
		<section>
			<ClassTile
				v-for="course, index in firebase.dataBase.semesters[currentSem].courses" :key="index"
				:courseIndex="index"
				:semIndex="currentSem"
			/>
		</section>
		<section v-if="breakNum !== -2">
			<p>Todo</p>
			<template v-for="list, week in todoAss" :key="week">
				<ul class="todo_list">
					<p><b>{{ week }}</b></p>
					<li v-for="ass, index in list" :key="index">
						<span>{{ new Date(ass.dueDate).toLocaleDateString() }} ({{ daysTill(new Date(ass.dueDate)) }} days)</span>
						<span>{{ ass.weight.toString().padStart(2, " ") }}%</span>
						<span :style="`background-color: ${ass.colour}`">{{ ass.courseCode }}</span>
						<span>{{ ass.name }}</span>
					</li>
				</ul>
			</template>
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
	max-width: 900px;
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

section:nth-of-type(1) > button .material-symbols-rounded {
	display: none;
}
section:nth-of-type(1) > button .text {
	display: inline;
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
	section:nth-of-type(1) > button .material-symbols-rounded {
		display: inline;
	}
	section:nth-of-type(1) > button .text {
		display: none;
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
.todo_list li > span:nth-of-type(2) {
	margin-right: 0.5ch;
}
.todo_list li > span:nth-of-type(3) {
	display: inline-block;
	margin-right: 0.8ch;
	padding: 0 0.5ch;
	height: 22px;
	background-color: #dadada;
	border-radius: 0.5em;
	min-width: 9ch;
}

.todo_list li {
	border-bottom: 1px solid grey;
	margin-bottom: 6px;
	padding-bottom: 6px;
}
</style>
