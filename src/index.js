import './style.scss';
import './style.css';

const addStudentBtn = document.querySelector('.btn');
const listParent = document.querySelector('.list-group');
let list;
const SERVER_URL = 'http://localhost:3000';

//добавляем студента на сервер
async function serverAddStudent(obj) {
  const response = await fetch(SERVER_URL + '/api/students', {
    method: "POST",
    headers: {'Content-Type': 'aplication/json'},
    body: JSON.stringify(obj),
  })

  let data = await response.json();

  return data;
}

//получаем студента от сервера
async function serverGetStudent() {
  const response = await fetch(SERVER_URL + '/api/students', {
    method: "GET",
    headers: {'Content-Type': 'aplication/json'}
  })

  let data = await response.json();

  return data;
}

//удаляем студента с сервера
async function serverDeletedStudent(obj) {
  const response = await fetch(SERVER_URL + '/api/students' + `/${obj.id}`, {
    method: "DELETE",
  })
}

//поиск студента
async function serverFindStudent(value) {
  const response = await fetch(SERVER_URL + `/api/students` + `?search=${value}`, {
    method: "GET",
    headers: {'Content-Type': 'aplication/json'}
  })

  let data = await response.json();

  return data;
}

let serverData = await serverGetStudent();

// Создаем массив объектов студентов
let studentsList = [];

if(serverData) {
  studentsList = serverData
};

// выводим одного студента в таблицу
function getStudentItem(studentObj) {
  const item = document.createElement('li');
  const list = document.createElement('ul');
  const itemName = document.createElement('li');
  const itemFaculty = document.createElement('li');
  const itembirthday = document.createElement('li');
  const itemstudyStart = document.createElement('li');
  const deleteBtn = document.createElement('button');

  item.classList.add('list-group-item', 'parent-item', 'student');
  list.classList.add('list-group', 'flex-row');
  itemName.classList.add('list-group-item');
  itemFaculty.classList.add('list-group-item');
  itembirthday.classList.add('list-group-item');
  itemstudyStart.classList.add('list-group-item');
  deleteBtn.classList.add('btn', 'btn-danger');
  list.append(itemName, itemFaculty, itembirthday, itemstudyStart, deleteBtn);

  list.querySelectorAll('li')[0].textContent = `${studentObj.surname} ${studentObj.name} ${studentObj.lastname}`;
  list.querySelectorAll('li')[1].textContent = `${studentObj.faculty}`;
  list.querySelectorAll('li')[2].textContent = `${formatDate(new Date(studentObj.birthday))}\n(${getYear(studentObj.birthday)} лет)`;
  list.querySelectorAll('li')[3].textContent = `${studentObj.studyStart} - ${parseInt(studentObj.studyStart) + 4}\n(${getCurs(studentObj.studyStart)})`;
  deleteBtn.textContent = 'Удалить студента';

  item.append(list);

  deleteBtn.addEventListener('click', () => {
    if (confirm('Вы уверены?'))  {
      deleteBtn.parentElement.parentElement.remove();
      serverDeletedStudent(studentObj);
    }
  })

  return item;
}

// создане нового студента
function createNewStudent() {
  const item = document.createElement('li');
  const form = document.createElement('form');
  const fullName = document.createElement('input');
  const faculty = document.createElement('input');
  const birthday = document.createElement('input');
  const studyStart = document.createElement('input');
  const buttonAdd = document.createElement('button');

  item.classList.add('list-group-item', 'parent-item');
  form.classList.add('input-group', 'flex-row');
  fullName.classList.add('form-control', 'new-student');
  faculty.classList.add('form-control', 'new-student');
  birthday.classList.add('form-control', 'new-student');
  studyStart.classList.add('form-control', 'new-student');
  buttonAdd.classList.add('btn', 'btn-success');
  form.append(fullName, faculty, birthday, studyStart, buttonAdd);

  fullName.placeholder = 'Фамилия Имя Отчество';
  faculty.placeholder = 'Факультет';
  birthday.placeholder = 'Дата рождения';
  studyStart.placeholder = ' Год начала обучения';

  birthday.type = 'date';
  birthday.min = '1900-01-01';
  studyStart.type = 'number';
  studyStart.min = '2000';
  const yearNow = new Date();
  studyStart.max = `${parseInt(yearNow.getFullYear())}`;
  buttonAdd.textContent = '+';

  item.append(form);

  return {
    item,
    buttonAdd,
    form,
  }
}
//считываем данные с инпутов для добавления в массив студентов
function readInputsValue(inputsArr) {

  let fullNameArr = inputsArr[0].value.trim().split(' ');
  const name = fullNameArr[1];
  const surname = fullNameArr[0];
  const lastname = fullNameArr[2];

  let newStudent = {
    name: name,
    surname: surname,
    lastname: lastname,
    birthday: inputsArr[2].valueAsDate,
    studyStart: parseInt(inputsArr[3].value),
    faculty: inputsArr[1].value.trim(),
  }

  return newStudent;
}

// валидация инпутов
function validateInputs() {
  const input = document.querySelectorAll('.new-student')
  const result = [];
  input.forEach(function(el) {
    if (!el.value.trim()) {
      el.classList.add('not-validate')
      result.push(false);
    } else {
      el.classList.remove('not-validate')
      result.push(true);
    }
  });
  return result;
}
// функция возвращает возраст студента
function getYear(bornDate) {
  const dateNow = Date.now()
  const yers = Math.floor((dateNow - new Date (bornDate).getTime())/ (1000 * 31536000));
  return yers
}
//функция возвращает курс студента
function getCurs(studyStart) {
  const dateNow = new Date()
  const curs = dateNow.getFullYear() - studyStart;
  if (curs > 4) {
    return 'Закончил'
  } else {
    return `${curs} курс`;
  }
}

//форматирование даты
function formatDate(date) {

  let dd =  date.getDate();
  if (dd < 10) dd = '0' + dd;

  let mm = date.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;

  let yy = date.getFullYear();
  if (yy < 10) yy = '0' + yy;

  return dd + '.' + mm + '.' + yy;
}

// отрисовка всех студентовсок студентов
function renderStudentsTable(newStudentsArray) {

  // let nameValue = document.querySelectorAll('.filter-input')[0].value.toUpperCase();
  // let lowCase = nameValue.substr(1).toLowerCase();
  // nameValue = nameValue.substr(0, 1) + lowCase;
  // let facultyValue = document.querySelectorAll('.filter-input')[1].value.toUpperCase();
  // lowCase = facultyValue.substr(1).toLowerCase();
  // facultyValue = facultyValue.substr(0, 1) + lowCase;
  // const studyStartValue = document.querySelectorAll('.filter-input')[2].value;
  // const endStudyValue = document.querySelectorAll('.filter-input')[3].value;

  // let newStudentsArray = [...studentsArray];
  // if (nameValue !== '') {
  //   let prop;
  //   for (let i = 0; i < newStudentsArray.length; i++) {
  //     if (newStudentsArray[i].name.includes(nameValue)) {
  //       prop = 'name'
  //     } else if (newStudentsArray[i].surname.includes(nameValue)) {
  //       prop = 'surname'
  //     } else if (newStudentsArray[i].lastname.includes(nameValue)){
  //       prop = 'lastname'
  //     }
  //   }
  //   newStudentsArray = filter(newStudentsArray, `${prop}`, nameValue);

  // };
  // if (facultyValue !== '') newStudentsArray = filter(newStudentsArray, 'faculty', facultyValue);
  // if (studyStartValue !== '') newStudentsArray = filter(newStudentsArray, 'studyStart',  studyStartValue);
  // if (endStudyValue !== '') newStudentsArray = filter(newStudentsArray, `studyStart`, `${endStudyValue - 4}`)

  for (let i = 0; i < newStudentsArray.length; i++) {
    listParent.append(getStudentItem(newStudentsArray[i]));
  }
}

//  создаем нового студента в список
addStudentBtn.addEventListener('click', () => {
  const newItem = createNewStudent().item;
  listParent.prepend(newItem);
  setTimeout(() => {
    newItem.firstElementChild.style.cssText = 'opacity: 1';
  }, 100);
  addStudentBtn.disabled = 'disabled'

  const btnAddStudentList = document.querySelector('.btn-success');

  btnAddStudentList.addEventListener('click', async function (el) {
    el.preventDefault();
    if (!validateInputs().includes(false)) {
      const obj = readInputsValue(document.querySelectorAll('.form-control'));
      let serverData = await serverAddStudent(obj);
      serverData.birthday = new Date (serverData.birthday);
      serverData.studyStart = parseInt(serverData.studyStart)
      studentsList.push(serverData);
      listParent.append(getStudentItem(serverData));
    }
    document.querySelectorAll('.form-control').forEach(function(el) {
      el.value = ''
    })
  })
});

// сортируем список по нажатию на хедер таблицы
function sortArray(arr, property, dir = false) {
  return arr.sort(function(a,b) {
    if (property == 'birthday') {
      dir = false;
    }
    if (property == 'fullName') {
      property = 'surname';
    }

    let ifDir = a[property] < b[property];
    if (dir == false) {
      ifDir = a[property] > b[property]; // сортировка по возрастанию
    }
    if (ifDir == true) return -1; // сортировка по убыванию
  });
}
// меняем местами студентов
function replaceItem() {
  for (let i = 0; i < document.querySelectorAll('.student').length; i++) {
    document.querySelectorAll('.student')[i].replaceWith(getStudentItem(studentsList[i]));
   }
   return;
}

document.querySelectorAll('.header').forEach(function(el) {
  el.addEventListener('click', () => {
    let id = el.id; // считываем id атрибут в html коде
    sortArray(studentsList, id, true);
    replaceItem();
  })
})

// функция фильтрации студентов

function filter(arr, prop, value) {
  let result = [],
    copy = [...arr];
  for (const item of copy) {
    if (String(item[prop]).includes(value) == true) {
      result.push(item)
    }
  }
  return result;
}

document.querySelector('.filter').addEventListener('submit', async function(event) {
  event.preventDefault();})
//   document.querySelectorAll('.student').forEach(function(el) {
//     el.remove();
//   })
//   document.querySelectorAll('.filter-input').forEach(async function(el) {
//     if (!el.value == '') {
//       const data = await serverFindStudent(el.value);
//       renderStudentsTable(data);
//       console.log(data)
//     }
//   })
// })

document.querySelectorAll('.filter-input').forEach(function(el) {
  el.addEventListener('input', async () => {
      setTimeout(async () => {
        document.querySelectorAll('.student').forEach(function(el) {
          el.remove();
        });
        let data = await serverFindStudent(el.value);
        let prop = el.dataset.name;
        let value;
        value = el.value.toUpperCase();
        let lowValue = value.substr(1).toLowerCase();
        value = value.substr(0, 1) + lowValue;
        console.log(value)

        for (let i=0; i< data.length; i++) {
          if ([data[i].name].includes(value)) {
            prop = 'name';
          } else if ([data[i].surname].includes(value)) {
            prop = 'surname';
          } else if ([data[i].lastname].includes(value)) {
            prop = 'lastname';
          }
        }

        if (prop === 'studyEnd') {
          prop = 'studyStart';
          value = `${parseInt(el.value) - 4}`;
          console.log(value)
          data = await serverFindStudent(value)
        }
        studentsList = data;

        renderStudentsTable(filter(studentsList, prop, value));
      }, 300);
  });
});

renderStudentsTable(studentsList);
