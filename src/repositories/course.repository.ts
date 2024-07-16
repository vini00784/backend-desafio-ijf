import { Course, CourseProps } from "src/domain/entities/course";
import { Repository } from "./repository";
import { AlreadyExistsError } from "src/errors/already-exists.error";

export class CourseRepository extends Repository<Course, CourseProps> {
    store(course: Course): void {
        for(const dataItem of this.data) {
            if(dataItem.props.name === course.props.name)
                throw new AlreadyExistsError();
        }

        this.data.push(course);
    }

    update(id: string, props: Partial<Omit<CourseProps, "teacher">>): Course {
        const foundedItem = this.findItemById(id);

        this.data[foundedItem].edit(props);

        return this.data[foundedItem];
    }
    
}