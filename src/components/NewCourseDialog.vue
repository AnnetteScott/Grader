<script lang="ts">
import { defineComponent } from 'vue';
import { Course } from '@/types';
import firebase from '@/firebase';

export default defineComponent({
	name: 'NewSemesterDialog',
	data () {
		return {
            firebase,
            courseCode: '',
            semIndex: 0
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
            firebase.dataBase.semesters[this.semIndex].courses.push({...new Course(this.courseCode)})
            void firebase.updateDataBase();
            this.semIndex = 0;
            this.courseCode = '';
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
		<form @submit.prevent="save()">
			<fieldset>
				<label for="newCourseName">
					Course Code
					<input type="text" id="newCourseName" v-model="courseCode">
				</label>
				<label for="newCourseSemester">
					Semester
					<select name="" id="newCourseSemester" v-model="semIndex">
                        <option v-for="semester, index in firebase.dataBase.semesters" :key="index" :value="index">{{ new Date(semester.startDate).getFullYear() }} - {{ semester.name }}</option>
                    </select>
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
