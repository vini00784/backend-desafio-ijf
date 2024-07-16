import { randomUUID } from "crypto";
import { BaseEntity } from "./base-entity";
import { Teacher } from "./teacher";
import { Student } from "./student";
import { Lesson } from "./lesson";
import { CannotDeleteError } from "src/errors/cannot-delete.error";
import { AlreadyExistsError } from "src/errors/already-exists.error";

export interface CourseProps {
    name: string;
    description: string;
    banner: string;
    teacher: Teacher;
    students?: Student[];
    lessons: Lesson[];
}

export class Course extends BaseEntity<CourseProps> {
    constructor(props: CourseProps) {
        super(randomUUID(), {
            ...props,
            students: props.students || []
        });
    }

    addLesson(lesson: Lesson) {
        this.props.lessons.push(lesson);
    }

    removeLesson(lessonId: Lesson["id"]) {
        if(this.props.lessons.length === 1)
            throw new CannotDeleteError("a course must have at least one lesson");
        
        const foundedLesson = this.props.lessons.findIndex(lesson => lesson.id === lessonId);

        this.props.lessons.splice(foundedLesson, 1);
    }

    addStudent(student: Student) {
        if(this.props.students.findIndex(studentItem => studentItem.props.username === student.props.username))
            throw new AlreadyExistsError();

        this.props.students.push(student);
    }

    removeStudent(studentId: Student["id"]) {
        const foundedStudent = this.props.students.findIndex(student => student.id === studentId);

        this.props.students.splice(foundedStudent, 1);
    }

    edit(data: Partial<Omit<CourseProps, "teacher">>) {
        this.props = {
            ...this.props,
            ...data
        };
    }
}