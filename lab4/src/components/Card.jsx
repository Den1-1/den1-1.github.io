import {isSelected} from '../assets/scripts/LoadInitiatives.js';
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { addSelectedInitiative, removeSelectedInitiative, findUserByEmail } from '../assets/scripts/WriteData.js';
import Rates from './Rates.jsx';

export default function Card({ data, index, hideDescription, setIsMessageVisible }) {    
    const [isHovered, setIsHovered] = useState(false);
    const [userEmail, setUserEmail] = useState(null);
    const [Selected, setSelected] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserEmail(user.email);
                isSelected(user.email, data.id).then((result) => {
                    setSelected(result);
                });
                // console.log("Імейл:", user.email);
            } else {
                setUserEmail(null);
                // console.log("Користувач не увійшов");
            }
        });

        return () => unsubscribe(); // Clean-up при демонтажі
    }, []);
    
    function joinInitiative(event) {
        event.target.textContent = 'Ви приєдналися';
        event.target.classList.add('active');

        const parentDiv = event.target.closest('.initiative');
        const volunteersLi = parentDiv.querySelector('li:nth-child(3)');
        
        let remainingVolunteers = parseInt(volunteersLi.textContent.match(/\d+/)[0], 10);

        if (remainingVolunteers > 0) {
            remainingVolunteers--;
            volunteersLi.textContent = `Кількість волонтерів: ${remainingVolunteers}`;
        }

        findUserByEmail(userEmail).then((user) => {
            if (user) {
                addSelectedInitiative(user.id, data.id); // Записуємо ініціативу в БД
                console.log("Ініціатива додана до користувача:", user.email);
            }
        });

        setSelected(true);
    }

    function unjoinInitiative(event) {
        event.target.textContent = 'Приєднатися';
        event.target.classList.remove('active');

        const parentDiv = event.target.closest('.initiative');
        const volunteersLi = parentDiv.querySelector('li:nth-child(3)');
        
        let remainingVolunteers = parseInt(volunteersLi.textContent.match(/\d+/)[0], 10);

        remainingVolunteers++;
        volunteersLi.textContent = `Кількість волонтерів: ${remainingVolunteers}`;

        findUserByEmail(userEmail).then((user) => {
            if (user) {
                removeSelectedInitiative(user.id, data.id); // Видаляємо ініціативу з БД
                console.log("Ініціатива додана до користувача:", user.email);
            }
        });

        setSelected(false);
    }

    return (
        <div className="initiative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <h3>{data.title}</h3>
            <p className="category">{data.category}</p>
            {(!hideDescription || (hideDescription && isHovered)) && <p className="description">{data.description}</p>}
            <ul>
                <li>Дата: {data.date}</li>
                <li>Місце проведення: {data.location}</li>
                <li>Кількість волонтерів: {data.volunteers}</li>
            </ul>
            
            <Rates initiativeId={data.id} />
            
            {
                userEmail ? (
                    Selected ?
                        <button className="btn_join active" onClick={(event) => unjoinInitiative(event)}>Ви приєдналися</button>
                    :
                        <button className="btn_join" onClick={(event) => joinInitiative(event)}>Приєднатися</button>
                ) : (
                    <button className="btn_join" onClick={() => setIsMessageVisible(prev => !prev)}>Приєднатися</button>
                )
            }
            
            
        </div>
    );
} 