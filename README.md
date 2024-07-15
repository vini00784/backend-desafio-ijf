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