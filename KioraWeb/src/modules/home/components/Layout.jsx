import imageBg from '../../../assets/main.jpg'; /* Sumamos un nivel de retorno por entrar a components/ */
import styles from './Layout.module.css';

const MainLayout = ({ children }) => {
    return (
        <div className={styles['main-container']}>
            <div className={styles.backgroundWrapper}>
                <img src={imageBg} alt="Background" className={styles['image-background']} />
            </div>
            <div className={styles.contentOverlay}>
                {children}
            </div>
        </div>
    );
};

export default MainLayout;
