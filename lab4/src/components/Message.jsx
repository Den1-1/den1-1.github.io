<<<<<<< HEAD


export default function LoginForm({setIsMessageVisible, message}) {

    return (
        <form className="registrationForm" onSubmit={(e) => {e.preventDefault();}}>
            <h2>Message!!!</h2>
            <p>{message}</p>
            <button className="btn_submit" onClick={() => setIsMessageVisible(prev => !prev)}>OK</button>
        </form>
    );
=======


export default function LoginForm({setIsMessageVisible, message}) {

    return (
        <form className="registrationForm" onSubmit={(e) => {e.preventDefault();}}>
            <h2>Message!!!</h2>
            <p>{message}</p>
            <button className="btn_submit" onClick={() => setIsMessageVisible(prev => !prev)}>OK</button>
        </form>
    );
>>>>>>> c5f44b3d83f19968b98d27be1ded60cfcabe06e9
}