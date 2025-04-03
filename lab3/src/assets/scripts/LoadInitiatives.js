import Papa from 'papaparse'; // Імпорт бібліотеки для парсингу CSV 

export default function loadInitiatives(cards, setCards, filterValues) {

    console.warn(cards.length); // Виведення масиву ініціатив в консоль
    let count = cards.length + 10; // Отримуємо кількість ініціатив, які вже завантажені
    console.log(count);

    // // Отримання значень фільтрів
    // const relevant = document.getElementById('relevant');
    // const education = document.getElementById('education');
    // const health = document.getElementById('health');
    // const environment = document.getElementById('environment');
    
    const currentDate = new Date();
    
    // URL до твого CSV-файлу на сервері чи в Інтернеті
    const csvUrl = '/lab3/datasets/nyc-service-volunteer-opportunities.csv';
    let dataArray = []; // Масив для зберігання даних ініціатив

    //---------------------------------- Відображення збережених ініціатив -----------------------------------
    let created_initiatives = JSON.parse(localStorage.getItem("created_initiatives")) || []; 

    for (let i = 0; i < created_initiatives.length && dataArray.length < count; i++) {
        let data = created_initiatives[i];
        console.log(data);
        console.warn(isSelected(data));

            // Ящо розділ Мої ініціативи показати лише обрані
            if (document.querySelector('h2').textContent == 'Мої ініціативи')
                if (!isSelected(data))
                    continue;

            const initiativeDate = new Date(data.date); // Перетворюємо рядок у дату
            if (filterValues.relevant && initiativeDate < currentDate) continue; // Перевіряємо, чи ініціатива ще актуальна
            
            if (filterValues.education || filterValues.health || filterValues.environment) {
                var category = [filterValues.education ? 'Education' : null, filterValues.health ? 'Health' : null, filterValues.environment ? 'Environment' : null];
                
                if (!category.includes(data.category)) continue;
            }
            
            dataArray.push(data);
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
    console.log(count);

    let i = -1;
    while (++i < parsedData.data.length && dataArray.length < count) { //----------------------------- Показ ініціатив
        let initiative = parsedData.data[i]

        if (initiative.locality == "" || initiative.locality == null ) continue;
        
        const initiativeDate = new Date(initiative.end_date_date); // Перетворюємо рядок у дату
        
        if (initiative.category_desc == "") continue;

        // Використовуємо регулярний вираз для витягнення адреси
        const addressMatch = initiative.locality.match(/"address":\s?"([^"]+)"/);
        const cityMatch = initiative.locality.match(/"city":\s?"([^"]+)"/);

        let address = `${addressMatch[1]}${cityMatch ? ", " + cityMatch[1] : ""}`;

        const data = {
            title: initiative.title,
            category: initiative.category_desc,
            description: initiative.summary,
            date: initiative.end_date_date,
            location: address,
            volunteers: initiative.vol_requests
        }

        // Ящо розділ Мої ініціативи показати лише обрані
        if (document.querySelector('h2').textContent == 'Мої ініціативи')
            if (!isSelected(data))
                continue;

        if (filterValues.relevant && initiativeDate < currentDate) continue; // Перевіряємо, чи ініціатива ще актуальна
        
        if (filterValues.education || filterValues.health || filterValues.environment) {
            var category = [filterValues.education ? 'Education' : null, filterValues.health ? 'Health' : null, filterValues.environment ? 'Environment' : null];
            
            if (!category.includes(data.category)) continue;
        }
        

        dataArray.push(data); // Додаємо ініціативу в масив
    }

    setCards(dataArray); // Додаємо нові ініціативи до стану карток
    })
    .catch(error => console.error('Помилка завантаження або парсингу:', error));
}




export function isSelected(data) {
    let my_initiatives = JSON.parse(localStorage.getItem("my_initiatives")) || []; 

    for (let i = 0; i < my_initiatives.length; i++) {
        if (
            my_initiatives[i].title === data.title &&
            my_initiatives[i].category === data.category &&
            my_initiatives[i].description === data.description
        ) {
            return true;
        }
    }

    return false;
}