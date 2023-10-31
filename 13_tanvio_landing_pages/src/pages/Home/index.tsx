import React from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.scss";
import Logo from "../../assets/logo";

const Home: React.FC = () => {
  return (
    <header>
      <div className={styles.logo}>
        <Logo />
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/features">Features</Link>
          </li>
          <li>
            <Link to="/company">Company</Link>
          </li>
        </ul>
      </nav>
      <div className={styles.getStarted}>
        <button>Get Started</button>
      </div>
    </header>
  );
};

export default Home;
