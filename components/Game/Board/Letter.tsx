import { useEffect, useRef, useState } from "react";
import { gameActions } from "../../../store/game-slice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import styles from "./Letter.module.css";

interface LetterProps {
  content: string;
  dataState: string;
  index: number;
}

const Letter: React.FC<LetterProps> = (props) => {
  const gameStatus = useAppSelector(({ game: { gameStatus } }) => gameStatus);
  const reference = useRef<HTMLDivElement>(null);
  const [resultStyles, setResultStyles] = useState("");

  const animationEndHandler = () => {
    if (reference.current?.classList.contains(styles.flipin)) {
      reference.current?.classList.remove(styles.flipin);
      setResultStyles(props.dataState);
      reference.current?.classList.add(styles.flipout);
      return;
    }
    if (reference.current?.classList.contains(styles.flipout)) {
      reference.current?.classList.remove(styles.flipout);
      if (gameStatus === "WIN") {
        reference.current?.classList.add(styles.win);
      }
      return;
    }
    if (reference.current?.classList.contains(styles.win)) {
      reference.current?.classList.remove(styles.win);
      return;
    }
  };

  useEffect(() => {
    const active = "A";
    const alreadyUsed = "u";

    ((dataState: string) => {
      if (dataState === "") {
        return setResultStyles("");
      }
      if (dataState === active) {
        return setResultStyles(active);
      }
      if (dataState === alreadyUsed) {
        return setResultStyles(alreadyUsed);
      }
      reference.current?.classList.add(styles.flipin);
    })(props.dataState);
  }, [props.dataState, props.index]);

  return (
    <div className={`${styles.container}`}>
      <div
        ref={reference}
        className={`${styles.letter}

        `}
        data-state={resultStyles}
        onAnimationEnd={animationEndHandler}
      >
        {props.content}
      </div>
    </div>
  );
};

export default Letter;
