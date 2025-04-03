import {isSelected} from '../assets/scripts/LoadInitiatives.js';
import { useState } from 'react';

export default function Card({ data, index, hideDescription}) {    
    const [isHovered, setIsHovered] = useState(false)
    
    function joinInitiative(event) {
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

            data = {
                title: parentDiv.querySelector('h3').textContent,
                category: parentDiv.querySelector('.category').textContent,
                description: parentDiv.querySelector('.description').textContent,
                date: parentDiv.querySelector('ul').innerHTML.match(/Дата: ([^<]+)/)[1],
                location: parentDiv.querySelector('ul').innerHTML.match(/Місце проведення: ([^<]+)/)[1],
                volunteers: parentDiv.querySelector('ul').innerHTML.match(/Кількість волонтерів: ([^<]+)/)[1]
            }

            my_initiatives.push(data);

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
                if (my_initiatives[i].title.includes(title)) {
                    my_initiatives.splice(i, 1);
                }
            }

            localStorage.setItem("my_initiatives", JSON.stringify(my_initiatives)); 
            console.log(my_initiatives);
        }

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
            {isSelected(data) ?
                <button className="btn_join active" onClick={(event) => joinInitiative(event)}>Ви приєдналися</button>
            :
                <button className="btn_join" onClick={(event) => joinInitiative(event)}>Приєднатися</button>}
        </div>
    );

}