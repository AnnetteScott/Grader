export class UserData {
    semesters = {} as {[year: string]: Semester[]}
    courses = {} as {[CourseCode: string]: Course}
}

export class Semester {
    startDate: string
    endDate: string
    name: string

    constructor(startDate: string, endDate: string, name: string){
        this.startDate = startDate
        this.endDate = endDate
        this.name = name
    }
}

export class Course {
    assessments: Assessment
}

export class Assessment {
    weight: number
    result: number | null
    name: number
    dueDate: string

    constructor(weight: number, name: number, dueDate: string){
        this.weight = weight
        this.result = null
        this.name = name
        this.dueDate = dueDate
    }
}

export function letterGrade (percent): string {
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