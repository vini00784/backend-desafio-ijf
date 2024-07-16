import { Course } from "src/domain/entities/course";
import { Lesson } from "src/domain/entities/lesson";
import { Student } from "src/domain/entities/student";
import { Teacher } from "src/domain/entities/teacher";
import { CourseRepository } from "src/repositories/course.repository";
import { describe, it, expect, beforeEach } from "vitest";

describe("Tests for courses", () => {
    let courseRepository = new CourseRepository();

    beforeEach(() => {
        courseRepository = new CourseRepository();
    });

    it("Should create a course and add student in the course", () => {
        const course = new Course({
            name: "C# Course",
            description: "Just a test course",
            banner: "test.png",
            lessons: [
                new Lesson({
                    content: "Test lesson"
                })
            ], 
            teacher: new Teacher({
                name: "Robert Reina",
                username: "robert_reina",
                password: "123123"
            })
        });

        const student = new Student({
            name: "Tina Carter",
            username: "tina_carter",
            password: "123123",
            courses: []
        });

        courseRepository.store(course);

        expect(courseRepository.get(course.id)).toEqual(course);

        let storedCourse = courseRepository.get(course.id);

        storedCourse.addStudent(student);

        courseRepository.update(course.id, storedCourse.props);

        expect(storedCourse.props.students.length).toEqual(1);
    });
})