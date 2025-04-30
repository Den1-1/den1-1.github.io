<<<<<<< HEAD
import { Link } from "react-router-dom";

export default function Header() {
    return (
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
        </header>
    );
};
=======
import { Link } from "react-router-dom";

export default function Header() {
    return (
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
        </header>
    );
};
>>>>>>> c5f44b3d83f19968b98d27be1ded60cfcabe06e9
