import globalStyles from '../global-styles.module.css';
import NavBar from "./NavBar";

export default function NavWrapper({children}): JSX.Element {
    return (
        <div className={globalStyles.VLayout}>
            {children}
            <NavBar />
        </div>
    );
}