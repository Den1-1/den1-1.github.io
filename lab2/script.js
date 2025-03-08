var type = 0

// URL до твого CSV-файлу на сервері чи в Інтернеті
const csvUrl = 'source\\datasets\\nyc-service-volunteer-opportunities.csv';

// Завантаження CSV-файлу
fetch(csvUrl)
  .then(response => response.text())
  .then(csvData => {
    // Парсинг CSV за допомогою PapaParse
    const parsedData = Papa.parse(csvData, {
      header: true, // Якщо CSV містить заголовки
      skipEmptyLines: true, // Пропустити порожні рядки
    });
    
    console.log(parsedData.data); // Виведення даних в консоль


    const initiativesContainer = document.querySelector('.container');

    for (let i = 0; i < parsedData.data.length; i++) {
        let initiative = parsedData.data[i]

        if (initiative.locality == "") continue;

        // Створюємо контейнер для кожної ініціативи
        const div = document.createElement('div');
        div.classList.add('initiative');
    
        // Додаємо заголовок (назва ініціативи)
        const h3 = document.createElement('h3');
        h3.textContent = initiative.title;
        div.appendChild(h3);
        
        // Додаємо опис
        const p = document.createElement('p');
        p.textContent = initiative.summary
        p.classList.add('description');
        div.appendChild(p);
        
        // Створюємо список з даними
        const ul = document.createElement('ul');
        const dateLi = document.createElement('li');
        dateLi.textContent = `Дата: ${initiative.end_date_date}`;
        ul.appendChild(dateLi);
        

        console.log(initiative);

        const locationLi = document.createElement('li');
        
        // Використовуємо регулярний вираз для витягнення адреси
        const addressMatch = initiative.locality.match(/"address":\s?"([^"]+)"/);
        const cityMatch = initiative.locality.match(/"city":\s?"([^"]+)"/);

        locationLi.textContent = `Місце проведення: ${addressMatch[1]}${cityMatch ? ", " + cityMatch[1] : ""}`;
        ul.appendChild(locationLi);
        
        const volunteersLi = document.createElement('li');
        volunteersLi.textContent = `Кількість волонтерів: ${initiative.vol_requests}`;
        ul.appendChild(volunteersLi);
        
        div.appendChild(ul);
        
        // Додаємо ініціативу в контейнер
        initiativesContainer.appendChild(div);
        console.log(initiative.title, initiative.summary, initiative.vol_requests);  // Виведе лише ім'я та місто
    }

  })
  .catch(error => console.error('Помилка завантаження або парсингу:', error));


//-------------------------------------------------- Обробка кнопки "Сховати/Показати" -------------------------------------
// Отримуємо елемент кнопки
const btn_hide = document.querySelector('.btn_hide');

// Додаємо обробник події для натискання кнопки
btn_hide.addEventListener('click', function() {
    if (btn_hide.textContent == 'Сховати опис') {
        btn_hide.textContent = 'Показати опис'
        type = 1
        hide();
    } else {
        btn_hide.textContent = 'Сховати опис';
        type = 0
        show()
    }
});

function hide() {
    var initiatives = document.querySelectorAll('.initiative');

    initiatives.forEach(initiative => {
        initiative.querySelector('.description').style.display = "none";
    });
};

function show() {
    var initiatives = document.querySelectorAll('.initiative');

    initiatives.forEach(initiative => {
        initiative.querySelector('.description').style.display = "block";
    });
};

//---------------------------------------------------- Обробка наведення та додавання опису --------------------------------------
const container = document.querySelector(".container");

container.addEventListener("mouseenter", function(event) {
    if (event.target.classList.value == "initiative") {
        if (type == 1)
            event.target.querySelector('.description').style.display = "block";
    }
}, true);

container.addEventListener("mouseleave", function(event) {
    if (event.target.classList.value == "initiative") {
        if (type == 1)
            event.target.querySelector('.description').style.display = "none";
    }
}, true);



//-------------------------------------------------- Обробка кнопки "Додати ініціативу" ---------------------------------------
const btn_add = document.querySelector('.btn_add');

// Додаємо обробник події для натискання кнопки
btn_add.addEventListener('click', function() {
    const form = document.querySelector('.initiativeForm');
    form.style.display = 'flex';

    const blackout = document.querySelector('.blackout');
    blackout.style.display = 'block';
});


//----------------------------------------------- Обробка кнопки закриття форми -------------------------------------
const btn_close = document.querySelector('.btn_close');

// Додаємо обробник події для натискання кнопки
btn_close.addEventListener('click', function(event) {
    event.preventDefault(); // Запобігає перезавантаженню сторінки

    const form = document.querySelector('.initiativeForm');
    form.style.display = 'none';

    const blackout = document.querySelector('.blackout');
    blackout.style.display = 'none';
});


//----------------------------------------------- Обробка кнопки закриття форми -------------------------------------
const btn_submit = document.querySelector('.btn_submit');

// Додаємо обробник події для натискання кнопки
btn_submit.addEventListener('click', function(event) {
    event.preventDefault(); // Запобігає перезавантаженню сторінки

    // Отримання значень з форми
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const date = document.getElementById('date').value;
    const location = document.getElementById('location').value;
    const volunteers = document.getElementById('volunteers').value;

    if (title.trim() == '' || description.trim() == '' || date.trim() == '' || location.trim() == '' || volunteers.trim() == '')
        return;

    const initiativesContainer = document.querySelector('.container');

    // Відображення введених даних
    initiativesContainer.innerHTML += `
        <div class="initiative">
            <h3>${title}</h3>
            <p class="description">${description}</p>
            <ul>
                <li>Дата: ${date}</li>
                <li>Місце проведення: ${location}</li>
                <li>Кількість волонтерів: ${volunteers}</li>
            </ul>
        </div>
    `;

    // Очистка форми після відправки
    document.querySelector('.initiativeForm').reset();

    const form = document.querySelector('.initiativeForm');
    form.style.display = 'none';

    const blackout = document.querySelector('.blackout');
    blackout.style.display = 'none';
});