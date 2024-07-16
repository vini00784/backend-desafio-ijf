import { Course } from "src/domain/entities/course";
import { Lesson } from "src/domain/entities/lesson";
import { Student } from "src/domain/entities/student";
import { Teacher } from "src/domain/entities/teacher";
import { CannotApproveStudentError } from "src/errors/cannot-approve-student.error";
import { describe, it, expect } from "vitest";

describe("Tests for students", () => {
    it("Should correctly handle students", () => {
        const lesson1 = new Lesson({
            content: "lesson 1",
        });
        const lesson2 = new Lesson({
            content: "lesson 2",
        });

        const teacher = new Teacher({
            name: "Millie Reina",
            username: "millie_reina",
            password: "123123",
        });

        const course = new Course({
            name: "Java Course",
            description: "A fast Java learning",
            banner: "java.jpg",
            teacher,
            lessons: [lesson1, lesson2],
        });

        const student = new Student({
            name: "Bob Carter",
            username: "carter_bob",
            password: "123123",
            courses: [course]
        });

        const { studentLessons, studentCourses } = student.props;

        for(const lesson of studentLessons) {
            expect(lesson.props.isWatched).toBeFalsy();
        }
        expect(studentLessons.length).toBe(2);

        for(const course of studentCourses) {
            expect(course.props.status).toStrictEqual("notStarted");
        }

        student.changeWatchedLessonStatus(lesson2.id);
        
        expect(studentLessons[0].props.isWatched).toBeFalsy();
        expect(studentLessons[1].props.isWatched).toBeTruthy();
        expect(studentCourses[0].props.status).toStrictEqual("inProgress");

        student.changeWatchedLessonStatus(lesson1.id);

        expect(studentLessons[0].props.isWatched).toBeTruthy();
        expect(studentLessons[1].props.isWatched).toBeTruthy();
        expect(studentCourses[0].props.status).toStrictEqual("finished");

        student.changeWatchedLessonStatus(lesson2.id);

        expect(studentLessons[1].props.isWatched).toBeFalsy();
        expect(studentCourses[0].props.status).toStrictEqual("inProgress");

        expect(() => {
            studentCourses[0].approveStudent();
        }).toThrowError(CannotApproveStudentError);

        student.changeWatchedLessonStatus(lesson2.id);
        expect(studentLessons[1].props.isWatched).toBeTruthy();
        expect(studentCourses[0].props.status).toStrictEqual("finished");

        expect(() => {
            studentCourses[0].approveStudent();
        }).not.toThrowError(CannotApproveStudentError);

        expect(studentCourses[0].props.status).toStrictEqual("approved");
    })
})