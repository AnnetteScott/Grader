export class UserData {
    semesters = [] as Semester[]
}

export class Semester {
    startDate: string
    endDate: string
    name: string
    courses: Course[]

    constructor(startDate: string, endDate: string, name: string){
        this.startDate = startDate
        this.endDate = endDate
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

export function letterGrade (percent: number): string {
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
    else if(percent >= 0 && percent <= 49.49){
        return 'D'
    }
    return 'F';
}