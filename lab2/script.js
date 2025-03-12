var type = 0

load_initiatives();

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


//----------------------------------------------- Обробка підтвердження форми -------------------------------------
const btn_submit = document.querySelector('.btn_submit');

// Додаємо обробник події для натискання кнопки
btn_submit.addEventListener('click', function(event) {
    event.preventDefault(); // Запобігає перезавантаженню сторінки

    // Отримання значень з форми
    const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    const date = document.getElementById('date').value;
    const location = document.getElementById('location').value;
    const volunteers = document.getElementById('volunteers').value;

    const fields = ['title', 'category', 'description', 'date', 'location', 'volunteers'];
    let isValid = true;

    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el.value.trim() === '') {
            el.style.border = '2px solid red';
            isValid = false;
        } else {
            el.style.border = '2px solid lime';
        }
    });

    if (!isValid) return;

    // Відображення введених даних
    let new_initiative = createInitiative(title, category, description, date, location, volunteers);
    document.querySelector('.create').insertAdjacentElement('afterend', new_initiative);

    // Очистка форми після відправки
    document.querySelector('.initiativeForm').reset();

    const form = document.querySelector('.initiativeForm');
    form.style.display = 'none';

    const blackout = document.querySelector('.blackout');
    blackout.style.display = 'none';

    fields.forEach(id => {
        const el = document.getElementById(id);
        el.style.border = '';
    });
    
    // Збереження ініціативи
    let created_initiatives = JSON.parse(localStorage.getItem("created_initiatives")) || []; 

    console.log(created_initiatives);
    if (created_initiatives == null) 
        created_initiatives = [];

    created_initiatives.push([title, category, description, date, location, volunteers]);
    localStorage.setItem("created_initiatives", JSON.stringify(created_initiatives)); 
});

//-------------------------------------------------- Обробка кнопки "Фільтри" ---------------------------------------
const btn_filter = document.querySelector('.btn_filter');

// Додаємо обробник події для натискання кнопки
btn_filter.addEventListener('click', function() {
    const form = document.querySelector('.filterForm');
    form.style.display = 'flex';

    const blackout = document.querySelector('.blackout');
    blackout.style.display = 'block';
});


//----------------------------------------------- Обробка кнопки закриття форми фільтрів -------------------------------------
const btn_closef = document.querySelector('.btn_closef');

// Додаємо обробник події для натискання кнопки
btn_closef.addEventListener('click', function(event) {
    event.preventDefault(); // Запобігає перезавантаженню сторінки

    const form = document.querySelector('.filterForm');
    form.style.display = 'none';

    const blackout = document.querySelector('.blackout');
    blackout.style.display = 'none';
});

//----------------------------------------------- Обробка підтвердження форми фільтрів -------------------------------------
const btn_submitf = document.querySelector('.btn_submitf');

// Додаємо обробник події для натискання кнопки
btn_submitf.addEventListener('click', function(event) {
    event.preventDefault(); // Запобігає перезавантаженню сторінки

    // Отримання значень фільтрів
    const relevant = document.getElementById('relevant');
    const education = document.getElementById('education');
    const health = document.getElementById('health');
    const environment = document.getElementById('environment');

    // Видаляємо всі ініціативи, окрім першої
    const children = container.children;
        
    // Видаляємо всі елементи з другого і наступних
    for (let i = children.length - 1; i > 0; i--) {
        container.removeChild(children[i]);
    }

    load_initiatives();

    // Закритят форми
    const form = document.querySelector('.filterForm');
    form.style.display = 'none';

    const blackout = document.querySelector('.blackout');
    blackout.style.display = 'none';
});


//---------------------------------------------------- Обробка кнопки приєднання --------------------------------------
container.addEventListener("click", function(event) {
    if (event.target.classList.value.includes("btn_join")) {
        if (event.target.textContent == 'Приєднатися') {
            event.target.textContent = 'Ви приєдналися';
            event.target.classList.add('active');

            const parentDiv = event.target.closest('.initiative');
            const volunteersLi = parentDiv.querySelector('li:nth-child(3)');
            
            let remainingVolunteers = parseInt(volunteersLi.textContent.match(/\d+/)[0], 10);

            if (remainingVolunteers > 0) {
                remainingVolunteers--;
                volunteersLi.textContent = `Кількість волонтерів: ${remainingVolunteers}`;
            }

            console.log(parentDiv.innerHTML)

            // localStorage.clear();
            let my_initiatives = JSON.parse(localStorage.getItem("my_initiatives")) || []; 

            console.log(my_initiatives);
            if (my_initiatives == null) 
                my_initiatives = [];

            let cur_initiative = [];
            cur_initiative.push(parentDiv.querySelector('h3').textContent);
            cur_initiative.push(parentDiv.querySelector('p').textContent);
            cur_initiative.push(parentDiv.querySelector('ul').innerHTML.match(/Дата: ([^<]+)/)[1]);///"address":\s?"([^"]+)"/
            cur_initiative.push(parentDiv.querySelector('ul').innerHTML.match(/Місце проведення: ([^<]+)/)[1]);
            cur_initiative.push(parentDiv.querySelector('ul').innerHTML.match(/Кількість волонтерів: ([^<]+)/)[1]);
            
            my_initiatives.push(cur_initiative);

            localStorage.setItem("my_initiatives", JSON.stringify(my_initiatives)); 
            
            console.log(my_initiatives);
        } else { //--------------------------------------- Відмова від ініціативи --------------------------
            event.target.textContent = 'Приєднатися';
            event.target.classList.remove('active');

            const parentDiv = event.target.closest('.initiative');
            const volunteersLi = parentDiv.querySelector('li:nth-child(3)');
            
            let remainingVolunteers = parseInt(volunteersLi.textContent.match(/\d+/)[0], 10);

            remainingVolunteers++;
            volunteersLi.textContent = `Кількість волонтерів: ${remainingVolunteers}`;

            let my_initiatives = JSON.parse(localStorage.getItem("my_initiatives")) || []; 

            let title = parentDiv.querySelector('h3').textContent;

            for (let i = 0; i < my_initiatives.length; i++) {
                if (my_initiatives[i].includes(title)) {
                    my_initiatives.splice(i, 1);
                }
            }

            localStorage.setItem("my_initiatives", JSON.stringify(my_initiatives)); 
            console.log(my_initiatives);
        }
    }
}, true);


//---------------------------- Перевірка чи є ініціатива обрана ----------------------
function isSelected(title) {
    let my_initiatives = JSON.parse(localStorage.getItem("my_initiatives")) || []; 

    for (let i = 0; i < my_initiatives.length; i++) {
        if (my_initiatives[i].includes(title)) {
            return true;
        }
    }

    return false;
}

//-------------------------- Створення об'єкта ініціативи -------------------------
function createInitiative(title, category, summary, date, address, vol_requests) {
    // Створюємо контейнер для кожної ініціативи
    const div = document.createElement('div');
    div.classList.add('initiative');

    // Додаємо заголовок (назва ініціативи)
    const h3 = document.createElement('h3');
    h3.textContent = title;
    div.appendChild(h3);
     
    // Додаємо опис
    const p1 = document.createElement('p');
    p1.textContent = category
    p1.classList.add('category');
    div.appendChild(p1);

    // Додаємо опис
    const p = document.createElement('p');
    p.textContent = summary
    p.classList.add('description');
    div.appendChild(p);
    
    // Створюємо список з даними
    const ul = document.createElement('ul');

    const dateLi = document.createElement('li');
    dateLi.textContent = `Дата: ${date}`;
    ul.appendChild(dateLi);
    
    const locationLi = document.createElement('li');
    locationLi.textContent = `Місце проведення: ${address}`;
    ul.appendChild(locationLi);
    
    const volunteersLi = document.createElement('li');
    volunteersLi.textContent = `Кількість волонтерів: ${vol_requests}`;
    ul.appendChild(volunteersLi);
    
    div.appendChild(ul);

    // Кнопка приєднання
    const button = document.createElement('button');
    button.classList.add('btn_join');
    button.textContent = 'Приєднатися';

    if (isSelected(title)) {
        button.classList.add('active');
        button.textContent = 'Ви приєдналися';
    }

    div.appendChild(button);

    return div;
}

function load_initiatives() {
    
    // Отримання значень фільтрів
    const relevant = document.getElementById('relevant');
    const education = document.getElementById('education');
    const health = document.getElementById('health');
    const environment = document.getElementById('environment');

    const currentDate = new Date();

    // URL до твого CSV-файлу на сервері чи в Інтернеті
    const csvUrl = 'source\\datasets\\nyc-service-volunteer-opportunities.csv';

    const initiativesContainer = document.querySelector('.container');

    //---------------------------------- Відображення збережених ініціатив -----------------------------------
    let created_initiatives = JSON.parse(localStorage.getItem("created_initiatives")) || []; 

    for (let i = 0; i < created_initiatives.length; i++) {
        let initiative = created_initiatives[i]
        console.log(initiative)

            // Ящо розділ Мої ініціативи показати лише обрані
            if (document.querySelector('h2').textContent == 'Мої ініціативи')
                if (!isSelected(initiative[0]))
                    continue;

            if (initiative.locality == "") continue;

            const initiativeDate = new Date(initiative[3]); // Перетворюємо рядок у дату
            if (relevant.checked && initiativeDate < currentDate) continue; // Перевіряємо, чи ініціатива ще актуальна
            
            if (education.checked || health.checked || environment.checked) {
                var category = [education.checked ? 'Education' : null, health.checked ? 'Health' : null, environment.checked ? 'Environment' : null];
                
                if (!category.includes(initiative[1])) continue; // Перевіряємо, чи ініціатива ще актуальна
            }
            
            let div = createInitiative(initiative[0], initiative[1], initiative[2], initiative[3], initiative[4], initiative[5])
            
            // Додаємо ініціативу в контейнер
            initiativesContainer.appendChild(div);
            console.log(initiative.title);  // Виведе лише ім'я та місто
    }

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

    let i = -1;
    while (++i < parsedData.data.length) { //----------------------------- Показ ініціатив
        let initiative = parsedData.data[i]

            // Ящо розділ Мої ініціативи показати лише обрані
            if (document.querySelector('h2').textContent == 'Мої ініціативи')
                if (!isSelected(initiative.title))
                    continue;

            if (initiative.locality == "") continue;
            
            const initiativeDate = new Date(initiative.end_date_date); // Перетворюємо рядок у дату
            if (relevant.checked && initiativeDate < currentDate) continue; // Перевіряємо, чи ініціатива ще актуальна
            
            if (education.checked || health.checked || environment.checked) {
                var category = [education.checked ? 'Education' : null, health.checked ? 'Health' : null, environment.checked ? 'Environment' : null];
                
                if (!category.includes(initiative.category_desc)) continue; // Перевіряємо, чи ініціатива ще актуальна
            }

            console.log(initiative.category_desc);
            
            
            // Використовуємо регулярний вираз для витягнення адреси
            const addressMatch = initiative.locality.match(/"address":\s?"([^"]+)"/);
            const cityMatch = initiative.locality.match(/"city":\s?"([^"]+)"/);

            let address = `${addressMatch[1]}${cityMatch ? ", " + cityMatch[1] : ""}`;

            let div = createInitiative(initiative.title, initiative.category_desc, initiative.summary, initiative.end_date_date, address, initiative.vol_requests)
            
            // Додаємо ініціативу в контейнер
            initiativesContainer.appendChild(div);
        }

    })
    .catch(error => console.error('Помилка завантаження або парсингу:', error));
}