<script lang="ts">
import firebase from '@/firebase';
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'ToPass',
	emits: ['update:modelValue', 'update:assessmentIndex'],
	props: {
		modelValue: { type: Boolean, default: false },
		semIndex: { type: Number, required: true },
		courseIndex: { type: Number, required: true },
	},
	setup(){
		return {
			firebase
		}
	},
	data(){
		return {
			grade: 'A+' as 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' |'D',
			info: {} as {[key: string]: number}
		}
	},
	methods: {
		getData(){
			this.info = {};
			let amount = 0;
			let max = 0;
			firebase.dataBase.semesters[this.semIndex].courses[this.courseIndex].assessments.forEach((assessment) => {
				if (assessment.result == null) {
					max += assessment.weight;
					return;
				}
				amount += (assessment.result * assessment.weight) / 100;
			});

			amount = parseFloat(amount.toFixed(2));

			const minPercent = this.minPercent();
			const left = minPercent - amount
			

			if(left <= 0){
				firebase.dataBase.semesters[this.semIndex].courses[this.courseIndex].assessments.forEach((assessment) => {
					if (assessment.result == null) {
						this.info[assessment.name] = 0;
					}
				});
				return;
			}

			const percentNeeded = left / max;
			console.log(max, left)
			firebase.dataBase.semesters[this.semIndex].courses[this.courseIndex].assessments.forEach((assessment) => {
				if (assessment.result == null) {
					this.info[assessment.name] = parseFloat((percentNeeded * assessment.weight).toFixed(2));
				}
			});
		},
		minPercent() {
			if(this.grade == 'A+'){
				return 89.5
			}
			else if(this.grade == 'A'){
				return 84.5
			}
			else if(this.grade == 'A-'){
				return 79.5
			}
			else if(this.grade == 'B+'){
				return 74.5
			}
			else if(this.grade == 'B'){
				return 69.5
			}
			else if(this.grade == 'B-'){
				return 64.5
			}
			else if(this.grade == 'C+'){
				return 59.5
			}
			else if(this.grade == 'C'){
				return 54.5
			}
			else if(this.grade == 'C-'){
				return 49.5
			}
			else if(this.grade == 'D'){
				return 0
			}
			return 0;
		},
		cancel (): void {
			this.$emit('update:modelValue', false);
		},
	},
	watch: {
		modelValue (newValue) {
			if (newValue) {
				(this.$refs.dialog as HTMLDialogElement).showModal();
				this.getData();
			} else {
				(this.$refs.dialog as HTMLDialogElement).close();
			}
		},
		grade () {
			this.getData();
		},
	}
})

</script>

<template>
	<dialog ref="dialog">
		<select v-model="grade">
			<option value="A+">A+</option>
			<option value="A">A</option>
			<option value="A-">A-</option>
			<option value="B+">B+</option>
			<option value="B">B</option>
			<option value="B-">B-</option>
			<option value="C+">C+</option>
			<option value="C">C</option>
			<option value="C-">C-</option>
			<option value="D">D</option>
		</select>
		<p v-for="[name, val] of Object.entries(info)"
			:key="name"
		>
			{{ name }}: {{ val }}
		</p>
		<fieldset>
			<button @click="cancel()">Cancel</button>
		</fieldset>
	</dialog>
</template>

<style scoped>

</style>
