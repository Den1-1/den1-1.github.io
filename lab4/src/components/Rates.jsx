// export default function Rates({ initiativeId }) { 

//     function HoverRating(event) {
//         const rating = event.target.id;
//         console.log("rating", rating);
//         const parentDiv = event.target.closest('.rating');

//         const stars = parentDiv.querySelectorAll('span');
//         stars.forEach((star, index) => {
//             if (index < rating) {
//                 star.innerHTML = '★';
//             } else {
//                 star.innerHTML = '☆';
//             }
//         });
//     }

//     function ClickRating(event) {
//         const rating = event.target.id;
//         console.log("rating", rating);
//         const parentDiv = event.target.closest('.rating');

//         const stars = parentDiv.querySelectorAll('span');
//         stars.forEach((star, index) => {
//             if (index < rating) {
//                 star.innerHTML = '★';
//             } else {
//                 star.innerHTML = '☆';
//             }
//         });
//     }

//     return (
//         <div className="rating">
//             <span id="1" onMouseEnter={HoverRating} onClick={ClickRating}>★</span>
//             <span id="2" onMouseEnter={HoverRating} onClick={ClickRating}>★</span>
//             <span id="3" onMouseEnter={HoverRating} onClick={ClickRating}>★</span>
//             <span id="4" onMouseEnter={HoverRating} onClick={ClickRating}>★</span>
//             <span id="5" onMouseEnter={HoverRating} onClick={ClickRating}>★</span>
//         </div>
//     )
// }


import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { findUserByEmail } from "../assets/scripts/WriteData.js"; // Імпортуємо функцію findUserByEmail

export default function Rates({ initiativeId }) {
  const [rating, setRating] = useState(0); // Поточна оцінка користувача
  const [hover, setHover] = useState(0);   // Оцінка при наведенні
  const [userId, setUserId] = useState(null);

  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        findUserByEmail(user.email).then((userData) => {
          if (userData) {
            setUserId(userData.id);
          } else {
            console.error("Користувача не знайдено в базі даних");
          }
          fetchUserRating(userData.id);
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserRating = async (uid) => {
    const docRef = doc(db, "initiatives", initiativeId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const userRate = data.rates?.find((r) => r.user === uid);
      if (userRate) {
        setRating(userRate.rate);
      }
    }
  };

  const handleClick = async (value) => {
    if (!userId) return;

    const docRef = doc(db, "initiatives", initiativeId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return;

    const data = docSnap.data();
    let updatedRates = data.rates || [];

    const existingIndex = updatedRates.findIndex((r) => r.user === userId);
    if (existingIndex !== -1) {
      updatedRates[existingIndex].rate = value;
    } else {
      updatedRates.push({ user: userId, rate: value });
    }

    await updateDoc(docRef, { rates: updatedRates });
    setRating(value);
  };

  return (
    <div className="rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => handleClick(star)}
          style={{
            cursor: "pointer",
            color: (hover || rating) >= star ? "#ffc107" : "#e4e5e9",
            fontSize: "24px",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}