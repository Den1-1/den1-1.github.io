// import {ShowCreateForm} from "../assets/scripts/FunctionButtons.js";
import CreateForm from "../components/CreateForm.jsx";
import Card from "../components/Card.jsx";
import { useState } from "react";
import Papa from 'papaparse'; // Імпорт бібліотеки для парсингу CSV 


export default function AvalibleInitiatives() {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [cards, setCards] = useState([]); // Масив для карток

    load_initiatives({ setCards }); // Завантаження ініціатив з CSV-файлу

    function ShowCreateForm() {
        setIsFormVisible(!isFormVisible);
    }

    return (
        <main>
            <section>
                <h2 class="initiatives">Доступні ініціативи</h2>

                <div class="control_initiatives">
                    <button class="btn_hide">Сховати опис</button>
                    <button class="btn_filter">Фільтри</button>
                </div>

                <div class="container">
                    <div class="initiative create">
                        <h3>Створи свою ініціативу!</h3>
                        <p class="description">Створи власну ініціативу, залучи однодумців і змінюй світ разом!</p>
                        <ul></ul>
                        <button class="btn_add active" onClick={(isFormVisible, setIsFormVisible) => ShowCreateForm(isFormVisible, setIsFormVisible)}>Створити!</button>
                    </div>

                    {cards.map((card, index) => (
                    <Card data={card} />
                    ))}

                    {isFormVisible && (
                        <>
                            <div class="blackout"></div>
                            <CreateForm setIsFormVisible={setIsFormVisible} setCards={setCards}/>
                        </>
                        )}
                </div>
            </section>
        </main>
    );
  }



  function load_initiatives({ setCards }) {
    
    // // Отримання значень фільтрів
    // const relevant = document.getElementById('relevant');
    // const education = document.getElementById('education');
    // const health = document.getElementById('health');
    // const environment = document.getElementById('environment');

    // const currentDate = new Date();

    // URL до твого CSV-файлу на сервері чи в Інтернеті
    const csvUrl = '../assets/datasets/nyc-service-volunteer-opportunities.csv';

    // //---------------------------------- Відображення збережених ініціатив -----------------------------------
    // let created_initiatives = JSON.parse(localStorage.getItem("created_initiatives")) || []; 

    // for (let i = 0; i < created_initiatives.length; i++) {
    //     let initiative = created_initiatives[i]
    //     console.log(initiative)

    //         // Ящо розділ Мої ініціативи показати лише обрані
    //         if (document.querySelector('h2').textContent == 'Мої ініціативи')
    //             if (!isSelected(initiative[0]))
    //                 continue;

    //         if (initiative.locality == "") continue;

    //         const initiativeDate = new Date(initiative[3]); // Перетворюємо рядок у дату
    //         if (relevant.checked && initiativeDate < currentDate) continue; // Перевіряємо, чи ініціатива ще актуальна
            
    //         if (education.checked || health.checked || environment.checked) {
    //             var category = [education.checked ? 'Education' : null, health.checked ? 'Health' : null, environment.checked ? 'Environment' : null];
                
    //             if (!category.includes(initiative[1])) continue; // Перевіряємо, чи ініціатива ще актуальна
    //         }
            
    //         let div = createInitiative(initiative[0], initiative[1], initiative[2], initiative[3], initiative[4], initiative[5])
            
    //         // Додаємо ініціативу в контейнер
    //         initiativesContainer.appendChild(div);
    //         console.log(initiative.title);  // Виведе лише ім'я та місто
    // }

    fetch(csvUrl)
    .then(response => response.text())
    .then(csvData => {
        console.log("Завантажений CSV:", csvData);
        const parsedData = Papa.parse(csvData, { header: true, skipEmptyLines: true });
        console.log("Парсинг:", parsedData.data);
    })
    .catch(error => console.error("Помилка:", error));
  }

//     // Завантаження CSV-файлу
//     fetch(csvUrl)
//     .then(response => response.text())
//     .then(csvData => {
//         // Парсинг CSV за допомогою PapaParse
//         const parsedData = Papa.parse(csvData, {
//         header: true, // Якщо CSV містить заголовки
//         skipEmptyLines: true, // Пропустити порожні рядки
//     });
        
//     console.log(parsedData.data); // Виведення даних в консоль

//     let i = -1;
//     while (++i < parsedData.data.length) { //----------------------------- Показ ініціатив
//         let initiative = parsedData.data[i]

//             // // Ящо розділ Мої ініціативи показати лише обрані
//             // if (document.querySelector('h2').textContent == 'Мої ініціативи')
//             //     if (!isSelected(initiative.title))
//             //         continue;

//             if (initiative.locality == "" || initiative.locality == null ) continue;
            
//             const initiativeDate = new Date(initiative.end_date_date); // Перетворюємо рядок у дату
//             // if (relevant.checked && initiativeDate < currentDate) continue; // Перевіряємо, чи ініціатива ще актуальна
            
//             // if (education.checked || health.checked || environment.checked) {
//             //     var category = [education.checked ? 'Education' : null, health.checked ? 'Health' : null, environment.checked ? 'Environment' : null];
                
//             //     if (!category.includes(initiative.category_desc)) continue; // Перевіряємо, чи ініціатива ще актуальна
//             // }

//             console.log(initiative.category_desc);
            
            
//             // Використовуємо регулярний вираз для витягнення адреси
//             const addressMatch = initiative.locality.match(/"address":\s?"([^"]+)"/);
//             const cityMatch = initiative.locality.match(/"city":\s?"([^"]+)"/);

//             let address = `${addressMatch[1]}${cityMatch ? ", " + cityMatch[1] : ""}`;

//             const data = {
//                 title: initiative.title,
//                 category: initiative.category_desc,
//                 description: initiative.summary,
//                 date: initiative.end_date_date,
//                 location: address,
//                 volunteers: initiative.vol_requests
//             }

//             setCards(prevCards => [...prevCards, data]);
//         }

//     })
//     .catch(error => console.error('Помилка завантаження або парсингу:', error));
// }