# School API
This is an API to manage a (fictional) school system.

## Getting started
First, you need to clone the project using the command:

```bash
    git clone git@github.com:vini00784/backend-desafio-ijf.git
```

After this, you need to install dependencies using the command:

```bash
    pnpm i
```

To run the project, run:

```bash
    pnpm prisma migrate
    pnpm run seed
    pnpm run start:dev
```

And now, you can test this API!

## E2E Tests
The E2E tests can be done via the URL `http://localhost:3000/graphql`, it gives access to the GraphQL Playground.

## Auth

### Register mutation
The register can be done according to the role:
```graphql
    mutation createTeacherUser {
        createUser(
            input: {
                name: "Lina Reina",
                username: "lina_reina",
                password: "123123",
                userRole: teacher
            }
        ) {
            id
            createdAt
            username
        }
    }

    mutation createStudentUser {
        createUser(
            input: {
                name: "peter_carter",
                username: "peter_carter",
                password: "123123",
                userRole: student
            }
        ) {
            id
            createdAt
            username
        }
    }
```

### Login mutation
The Login can be done according to the role:
```graphql
    mutation teacherLogin {
        login(
            input: {
                username: "lina_reina",
                password: "123123",
                userRole: teacher
            }
        ) {
            token
        }
    }

    mutation studentLogin {
        login(input: {
            username: "peter_carter",
            password: "123123",
            userRole: student
        }) {
            token
        }
    }
```
### Using JWT Token
After making login and getting token, you must pass it through the "HTTP headers" field and following the pattern below:
```json
    {
        "Authorization": "bearer TOKEN"
    }
```

## Student

### Load courses query
As a student, you can load the courses you are taking:
```graphql
    query loadCourses {
        loadCourses {
            id
            name
            description
            banner
            teacher {
                id
                name
                username
            }
            lessons {
                id
                content
            }
            studentCourses {
                status
                courseId
                student {
                    id
                    name
                    username
                    studentLessons {
                        lessonId
                        isWatched
                    }
                }
            }
        }
    }
```

### Watch lesson query
As a student, you can watch a lesson related to a course you are linked to:
```graphql
    mutation watchLesson {
        watchLesson(
            input: {
                lessonId: "87964c19-e7bb-48d9-8721-649d101b7477"
            }
        ) {
            id,
            watchedAt,
            message
        }
    }
```

## Teacher

### Create course mutation
As a teacher, you can create courses and their lessons:
```graphql
    mutation createCourse {
        createCourse(
            input: {
                name: "Course 1",
                banner: "course.jpeg",
                description: "My first course",
                teacherId: "1ea88d88-62ea-4013-8c45-40e9fee7e8c5",
                lessons: [
                    {
        	            content: "Lesson 1"
                    },
                    {
                        content: "Lesson 2"
                    }
                ]
            }
        ) {
            id
            createdAt
        }
    }
```

### Update course mutation
As a teacher, after creating a course, you can update/edit the information related to it:
```graphql
    mutation updateCourse {
        updateCourse(
            input: {
    	        id: "51a94e50-8b55-498c-90fa-e00f86a0fda7",
                name: "Update Test",
                description: "Updating course",
                banner: "update.jpeg"
            }
        ) {
            id
            updatedAt
        }
    }
```

### Delete course mutation
As a teacher, after creating a course, you can delete it as soon as you feel the need:
```graphql
    mutation deleteCourse {
        deleteCourse(
            input: {
                id: "51a94e50-8b55-498c-90fa-e00f86a0fda7"
            }
        ) {
            id
            deletedAt
        }
    }
```

### Load courses query
As a teacher, you can load courses you created (as well as the attached students and their respective lessons):
```graphql
    query loadCourses {
        loadCourses {
            id
            name
            description
            banner
            teacher {
                id
                name
                username
            }
            lessons {
                id
                content
            }
            studentCourses {
                status
                courseId
                student {
                    id
                    name
                    username
                    studentLessons {
                        lessonId
                        isWatched
                    }
                }
            }
        }
    }
```

### Assign course to student mutation
As a teacher, you can enroll a student in a course, so they will have access to lessons:
```graphql
    mutation assignCourseToStudent {
        assignCourseToStudent(
            input:{
                courseId: "ccbf1840-5d2a-44e5-926b-a7feaf862e85",
                studentId: "565fdfd5-f3e4-4b2e-ae04-121e4abe0dd4"
            }
        ) {
            message
        }
    }
```

### Remove student of course mutation
As a teacher, you can remove a student from your course:
```graphql
    mutation removeStudentOfCourse {
        removeStudentOfCourse(
            input: {
                courseId: "ccbf1840-5d2a-44e5-926b-a7feaf862e85",
                studentId: "565fdfd5-f3e4-4b2e-ae04-121e4abe0dd4"
            }
        ) {
            message
        }
    }
```

### Approve student mutation
As a teacher, you can approve a student if they have finished a course (in this case, watched all lessons):
```graphql
    mutation approveStudent {
        approveStudent(
            input: {
                courseId: "ccbf1840-5d2a-44e5-926b-a7feaf862e85",
                studentId: "565fdfd5-f3e4-4b2e-ae04-121e4abe0dd4"
            }
        ) {
            message
        }
    }
```