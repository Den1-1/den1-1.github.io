import React, { useState } from "react";

export default function FilterForm({setIsFilterFormVisible, setFilterValues, setCards, values}) {
    const [formData, setFormData] = useState(values);

    const handleChange = (event) => {
        const { name, checked } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: checked,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setFilterValues(formData); // Передаємо дані фільтра в батьківський компонент
        setIsFilterFormVisible(prev => !prev)
        setCards([]); // Очищаємо картки перед новим завантаженням
        console.log("Form Data:", formData);
    };

    return (
        <form className="filterForm" onSubmit={handleSubmit}>
            <h3>Фільтри</h3>
            <button className="btn_closef" type="button" onClick={() => setIsFilterFormVisible(prev => !prev)}>✖</button>

            <div>
                <input
                    type="checkbox"
                    id="relevant"
                    name="relevant"
                    checked={formData.relevant}
                    onChange={handleChange}
                />
                <label htmlFor="relevant">- лише актуальні</label>
            </div>

            <p>Категорії:</p>

            <div className="category_filter">
                <div>
                    <input
                        type="checkbox"
                        id="education"
                        name="education"
                        checked={formData.education}
                        onChange={handleChange}
                    />
                    <label htmlFor="education">- Education</label>
                </div>
                
                <div>
                    <input
                        type="checkbox"
                        id="health"
                        name="health"
                        checked={formData.health}
                        onChange={handleChange}
                    />
                    <label htmlFor="health">- Health</label>
                </div>
                
                <div>
                    <input
                        type="checkbox"
                        id="environment"
                        name="environment"
                        checked={formData.environment}
                        onChange={handleChange}
                    />
                    <label htmlFor="environment">- Environment</label>
                </div>
            </div>

            <button className="btn_submitf" type="submit">Застосувати</button>
        </form>
    );
}