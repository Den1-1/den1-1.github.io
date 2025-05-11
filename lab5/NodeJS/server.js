const firebaseConfig = require("./firebaseConfig.js").default;
const { doc, updateDoc, arrayUnion, increment } = require("firebase-admin/firestore");
const { FieldValue } = require("firebase-admin/firestore");

const express = require("express");
const cors = require("cors");

const admin = require("firebase-admin"); // Initialize Firebase Admin SDK

let serviceAccountPath = '';

const fs = require('fs');
if (fs.existsSync('./serviceAccountKey.json')) {
  serviceAccountPath = './serviceAccountKey.json';
} else if (fs.existsSync('/etc/secrets/serviceAccountKey.json')) {
  serviceAccountPath = '/etc/secrets/serviceAccountKey.json';
} else {
  throw new Error('❌ serviceAccountKey.json not found in expected locations.');
}

const serviceAccount = require(serviceAccountPath);
// const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) }); 
const db = admin.firestore();

const app = express(); 
app.use(cors());
app.use(express.json());

app.listen(5000, () => { console.log("Server is running on port 5000"); });


// Fetch data from Firestore
app.get("/api/users", async (req, res) => {
    const snapshot = await db.collection("users").get();
    const users = [];
    snapshot.forEach(doc => {
        users.push({ id: doc.id, ...doc.data() });
    });
    res.json(users);
}); 


// Add a new user to Firestore
app.post("/api/register", async (req, res) => {
    const { uid, email, selected_initiatives } = req.body;

    if (!email || !selected_initiatives) {
        return res.status(400).json({ error: "Missing email, password or selected_initiatives" });
    }

    try {
        // Збереження додаткової інформації у Firestore
        await db.collection("users").doc(uid).set({
            email,
            selected_initiatives
        });

        res.status(201).json({
            message: "User registered successfully",
            uid: userRecord.uid,
            email: email
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: error.message });
    }
});


// app.post("/api/login", async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).json({ error: "Missing email or password" });
//     }

//     try {
//         console.log(firebaseConfig)
//         const firebaseUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`;

//         const response = await fetch(firebaseUrl, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 email,
//                 password,
//                 returnSecureToken: true
//             })
//         });

//         const data = await response.json();

//         if (!response.ok) {
//             console.error("Login error:", data.error?.message);
//             return res.status(401).json({ error: "Invalid credentials", details: data.error?.message });
//         }

//         const { idToken, localId } = data;

//         res.status(200).json({
//             message: "Login successful",
//             token: idToken,
//             uid: localId,
//             email: email
//         });

//     } catch (error) {
//         console.error("Login error:", error.message);
//         res.status(500).json({ error: "Internal server error", details: error.message });
//     }
// });

// Сервер: Node.js + Express + Firestore
app.get("/api/initiatives", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const startAfterId = req.query.startAfter || null;

        let query = db.collection("initiatives").orderBy("date", "asc").limit(limit);

        if (startAfterId) {
            const startDoc = await db.collection("initiatives").doc(startAfterId).get();
            if (startDoc.exists) {
                query = query.startAfter(startDoc);
            }
        }

        const snapshot = await query.get();
        const initiatives = [];
        // snapshot.forEach((doc) => {
        //     initiatives.push({ id: doc.id, ...doc.data() });
        // });

        snapshot.forEach((doc) => {
            const data = doc.data();

            // Обчислення середньої оцінки
            if (Array.isArray(data.rates) && data.rates.length > 0) {
                const total = data.rates.reduce((sum, r) => sum + (r.rate || 0), 0);
                const average = total / data.rates.length;
                data.averageRate = Math.round(average); // Додаємо поле averageRate
            } else {
                data.averageRate = null; // або 0, якщо потрібно
            }

            initiatives.push({ id: doc.id, ...data });
        });

        res.status(200).json(initiatives);
    } catch (error) {
        console.error("Error getting initiatives:", error);
        res.status(500).json({ error: "Failed to fetch initiatives" });
    }
});

// app.get("/api/initiatives", async (req, res) => {
//     try {
//         const initiativesQuery = query(collection(db, "initiatives"), limit(10));
//         const snapshot = await getDocs(initiativesQuery);
        
//         const initiatives = [];
//         snapshot.forEach((doc) => {
//             initiatives.push({ id: doc.id, ...doc.data() });
//         });

//         res.status(200).json(initiatives);
//     } catch (error) {
//         console.error("Error getting initiatives:", error);
//         res.status(500).json({ error: "Failed to fetch initiatives" });
//     }
// });

// Додавання нової ініціативи до Firestore
app.post("/api/add_initiative", async (req, res) => {
    const { title, category, description, date, location, volunteers } = req.body;

    // Перевірка обовʼязкових полів
    if (!title || !category || !description || !date || !location || !volunteers) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const docRef = await db.collection("initiatives").add({
            title,
            category,
            description,
            date,
            location,
            volunteers
        });

        res.status(201).json({
            message: "Initiative created successfully",
            id: docRef.id
        });
    } catch (error) {
        console.error("Error adding initiative:", error);
        res.status(500).json({ error: "Failed to add initiative" });
    }
});

// Verify Firebase Auth Token (Middleware)
const verifyToken = async (req, res, next) => { 
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = await admin.auth().verifyIdToken(token); 
    req.user = decodedToken;
    next();
};

// // Protected route (Only accessible with a valid token) 
// app.get("/api/protected", verifyToken, (req, res) => {
//     res.json({ message: "You have accessed a protected route!", user: req.user });
// });

// Protected route (Only accessible with a valid token) 
app.get("/api/get_user", verifyToken, async (req, res) => {
    const uid = req.user.uid;

    try {
        const userDoc = await db.collection("users").doc(uid).get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: "User not found in Firestore" });
        }

        const userData = userDoc.data();

        res.json({
            message: "Protected user data retrieved successfully",
            user: {
                uid: uid,
                ...userData
            }
        });
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ message: "Failed to fetch user data" });
    }
});

// Protected route (Only accessible with a valid token) 
app.post("/api/add_selected_initiative", verifyToken, async (req, res) => {
    const { userId, initiativeId } = req.body;

    if (!userId || !initiativeId) {
        return res.status(400).json({ error: "Missing userId or initiativeId" });
    }

    try {
        const userRef = db.collection("users").doc(userId);
        const initiativeRef = db.collection("initiatives").doc(initiativeId);

        // Додаємо ініціативу до масиву обраних користувача
        await userRef.update({
            selected_initiatives: FieldValue.arrayUnion(initiativeId),
        });

        // Зменшуємо кількість волонтерів на 1
        await initiativeRef.update({
            volunteers: FieldValue.increment(-1),
        });

        res.status(200).json({ message: "Initiative selected successfully" });
    } catch (error) {
        console.error("Error updating selection:", error);
        res.status(500).json({ error: "Failed to update selection" });
    }
});


app.post("/api/remove_selected_initiative", verifyToken, async (req, res) => {
  const { userId, initiativeId } = req.body;

  if (!userId || !initiativeId) {
    return res.status(400).json({ error: "Missing userId or initiativeId" });
  }

  try {
    const userRef = db.collection("users").doc(userId);
    const initiativeRef = db.collection("initiatives").doc(initiativeId);

    // Видаляємо ініціативу з масиву обраних користувача
    await userRef.update({
      selected_initiatives: FieldValue.arrayRemove(initiativeId),
    });

    // Збільшуємо кількість волонтерів на 1
    await initiativeRef.update({
      volunteers: FieldValue.increment(1),
    });

    res.status(200).json({ message: "Initiative removed successfully" });
  } catch (error) {
    console.error("Error removing selection:", error);
    res.status(500).json({ error: "Failed to remove selection" });
  }
});

app.patch("/api/initiatives/:id/rate", async (req, res) => {
    const { id } = req.params;
    const { userId, rate } = req.body;

    if (!userId || typeof rate !== "number") {
        return res.status(400).json({ error: "Missing or invalid data" });
    }

    try {
        const docRef = db.collection("initiatives").doc(id);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return res.status(404).json({ error: "Initiative not found" });
        }

        const data = docSnap.data();
        let updatedRates = data.rates || [];

        const index = updatedRates.findIndex((r) => r.user === userId);
        if (index !== -1) {
            updatedRates[index].rate = rate;
        } else {
            updatedRates.push({ user: userId, rate });
        }

        await docRef.update({ rates: updatedRates });

        res.status(200).json({ success: true, updatedRates });
    } catch (error) {
        console.error("Error updating rate:", error);
        res.status(500).json({ error: "Failed to update rate" });
    }
});