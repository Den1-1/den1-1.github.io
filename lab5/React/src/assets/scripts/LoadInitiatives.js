import { ReadInitiativesPaginated } from './WriteData';

export default async function loadInitiatives(cards, setCards, filterValues, userData) {
    const lastCard = cards[cards.length - 1];
    const lastId = lastCard ? lastCard.id : null;

    const newInitiatives = await ReadInitiativesPaginated(10, lastId);

    const currentDate = new Date();
    const selected_initiatives = userData?.selected_initiatives || [];

    const filtered = newInitiatives.filter((data) => {
        if (document.querySelector('h2').textContent === 'Мої ініціативи' &&
            !selected_initiatives.includes(data.id)) return false;

        if (filterValues.relevant && new Date(data.date) < currentDate) return false;

        if (filterValues.education || filterValues.health || filterValues.environment) {
            const categories = [
                filterValues.education ? 'Education' : null,
                filterValues.health ? 'Health' : null,
                filterValues.environment ? 'Environment' : null,
            ].filter(Boolean);
            if (!categories.includes(data.category)) return false;
        }

        return true;
    });

    setCards([...cards, ...filtered]);
}

export async function isSelected(userData, initiativeId) {
    console.log("IsSelected userData:", userData);

    if (!userData) return false;

    console.warn(userData.selected_initiatives?.includes(initiativeId) ?? false);
    return userData.selected_initiatives?.includes(initiativeId) ?? false;
}