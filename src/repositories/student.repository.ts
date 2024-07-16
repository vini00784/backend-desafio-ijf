import { Student, StudentProps } from 'src/domain/entities/student';
import { Repository } from './repository';
import { AlreadyExistsError } from 'src/errors/already-exists.error';

export class StudentRepository extends Repository<Student, StudentProps> {
  store(student: Student): void {
    for (const dataItem of this.data) {
      if (student.props.username === dataItem.props.username)
        throw new AlreadyExistsError();
    }

    if (this.data.includes(student)) throw new AlreadyExistsError();
    else this.data.push(student);
  }

  update(id: string, props: StudentProps): Student {
    const foundedItem = this.findItemById(id);

    this.data[foundedItem].edit(props);

    return this.data[foundedItem];
  }
}
