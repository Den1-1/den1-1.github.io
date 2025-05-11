export default function LoginForm({setIsMessageVisible, message}) {

    return (
        <form className="registrationForm" onSubmit={(e) => {e.preventDefault();}}>
            <h2>Message!!!</h2>
            <p>{message}</p>
            <button className="btn_submit" onClick={() => setIsMessageVisible(prev => !prev)}>OK</button>
        </form>
    );
}