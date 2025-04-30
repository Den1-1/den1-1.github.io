import CreateForm from "../components/CreateForm.jsx";
import FilterForm from "../components/FilterForm.jsx";
import Card from "../components/Card.jsx";
import { useState, useEffect } from "react";
import loadInitiatives from "../assets/scripts/LoadInitiatives.js"; // Імпорт функції для завантаження ініціатив
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Message from "../components/Message.jsx"; // Імпорт функції для відображення повідомлень

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

    const [userEmail, setUserEmail] = useState(null);
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    

    // Завантажуємо початкові картки при першому рендері
    useEffect(() => {
        loadInitiatives(cards, setCards, filterValues);

        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserEmail(user.email);
                console.log("Імейл:", user.email);
            } else {
                setUserEmail(null);
                console.log("Користувач не увійшов");
            }
        });
    
        return () => unsubscribe(); // Clean-up при демонтажі
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
                <h2 className="initiatives">{type}</h2>

                <div className="control_initiatives">
                    <button className="btn_hide" onClick={() => setHideDescription(prev => !prev)}>{hideDescription ? "Показати" : "Сховати"} опис</button>
                    <button className="btn_filter" onClick={() => setIsFilterFormVisible(!isFilterFormVisible)}>Фільтри</button>
                </div>

                <div className="container">
                    <div className="initiative create">
                        <h3>Створи свою ініціативу!</h3>
                        <p className="description">Створи власну ініціативу, залучи однодумців і змінюй світ разом!</p>
                        <ul></ul>
                        {
                            userEmail ? (
                                <button className="btn_add" onClick={() => setIsFormVisible(!isFormVisible)}>Створити!</button>
                            ) : (
                                <button className="btn_add" onClick={() => setIsMessageVisible(!isMessageVisible)}>Створити!</button>
                            )
                        }
                        {/* <button className="btn_add active" onClick={() => setIsFormVisible(!isFormVisible)}>Створити!</button> */}
                    </div>

                    {cards.map((card, index) => (
                        <Card key={card.id} data={card} index={index} hideDescription={hideDescription} setIsMessageVisible={setIsMessageVisible}/>
                    ))}

                    {isFormVisible && (
                        <>
                            <div className="blackout"></div>
                            <CreateForm setIsFormVisible={setIsFormVisible} setCards={setCards}/>
                        </>
                    )}

                    {isFilterFormVisible && (
                        <>
                            <div className="blackout"></div>
                            <FilterForm setIsFilterFormVisible={setIsFilterFormVisible} setFilterValues={setFilterValues} setCards={setCards} values={filterValues}/>
                        </>
                    )}

                    {isMessageVisible && (
                        <>
                            <div className="blackout"></div>
                            <Message setIsMessageVisible={setIsMessageVisible} message={"Спочатку увійдіть в систему!"} />
                        </>
                    )}
                </div>
            </section>
        </main>
    );
}