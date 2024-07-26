(function () {
  let clientsList = [];
  let clientObjID;

  //Получаем список клиентов с сервера
  async function getClientsListOnServ() {
    const response = await fetch('http://localhost:3000/api/clients');
    const clientsListServ = await response.json();

    if (response.status >= 500) tablePlug('Что-то пошло не так...');

    clientsListServ.forEach(clientsObj => {
      let clientsObjInp = getClientsItem(clientsObj);
      clientsList.push(clientsObjInp);
    });
    sortClients(clientsListServ, 'id');

    if (clientsListServ.length === 0) tablePlug('Добавьте первого клиента');

    console.log(clientsListServ);

    //Заглушка для пустого окна и ошибки с сервера
    function tablePlug(text) {
      const tbody = document.querySelector('.table__tbody');
      const tablePlugTr = document.createElement('tr');

      const tablePlugTd = document.createElement('td');
      tablePlugTr.append(tablePlugTd);
      tablePlugTd.classList.add('table__plug', 'text-reset', 'thead-text');
      tablePlugTd.textContent = text;
      tablePlugTd.setAttribute('colspan', '6');

      tbody.append(tablePlugTr);
    }

    for (let i = 0; i < clientsListServ.length; i++) {
      const hash = window.location.hash;

      if (hash === `#${clientsListServ[i].id}`) {
        clientObjID = clientsListServ[i].id;
        console.log(modalWrapper);
        createModalWindow('Изменить данные', undefined, 'Удалить клиента', 3, undefined, 'change');
        fillForm(clientsListServ[i]);
      }
    }
  }

  const mainText = 'main-text';
  const contactBtnSvg = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill="#B0B0B0" />
	</svg>`;
  const contactBtnActive = 'contact__btn--active';

  let counter = 0;
  //Создаем функцию добавления контакта
  function createContacts() {
    let modalBtn = document.querySelector('.modal__btn');

    //Классы
    const modalBtnPadding = 'modal__btn--padding';
    const modalBtnNone = 'modal__btn--none';
    const contactPadding = 'contact--padding';
    const mb25 = 'mb-25';

    counter++;

    const contact = document.querySelector('.contact');
    contact.classList.add(contactPadding);

    modalBtn.classList.add(modalBtnPadding);
    let contactBlock = document.createElement('div');
    contactBlock.classList.add('contact__block', 'flex');

    const contactSelectDiv = document.createElement('div');
    contactSelectDiv.classList.add('contact__wrapper');
    const contactSelect = document.createElement('select');
    contactSelect.classList.add('contact__select', 'thead-text', 'main-text--333');
    contactSelect.name = 'contact';

    let option;
    const valueOptions = { plug: '-Тип контакта-', phone: 'Телефон', vk: 'Vk', email: 'Email', fb: 'Facebook', other: 'Другое' };

    for (let key in valueOptions) {
      option = document.createElement('option');
      option.value = key;
      option.text = valueOptions[key];

      contactSelect.append(option);
      contactSelectDiv.append(contactSelect);
    }

    const contactInput = document.createElement('input');
    contactInput.classList.add('contact__input', 'input-reset', 'main-text', 'main-text--weight', 'contact__input--placeholder');
    contactInput.placeholder = 'Введите данные контакта';

    const optionPlug = contactSelect.querySelector(`option[value="${contactSelect.value}"]`);

    if (optionPlug) {
      contactInput.disabled = true;
    }

    const contactBtn = document.createElement('button');
    contactBtn.classList.add('btn-reset', 'contact__btn');
    contactBtn.innerHTML = contactBtnSvg;

    contactBlock.append(contactSelectDiv);
    contactBlock.append(contactInput);
    contactBlock.append(contactBtn);
    contact.append(contactBlock);

    //Добавляем кнопку-крестик форме ввода контакта и если выбран пункт phone заполняем input
    contactInput.oninput = function (e) {
      e.target.value ? contactBlock.lastChild.classList.add(contactBtnActive) : contactBlock.lastChild.classList.remove(contactBtnActive);
    };

    //Изменим placeholder при выборе пункта Другое
    contactSelect.oninput = function () {
      if (contactSelect.value === 'other') {
        contactInput.placeholder = 'Тип контакта: Значение контакта';
      } else {
        contactInput.placeholder = 'Введите данные контакта';
      };

      if (contactSelect.value === 'phone') {
        contactInput.setAttribute('type', 'tel');
        contactInput.value = '+7';
      } else {
        contactInput.removeAttribute('type');
        contactInput.value = '';
      }

      if (contactSelect.value !== 'plug') {
        contactInput.disabled = false;
      } else {
        contactInput.disabled = true;
      }
    };

    //Удаляем поле ввода контакта при нажатии на кнопку-крестик
    contactBtn.addEventListener('click', function () {
      counter--;
      contactBlock.remove();
      console.log(counter);
      if (counter < 1) {
        contact.classList.remove(contactPadding);
        modalBtn.classList.remove(modalBtnPadding);
      }
      deleteContacCreateBtn();
    })

    //Удаляем кнопку добавления контакта, если их в форме уже 10
    function deleteContacCreateBtn() {
      if (counter === 10) {
        modalBtn.classList.add(modalBtnNone);
        contact.classList.add(mb25);
      } else {
        contact.classList.remove(mb25);
        modalBtn.classList.remove(modalBtnNone);
      }
    }
    deleteContacCreateBtn();
  }

  //Преобразим даты в нужный формат
  function dateFormat(date) {
    let d = new Date(date),
      month = String(d.getMonth() + 1),
      day = String(d.getDate()),
      year = String(d.getFullYear()),
      hours = String(d.getHours()),
      minutes = String(d.getMinutes());

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (hours.length < 2) hours = '0' + hours;
    if (minutes.length < 2) minutes = '0' + minutes;

    return [[day, month, year].join('.'), [hours, minutes].join(':')];
  }

  //Создаем функцию по добавлению одного элемента в DOM
  async function getClientsItem(obj) {
    let theadTr = document.querySelector('.table__title');
    let tbody = document.querySelector('.table__tbody');

    let tr = document.createElement('tr');
    tr.classList.add('table__tr');
    let td;

    let changeBtn = document.createElement('button');
    let deleteBtn = document.createElement('button');

    for (let i = 0; i < theadTr.childElementCount; i++) {
      td = document.createElement('td');
      td.classList.add('text-reset', mainText, 'table__td', `td-${i}`);
      tr.append(td);
    }


    for (let node of tr.childNodes) {
      if (node.classList.contains('td-0')) {
        node.textContent = obj['id'];

      } else if (node.classList.contains('td-1')) {
        node.textContent = `${obj['surname']} ${obj['name']} ${obj['lastName']}`;

      } else if (node.classList.contains('td-2')) {
        node.innerHTML = `${dateFormat(obj['createdAt'])[0]} <span>${dateFormat(obj['createdAt'])[1]}</span>`;
        const hours = node.lastChild;
        hours.classList.add('main-text--b0b0b0');

      } else if (node.classList.contains('td-3')) {
        node.textContent = dateFormat(obj['updatedAt']);
        node.innerHTML = `${dateFormat(obj['updatedAt'])[0]} <span>${dateFormat(obj['updatedAt'])[1]}</span>`;
        const hours = node.lastChild;
        hours.classList.add('main-text--b0b0b0');

      } else if (node.classList.contains('td-4')) {
        createContactIcon(node);

      } else if (node.classList.contains('td-5')) {
        const changeBtnSvg = `<svg class="btn__svg" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M0 9.49996V12H2.5L9.87333 4.62662L7.37333 2.12662L0 9.49996ZM11.8067 2.69329C12.0667 2.43329 12.0667 2.01329 11.8067 1.75329L10.2467 0.193291C9.98667 -0.066709 9.56667 -0.066709 9.30667 0.193291L8.08667 1.41329L10.5867 3.91329L11.8067 2.69329Z" fill="#9873FF"/>
				</svg>`;

        changeBtn.innerHTML = `<span class="btn__span">${changeBtnSvg}</span> Изменить`;
        changeBtn.classList.add('btn-reset', 'btn', 'btn__change', 'mr-30');

        let deleleBtnSvg;
        if (contactBtnSvg.includes('#B0B0B0')) {
          deleleBtnSvg = contactBtnSvg.split('#B0B0B0').join('#F06A4D');
        }

        deleteBtn.innerHTML = `${deleleBtnSvg} Удалить`;
        deleteBtn.classList.add('btn-reset', 'btn', 'btn__delete');

        node.append(changeBtn);
        node.append(deleteBtn);
      }
    }

    const response = await fetch(`http://localhost:3000/api/clients/${obj.id}`);
    const clientObjServ = await response.json();

    //Изменяем данные клиента
    changeBtn.addEventListener('click', function () {
      const btnSpan = document.querySelector('.btn__span');
      const btnSvg = document.querySelector('.btn__svg');

      btnSvg.classList.add('modal__btn--none');
      changeBtn.disabled = true;
      btnSpan.classList.add('btn__loading');

      createModalWindow('Изменить данные', undefined, 'Удалить клиента', 3, undefined, 'change');
      fillForm(clientObjServ);

      btnSvg.classList.remove('modal__btn--none');
      changeBtn.disabled = false;
      btnSpan.classList.remove('btn__loading');

      clientObjID = clientObjServ.id;
      window.location.hash = `${clientObjID}`;

      const modalDelete = document.querySelector('.modal__delete');
      modalDelete.setAttribute('data-delete', 'delete');
    });

    //Обработчик кнопки Удалить
    deleteBtn.addEventListener('click', function () {
      createModalWindow('Удалить клиента', 'Удалить', undefined, 0, 'display-inline-block', 'delete');

      clientObjID = clientObjServ.id;
    });

    //Создаем иконку вместо контакта
    function createContactIcon(prop) {
      const phoneIcon = `<svg data-type="Телефон" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="8" cy="8" r="8" fill="#9873FF"/>
			<path d="M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111 5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556 12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z" fill="white"/>
			</g>
			</svg>`;
      const vkIcon = `<svg data-type="Vk" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97311 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z" fill="#9873FF"/>
			</svg>`;
      const fbIcon = `<svg data-type="Facebook" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z" fill="#9873FF"/>
			</svg>`;
      const emailIcon = `<svg data-type="Email" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12 5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2 6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z" fill="#9873FF"/>
			</svg>`;
      const otherIcon = `<svg data-type="Другое" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8C13 10.76 10.76 13 8 13C5.24 13 3 10.76 3 8ZM9.5 6C9.5 5.17 8.83 4.5 8 4.5C7.17 4.5 6.5 5.17 6.5 6C6.5 6.83 7.17 7.5 8 7.5C8.83 7.5 9.5 6.83 9.5 6ZM5 9.99C5.645 10.96 6.75 11.6 8 11.6C9.25 11.6 10.355 10.96 11 9.99C10.985 8.995 8.995 8.45 8 8.45C7 8.45 5.015 8.995 5 9.99Z" fill="#9873FF"/>
			</svg>`;

      let svgObj = { phone: phoneIcon, vk: vkIcon, fb: fbIcon, email: emailIcon, other: otherIcon };
      let contactDiv;
      let contactTag;

      for (let i = 0; i < obj['contacts'].length; i++) {
        let contactType = obj['contacts'][i]['type'];

        if (obj['contacts'].length !== 0) {
          prop.classList.add('flex', 'gap-7');
          contactDiv = document.createElement('div');
          contactDiv.classList.add('table__contact');
          contactDiv.setAttribute('data-num', i);

          contactDiv.setAttribute('data-type', contactType);
          contactDiv.setAttribute('data-value', `${obj['contacts'][i]['value']}`);

          let dataType = contactDiv.getAttribute('data-type');
          let dataValue = contactDiv.getAttribute('data-value');

          for (let key in svgObj) {
            let svgType = svgObj[key].includes(dataType);

            if (contactType === dataType && svgType) {
              contactDiv.innerHTML = svgObj[key];
              prop.append(contactDiv);
            }
          }

          dataType === 'Другое' ? contactTag = createContactTag(dataValue) : contactTag = createContactTag(`${dataType}: ${dataValue}`);
          contactDiv.append(contactTag);
          if (contactDiv.getAttribute('data-num') > 3) contactDiv.classList.add('display-none');
        }
      }

      //Если иконок больше 4х, скрывем их и добавляем круглую кнопку
      let objContactsLength = obj['contacts'].length;
      if (objContactsLength > 3) {
        let moreContactsBtn = document.createElement('button');
        moreContactsBtn.classList.add('btn-reset', 'table__btn',);

        if (objContactsLength - 4 !== 0) {
          moreContactsBtn.textContent = `+${objContactsLength - 4}`;
          prop.append(moreContactsBtn);
        }

        //Создаем обработчик нажатия для кнопки, которая покажет все контакты
        moreContactsBtn.addEventListener('click', function () {
          let contactNone = document.querySelectorAll('.display-none');
          for (let none of contactNone) {
            let moreContactsBtnParent = moreContactsBtn.parentElement;
            if (moreContactsBtnParent === none.parentElement) {
              none.classList.remove('display-none');
            }
          }
          moreContactsBtn.classList.add('display-none');
        })
      }

    }

    tbody.append(tr);
    return tr;
  }

  //Создаем табличку при наведении на контакт
  function createContactTag(data) {
    let contactTag = document.createElement('div');
    contactTag.classList.add('table__tag', 'tag', 'text-reset');
    const tagText = 'tag__text';

    const contactValue = document.createElement('a');
    const contactType = document.createElement('span');

    contactType.classList.add(tagText);
    contactType.textContent = `${data.split(':').shift()}: `;

    contactValue.classList.add(tagText, 'tag__text--color');
    contactValue.textContent = data.split(':').pop();
    console.log(contactType.textContent)

    if (contactType.textContent.includes('Телефон')) {
      contactValue.href = `tel:${contactValue.textContent.trim()}`;
    } else if (contactType.textContent.includes('Email')) {
      contactValue.href = `mailto:${contactValue.textContent.trim()}`;
    } else {
      contactValue.href = contactValue.textContent.trim();
    }

    contactTag.append(contactType);
    contactTag.append(contactValue);

    return contactTag;
  }

  //Функция очистки DOM дерева
  function cleanDOMElements() {
    let trAll = document.querySelectorAll('.table__tr');
    for (let i = 0; i < trAll.length; i++) {
      trAll[i].remove();
    }
  }

  //Функция удаления hash
  function deleteHash() {
    if (window.history.pushState) {
      window.history.pushState('', '/', window.location.pathname)
    } else {
      window.location.hash = '';
    }
  }

  //Функция размещения клиентов в DOM
  function renderClientsTable() {
    cleanDOMElements();
    getClientsListOnServ();
  }

  //Функция колеса загрузки
  window.onload = function () {
    const tbody = document.querySelector('.table__tbody');
    tbody.classList.add('loading--hidding');
    renderClientsTable();
    tbody.classList.add('loading');
    tbody.classList.remove('loading--hidding');
  }


  //Добавляем модальное окно на страницу
  function createModalWindow(title, submit = 'Сохранить', button = 'Отмена', formLength = 3, display = 'display-none', dataEvent = 'new') {
    let modalForm = document.querySelector('#form');
    let plusIcon = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.00001 3.66665C6.63334 3.66665 6.33334 3.96665 6.33334 4.33331V6.33331H4.33334C3.96668 6.33331 3.66668 6.63331 3.66668 6.99998C3.66668 7.36665 3.96668 7.66665 4.33334 7.66665H6.33334V9.66665C6.33334 10.0333 6.63334 10.3333 7.00001 10.3333C7.36668 10.3333 7.66668 10.0333 7.66668 9.66665V7.66665H9.66668C10.0333 7.66665 10.3333 7.36665 10.3333 6.99998C10.3333 6.63331 10.0333 6.33331 9.66668 6.33331H7.66668V4.33331C7.66668 3.96665 7.36668 3.66665 7.00001 3.66665ZM7.00001 0.333313C3.32001 0.333313 0.333344 3.31998 0.333344 6.99998C0.333344 10.68 3.32001 13.6666 7.00001 13.6666C10.68 13.6666 13.6667 10.68 13.6667 6.99998C13.6667 3.31998 10.68 0.333313 7.00001 0.333313ZM7.00001 12.3333C4.06001 12.3333 1.66668 9.93998 1.66668 6.99998C1.66668 4.05998 4.06001 1.66665 7.00001 1.66665C9.94001 1.66665 12.3333 4.05998 12.3333 6.99998C12.3333 9.93998 9.94001 12.3333 7.00001 12.3333Z" />
    </svg>`;
    modalBg.classList.add('modal__bg--active');
    modalWrapper.classList.add('modal__center');
    modalWrapper.setAttribute('data-event', dataEvent);

    const modalTitle = document.querySelector('.modal__title');
    modalTitle.classList.add('mb-32');
    modalTitle.textContent = title;

    const modalText = document.createElement('p');
    modalText.classList.add('main-text', 'text-reset', 'mb-25', 'modal__text', display);
    modalText.textContent = 'Вы действительно хотите удалить данного клиента?';
    modalTitle.after(modalText);

    const modalSubmit = document.querySelector('.modal__submit');
    modalSubmit.innerHTML = `<span class="modal__loading modal__loading--hide"></span> ${submit}`;

    const modalDelete = document.querySelector('.modal__delete');
    modalDelete.value = button;

    let modalInput;
    let modalLabel;
    for (let i = 0; i < formLength; i++) {
      const modalBlock = document.createElement('div');
      modalBlock.classList.add('modal__block', 'mb-32');
      modalBlock.id = `modal-block${3 - i}`;

      modalInput = document.createElement('input');
      modalLabel = document.createElement('label');
      modalInput.classList.add('modal__input', 'main-text', 'input-reset');
      modalInput.type = 'text';
      modalLabel.classList.add('modal__label');

      if (modalBlock.id === 'modal-block1') {
        modalInput.name = 'surname';
        modalInput.id = 'input-surname';
        modalLabel.innerHTML = `Фамилия<span class="main-text--color">*</span>`;

      } else if (modalBlock.id === 'modal-block2') {
        modalInput.name = 'name';
        modalInput.id = 'input-name';
        modalLabel.innerHTML = `Имя<span class="main-text--color">*</span>`;

      } else if (modalBlock.id === 'modal-block3') {
        modalInput.name = 'lastname';
        modalInput.id = 'input-lastname';
        modalLabel.textContent = 'Отчество';
      }

      modalLabel.setAttribute('for', modalInput.id);

      modalBlock.append(modalInput);
      modalBlock.append(modalLabel);
      modalForm.prepend(modalBlock);
    }

    if (modalText.classList.contains('display-none')) {
      const contact = document.createElement('div');
      const modalBlockLast = document.querySelector('#modal-block3');
      const modalBtn = document.createElement('button');

      contact.classList.add('contact');
      modalBlockLast.after(contact);

      modalBtn.classList.add('modal__btn', 'btn-reset', 'mb-25');
      modalBtn.type = 'button';
      modalBtn.innerHTML = `${plusIcon} <span class="text-reset main-text main-text--weight">Добавить контакт</span>`;
      contact.after(modalBtn);
    } else {
      modalWrapper.classList.add('modal__wrapper--center');
      modalTitle.classList.remove('mb-32');
      modalTitle.classList.add('mb-11');
    }

  }

  window.addEventListener('hashchange', function () {
    console.log('hash изменился', location.hash);
  });

  //Добавляем модальное окно НОВОГО клиента на страницу
  let modalWrapper = document.querySelector('.modal__wrapper');
  let modalBg = document.querySelector('.modal__bg');
  let mainBtn = document.querySelector('.main__btn');

  mainBtn.addEventListener('click', function () {
    createModalWindow('Новый клиент');
    changePositionPlaceholder();
    document.querySelector('.modal__btn').addEventListener('click', createContacts);
  });

  //Закрываем модальное окно с помощью крестика, кнопки Отмена или серого фона
  document.querySelector('.modal__bg').addEventListener('click', function (e) {
    let target = e.target;

    if (target.className === 'modal__close--img' || target.classList.contains('modal__delete') || target.classList.contains('modal__bg')) {
      clearForm();
    }

    if (target.classList.contains('modal__delete') && target.getAttribute('value') === 'Удалить клиента') {
      createModalWindow('Удалить клиента', 'Удалить', undefined, 0, 'display-inline-block', 'delete');
    }

  });

  document.querySelector('.modal__close--img').addEventListener('click', function () {
    deleteHash();
  });

  // Очищаем форму после ввода нового клиента
  function clearForm() {
    const inputSurname = document.querySelector('#input-surname');
    const inputName = document.querySelector('#input-name');
    const inputLastname = document.querySelector('#input-lastname');
    const modalText = document.querySelector('.modal__text');

    const contactBlock = document.querySelectorAll('.contact__block');
    for (let block of contactBlock) {
      block.remove();
    }

    const clientId = document.querySelector('.modal__id');
    clientId?.remove();

    const modalBlockAll = document.querySelectorAll('.modal__block');
    for (let block of modalBlockAll) {
      block.remove();
    }

    if (modalText?.classList.contains('display-none')) {
      const contact = document.querySelector('.contact');
      contact.remove();

      const modalBtn = document.querySelector('.modal__btn');
      modalBtn.remove();

      inputSurname.value = '';
      inputName.value = '';
      inputLastname.value = '';

      const modalLabel = document.querySelectorAll('.modal__label');
      for (let label of modalLabel) {
        label.classList.remove('modal__label--focus');
      }
    }

    modalText?.remove();
    const modalTitle = document.querySelector('.modal__title');
    modalTitle.classList.remove('mb-11');

    const errorText = document.querySelector('.modal__error');
    errorText?.remove();

    modalBg.classList.remove('modal__bg--active');
    modalWrapper.classList.remove('modal__center', 'modal__wrapper--center');
    modalWrapper.removeAttribute('data-event');
  }

  //Добавляем сообщение об ошибке и удаляем его, если юзер начал изменения
  function invalidDataErrorText(error) {
    const modalBtn = document.querySelector('.modal__btn');

    const errorText = document.createElement('p');
    errorText.classList.add('modal__error', 'text-reset');
    errorText.textContent = error;

    modalBtn.after(errorText);

    if (errorText) {
      modalBtn.classList.remove('mb-25');
    }

    const inputSurname = document.querySelector('#input-surname');
    const inputName = document.querySelector('#input-name');
    const inputContacts = document.querySelectorAll('.contact__input');

    if (errorText) {
      inputSurname.oninput = function () {
        inputSurname.classList.remove('modal__input--invalid');
        modalBtn.classList.add('mb-25');
        errorText.remove();
      }

      inputName.oninput = function () {
        inputName.classList.remove('modal__input--invalid');
        modalBtn.classList.add('mb-25');
        errorText.remove();
      }

      for (let contact of inputContacts) {
        contact.oninput = function () {
          contact.classList.remove('contact__input--invalid');
          modalBtn.classList.add('mb-25');
          errorText.remove();
        }

      }
    }

  }

  //Заполняем форму данными клиента (Изменить)
  function fillForm(obj) {
    const modalTitle = document.querySelector('.modal__title');
    modalTitle.classList.add('mr-9', 'display-inline-block');

    const clientId = document.createElement('span');
    clientId.classList.add('text-reset', 'thead-text', 'modal__id');
    clientId.textContent = `ID: ${obj.id}`;
    modalTitle.after(clientId);

    const modalLabel = document.querySelectorAll('.modal__label');
    for (let label of modalLabel) {
      label.classList.add('modal__label--focus')
    }

    const inputSurname = document.querySelector('#input-surname');
    const inputName = document.querySelector('#input-name');
    const inputLastname = document.querySelector('#input-lastname');

    inputSurname.value = obj.surname;
    inputName.value = obj.name;
    inputLastname.value = obj.lastName;

    const contacts = obj.contacts;
    const selectArr = [];
    const inputArr = [];

    for (let i = 0; i < contacts.length; i++) {
      createContacts();
      const select = contacts[i]['type'];
      const input = contacts[i]['value'];
      selectArr.push(select);
      inputArr.push(input);
    }

    const contactBlock = document.querySelectorAll('.contact__block');
    for (let contact of contactBlock) {
      contact.lastChild.classList.add(contactBtnActive); //Делаю видимой кнопку-крестик у поля ввода контакта
    }

    //Получаю данные контактов с сервера в форму
    const selectContact = document.querySelectorAll('.contact__select');
    selectContact.forEach((select, index) => {
      select.options[select.selectedIndex].text = contacts[index]['type'];
    });

    const inputContact = document.querySelectorAll('.contact__input');
    inputContact.forEach((input, index) => {
      input.value = contacts[index]['value'];
    });

    document.querySelector('.modal__btn').addEventListener('click', createContacts);
  }

  //Обработчик формы ввода клиента и изменение положения placeholder
  function changePositionPlaceholder() {
    const modalInput = document.querySelectorAll('.modal__input');
    const modalLabel = document.querySelectorAll('.modal__label');

    for (let inp of modalInput) {
      let inpId = inp.getAttribute('id');

      inp.onfocus = function () {
        for (let label of modalLabel) {
          let labelFor = label.getAttribute('for');
          if (inpId === labelFor) label.classList.add('modal__label--focus')
        }
      }

      inp.onblur = function () {
        for (let label of modalLabel) {
          let labelFor = label.getAttribute('for');
          if (inpId === labelFor && !inp.value) label.classList.remove('modal__label--focus');
        }
      }

    }
  }



  //Добавляем клиентов из формы на сервер
  document.querySelector('.modal__form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const dataEvent = document.querySelector('.modal__wrapper').getAttribute('data-event');
    const modalSubmit = document.querySelector('.modal__submit');
    const modalLoading = document.querySelector('.modal__loading');

    const inputSurname = document.querySelector('#input-surname');
    const inputName = document.querySelector('#input-name');
    const inputLastname = document.querySelector('#input-lastname');
    const selectContacts = document.querySelectorAll('.contact__select');
    const inputContacts = document.querySelectorAll('.contact__input');
    let clientsObjInp = {};

    if (dataEvent === 'new' || dataEvent === 'change') {
      const surname = inputSurname.value.trim();
      const name = inputName.value.trim();
      const lastname = inputLastname.value.trim();

      clientsObjInp.surname = surname[0]?.toUpperCase() + surname?.slice(1).toLowerCase();
      clientsObjInp.name = name[0]?.toUpperCase() + name.slice(1)?.toLowerCase();

      if (!lastname) {
        clientsObjInp.lastname = '';
      } else {
        clientsObjInp.lastname = lastname[0].toUpperCase() + lastname.slice(1).toLowerCase();
      }

      if (!inputSurname.value) {
        inputSurname.classList.add('modal__input--invalid');
        invalidDataErrorText('Данные неполны: Введите фамилию клиента');
        return;
      }

      if (!inputName.value) {
        inputName.classList.add('modal__input--invalid');
        invalidDataErrorText('Данные неполны: Введите имя клиента');
        return;
      }

      const selectArr = [];
      const inputArr = [];
      const contacts = [];

      for (let select of selectContacts) {
        let selectN = select.options[select.selectedIndex].text;
        selectArr.push(selectN);
      }

      for (let input of inputContacts) {
        const contact = input.value;
        inputArr.push(contact);
      }

      for (let i = 0; i < selectArr.length; i++) {
        const contactObj = {};
        contactObj.type = selectArr[i];
        contactObj.value = inputArr[i];
        contacts.push(contactObj);
      }

      //Валидация контактов
      for (let i = 0; i < contacts.length; i++) {

        if (selectContacts[i].value !== 'plug' && inputContacts[i].value === '') {
          inputContacts[i].classList.add('contact__input--invalid');
          invalidDataErrorText('Введите данные контакта');
          return;
        }

        if (contacts[i].type === 'Email') {
          const checkEmail = /^[\w]{1}[\w-\.]*@[\w-]+\.[a-z]{2,4}$/i;
          const validData = checkEmail.test(contacts[i].value);
          if (!validData) {
            inputContacts[i].classList.add('contact__input--invalid');
            invalidDataErrorText('Введите e-mail в формате: abc@abc.ru');
            return;
          }
        } else if (contacts[i].type === 'Телефон'){
          const checkPhone = /^\+7[1-9]{10}$/;
          const validData = checkPhone.test(contacts[i].value);
          if (!validData || contacts[i].value.length < 10) {
            inputContacts[i].classList.add('contact__input--invalid');
            invalidDataErrorText('Введите телефон в формате: +79991234567');
            return;
          }

        }
      }

      clientsObjInp.contacts = contacts;
      console.log(clientsObjInp);
    }

    if (dataEvent === 'new') {
      modalSubmit.disabled = true;
      modalLoading.classList.remove('modal__loading--hide');

      const response = await fetch('http://localhost:3000/api/clients', {
        method: 'POST',
        body: JSON.stringify({
          name: clientsObjInp.name,
          surname: clientsObjInp.surname,
          lastName: clientsObjInp.lastname,
          contacts: clientsObjInp.contacts,
          owner: 'Muha',
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      modalSubmit.disabled = false;
      modalLoading.classList.add('modal__loading--hide');

      const clientsObj = response.json();
      clientsList.push(clientsObj);

    } else if (dataEvent === 'change') {
      modalSubmit.disabled = true;
      modalLoading.classList.remove('modal__loading--hide');

      console.log(clientObjID);

      await fetch(`http://localhost:3000/api/clients/${clientObjID}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: clientsObjInp.name,
          surname: clientsObjInp.surname,
          lastName: clientsObjInp.lastname,
          contacts: clientsObjInp.contacts,
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      modalSubmit.disabled = false;
      modalLoading.classList.add('modal__loading--hide');

      deleteHash();

    } else if (dataEvent === 'delete') {
      const tr = document.querySelector('.table__tr');
      if (e.target) {
        tr.remove();
        await fetch(`http://localhost:3000/api/clients/${clientObjID}`, {
          method: 'DELETE',
        });
      }
    }
    renderClientsTable();
    clearForm();
  });

  //Функция поиска
  const headerInput = document.querySelector('.header__input');
  async function clientSearch() {
    const value = headerInput.value.trim()
    const value1 = value[0]?.toUpperCase() + value.slice(1)?.toLowerCase();

    const url = new URL('http://localhost:3000/api/clients');
    url.searchParams.set('search', value1);

    const response = await fetch(url);
    const clientsListServ = await response.json();

    cleanDOMElements();
    clientsListServ.forEach(clientObj => {
      let clientsObjInp = getClientsItem(clientObj);
      clientsList.push(clientsObjInp);
    });
    if (!value) {
      getClientsListOnServ();
    }
  }

  //Задержка срабатывания input
  function debounce(func, timer) {
    return function perform(...args) {
      let previousCall = this.lastCall;
      this.lastCall = Date.now();
      if (previousCall && this.lastCall - previousCall <= timer) {
        clearTimeout(this.lastCallTimer);
      }

      this.lastCallTimer = setTimeout(() => func(...args), timer);
    }
  }

  const debouncedSearch = debounce(clientSearch, 300);

  headerInput.addEventListener('input', debouncedSearch);

  //Функция сортировки клиентов
  function sortClients(arr, prop, dir = false) {

    let result = arr.sort(function (a, b) {

      let conditionDir = a[prop] < b[prop];
      if (dir == true) conditionDir = a[prop] > b[prop];
      if (conditionDir == true) return -1;
      if (a[prop] == b[prop]) return 0;
      if (a[prop] > b[prop]) return 1;
    });

    return result;
  };

  function rotateSortArrow(n) {
    const tableThArrows = document.querySelectorAll('.table__th');

    for (let arrow of tableThArrows) {
      if (!arrow.classList.contains(`table__th${n}`)) {
        arrow.classList.remove('table__th--sort');
      }
    }
  }

  //Сортировка при нажатиии на имя колонки
  const classNames = ['table__th1', 'table__th2', 'table__th3', 'table__th4'];
  const tableTh = document.querySelectorAll('.table__th');
  for (let th of tableTh) {
    if (classNames.some(className => th.classList.contains(className))) {
      th.setAttribute('sort-param', 'ASC');
    }
  }

  const tableThArrow1 = document.querySelector('.table__th1');
  tableThArrow1.addEventListener('click', async function () { //сортировка по id
    const response = await fetch('http://localhost:3000/api/clients');
    const clientsList = await response.json();

    const sortDirection = tableThArrow1.getAttribute('sort-param') === 'ASC' ? 'DESC' : 'ASC';
    tableThArrow1.setAttribute('sort-param', sortDirection);

    sortDirection === 'ASC' ? sortClients(clientsList, 'id', false) : sortClients(clientsList, 'id', true);

    tableThArrow1.classList.toggle('table__th--sort');
    rotateSortArrow(1);

    cleanDOMElements();

    clientsList.forEach(clientsObj => {
      let clientsObjInp = getClientsItem(clientsObj);
      clientsList.push(clientsObjInp);
    });

  });

  const tableThArrow2 = document.querySelector('.table__th2');
  tableThArrow2.addEventListener('click', async function () { //сортировка по фамилии имени отчеству
    const response = await fetch('http://localhost:3000/api/clients');
    const clientsList = await response.json();
    clientsList.forEach(client => {
      client['fio'] = `${client['surname']} ${client['name']} ${client['lastName']}`;
    });

    const sortDirection = tableThArrow2.getAttribute('sort-param') === 'ASC' ? 'DESC' : 'ASC';
    tableThArrow2.setAttribute('sort-param', sortDirection);

    sortDirection === 'ASC' ? sortClients(clientsList, 'fio', false) : sortClients(clientsList, 'fio', true);

    tableThArrow2.classList.toggle('table__th--sort');
    rotateSortArrow(2);

    cleanDOMElements();
    clientsList.forEach(clientsObj => {
      let clientsObjInp = getClientsItem(clientsObj);
      clientsList.push(clientsObjInp);
    });
  });

  const tableThArrow3 = document.querySelector('.table__th3');
  tableThArrow3.addEventListener('click', async function () { //сортировка по дате создания
    const response = await fetch('http://localhost:3000/api/clients');
    const clientsList = await response.json();

    const sortDirection = tableThArrow3.getAttribute('sort-param') === 'ASC' ? 'DESC' : 'ASC';
    tableThArrow3.setAttribute('sort-param', sortDirection);

    sortDirection === 'ASC' ? sortClients(clientsList, 'id', false) : sortClients(clientsList, 'id', true);

    tableThArrow3.classList.toggle('table__th--sort');
    rotateSortArrow(3);

    cleanDOMElements();
    clientsList.forEach(clientsObj => {
      let clientsObjInp = getClientsItem(clientsObj);
      clientsList.push(clientsObjInp);
    });
  });

  const tableThArrow4 = document.querySelector('.table__th4');
  tableThArrow4.addEventListener('click', async function () { //сортировка по дате изменения
    const response = await fetch('http://localhost:3000/api/clients');
    const clientsList = await response.json();

    const sortDirection = tableThArrow4.getAttribute('sort-param') === 'ASC' ? 'DESC' : 'ASC';
    tableThArrow4.setAttribute('sort-param', sortDirection);

    sortDirection === 'ASC' ? sortClients(clientsList, 'fio', false) : sortClients(clientsList, 'fio', true);

    tableThArrow4.classList.toggle('table__th--sort');
    rotateSortArrow(4);

    cleanDOMElements();
    clientsList.forEach(clientsObj => {
      let clientsObjInp = getClientsItem(clientsObj);
      clientsList.push(clientsObjInp);
    });
  });


})();
