import { Course } from "src/domain/entities/course";
import { Lesson } from "src/domain/entities/lesson";
import { Teacher } from "src/domain/entities/teacher";
import { AlreadyExistsError } from "src/errors/already-exists.error";
import { CourseRepository } from "src/repositories/course.repository";
import { describe, it, expect, beforeEach } from "vitest";

describe("Tests for course repository", () => {
    let courseRepository = new CourseRepository();

    beforeEach(() => {
        courseRepository = new CourseRepository();
    });

    it("Should throw already exists exception", () => {
        const course1 = new Course({
            name: "Test Course",
            description: "Just a test course",
            banner: "test.png",
            lessons: [
                new Lesson({
                    content: "Test lesson"
                })
            ], 
            teacher: new Teacher({
                name: "Lina Reina",
                username: "lina_reina",
                password: "123123"
            })
        });

        const course2 = new Course({
            name: "Test Course",
            description: "Just a test course",
            banner: "test.png",
            lessons: [
                new Lesson({
                    content: "Test lesson"
                })
            ], 
            teacher: new Teacher({
                name: "Joseph Reina",
                username: "joseph_reina",
                password: "123123"
            })
        });

        courseRepository.store(course1);

        expect(courseRepository.get(course1.id)).toEqual(course1);

        expect(() => {
            courseRepository.store(course2);
        }).toThrowError(AlreadyExistsError);

        course2.edit({ 
            name: "Second Test Course"
        });

        expect(() => {
            courseRepository.store(course2);
        }).not.toThrowError(AlreadyExistsError);
    });

    it("Should create a course", () => {
        let courses = courseRepository.load();

        expect(courses.length).not.toBeGreaterThan(0);

        const course = new Course({
            name: "Course",
            description: "course",
            banner: "course.png",
            lessons: [
                new Lesson({
                    content: "Lesson content"
                })
            ],
            teacher: new Teacher({
                name: "Robert Reina",
                username: "robert_reina",
                password: "123123"
            })
        });

        courseRepository.store(course);
        courses = courseRepository.load();

        expect(courses.length).toBeGreaterThan(0);
    });
})