import { Student } from "src/domain/entities/student";
import { AlreadyExistsError } from "src/errors/already-exists.error";
import { StudentRepository } from "src/repositories/student.repository";
import { describe, it, expect, beforeEach } from "vitest";

describe("Tests for student repository", () => {
    let studentRepository = new StudentRepository();

    beforeEach(() => {
        studentRepository = new StudentRepository();
    });

    it("Should create and manipulate an user", () => {
        const student = new Student({
            name: "Joana Carter",
            username: "joana_carter",
            password: "123123"
        });

        studentRepository.store(student);

        const storedStudent = studentRepository.get(student.id)

        expect(studentRepository.get(storedStudent.id)).toStrictEqual(student);

        storedStudent.edit({
            username: "carter_joana"
        });

        studentRepository.update(student.id, storedStudent.props);

        expect(storedStudent.props.username).not.toBe("joana_carter");
        expect(storedStudent.props.username).toBe("carter_joana");
    });

    it("Should throw already exists exception", () => {
        const student1 = new Student({
            name: "Peter Carter",
            username: "carter_pet",
            password: "123123",
            courses: []
        });

        const student2 = new Student({
            name: "Peter Carter",
            username: "carter_pet",
            password: "123123",
            courses: []
        });

        studentRepository.store(student1);

        expect(studentRepository.get(student1.id)).toEqual(student1);

        expect(() => {
            studentRepository.store(student2);
        }).toThrowError(AlreadyExistsError);

        student2.edit({
            username: "peter_carter"
        });

        expect(() => {
            studentRepository.store(student2);
        }).not.toThrowError(AlreadyExistsError);
    });
})