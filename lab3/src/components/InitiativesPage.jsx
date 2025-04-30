import CreateForm from "../components/CreateForm.jsx";
import FilterForm from "../components/FilterForm.jsx";
import Card from "../components/Card.jsx";
import { useState, useEffect } from "react";
import loadInitiatives from "../assets/scripts/LoadInitiatives.js"; // Імпорт функції для завантаження ініціатив

export default function InitiativesPage({type}) {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isFilterFormVisible, setIsFilterFormVisible] = useState(false);
    const [cards, setCards] = useState([]); // Масив для карток
    const [loading, setLoading] = useState(false); 
    const [hideDescription, setHideDescription] = useState(false); // Стан для контролю видимості опису
    const [filterValues, setFilterValues] = useState({
        relevant: false,
        education: false,
        health: false,
        environment: false,
    });

    // Завантажуємо початкові картки при першому рендері
    useEffect(() => {
        loadInitiatives(cards, setCards, filterValues);
    }, []);

    // Відслідковуємо прокручування
    const handleScroll = () => {
        if (document.documentElement.scrollHeight < document.documentElement.scrollTop + window.innerHeight + 300 && !loading) {
            setLoading(true); // Увімкнути стан завантаження
            loadInitiatives(cards, setCards, filterValues);
            setLoading(false); // Вимкнути стан завантаження
        }
    };

    useEffect(() => {
        // Додаємо обробник події прокручування
        window.addEventListener('scroll', handleScroll);

        // Очищаємо обробник при демонтажі компонента
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [cards, loading]); // Залежності: кожного разу, коли змінюються cards або loading

    return (
        <main>
            <section>
                <h2 class="initiatives">{type}</h2>

                <div class="control_initiatives">
                    <button class="btn_hide" onClick={() => setHideDescription(prev => !prev)}>{hideDescription ? "Показати" : "Сховати"} опис</button>
                    <button class="btn_filter" onClick={() => setIsFilterFormVisible(!isFilterFormVisible)}>Фільтри</button>
                </div>

                <div class="container">
                    <div class="initiative create">
                        <h3>Створи свою ініціативу!</h3>
                        <p class="description">Створи власну ініціативу, залучи однодумців і змінюй світ разом!</p>
                        <ul></ul>
                        <button class="btn_add active" onClick={() => setIsFormVisible(!isFormVisible)}>Створити!</button>
                    </div>

                    {cards.map((card, index) => (
                        <Card data={card} index={index} hideDescription={hideDescription}/>
                    ))}

                    {isFormVisible && (
                        <>
                            <div class="blackout"></div>
                            <CreateForm setIsFormVisible={setIsFormVisible} setCards={setCards}/>
                        </>
                    )}

                    {isFilterFormVisible && (
                        <>
                            <div class="blackout"></div>
                            <FilterForm setIsFilterFormVisible={setIsFilterFormVisible} setFilterValues={setFilterValues} setCards={setCards}/>
                        </>
                    )}
                </div>
            </section>
        </main>
    );
}