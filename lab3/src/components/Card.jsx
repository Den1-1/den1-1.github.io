export default function Card({ data }) {
    return (
        <div className="initiative">
            <h3>{data.title}</h3>
            <p className="category">{data.category}</p>
            <p className="description">{data.description}</p>
            <ul>
                <li>Дата проведення: {data.date}</li>
                <li>Місце проведення: {data.location}</li>
                <li>Кількість волонтерів: {data.volunteers}</li>
            </ul>
            <button className="btn_join">Приєднатися</button>
        </div>
    );

}