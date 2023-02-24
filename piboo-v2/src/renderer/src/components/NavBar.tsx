import { NavLink } from "react-router-dom";
import styles from './NavBar.module.css';

export default function NavBar(): JSX.Element {
    return (
        <div className={styles.HLayout}>
            <NavLink to="/" end>Capture</NavLink>
            <NavLink to="editor">Editeur</NavLink>
        </div>
    );
}