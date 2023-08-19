import { createSlice } from "@reduxjs/toolkit";

import Letters, { LettersInterface, LettersObjectKeyType } from "./Letters";

interface GameState {
  gameStatus: string;
  numberOfLetters: number;
  numberOfRows: number;
  currentRow: number;
  boardState: Array<string>;
  boardStyles: Array<string>;
  targetWord: string;
  lettersAndStyling: LettersInterface;
  alertMessage: { message: string };
}

const targetWord: string = "react";

const initialState: GameState = {
  gameStatus: "IN_PROGRESS",
  numberOfLetters: 5,
  numberOfRows: 6,
  currentRow: 0,
  boardState: new Array(6).fill(""),
  boardStyles: new Array(6).fill(""),
  targetWord: targetWord,
  lettersAndStyling: Letters,
  alertMessage: { message: "" },
};

// Helpers

const regexUnicode = (whatToSearch: string) => {
  const flags = "u";
  return new RegExp(whatToSearch, flags);
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    addLetterToCurrentRow(state, action) {
      state.alertMessage = {
        message: ""
      }
      if (state.currentRow === state.numberOfRows) return;
      if (state.boardState[state.currentRow].length < state.numberOfLetters) {
        state.boardState[state.currentRow] += action.payload;
      }
    },
    backSpaceHandler(state) {
      if (state.currentRow === state.numberOfRows) return;
      if (state.boardState[state.currentRow].length > 0) {
        state.boardState[state.currentRow] = state.boardState[
          state.currentRow
        ].slice(0, -1);
      }
    },
    enterHandler(state) {
      if (state.boardState[state.currentRow].length === state.numberOfLetters) {
        const styles = new Array(state.numberOfLetters).fill("a");

        let targetPresent = state.targetWord;

        const currentTryWord = state.boardState[state.currentRow];

        for (let index = 0; index < currentTryWord.length; index++) {
          const attemptLetter = currentTryWord[index];
          const regex = regexUnicode(attemptLetter);

          const attemptLetterKey = attemptLetter as LettersObjectKeyType;

          if (attemptLetter === targetPresent[index]) {
            styles[index] = "c";
            targetPresent = targetPresent.replace(regex, "!");
            targetPresent = targetPresent;

            state.lettersAndStyling[attemptLetterKey] = "correct";

            continue;
          }

          if (targetPresent.includes(attemptLetter)) {
            styles[index] = "p";
            targetPresent = targetPresent.replace(regex, "!");

            if (state.lettersAndStyling[attemptLetterKey] === "correct")
              continue;

            state.lettersAndStyling[attemptLetterKey] = "present";

            continue;
          }

          if (
            state.lettersAndStyling[attemptLetterKey] === "correct" ||
            state.lettersAndStyling[attemptLetterKey] === "present"
          )
            continue;

          state.lettersAndStyling[attemptLetterKey] = "abscent";
        }

        state.boardStyles[state.currentRow] = styles.join("");

        if (state.boardStyles[state.currentRow] === "ccccc") {
          state.gameStatus = "WIN";

          state.alertMessage = {
            message: "Great",
          };

          ++state.currentRow;
          return;
        }
        ++state.currentRow;
        if (state.currentRow === state.numberOfRows) {
          state.gameStatus = "fail";
          state.alertMessage = {
            message: `keyword: ${state.targetWord.toUpperCase()}`,
          };
          return;
        }
      } else {
        state.alertMessage.message = "Not enough letters";
      }
    },
  },
});

export default gameSlice.reducer;

export const gameActions = gameSlice.actions;
