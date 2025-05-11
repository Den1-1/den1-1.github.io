import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

export default function Rates({ initiative, userData }) {
  const [rating, setRating] = useState(0); // Поточна оцінка користувача
  const [hover, setHover] = useState(0);   // Оцінка при наведенні
  const db = getFirestore();

  useEffect(() => {
    const averageRate = initiative.averageRate;
    if (averageRate) {
      setRating(averageRate);
    }

    if (!userData) return;

    const userRate = initiative.rates?.find((r) => r.user === userData.uid);
      if (userRate) {
        setRating(userRate.rate);
      }
    
  }, []);

  const handleClick = async (value) => {
    if (!userData) return;

    try {
      const response = await fetch(`http://localhost:5000/api/initiatives/${initiative.id}/rate`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData.uid,
          rate: value,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update rating");
      }

      const result = await response.json();
      console.log("Rating updated:", result);
      setRating(value);
    } catch (error) {
      console.error("Error updating rating:", error);
    }
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