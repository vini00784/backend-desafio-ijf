import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();
const configService = new ConfigService();

async function main() {
    const josephReina = await prisma.teacher.create({
        data: {
            name: "Joseph Reina",
            username: "joseph_reina",
            password: await hash("123123", +configService.get<number>('BCRYPT_SALT_ROUNDS'))
        }
    });

    const linaReina = await prisma.teacher.create({
        data: {
            name: "Lina Reina",
            username: "lina_reina",
            password: await hash("123123", +configService.get<number>('BCRYPT_SALT_ROUNDS'))
        }
    });

    const tinaCarter = await prisma.student.create({
        data: {
            name: "Tina Carter",
            username: "tina_carter",
            password: await hash("123123", +configService.get<number>('BCRYPT_SALT_ROUNDS'))
        }
    });

    const peterCarter = await prisma.student.create({
        data: {
            name: "Peter Carter",
            username: "peter_carter",
            password: await hash("123123", +configService.get<number>('BCRYPT_SALT_ROUNDS'))
        }
    });

    const lesson1 = await prisma.lesson.create({
        data: {
            content: "Lesson 1 content",
        }
    });
    
    const course1 = await prisma.course.create({
        data: {
            name: ".NET Course",
            description: "Fast .NET learning",
            banner: "picture.png",
            teacher: {
                connect: {
                    id: josephReina.id
                }
            },
            lessons: {
                connect: {
                    id: lesson1.id
                }
            }
        }
    });

    const lesson2 = await prisma.lesson.create({
        data: {
            content: "Lesson 2 content",
        }
    });

    const course2 = await prisma.course.create({
        data: {
            name: "Ruby Course",
            description: "Fast Ruby learning",
            banner: "picture.png",
            teacher: {
                connect: {
                    id: linaReina.id
                }
            },
            lessons: {
                connect: {
                    id: lesson2.id
                }
            }
        }
    });

    await prisma.studentLesson.create({
        data: {
            student: {
                connect: {
                    id: tinaCarter.id
                }
            },
            lesson: {
                connect: {
                    id: lesson1.id
                }
            }
        }
    });

    await prisma.studentCourse.create({
        data: {
            student: {
                connect: {
                    id: tinaCarter.id
                }
            },
            course: {
                connect: {
                    id: course1.id
                }
            }
        }
    });

    await prisma.studentLesson.create({
        data: {
            student: {
                connect: {
                    id: peterCarter.id
                }
            },
            lesson: {
                connect: {
                    id: lesson2.id
                }
            }
        }
    });

    await prisma.studentCourse.create({
        data: {
            student: {
                connect: {
                    id: peterCarter.id
                }
            },
            course: {
                connect: {
                    id: course2.id
                }
            }
        }
    });
}

main().then(() => console.log("Database populate successfully!"));