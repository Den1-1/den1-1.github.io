import { getAuth, getIdToken } from "firebase/auth";

export default async function WriteUser(uid, email, selected_initiatives) {
    try {
        const response = await fetch("http://localhost:5000/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ uid, email, selected_initiatives })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to register user");
        }

        const data = await response.json();
        console.log("User registered with ID:", data.uid);
        return data.uid;
    } catch (error) {
        console.error("Error registering user:", error.message);
        return null;
    }
}

export async function addSelectedInitiative(userId, initiativeId) {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    console.warn("Please log in first.");
  }
  try {
    const token = await getIdToken(user);
    console.log("Token:", token);
    const response = await fetch("http://localhost:5000/api/add_selected_initiative", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userId: userId,
            initiativeId: initiativeId
        })
    });
  } catch (error) {
    console.warn("Error protected data: " + error.message);
  }
}

export async function removeSelectedInitiative(userId, initiativeId) {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    console.warn("Please log in first.");
    return;
  }

  try {
    const token = await getIdToken(user);
    const response = await fetch("http://localhost:5000/api/remove_selected_initiative", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        initiativeId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Server error:", errorData);
    } else {
      console.log("Ініціатива успішно видалена з обраних");
    }
  } catch (error) {
    console.warn("Error removing initiative: " + error.message);
  }
}

export async function ReadAllInitiatives() {
    try {
        const response = await fetch("http://localhost:5000/api/initiatives");
        if (!response.ok) {
            throw new Error("Failed to fetch initiatives");
        }

        const initiatives = await response.json();
        console.log("All initiatives:", initiatives);
        return initiatives;
    } catch (error) {
        console.error("Error fetching initiatives:", error);
        return null;
    }
}

export async function ReadInitiativesPaginated(limit = 10, startAfterId = null) {
    try {
        let url = `http://localhost:5000/api/initiatives?limit=${limit}`;
        if (startAfterId) url += `&startAfter=${startAfterId}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch initiatives");

        const initiatives = await response.json();
        return initiatives;
    } catch (error) {
        console.error("Error fetching initiatives:", error);
        return [];
    }
}

export async function WriteInitiative(initiativeData) {
    try {
        const response = await fetch("http://localhost:5000/api/add_initiative", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(initiativeData)
        });

        const result = await response.json();
        if (response.ok) {
            console.log("Initiative created with ID:", result.id);
            return result.id;
        } else {
            throw new Error(result.error || "Unknown error");
        }
    } catch (error) {
        console.error("Error adding initiative:", error.message);
        return null;
    }
}

// Fetch Protected API Data
export async function getUser() {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    console.warn("Please log in first.");
    return null;
  }
  try {
    const token = await getIdToken(user);
    console.log("Token:", token);
    const response = await fetch("http://localhost:5000/api/get_user", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await response.json();
    console.log(JSON.stringify(data));
    return data.user;
  } catch (error) {
    console.warn("Error fetching protected data: " + error.message);
  }
}