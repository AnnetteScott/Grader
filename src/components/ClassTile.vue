<script lang="ts">
import { defineComponent } from 'vue';
import { letterGrade } from '@/types'
import firebase from '@/firebase';
import AssessmentDialog from './AssessmentDialog.vue';

export default defineComponent({
	name: "ClassTile",
	data() {
		return {
			letterGrade,
			firebase,
			showAssessments: false,
			showCreateAssessment: false,
			assessmentIndex: -1
		};
	},
	props: {
		courseIndex: {
			type: Number,
			required: true
		},
		semIndex: {
			type: Number,
			required: true
		}
	},
	computed: {
		percent() {
			let amount = 0;
			firebase.dataBase.semesters[this.semIndex].courses[this.courseIndex].assessments.forEach((assessment) => {
				if (assessment.result == null) {
					return;
				}
				amount += (assessment.result * assessment.weight) / 100;
			});
			return amount;
		},
		percent2() {
			let amount = 0;
			let index = 0;
			firebase.dataBase.semesters[this.semIndex].courses[this.courseIndex].assessments.forEach((assessment) => {
				if (assessment.result == null) {
					return;
				}
				amount += assessment.result
				index += 1
			});
			return amount / index;
		}
	},
	methods: {
		deleteAss(assIndex: number): void {
			firebase.dataBase.semesters[this.semIndex].courses[this.courseIndex].assessments.splice(assIndex, 1);
			firebase.updateDataBase();
		}
	},
	components: { AssessmentDialog }
})

</script>

<template>
	<div class="course_tile" :class="{ showAssessments }" @click="showAssessments = !showAssessments">
		<div class="top_section">
			<h2>{{ firebase.dataBase.semesters[semIndex].courses[courseIndex].courseCode }}</h2>
			<p>
				<span>{{ letterGrade(percent) }}</span>
				<span>{{ letterGrade(percent2) }}</span>
				<span>{{ percent }}%</span>
			</p>
		</div>
		<div class="bottom_section">
			<div>
				<button class="icon_button" @click.stop="showCreateAssessment = true"><span class="material-symbols-rounded">add</span></button>
			</div>
			<ul class="assessment_list">
				<li v-for="assessment, index in firebase.dataBase.semesters[semIndex].courses[courseIndex].assessments" :key="index">
					<p>{{ assessment.name }}: {{ assessment.result ? assessment.result : 0 }}%</p>
					<button
						class="icon_button"
						@click.stop="assessmentIndex = index, showCreateAssessment = true">
						<span class="material-symbols-rounded">edit</span>
					</button>
					<button
						class="icon_button"
						@click.stop="deleteAss(index)">
						<span class="material-symbols-rounded">delete</span>
					</button>
				</li>
			</ul>
		</div>
	</div>
	<AssessmentDialog :semIndex="semIndex" :courseIndex="courseIndex" v-model:assessmentIndex="assessmentIndex" v-model="showCreateAssessment"/>
</template>

<style scoped>
.course_tile{
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: 3rem 0fr;
	padding: 10px;
	border: 1px solid #eee;
	border-radius: 8px;
	transition: 0.2s ease grid-template-rows;
	cursor: pointer;
	user-select: none;
	-webkit-tap-highlight-color: transparent;
}
.course_tile.showAssessments {
	grid-template-rows: 3rem 1fr;
}

.top_section{
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	align-items: center;
}

.top_section p {
	display: grid;
	grid-template-columns: 2rem 4.3rem;
	grid-template-rows: 1fr 1fr;
	place-items: center;
	gap: 0;
	border-radius: 2em;
	overflow: hidden;
}
.top_section p span {
	width: 100%;
	height: 100%;
	font-size: small;
	text-align: center;
	background-color: #eee;
}
.top_section p span:nth-of-type(1) {
	grid-area: 1 / 1 / 3 / 2;
	position: relative;
	display: inline-flex;
	flex-flow: row;
	justify-content: flex-end;
	align-items: center;
	font-size: x-large;
	background-color: #eee;
}
.top_section p span:nth-of-type(1)::after {
	content: '';
	position: absolute;
	right: -7px;
	display: block;
	width: 1px;
	height: 1em;
	background-color: #bbb;
}

.bottom_section {
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: 2em 1fr;
	overflow: hidden;
}

.assessment_list {
	display: flex;
	flex-flow: column nowrap;
	gap: 0.5em;
	margin: 0;
	padding: 0.5em 0;
	list-style: none;
}

.assessment_list li {
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-start;
	align-items: center;
	gap: 0.5ch;
	padding: 0.5ch 0.8ch;
	background-color: #f6f6f6;
	border-radius: 8px;
}

.assessment_list li p {
	margin-right: auto;
}
</style>
