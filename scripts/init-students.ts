import 'reflect-metadata';
import 'tsconfig-paths/register';
import { addStudentDb } from '../src/db/studentDb';
import { getGroupsDb } from '../src/db/groupDb';
import { initializeDataSource } from '../src/db/AppDataSource';

const russianMaleFirstNames = [
  'Александр', 'Дмитрий', 'Максим', 'Сергей', 'Андрей', 'Алексей', 'Артем', 'Илья', 'Кирилл', 'Михаил',
  'Никита', 'Матвей', 'Роман', 'Егор', 'Арсений', 'Иван', 'Денис', 'Евгений', 'Данил', 'Тимур',
  'Владислав', 'Игорь', 'Владимир', 'Павел', 'Руслан', 'Марк', 'Лев', 'Ярослав', 'Федор', 'Георгий',
  'Николай', 'Антон', 'Константин', 'Василий', 'Олег', 'Юрий', 'Борис', 'Григорий', 'Станислав', 'Вадим',
  'Артур', 'Роберт', 'Эдуард', 'Леонид', 'Вячеслав', 'Степан', 'Валентин', 'Геннадий', 'Виктор', 'Семен'
];

const russianMaleLastNames = [
  'Иванов', 'Петров', 'Смирнов', 'Козлов', 'Попов', 'Соколов', 'Лебедев', 'Новиков', 'Морозов', 'Волков',
  'Алексеев', 'Семенов', 'Егоров', 'Павлов', 'Степанов', 'Николаев', 'Орлов', 'Андреев', 'Макаров', 'Никитин',
  'Захаров', 'Зайцев', 'Соловьев', 'Борисов', 'Яковлев', 'Григорьев', 'Романов', 'Воробьев', 'Сергеев', 'Тарасов',
  'Белов', 'Комаров', 'Федоров', 'Михайлов', 'Кузнецов', 'Петухов', 'Медведев', 'Титов', 'Баранов', 'Филиппов',
  'Марков', 'Большаков', 'Суханов', 'Миронов', 'Ширяев', 'Александров', 'Коновалов', 'Шестаков', 'Казаков', 'Ефимов'
];

const russianMaleMiddleNames = [
  'Александрович', 'Дмитриевич', 'Максимович', 'Сергеевич', 'Андреевич', 'Алексеевич', 'Артемович', 'Ильич', 'Кириллович', 'Михайлович',
  'Никитич', 'Матвеевич', 'Романович', 'Егорович', 'Арсеньевич', 'Иванович', 'Денисович', 'Евгеньевич', 'Данилович', 'Тимурович',
  'Владиславович', 'Игоревич', 'Владимирович', 'Павлович', 'Русланович', 'Маркович', 'Львович', 'Ярославович', 'Федорович', 'Николаевич',
  'Антонович', 'Константинович', 'Васильевич', 'Олегович', 'Юрьевич', 'Борисович', 'Григорьевич', 'Станиславович', 'Вадимович', 'Артурович',
  'Робертович', 'Эдуардович', 'Леонидович', 'Вячеславович', 'Степанович', 'Валентинович', 'Геннадьевич', 'Викторович', 'Семенович', 'Георгиевич'
];

function getRandomRussianFio() {
  const firstName = russianMaleFirstNames[Math.floor(Math.random() * russianMaleFirstNames.length)];
  const lastName = russianMaleLastNames[Math.floor(Math.random() * russianMaleLastNames.length)];
  const middleName = russianMaleMiddleNames[Math.floor(Math.random() * russianMaleMiddleNames.length)];
  
  return {
    firstName,
    lastName,
    middleName
  };
}

async function initStudents() {
  try {
    if (!process.env.DB) {
      process.env.DB = 'd:/vki/vki-web-orm.db';
    }
    
    await initializeDataSource();
    console.log('База данных инициализирована');
    console.log('DB path:', process.env.DB);

    const groups = await getGroupsDb();
    console.log(`Найдено групп: ${groups.length}`);

    if (groups.length === 0) {
      console.log('Нет групп в базе данных. Создайте группы сначала.');
      process.exit(0);
    }

    let studentCounter = 1;
    const createdStudents = [];
    const errors = [];

    for (const group of groups) {
      console.log(`\nОбработка группы: ${group.name} (ID: ${group.id})`);
      
      for (let i = 0; i < 10; i++) {
        try {
          const fio = getRandomRussianFio();
          const password = `student${studentCounter}`;
          
          const newStudent = await addStudentDb(
            {
              firstName: fio.firstName,
              lastName: fio.lastName,
              middleName: fio.middleName,
              groupId: group.id,
            },
            password,
          );
          
          createdStudents.push(newStudent);
          console.log(`✓ Добавлен: ${fio.lastName} ${fio.firstName} ${fio.middleName} (пароль: ${password})`);
          studentCounter++;
        }
        catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
          errors.push({
            group: group.name,
            error: errorMessage,
          });
          console.log(`✗ Ошибка при добавлении студента в группу ${group.name}: ${errorMessage}`);
        }
      }
    }

    console.log('\n=== Результаты ===');
    console.log(`Успешно добавлено студентов: ${createdStudents.length}`);
    if (errors.length > 0) {
      console.log(`Ошибок: ${errors.length}`);
      errors.forEach((err) => {
        console.log(`  - ${err.group}: ${err.error}`);
      });
    }

    process.exit(0);
  }
  catch (error) {
    console.error('Критическая ошибка:', error);
    process.exit(1);
  }
}

initStudents();

