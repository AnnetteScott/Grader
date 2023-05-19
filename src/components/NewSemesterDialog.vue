<script lang="ts">
import { defineComponent } from 'vue';
import { Semester } from '@/types';
import firebase from '@/firebase';

export default defineComponent({
	name: 'NewSemesterDialog',
	data () {
		return {
			name: '',
			startDate: '',
			endDate: ''
		};
	},
	props: {
		modelValue: { type: Boolean, default: false }
	},
	emits: ['update:modelValue'],
	methods: {
		cancel (): void {
			this.$emit('update:modelValue', false);
		},
		save (): void {
			firebase.dataBase.semesters.push({...new Semester(this.startDate, this.endDate, this.name)});
			void firebase.updateDataBase();
			this.name = '';
			this.startDate = '';
			this.endDate = '';
			this.$emit('update:modelValue', false);
		}
	},
	watch: {
		modelValue (newValue) {
			if (newValue) {
				(this.$refs.dialog as HTMLDialogElement).showModal();
			} else {
				(this.$refs.dialog as HTMLDialogElement).close();
			}
		}
	}
});
</script>

<template>
	<dialog ref="dialog">
		<form @submit.prevent>
			<fieldset>
				<label for="newSemesterName">
					Name
					<input type="text" id="newSemesterName" v-model="name">
				</label>
				<label for="newSemesterStartDate">
					Start Date
					<input type="date" id="newSemesterStartDate" v-model="startDate">
				</label>
				<label for="newSemesterEndDate">
					End Date
					<input type="date" id="newSemesterEndDate" v-model="endDate">
				</label>
			</fieldset>
			<fieldset>
				<button @click="cancel()">Cancel</button>
				<button @click="save()">Create</button>
			</fieldset>
		</form>
	</dialog>
</template>

<style scoped>

</style>
