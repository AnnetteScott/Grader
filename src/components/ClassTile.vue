<script lang="ts">
import { defineComponent } from 'vue';
import { letterGrade } from '@/types'

export default defineComponent({
	name: 'ClassTile',
    data(){
        return {
            letterGrade
        }
    },
	props: {
        course: {
			type: String,
			required: true
		},
        percent: {
            type: Number,
            required: true
        }
    },
	methods: {
		
	},
})

</script>

<template>
	<div class="course_tile">
        <div class="top_section">
            <h1>{{ course }}</h1>
            <div class="grade">{{ letterGrade(percent) }}</div>
        </div>
    </div>
</template>

<style scoped>
.course_tile{
    border-radius: 7px;
    border: 1px solid black;
    padding: 10px;
}

.top_section{
    display: flex;
    align-items: center;
}

.grade {
    width: 30px;
    height: 30px;
    border-radius: 15px;
    border: 1px solid black;
    text-align: center;
}
</style>
