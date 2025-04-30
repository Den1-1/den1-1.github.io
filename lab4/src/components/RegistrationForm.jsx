// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import WriteData, { ReadAllInitiatives, ReadData, WriteInitiative } from "../assets/scripts/WriteData";
import { useEffect, useState } from "react";
import WriteUser from "../assets/scripts/WriteData";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBO_A37lPRx84XXuZERrIYIymF_3FvXaVI",
  authDomain: "volunteer-initiatives-8f057.firebaseapp.com",
  databaseURL: "https://volunteer-initiatives-8f057.firebaseio.com",
  projectId: "volunteer-initiatives-8f057",
  storageBucket: "volunteer-initiatives-8f057.firebasestorage.app",
  messagingSenderId: "306158446408",
  appId: "1:306158446408:web:671dcfea8835349ab4757d",
  measurementId: "G-T10E07SS5X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export default function LoginForm({setIsFormVisible}) {
    const [isLogin, setIsLogin] = useState(true);

    // Login
    async function login() {
        const email = document.getElementById("email");
        const password = document.getElementById("password");

        email.setCustomValidity("");
        password.setCustomValidity("");

        // Перевірка на заповненість полів
        const fields = ['email', 'password'];
        let isValid = true;

        fields.forEach(id => {
            const el = document.getElementById(id);
            if (el.value.trim() === '') {
                el.style.border = '2px solid red';
                isValid = false;
            } else {
                el.style.border = '2px solid lime';
            }
        });

        if (!isValid) return;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value); 
        } catch (error) {
            email.style.border = '2px solid red';
            password.style.border = '2px solid red';

            isValid = false;
            
            email.setCustomValidity("");
            email.setCustomValidity("Нерпавильний логін або пароль");
            email.reportValidity();
            console.log("Error: " + error.message, error.code);
        }

        if (!isValid) return;
        setIsFormVisible(prev => !prev)
    }

    // Sign Up
    async function signUp() {
        const email = document.getElementById("email");
        const password = document.getElementById("password");
        const confirm_password = document.getElementById("confirm_password");

        email.setCustomValidity("");
        password.setCustomValidity("");
        confirm_password.setCustomValidity("");

        // Перевірка на заповненість полів
        const fields = ['email', 'password', 'confirm_password'];
        let isValid = true;

        fields.forEach(id => {
            const el = document.getElementById(id);
            if (el.value.trim() === '') {
                el.style.border = '2px solid red';
                isValid = false;
            } else {
                el.style.border = '2px solid lime';
            }
        });

        console.log(password.value.length, password.value.length < 8);

        if (password.value.length < 8) {
            password.style.border = '2px solid red';

            password.setCustomValidity("");
            password.setCustomValidity("Пароль має бути не менше 8 символів");
            password.reportValidity();
            return;
        }

        if (password.value !== confirm_password.value) {
            confirm_password.style.border = '2px solid red';

            confirm_password.setCustomValidity("");
            confirm_password.setCustomValidity("Паролі мають бути однакові");
            confirm_password.reportValidity(); 
            return;
        }

        if (!isValid) return;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value); 
            WriteUser(userCredential.user.email, []);
        } catch (error) {
            email.style.border = '2px solid red'; // червона рамка
            isValid = false; // помилка, бо користувач вже існує
            
            email.setCustomValidity("");
            email.setCustomValidity("Користувач з такою електронною адресою вже існує");
            email.reportValidity();
            console.log("Error: " + error.message, error.code);
        }
        
        if (!isValid) return;
        setIsFormVisible(prev => !prev)
    }

    return (
        <form className="registrationForm" onSubmit={(e) => {e.preventDefault();}}>
            {isLogin && (
                <>
                <h2>Login</h2>
                <button className="btn_close" type="button" onClick={() => setIsFormVisible(prev => !prev)}>✖</button>
    
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required />
    
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required />
    
                <button className="btn_submit" type="submit" onClick={login}>Sign In</button>
                <p className="text_small">or</p>
                <button className="btn_submit btn_small" onClick={() => setIsLogin(false)}>Sign Up</button>
                </>
            )}

            {!isLogin && (
                <>
                <h2>Registration</h2>
                <button className="btn_close" type="button" onClick={() => setIsFormVisible(prev => !prev)}>✖</button>
    
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required />
    
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required />
    
                    <label htmlFor="confirm_password">Confirm password:</label>
                    <input type="password" id="confirm_password" name="confirm_password" required />
    
                <button className="btn_submit" type="submit" onClick={signUp}>Sign Up</button>
                <p className="text_small">or</p>
                <button className="btn_submit btn_small" onClick={() => setIsLogin(true)}>Sign In</button>
                </>
            )}
        </form>
    );
}