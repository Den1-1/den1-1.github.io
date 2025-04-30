import { ReadAllInitiatives } from './WriteData';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { findUserByEmail } from './WriteData';

function getCurrentUser() {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
        unsubscribe(); // Відписка після отримання користувача
        resolve(user);
      }, reject);
    });
  }

export default async function loadInitiatives(cards, setCards, filterValues) {
    const user = await getCurrentUser();

    var selected_initiatives = []; // Масив для зберігання обраних ініціатив користувача
    if (user) {
      console.error("Користувач не увійшов");
      console.log("Імейл:", user.email);
      const userData = await findUserByEmail(user.email);
      const userId = await userData.id;
      
      const db = getFirestore();
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      
      selected_initiatives = userSnap.data().selected_initiatives || [];
    }


    let count = cards.length + 10; // Отримуємо кількість ініціатив, які вже завантажені    
    let dataArray = []; // Масив для зберігання даних ініціатив
    
    const currentDate = new Date();
    const initiatives = await ReadAllInitiatives(); // Читання всіх ініціатив з Firestore
    
    // if (user) {
    //     console.log("Імейл:", user.email);
    // } else {
    //     console.log("Користувач не увійшов");
    // }


    let i = -1;
    while (++i < initiatives.length && dataArray.length < count) { //----------------------------- Показ ініціатив
        let data = initiatives[i]

        // Ящо розділ Мої ініціативи показати лише обрані
        if (document.querySelector('h2').textContent == 'Мої ініціативи') {
            if (!selected_initiatives.includes(data.id))
                continue; // Пропускаємо решту коду в циклі
        }

        if (filterValues.relevant && data.date < currentDate) continue; // Перевіряємо, чи ініціатива ще актуальна
        
        if (filterValues.education || filterValues.health || filterValues.environment) {
            var category = [filterValues.education ? 'Education' : null, filterValues.health ? 'Health' : null, filterValues.environment ? 'Environment' : null];
            
            if (!category.includes(data.category)) continue;
        }
        

        dataArray.push(data); // Додаємо ініціативу в масив
    }

    setCards(dataArray); // Додаємо нові ініціативи до стану карток
}

export async function isSelected(email, initiativeId) {
    if (!email) return false;
    const user = await findUserByEmail(email);
    const userId = await user.id;

    const db = getFirestore();
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        const data = userSnap.data();
        console.warn(data.selected_initiatives?.includes(initiativeId) ?? false);
        return data.selected_initiatives?.includes(initiativeId) ?? false;
    } else {
        return false;
    }
}