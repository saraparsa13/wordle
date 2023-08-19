import styles from "./Keyboard.module.css";
import Key from "./Key";
import { gameActions } from "../../../store/game-slice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { Fragment, useCallback, useEffect, useState } from "react";

const Keyboard: React.FC = () => {
  const [gameStatus, firstRow, secondRow, thirdRow] = useAppSelector(
    ({
      game: {
        gameStatus,
        lettersAndStyling: {
          q,
          w,
          e,
          r,
          t,
          y,
          u,
          i,
          o,
          p,
          a,
          s,
          d,
          f,
          g,
          h,
          j,
          k,
          l,
          z,
          x,
          c,
          v,
          b,
          n,
          m,
        },
      },
    }) => {
      const firstRow = { q, w, e, r, t, y, u, i, o, p };
      const secondRow = { a, s, d, f, g, h, j, k, l };
      const thirdRow = { z, x, c, v, b, n, m };
      return [gameStatus, firstRow, secondRow, thirdRow];
    }
  );

  const dispatch = useAppDispatch();

  // Handler functions
  const keyPressedHandler = useCallback(
    (keyPressed: string) => {
      dispatch(gameActions.addLetterToCurrentRow(keyPressed));
    },
    [dispatch]
  );

  const backSpaceHandler = useCallback(() => {
    dispatch(gameActions.backSpaceHandler());
  }, [dispatch]);

  const enterHandler = useCallback(() => {
    dispatch(gameActions.enterHandler());
  }, [dispatch]);

  // useEffects

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const pressedKey = event.key;
      if (pressedKey === "Backspace") {
        backSpaceHandler();
        return;
      }

      if (pressedKey === "Enter") {
        enterHandler();
        return;
      }

      if (pressedKey.match(/^[a-z]$/i)) {
        keyPressedHandler(pressedKey.toLocaleLowerCase());
      }
    };

    if (gameStatus === "IN_PROGRESS") {
      window.addEventListener("keyup", handleKeyDown);
    } else {
      window.removeEventListener("keyup", handleKeyDown);
    }
    return () => window.removeEventListener("keyup", handleKeyDown);
  }, [keyPressedHandler, backSpaceHandler, enterHandler, gameStatus]);

  // Helper Function
  const mapKeysHelper = (keys: object) => {
    return Object.entries(keys).map(([key, value]) => {
      return (
        <Key
          key={key}
          content={key}
          state={value}
          onClick={
            gameStatus === "IN_PROGRESS"
              ? keyPressedHandler.bind(null, key)
              : undefined
          }
        />
      );
    });
  };

  return (
    <Fragment>
      <div className={styles.container}>
        <div className={styles.keyboard}>
          <div className={styles.row}>{mapKeysHelper(firstRow)}</div>
          <div className={styles.row}>
            <div className={styles.half}></div>
            {mapKeysHelper(secondRow)}
            <div className={styles.half}></div>
          </div>
          <div className={styles.row}>
            <button
              data-key="↵"
              className={styles["one-and-a-half"]}
              onClick={gameStatus === "IN_PROGRESS" ? enterHandler : undefined}
            >
              enter
            </button>
            {mapKeysHelper(thirdRow)}
            <button
              data-key="←"
              onClick={
                gameStatus === "IN_PROGRESS" ? backSpaceHandler : undefined
              }
              className={styles["one-and-a-half"]}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Keyboard;
