<<<<<<< HEAD
import { useState } from "react";

export default function CreateForm({setIsFormVisible, setCards}) {
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        date: '',
        location: '',
        volunteers: 1,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Отримання значень з форми
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

        // Додавання нової картки
        setCards(prevCards => [formData, ...prevCards]);
        setIsFormVisible(prev => !prev)
        
        // Збереження ініціативи
        let created_initiatives = JSON.parse(localStorage.getItem("created_initiatives")) || []; 

        console.log(created_initiatives);
        if (created_initiatives == null) 
            created_initiatives = [];

        created_initiatives.push(formData);
        localStorage.setItem("created_initiatives", JSON.stringify(created_initiatives)); 

        console.log('Form submitted:', formData);
    };

    return (
        <form className="initiativeForm" onSubmit={handleSubmit}>
            <h3>Додати ініціативу</h3>
            <button className="btn_close" type="button" onClick={() => setIsFormVisible(prev => !prev)}>✖</button>

            <label htmlFor="title">Назва ініціативи:</label>
            <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
            />

            <label htmlFor="category">Категорія:</label>
            <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
            />

            <label htmlFor="description">Опис:</label>
            <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
            ></textarea>

            <label htmlFor="date">Дата проведення:</label>
            <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
            />

            <label htmlFor="location">Місце проведення:</label>
            <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
            />

            <label htmlFor="volunteers">Кількість волонтерів:</label>
            <input
                type="number"
                id="volunteers"
                name="volunteers"
                min="1"
                value={formData.volunteers}
                onChange={handleChange}
            />

            <button className="btn_submit" type="submit">Створити ініціативу</button>
        </form>
    );
=======
import { useState } from "react";

export default function CreateForm({setIsFormVisible, setCards}) {
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        date: '',
        location: '',
        volunteers: 1,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Отримання значень з форми
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

        // Додавання нової картки
        setCards(prevCards => [formData, ...prevCards]);
        setIsFormVisible(prev => !prev)
        
        // Збереження ініціативи
        let created_initiatives = JSON.parse(localStorage.getItem("created_initiatives")) || []; 

        console.log(created_initiatives);
        if (created_initiatives == null) 
            created_initiatives = [];

        created_initiatives.push(formData);
        localStorage.setItem("created_initiatives", JSON.stringify(created_initiatives)); 

        console.log('Form submitted:', formData);
    };

    return (
        <form className="initiativeForm" onSubmit={handleSubmit}>
            <h3>Додати ініціативу</h3>
            <button className="btn_close" type="button" onClick={() => setIsFormVisible(prev => !prev)}>✖</button>

            <label htmlFor="title">Назва ініціативи:</label>
            <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
            />

            <label htmlFor="category">Категорія:</label>
            <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
            />

            <label htmlFor="description">Опис:</label>
            <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
            ></textarea>

            <label htmlFor="date">Дата проведення:</label>
            <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
            />

            <label htmlFor="location">Місце проведення:</label>
            <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
            />

            <label htmlFor="volunteers">Кількість волонтерів:</label>
            <input
                type="number"
                id="volunteers"
                name="volunteers"
                min="1"
                value={formData.volunteers}
                onChange={handleChange}
            />

            <button className="btn_submit" type="submit">Створити ініціативу</button>
        </form>
    );
>>>>>>> c5f44b3d83f19968b98d27be1ded60cfcabe06e9
}