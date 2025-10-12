export class UserData {
    semesters = [] as Semester[]
}

export class Semester {
    startDate: string
    endDate: string
    name: string
    courses: Course[]
	breakDate: string

    constructor(startDate: string, endDate: string, name: string, breakDate: string){
        this.startDate = startDate
        this.endDate = endDate
        this.breakDate = breakDate
        this.name = name
        this.courses = []
    }
}

export class Course {
    assessments: Assessment[]
    courseCode: string

    constructor (courseCode: string) {
        this.courseCode = courseCode
        this.assessments = []
    }
}

export class Assessment {
    weight: number
    result: number | null
    name: string
    dueDate: string
    submitted: boolean

    constructor(weight: number, name: string, dueDate: string, result: number | null, submitted: boolean){
        this.weight = weight
        this.result = result
        this.name = name
        this.dueDate = dueDate
        this.submitted = submitted
    }
}

type Grade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-'| 'D'

export function letterGrade (percent: number): Grade {
    if(percent >= 89.5){
        return 'A+'
    }
    else if(percent >= 84.5 && percent <= 89.49){
        return 'A'
    }
    else if(percent >= 79.5 && percent <= 84.49){
        return 'A-'
    }
    else if(percent >= 74.5 && percent <= 79.49){
        return 'B+'
    }
    else if(percent >= 69.5 && percent <= 74.49){
        return 'B'
    }
    else if(percent >= 64.5 && percent <= 69.49){
        return 'B-'
    }
    else if(percent >= 59.5 && percent <= 64.49){
        return 'C+'
    }
    else if(percent >= 54.5 && percent <= 59.49){
        return 'C'
    }
    else if(percent >= 49.5 && percent <= 54.49){
        return 'C-'
    }
    else {
        return 'D'
    }
}

type GradeRecord = Record<Grade, number>;

export class Grades {
	grades: Record<string, GradeRecord> = {
		'6': { 'A+': 0, 'A': 0, 'A-': 0, 'B+': 0, 'B': 0, 'B-': 0, 'C+': 0, 'C': 0, 'C-': 0, 'D': 0 },
		'7': { 'A+': 0, 'A': 0, 'A-': 0, 'B+': 0, 'B': 0, 'B-': 0, 'C+': 0, 'C': 0, 'C-': 0, 'D': 0 },
		'8': { 'A+': 0, 'A': 0, 'A-': 0, 'B+': 0, 'B': 0, 'B-': 0, 'C+': 0, 'C': 0, 'C-': 0, 'D': 0 },
	};
}


export function gradeWorth(grade: Grade): number {
	if(grade == 'A+') {
		return 9;
	}
	else if(grade == 'A'){
		return 8;
	}
	else if(grade == 'A-'){
		return 7;
	}
	else if(grade == 'B+'){
		return 6;
	}
	else if(grade == 'B'){
		return 5;
	}
	else if(grade == 'B-'){
		return 4;
	}
	else if(grade == 'C+'){
		return 3;
	}
	else if(grade == 'C'){
		return 2;
	}
	else if(grade == 'C-'){
		return 1;
	}
	return 0;
}