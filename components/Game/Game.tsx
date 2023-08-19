import Board from "./Board/Board";
import Keyboard from "./Keyboard/Keyboard";
import styles from "./Game.module.css";
import { Provider } from "react-redux";
import store from "../../store/store";
import Alert from "./Alert/Alert";

const Game: React.FC = () => {
  return (
    <Provider store={store}>
      <div className={styles.game}>
        <Alert />
        <Board />
        <Keyboard />
      </div>
    </Provider>
  );
};

export default Game;
