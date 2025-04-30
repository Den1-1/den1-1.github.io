import { Link } from "react-router-dom";
import LoginForm from "./RegistrationForm.jsx";
import { useState } from "react";
import { getAuth, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { useEffect } from "react";


export default function Header() {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [userEmail, setUserEmail] = useState(null);
    

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserEmail(user.email);
                console.log("Імейл:", user.email);
            } else {
                setUserEmail(null);
                console.log("Користувач не увійшов");
            }
        });

        return () => unsubscribe(); // Clean-up при демонтажі
    }, []);

    function signOut() {
        const auth = getAuth();
        firebaseSignOut(auth)
            .then(() => {
                console.log("User signed out");
                setUserEmail(null);
            })
            .catch((error) => {
                console.error("Error signing out:", error);
            });
    }
    return (
        <>
        <header>
            <h1>
                <Link to="/">ActNow</Link> - платформа для організації волонтерських ініціатив
            </h1>
            <nav>
                <ul>
                    <li><Link to="/available_initiatives">Доступні ініціативи</Link></li>
                    <li><Link to="/my_initiatives">Мої ініціативи</Link></li>
                    <li><Link to="/about">Про нас</Link></li>
                </ul>
            </nav>

            {!userEmail && (
            <div>
                <button onClick={() => setIsFormVisible(!isFormVisible)}>Login</button>
            </div>
            )}

            {userEmail && (
            <>
                <div className="user_email">
                    {userEmail}
                </div>

                <div className="user_email">
                    <button onClick={signOut}>Вийти</button>
                </div>
            </>
            )}
        </header>
            
        {isFormVisible && (
            <>
                <div class="blackout"></div>
                <LoginForm setIsFormVisible={setIsFormVisible} />
            </>
        )}
        </>
    );
};