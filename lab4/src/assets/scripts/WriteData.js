import { getFirestore, doc, setDoc, getDoc, getDocs, collection, addDoc, query, where, updateDoc, arrayUnion, arrayRemove, increment } from "firebase/firestore";

export default async function WriteUser(email, selected_initiatives) {
    const db = getFirestore();
    const userCol = collection(db, "users");

    try {
        const docRef = await addDoc(userCol, {
            email: email,
            selected_initiatives: selected_initiatives
        });
        console.log("User created with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error adding user:", error);
        return null;
    }
}

export async function addSelectedInitiative(userId, initiativeId) {
    const db = getFirestore();
    const userRef = doc(db, "users", userId);
    const initiativeRef = doc(db, "initiatives", initiativeId);

    try {
        // Додаємо ID ініціативи до обраних у користувача
        await updateDoc(userRef, {
            selected_initiatives: arrayUnion(initiativeId)
        });

        // Зменшуємо кількість доступних волонтерів в ініціативі
        await updateDoc(initiativeRef, {
            volunteers: increment(-1)
        });

        console.log("Ініціатива додана до обраних і лічильник зменшено");
    } catch (error) {
        console.error("Помилка при оновленні:", error);
    }
}

export async function removeSelectedInitiative(userId, initiativeId) {
    const db = getFirestore();
    const userRef = doc(db, "users", userId);
    const initiativeRef = doc(db, "initiatives", initiativeId);

    try {
        // Видаляємо ID ініціативи з обраних у користувача
        await updateDoc(userRef, {
            selected_initiatives: arrayRemove(initiativeId)
        });

        // Збільшуємо кількість доступних волонтерів в ініціативі
        await updateDoc(initiativeRef, {
            volunteers: increment(1)
        });

        console.log("Ініціатива видалена з обраних і лічильник збільшено");
    } catch (error) {
        console.error("Помилка при оновленні:", error);
    }
}

export async function ReadAllInitiatives() {
    const db = getFirestore();
    const initiativesCol = collection(db, "initiatives");

    try {
        const snapshot = await getDocs(initiativesCol);
        const initiatives = [];
        snapshot.forEach((doc) => {
            initiatives.push({ id: doc.id, ...doc.data() });
        });
        console.log("All initiatives:", initiatives);

        return initiatives;
    } catch (error) {
        console.error("Error getting documents:", error);
        return null;
    }
}

export async function WriteInitiative({ title, category, description, date, location, volunteers }) {
    const db = getFirestore();
    const initiativesCol = collection(db, "initiatives");

    try {
        const docRef = await addDoc(initiativesCol, {
            title,
            category,
            description,
            date,
            location,
            volunteers
        });
        console.log("Initiative created with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error adding initiative:", error);
        return null;
    }
}

export async function findUserByEmail(email) {
    const db = getFirestore();
    const usersRef = collection(db, "users");

    const q = query(usersRef, where("email", "==", email));

    try {
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            // console.log("Користувача не знайдено.");
            return null;
        }

        const users = [];
        querySnapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
        });

        // console.log("Знайдено користувачів:", users);
        return users[0];
    } catch (error) {
        console.error("Помилка пошуку користувача:", error);
        return null;
    }
}