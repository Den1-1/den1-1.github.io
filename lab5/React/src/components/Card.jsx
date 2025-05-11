import {isSelected} from '../assets/scripts/LoadInitiatives.js';
import { useState, useEffect } from 'react';
import { addSelectedInitiative, removeSelectedInitiative } from '../assets/scripts/WriteData.js';
import Rates from './Rates.jsx';

export default function Card({ data, userData, index, hideDescription, setIsMessageVisible }) {    
    const [isHovered, setIsHovered] = useState(false);
    const [Selected, setSelected] = useState(false);

    useEffect(() => {
        console.log("Card userData:", userData);
        isSelected(userData, data.id).then((result) => {
        setSelected(result);
        });
    }, [userData]);
    
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

        addSelectedInitiative(userData.uid, data.id); // Записуємо ініціативу в БД
        console.log("Ініціатива додана до користувача:", userData.email);

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

        removeSelectedInitiative(userData.uid, data.id); // Видаляємо ініціативу з БД
        console.log("Ініціатива додана до користувача:", userData.email);

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
            
            <Rates initiative={data} userData={userData} />
            
            {
                userData ? (
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