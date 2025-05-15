import CreateForm from "../components/CreateForm.jsx";
import FilterForm from "../components/FilterForm.jsx";
import Card from "../components/Card.jsx";
import { useState, useEffect, use } from "react";
import loadInitiatives from "../assets/scripts/LoadInitiatives.js"; // Імпорт функції для завантаження ініціатив
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Message from "../components/Message.jsx"; // Імпорт функції для відображення повідомлень
import { getUser } from "../assets/scripts/WriteData.js"; // Імпорт функції для отримання даних користувача

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

    const [isMessageVisible, setIsMessageVisible] = useState(false);

    const [userData, setUserData] = useState(null);
    

    // Завантажуємо початкові картки при першому рендері
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                getUser().then((userData) => {
                    console.log("User data:", userData);
                    setUserData(userData);
                    loadInitiatives(cards, setCards, filterValues, userData);
                });
            }
        });
    
        return () => unsubscribe(); // Clean-up при демонтажі
    }, []);

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    // Відслідковуємо прокручування
    const handleScroll = () => {
        if (document.documentElement.scrollHeight < document.documentElement.scrollTop + window.innerHeight + 300 && !loading) {
            setLoading(true); // Увімкнути стан завантаження
            loadInitiatives(cards, setCards, filterValues, userData);
            sleep(2000).then(() => {
                setLoading(false); // Вимкнути стан завантаження
            });
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
                            userData ? (
                                <button className="btn_add" onClick={() => setIsFormVisible(!isFormVisible)}>Створити!</button>
                            ) : (
                                <button className="btn_add" onClick={() => setIsMessageVisible(!isMessageVisible)}>Створити!</button>
                            )
                        }
                        {/* <button className="btn_add active" onClick={() => setIsFormVisible(!isFormVisible)}>Створити!</button> */}
                    </div>

                    {cards.map((card, index) => (
                        <Card key={card.id} data={card} userData={userData} index={index} hideDescription={hideDescription} setIsMessageVisible={setIsMessageVisible}/>
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