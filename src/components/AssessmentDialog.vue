<script lang="ts">
import { defineComponent } from 'vue';
import { Assessment } from '@/types';
import firebase from '@/firebase';

export default defineComponent({
	name: 'AssessmentDialog',
	data () {
		return {
			firebase,
			weight: 0,
			result: null as number | null,
			resultActual: null as number | null,
			name: "",
			dueDate: "",
			hasResult: false,
			submitted: false,
		};
	},
	props: {
		modelValue: { type: Boolean, default: false },
		semIndex: { type: Number, required: true },
		courseIndex: { type: Number, required: true },
		assessmentIndex: { type: Number, required: false, default: -1 },
	},
	emits: ['update:modelValue', 'update:assessmentIndex'],
	methods: {
		cancel (): void {
			this.clear()
			this.$emit('update:modelValue', false);
		},
		save (): void {
			const assessments = firebase.dataBase.semesters[this.semIndex].courses[this.courseIndex].assessments;
			const result = this.result ? this.result : this.resultActual ? this.resultActual / this.weight * 100 : null

			const assessmentData = new Assessment(
				this.weight,
				this.name,
				this.dueDate,
				this.hasResult ? result : null,
                this.hasResult ? true : this.submitted,
			);

			if (this.assessmentIndex === -1) {
				assessments.push({...assessmentData});
			} else {
				assessments[this.assessmentIndex] = {...assessmentData};
			}

			assessments.sort((a, b) => {
				if (a.dueDate < b.dueDate) {
					return -1;
				} else if (a.dueDate > b.dueDate) {
					return 1;
				} else {
					return b.name.localeCompare(a.name);
				}
			});

			void firebase.updateDataBase();
			this.clear()
			this.$emit('update:modelValue', false);
		},
		clear(){
			this.weight = 0
			this.result = null
			this.resultActual = null
			this.name = ""
			this.dueDate = ""
			this.hasResult = false
			this.submitted = false
			this.assessmentIndex
			this.$emit('update:assessmentIndex', -1);
		}
	},
	watch: {
		modelValue (newValue) {
			if (newValue) {
				(this.$refs.dialog as HTMLDialogElement).showModal();
				if(this.assessmentIndex > -1){
					let ass = firebase.dataBase.semesters[this.semIndex].courses[this.courseIndex].assessments[this.assessmentIndex]
					this.weight = ass.weight
					this.name = ass.name
					this.dueDate = ass.dueDate
					this.result = ass.result
                    this.submitted = ass.submitted
					if(typeof ass.result === 'number'){
						this.hasResult = true
					}
				}
			} else {
				(this.$refs.dialog as HTMLDialogElement).close();
			}
		},
	}
});
</script>

<template>
	<dialog ref="dialog">
		<form @submit.prevent="save()">
			<fieldset>
				<label for="AssessmentName">
					Assessment Name
					<input type="text" id="AssessmentName" v-model="name" required>
				</label>
				<label for="AssessmentWeight">
					Weight %
					<input type="number" id="AssessmentWeight" min="0" max="100" step="0.01" v-model="weight" required>
				</label>
				<label for="AssessmentSubmitted">
					Submitted
					<input type="checkbox" name="" id="AssessmentSubmitted" v-model="submitted">
				</label>
				<label for="AssessmentHasResult">
					Has Result
					<input type="checkbox" name="" id="AssessmentHasResult" v-model="hasResult">
				</label>
				<label for="AssessmentResult" v-if="hasResult">
					Result %
					<input type="number" id="AssessmentResult" min="0" max="100" step="0.01" v-model="result">
				</label>
				<label for="AssessmentResult" v-if="hasResult">
					Result
					<input type="number" id="AssessmentResult" min="0" max="100" step="0.01" v-model="resultActual">
				</label>
				<label for="AssessmentDate">
					Due Date
					<input type="date" id="AssessmentDate" v-model="dueDate" required>
				</label>
			</fieldset>
			<fieldset>
				<button @click="cancel()">Cancel</button>
				<button type="submit">Save</button>
			</fieldset>
		</form>
	</dialog>
</template>

<style scoped>

</style>
