import Menu from '../Menu/Menu';
import styles from './Header.module.scss';

const Header = (): React.ReactElement => (
  <header className={styles.Header}>
    <div className={styles.title}>Дневник</div>
    <Menu />
  </header>
);

export default Header;
