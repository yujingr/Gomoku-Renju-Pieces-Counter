document.addEventListener("DOMContentLoaded", () => {
  const diagonalStarts = [
    [0, 14],
    [0, 13],
    [0, 12],
    [0, 11],
    [0, 10],
    [0, 9],
    [0, 8],
    [0, 7],
    [0, 6],
    [0, 5],
    [0, 4],
    [0, 3],
    [0, 2],
    [0, 1],
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0],
    [6, 0],
    [7, 0],
    [8, 0],
    [9, 0],
    [10, 0],
    [11, 0],
    [12, 0],
    [13, 0],
    [14, 0],
  ];
  const diagonalStartsTop = [
    [0, 14],
    [1, 14],
    [2, 14],
    [3, 14],
    [4, 14],
    [5, 14],
    [6, 14],
    [7, 14],
    [8, 14],
    [9, 14],
    [10, 14],
    [11, 14],
    [12, 14],
    [13, 14],
    [14, 14],
    [0, 13],
    [0, 12],
    [0, 11],
    [0, 10],
    [0, 9],
    [0, 8],
    [0, 7],
    [0, 6],
    [0, 5],
    [0, 4],
    [0, 3],
    [0, 2],
    [0, 1],
    [0, 0],
  ];
  const boardSize = 15;
  let language = "zh";
  const gameBoard = document.getElementById("gameBoard");
  const verticalLabels = document.getElementById("verticalLabels");
  const horizontalLabels = document.getElementById("horizontalLabels");
  let historicalStates = [];
  let currentStateIndex = 0;
  let currentPlayer = "black";
  const isInRange = (x, y) =>
    x >= 0 && x < boardSize && y >= 0 && y < boardSize;

  const checkOpenFoursInSequence = (sequence, p) => {
    // the input will be the whole row, with undefined number of pieces
    // return starting and ending positions
    let openFours = [];
    const toMatch = [0, p, p, p, p, 0];
    for (let i = 0; i < sequence.length - 5; i++) {
      const subsequence = sequence.slice(i, i + 6);
      if (toMatch.every((val, index) => val === subsequence[index])) {
        openFours.push({ start: i + 1, end: i + 4 });
      }
    }
    return openFours;
  };

  const checkClosedFoursInSequence = (sequence, p) => {
    let closedFours = [];
    const openFours = checkOpenFoursInSequence(sequence, p);
    const toMatches = [
      [0, p, p, p, p],
      [p, 0, p, p, p],
      [p, p, 0, p, p],
      [p, p, p, 0, p],
      [p, p, p, p, 0],
    ];

    toMatches.forEach((pattern) => {
      for (let i = 0; i <= sequence.length - pattern.length; i++) {
        const subsequence = sequence.slice(i, i + pattern.length);
        if (pattern.every((val, index) => val === subsequence[index])) {
          // Check overlap with open fours
          const start = i + subsequence.indexOf(p);
          const end = i + subsequence.lastIndexOf(p);
          const isOverlapping = openFours.some(
            (openFour) =>
              (start <= openFour.end && start >= openFour.start) ||
              (end >= openFour.start && end <= openFour.end)
          );
          if (!isOverlapping) {
            closedFours.push({ start, end });
          }
        }
      }
    });

    return closedFours;
  };

  const countOpenFours = (board, player) => {
    let openFours = [];
    let openFoursWithLetterNumber = []; // ex[{start: B2 , end: E2},...]
    // check each row and append to openFoursWithLetterNumber the exact positions
    for (let i = 0; i < board.length; i++) {
      const row = board[i];
      const openFoursInRow = checkOpenFoursInSequence(row, player);
      openFours = openFours.concat(openFoursInRow);
      openFoursInRow.forEach((four) => {
        openFoursWithLetterNumber.push({
          start: `${String.fromCharCode(65 + four.start)}${i + 1}`,
          end: `${String.fromCharCode(65 + four.end)}${i + 1}`,
        });
      });
    }
    // check each column and append to openFoursWithLetterNumber the exact positions
    for (let i = 0; i < board.length; i++) {
      const column = board.map((row) => row[i]);
      const openFoursInColumn = checkOpenFoursInSequence(column, player);
      openFours = openFours.concat(openFoursInColumn);
      openFoursInColumn.forEach((four) => {
        openFoursWithLetterNumber.push({
          start: `${String.fromCharCode(65 + i)}${four.start + 1}`,
          end: `${String.fromCharCode(65 + i)}${four.end + 1}`,
        });
      });
    }
    // check bottom right diagonals

    for (let i = 0; i < diagonalStarts.length; i++) {
      const [x, y] = diagonalStarts[i];
      const diagonal = [];
      for (let j = 0; j < board.length; j++) {
        if (isInRange(x + j, y + j)) {
          diagonal.push(board[x + j][y + j]);
        }
      }
      const openFoursInDiagonal = checkOpenFoursInSequence(diagonal, player);
      openFours = openFours.concat(openFoursInDiagonal);
      openFoursInDiagonal.forEach((four) => {
        openFoursWithLetterNumber.push({
          start: `${String.fromCharCode(65 + y + four.start)}${
            x + four.start + 1
          }`,
          end: `${String.fromCharCode(65 + y + four.end)}${x + four.end + 1}`,
        });
      });
    }

    // check top right diagonals

    for (let i = 0; i < diagonalStartsTop.length; i++) {
      const [x, y] = diagonalStartsTop[i];
      const diagonal = [];
      for (let j = 0; j < board.length; j++) {
        if (isInRange(x + j, y - j)) {
          diagonal.push(board[x + j][y - j]);
        }
      }
      const openFoursInDiagonal = checkOpenFoursInSequence(diagonal, player);
      openFours = openFours.concat(openFoursInDiagonal);
      openFoursInDiagonal.forEach((four) => {
        openFoursWithLetterNumber.push({
          start: `${String.fromCharCode(65 + y - four.end)}${x + four.end + 1}`,
          end: `${String.fromCharCode(65 + y - four.start)}${
            x + four.start + 1
          }`,
        });
      });
    }
    //  return open fours
    return openFoursWithLetterNumber;
  };

  // might need to double check the logic
  const countClosedFours = (board, player) => {
    let closedFoursWithLetterNumber = []; // ex[{start: B2 , end: E2},...]

    for (let i = 0; i < board.length; i++) {
      const row = board[i];
      const closedFoursInRow = checkClosedFoursInSequence(row, player);

      closedFoursInRow.forEach((four) => {
        closedFoursWithLetterNumber.push({
          start: `${String.fromCharCode(65 + four.start)}${i + 1}`,
          end: `${String.fromCharCode(65 + four.end)}${i + 1}`,
        });
      });
    }

    for (let i = 0; i < board.length; i++) {
      const column = board.map((row) => row[i]);
      const closedFoursInColumn = checkClosedFoursInSequence(column, player);

      closedFoursInColumn.forEach((four) => {
        closedFoursWithLetterNumber.push({
          start: `${String.fromCharCode(65 + i)}${four.start + 1}`,
          end: `${String.fromCharCode(65 + i)}${four.end + 1}`,
        });
      });
    }

    for (let i = 0; i < diagonalStarts.length; i++) {
      const [x, y] = diagonalStarts[i];
      const diagonal = [];
      for (let j = 0; j < board.length; j++) {
        if (isInRange(x + j, y + j)) {
          diagonal.push(board[x + j][y + j]);
        }
      }
      const closedFoursInDiagonal = checkClosedFoursInSequence(
        diagonal,
        player
      );
      closedFoursInDiagonal.forEach((four) => {
        closedFoursWithLetterNumber.push({
          start: `${String.fromCharCode(65 + y + four.start)}${
            x + four.start + 1
          }`,
          end: `${String.fromCharCode(65 + y + four.end)}${x + four.end + 1}`,
        });
      });
    }

    for (let i = 0; i < diagonalStartsTop.length; i++) {
      const [x, y] = diagonalStartsTop[i];
      const diagonal = [];
      for (let j = 0; j < board.length; j++) {
        if (isInRange(x + j, y - j)) {
          diagonal.push(board[x + j][y - j]);
        }
      }
      const closedFoursInDiagonal = checkClosedFoursInSequence(
        diagonal,
        player
      );
      closedFoursInDiagonal.forEach((four) => {
        closedFoursWithLetterNumber.push({
          start: `${String.fromCharCode(65 + y - four.end)}${x + four.end + 1}`,
          end: `${String.fromCharCode(65 + y - four.start)}${
            x + four.start + 1
          }`,
        });
      });
    }

    return closedFoursWithLetterNumber;
  };

  const checkOpenThreesInSequence = (sequence, p) => {
    let openThrees = [];
    const toMatches = [
      [0, p, p, p, 0, 0],
      [0, 0, p, p, p, 0],
      [0, p, 0, p, p, 0],
      [0, p, p, 0, p, 0],
    ];

    for (let i = 0; i <= sequence.length - 6; i++) {
      const subsequence = sequence.slice(i, i + 6);
      toMatches.forEach((toMatch, patternIndex) => {
        if (toMatch.every((val, index) => val === subsequence[index])) {
          // Adjust the start and end positions based on the pattern
          let startOffset, endOffset;
          switch (patternIndex) {
            case 0: // Pattern: 0ppp00
              startOffset = 1;
              endOffset = 3;
              break;
            case 1: // Pattern: 00ppp0
              startOffset = 2;
              endOffset = 4;
              break;
            case 2: // Pattern: 0p0pp0
            case 3: // Pattern: 0pp0p0
              startOffset = 1;
              endOffset = 4;
              break;
          }
          let start = i + startOffset;
          let end = i + endOffset;
          // Check for duplicates before adding
          if (!openThrees.some((ot) => ot.start === start && ot.end === end)) {
            openThrees.push({ start: start, end: end });
          }
        }
      });
    }
    return openThrees;
  };

  const checkClosedThreesInSequence = (sequence, p) => {
    const closedThrees = [];
    const openThrees = checkOpenThreesInSequence(sequence, p);
    const closedFours = checkClosedFoursInSequence(sequence, p);
    const toMatches = [
      [p, p, 0, p, 0],
      [p, 0, p, p, 0],
      [0, p, 0, p, p],
      [0, p, p, 0, p],

      [0, 0, p, p, p],
      [p, p, p, 0, 0],

      // situations 2 and 4
      [p, p, 0, 0, p],
      [p, 0, 0, p, p],

      [p, 0, p, 0, p],
    ];
    // Check for closed threes in the sequence , return starting and ending positions without zeros
    for (let i = 0; i <= sequence.length - 5; i++) {
      const subsequence = sequence.slice(i, i + 5);
      toMatches.forEach((toMatch, patternIndex) => {
        if (toMatch.every((val, index) => val === subsequence[index])) {
          let start = i + subsequence.indexOf(p);
          let end = i + subsequence.lastIndexOf(p);
          closedThrees.push({ start, end });
        }
      });
    }
    // remove duplicates

    // filter out open threes (as long as start and end are same as open threes, remove them from closed threes)
    const openThreesStarts = openThrees.map((ot) => ot.start);
    const openThreesEnds = openThrees.map((ot) => ot.end);

    //filter out those that has either same start or end as closed fours
    const closedFoursStarts = closedFours.map((cf) => cf.start);
    const closedFoursEnds = closedFours.map((cf) => cf.end);

    // filter out those that overlaps with open fours
    const openFours = checkOpenFoursInSequence(sequence, p);
    const openFoursStarts = openFours.map((of) => of.start);
    const openFoursEnds = openFours.map((of) => of.end);

    // remove duplicates and those that are already open threes
    return closedThrees
      .filter(
        (v, i, a) =>
          a.findIndex((t) => t.start === v.start && t.end === v.end) === i
      )
      .filter(
        (ct) =>
          !openThreesStarts.includes(ct.start) &&
          !openThreesEnds.includes(ct.end)
      )
      .filter(
        (ct) =>
          !closedFoursStarts.includes(ct.start) &&
          !closedFoursEnds.includes(ct.end)
      )
      .filter(
        (ct) =>
          !openFoursStarts.includes(ct.start) && !openFoursEnds.includes(ct.end)
      );
  };

  const countOpenThrees = (board, player) => {
    let openThreesWithLetterNumber = []; // ex[{start: B2 , end: E2},...]
    let openThrees = [];
    for (let i = 0; i < board.length; i++) {
      const row = board[i];
      const openThreesInRow = checkOpenThreesInSequence(row, player);
      openThrees = openThrees.concat(openThreesInRow);
      openThreesInRow.forEach((three) => {
        openThreesWithLetterNumber.push({
          start: `${String.fromCharCode(65 + three.start)}${i + 1}`,
          end: `${String.fromCharCode(65 + three.end)}${i + 1}`,
        });
      });
    }

    for (let i = 0; i < board.length; i++) {
      const column = board.map((row) => row[i]);
      const openThreesInColumn = checkOpenThreesInSequence(column, player);
      openThrees = openThrees.concat(openThreesInColumn);
      openThreesInColumn.forEach((three) => {
        openThreesWithLetterNumber.push({
          start: `${String.fromCharCode(65 + i)}${three.start + 1}`,
          end: `${String.fromCharCode(65 + i)}${three.end + 1}`,
        });
      });
    }

    for (let i = 0; i < diagonalStarts.length; i++) {
      const [x, y] = diagonalStarts[i];
      const diagonal = [];
      for (let j = 0; j < board.length; j++) {
        if (isInRange(x + j, y + j)) {
          diagonal.push(board[x + j][y + j]);
        }
      }
      const openThreesInDiagonal = checkOpenThreesInSequence(diagonal, player);
      openThrees = openThrees.concat(openThreesInDiagonal);
      openThreesInDiagonal.forEach((three) => {
        openThreesWithLetterNumber.push({
          start: `${String.fromCharCode(65 + y + three.start)}${
            x + three.start + 1
          }`,
          end: `${String.fromCharCode(65 + y + three.end)}${x + three.end + 1}`,
        });
      });
    }

    for (let i = 0; i < diagonalStartsTop.length; i++) {
      const [x, y] = diagonalStartsTop[i];
      const diagonal = [];
      for (let j = 0; j < board.length; j++) {
        if (isInRange(x + j, y - j)) {
          diagonal.push(board[x + j][y - j]);
        }
      }
      const openThreesInDiagonal = checkOpenThreesInSequence(diagonal, player);
      openThrees = openThrees.concat(openThreesInDiagonal);
      openThreesInDiagonal.forEach((three) => {
        openThreesWithLetterNumber.push({
          start: `${String.fromCharCode(65 + y - three.end)}${
            x + three.end + 1
          }`,
          end: `${String.fromCharCode(65 + y - three.start)}${
            x + three.start + 1
          }`,
        });
      });
    }
    return openThreesWithLetterNumber;
  };

  const countClosedThrees = (board, player) => {
    let closedThreesWithLetterNumber = []; // ex[{start: B2 , end: E2},...]
    let closedThrees = [];
    for (let i = 0; i < board.length; i++) {
      const row = board[i];
      const closedThreesInRow = checkClosedThreesInSequence(row, player);
      closedThrees = closedThrees.concat(closedThreesInRow);
      closedThreesInRow.forEach((three) => {
        closedThreesWithLetterNumber.push({
          start: `${String.fromCharCode(65 + three.start)}${i + 1}`,
          end: `${String.fromCharCode(65 + three.end)}${i + 1}`,
        });
      });
    }

    for (let i = 0; i < board.length; i++) {
      const column = board.map((row) => row[i]);
      const closedThreesInColumn = checkClosedThreesInSequence(column, player);
      closedThrees = closedThrees.concat(closedThreesInColumn);
      closedThreesInColumn.forEach((three) => {
        closedThreesWithLetterNumber.push({
          start: `${String.fromCharCode(65 + i)}${three.start + 1}`,
          end: `${String.fromCharCode(65 + i)}${three.end + 1}`,
        });
      });
    }

    for (let i = 0; i < diagonalStarts.length; i++) {
      const [x, y] = diagonalStarts[i];
      const diagonal = [];
      for (let j = 0; j < board.length; j++) {
        if (isInRange(x + j, y + j)) {
          diagonal.push(board[x + j][y + j]);
        }
      }
      const closedThreesInDiagonal = checkClosedThreesInSequence(
        diagonal,
        player
      );
      closedThrees = closedThrees.concat(closedThreesInDiagonal);
      closedThreesInDiagonal.forEach((three) => {
        closedThreesWithLetterNumber.push({
          start: `${String.fromCharCode(65 + y + three.start)}${
            x + three.start + 1
          }`,
          end: `${String.fromCharCode(65 + y + three.end)}${x + three.end + 1}`,
        });
      });
    }

    for (let i = 0; i < diagonalStartsTop.length; i++) {
      const [x, y] = diagonalStartsTop[i];
      const diagonal = [];
      for (let j = 0; j < board.length; j++) {
        if (isInRange(x + j, y - j)) {
          diagonal.push(board[x + j][y - j]);
        }
      }
      const closedThreesInDiagonal = checkClosedThreesInSequence(
        diagonal,
        player
      );
      closedThrees = closedThrees.concat(closedThreesInDiagonal);
      closedThreesInDiagonal.forEach((three) => {
        closedThreesWithLetterNumber.push({
          start: `${String.fromCharCode(65 + y - three.end)}${
            x + three.end + 1
          }`,
          end: `${String.fromCharCode(65 + y - three.start)}${
            x + three.start + 1
          }`,
        });
      });
    }

    return closedThreesWithLetterNumber;
  };
  const checkOpenTwosInSequence = (sequence, p) => {
    // This function will hold the positions where adding a piece results in an open three
    let openTwos = [];

    // Iterate through the sequence to find potential spots for open twos
    sequence.forEach((current, index) => {
      // Check only empty spots
      if (current === 0) {
        // Temporarily place the player's piece in the current spot
        const modifiedSequence = [...sequence];
        modifiedSequence[index] = p;

        // Use the provided function to check if this results in an open three
        const result = checkOpenThreesInSequence(modifiedSequence, p);

        // If adding a piece here results in any open three, this position is a potential open two spot
        if (result.length > 0) {
          for (const three of result) {
            // if current index is at the start or end of the sequence in the three's start/end, then shift the start and end by 1
            if (index === three.start) {
              // next non-zero index
              let nextNonZeroIndex = index + 1;
              while (nextNonZeroIndex < sequence.length) {
                if (sequence[nextNonZeroIndex] !== 0) {
                  break;
                }
                nextNonZeroIndex++;
              }
              openTwos.push({ start: nextNonZeroIndex, end: three.end });
            } else if (index === three.end) {
              // previous non-zero index
              let previousNonZeroIndex = index - 1;
              while (previousNonZeroIndex >= 0) {
                if (sequence[previousNonZeroIndex] !== 0) {
                  break;
                }
                previousNonZeroIndex--;
              }
              openTwos.push({ start: three.start, end: previousNonZeroIndex });
            } else {
              openTwos.push({ start: three.start, end: three.end });
            }
          }
        }
      }
    });
    // remove if included in open threes
    const openThrees = checkOpenThreesInSequence(sequence, p);
    openTwos = openTwos.filter(
      (ot) =>
        !openThrees.some(
          (three) => ot.start === three.start && ot.end === three.end
        )
    );

    // remove duplicates
    openTwos = openTwos.filter(
      (v, i, a) =>
        a.findIndex((t) => t.start === v.start && t.end === v.end) === i
    );

    // Return the positions of open twos
    return openTwos;
  };

  const checkClosedTwosInSequence = (sequence, p) => {
    // This function will hold the positions where adding a piece results in a closed three
    let closedTwos = [];

    // Iterate through the sequence to find potential spots for closed twos
    sequence.forEach((current, index) => {
      // Check only empty spots
      if (current === 0) {
        // Temporarily place the player's piece in the current spot
        const modifiedSequence = [...sequence];
        modifiedSequence[index] = p;

        // Use the provided function to check if this results in a closed three
        const result = checkClosedThreesInSequence(modifiedSequence, p);

        // If adding a piece here results in any closed three, this position is a potential closed two spot
        if (result.length > 0) {
          for (const three of result) {
            // if current index is at the start or end of the sequence in the three's start/end, then shift the start and end by 1
            if (index === three.start) {
              // next non-zero index
              let nextNonZeroIndex = index + 1;
              while (nextNonZeroIndex < sequence.length) {
                if (sequence[nextNonZeroIndex] !== 0) {
                  break;
                }
                nextNonZeroIndex++;
              }
              closedTwos.push({ start: nextNonZeroIndex, end: three.end });
            } else if (index === three.end) {
              // previous non-zero index
              let previousNonZeroIndex = index - 1;
              while (previousNonZeroIndex >= 0) {
                if (sequence[previousNonZeroIndex] !== 0) {
                  break;
                }
                previousNonZeroIndex--;
              }
              closedTwos.push({
                start: three.start,
                end: previousNonZeroIndex,
              });
            } else {
              closedTwos.push({ start: three.start, end: three.end });
            }
          }
        }
      }
    });
    // remove if included in closed threes
    const closedThrees = checkClosedThreesInSequence(sequence, p);
    closedTwos = closedTwos.filter(
      (ct) =>
        !closedThrees.some(
          (three) => ct.start === three.start && ct.end === three.end
        )
    );
    // remove if included in openTwos
    const openTwos = checkOpenTwosInSequence(sequence, p);
    closedTwos = closedTwos.filter(
      (ct) =>
        !openTwos.some((two) => ct.start === two.start && ct.end === two.end)
    );
    // remove if overlapping with open threes
    const openThrees = checkOpenThreesInSequence(sequence, p);
    closedTwos = closedTwos.filter(
      (ct) =>
        !openThrees.some(
          (three) =>
            (ct.start <= three.end && ct.start >= three.start) ||
            (ct.end >= three.start && ct.end <= three.end)
        )
    );
    // remove if overlapping with closed threes, open fours and closed fours
    const closedThreesStarts = closedThrees.map((ct) => ct.start);
    const closedThreesEnds = closedThrees.map((ct) => ct.end);
    const openFours = checkOpenFoursInSequence(sequence, p);
    const closedFours = checkClosedFoursInSequence(sequence, p);

    closedTwos = closedTwos.filter(
      (ct) =>
        !closedThreesStarts.includes(ct.start) &&
        !closedThreesEnds.includes(ct.end)
    );
    closedTwos = closedTwos.filter(
      (ct) =>
        !openFours.some(
          (four) =>
            (ct.start <= four.end && ct.start >= four.start) ||
            (ct.end >= four.start && ct.end <= four.end)
        )
    );
    closedTwos = closedTwos.filter(
      (ct) =>
        !closedFours.some(
          (four) =>
            (ct.start <= four.end && ct.start >= four.start) ||
            (ct.end >= four.start && ct.end <= four.end)
        )
    );

    // remove duplicates
    closedTwos = closedTwos.filter(
      (v, i, a) =>
        a.findIndex((t) => t.start === v.start && t.end === v.end) === i
    );

    // Return the positions of closed twos
    return closedTwos;
  };

  const countOpenTwos = (board, player) => {
    let openTwosWithLetterNumber = []; // ex[{start: B2 , end: E2},...]
    let openTwos = [];

    // check horizontal open twos
    for (let i = 0; i < board.length; i++) {
      const row = board[i];
      const openTwosInRow = checkOpenTwosInSequence(row, player);

      openTwos = openTwos.concat(openTwosInRow);
      openTwosInRow.forEach((two) => {
        openTwosWithLetterNumber.push({
          start: `${String.fromCharCode(65 + two.start)}${i + 1}`,
          end: `${String.fromCharCode(65 + two.end)}${i + 1}`,
        });
      });
    }
    // check vertical open twos
    for (let i = 0; i < board.length; i++) {
      const column = board.map((row) => row[i]);
      const openTwosInColumn = checkOpenTwosInSequence(column, player);
      openTwos = openTwos.concat(openTwosInColumn);
      openTwosInColumn.forEach((two) => {
        openTwosWithLetterNumber.push({
          start: `${String.fromCharCode(65 + i)}${two.start + 1}`,
          end: `${String.fromCharCode(65 + i)}${two.end + 1}`,
        });
      });
    }

    // check bottom right diagonals
    for (let i = 0; i < diagonalStarts.length; i++) {
      const [x, y] = diagonalStarts[i];
      const diagonal = [];
      for (let j = 0; j < board.length; j++) {
        if (isInRange(x + j, y + j)) {
          diagonal.push(board[x + j][y + j]);
        }
      }
      const openTwosInDiagonal = checkOpenTwosInSequence(diagonal, player);
      openTwos = openTwos.concat(openTwosInDiagonal);
      openTwosInDiagonal.forEach((two) => {
        openTwosWithLetterNumber.push({
          start: `${String.fromCharCode(65 + y + two.start)}${
            x + two.start + 1
          }`,
          end: `${String.fromCharCode(65 + y + two.end)}${x + two.end + 1}`,
        });
      });
    }

    // check top right diagonals
    for (let i = 0; i < diagonalStartsTop.length; i++) {
      const [x, y] = diagonalStartsTop[i];
      const diagonal = [];
      for (let j = 0; j < board.length; j++) {
        if (isInRange(x + j, y - j)) {
          diagonal.push(board[x + j][y - j]);
        }
      }
      const openTwosInDiagonal = checkOpenTwosInSequence(diagonal, player);
      openTwos = openTwos.concat(openTwosInDiagonal);
      openTwosInDiagonal.forEach((two) => {
        openTwosWithLetterNumber.push({
          start: `${String.fromCharCode(65 + y - two.end)}${x + two.end + 1}`,
          end: `${String.fromCharCode(65 + y - two.start)}${x + two.start + 1}`,
        });
      });
    }

    return openTwosWithLetterNumber;
  };

  const countClosedTwos = (board, player) => {
    let closedTwosWithLetterNumber = []; // ex[{start: B2 , end: E2},...]

    for (let i = 0; i < board.length; i++) {
      const row = board[i];
      const closedTwosInRow = checkClosedTwosInSequence(row, player);
      closedTwosInRow.forEach((two) => {
        closedTwosWithLetterNumber.push({
          start: `${String.fromCharCode(65 + two.start)}${i + 1}`,
          end: `${String.fromCharCode(65 + two.end)}${i + 1}`,
        });
      });
    }

    for (let i = 0; i < board.length; i++) {
      const column = board.map((row) => row[i]);
      const closedTwosInColumn = checkClosedTwosInSequence(column, player);
      closedTwosInColumn.forEach((two) => {
        closedTwosWithLetterNumber.push({
          start: `${String.fromCharCode(65 + i)}${two.start + 1}`,
          end: `${String.fromCharCode(65 + i)}${two.end + 1}`,
        });
      });
    }

    for (let i = 0; i < diagonalStarts.length; i++) {
      const [x, y] = diagonalStarts[i];
      const diagonal = [];
      for (let j = 0; j < board.length; j++) {
        if (isInRange(x + j, y + j)) {
          diagonal.push(board[x + j][y + j]);
        }
      }
      const closedTwosInDiagonal = checkClosedTwosInSequence(diagonal, player);
      closedTwosInDiagonal.forEach((two) => {
        closedTwosWithLetterNumber.push({
          start: `${String.fromCharCode(65 + y + two.start)}${
            x + two.start + 1
          }`,
          end: `${String.fromCharCode(65 + y + two.end)}${x + two.end + 1}`,
        });
      });
    }

    for (let i = 0; i < diagonalStartsTop.length; i++) {
      const [x, y] = diagonalStartsTop[i];
      const diagonal = [];
      for (let j = 0; j < board.length; j++) {
        if (isInRange(x + j, y - j)) {
          diagonal.push(board[x + j][y - j]);
        }
      }
      const closedTwosInDiagonal = checkClosedTwosInSequence(diagonal, player);
      closedTwosInDiagonal.forEach((two) => {
        closedTwosWithLetterNumber.push({
          start: `${String.fromCharCode(65 + y - two.end)}${x + two.end + 1}`,
          end: `${String.fromCharCode(65 + y - two.start)}${x + two.start + 1}`,
        });
      });
    }

    return closedTwosWithLetterNumber;
  };

  const getPlayerInfoObject = (board, player) => {
    const openFours = countOpenFours(board, player);
    const closedFours = countClosedFours(board, player);
    const openThrees = countOpenThrees(board, player);
    const closedThrees = countClosedThrees(board, player);
    const openTwos = countOpenTwos(board, player);
    const closedTwos = countClosedTwos(board, player);

    const playerInfo = {
      player: player === 1 ? "黑" : "红",
      openFours: openFours.length,
      closedFours: closedFours.length,
      openThrees: openThrees.length,
      closedThrees: closedThrees.length,
      openTwos: openTwos.length,
      closedTwos: closedTwos.length,
      openFoursList: openFours.map((four) => `${four.start}-${four.end}`),
      closedFoursList: closedFours.map((four) => `${four.start}-${four.end}`),
      openThreesList: openThrees.map((three) => `${three.start}-${three.end}`),
      closedThreesList: closedThrees.map(
        (three) => `${three.start}-${three.end}`
      ),
      openTwosList: openTwos.map((two) => `${two.start}-${two.end}`),
      closedTwosList: closedTwos.map((two) => `${two.start}-${two.end}`),
    };
    return playerInfo;
  };

  const generateBoardNextStateOnHover = (board, x, y) => {
    // calculate player from given the current board, if divisible by 3, then player 1, else player 2
    const player =
      board.flat().reduce((acc, val) => acc + val) % 3 === 0 ? 1 : 2;

    const boardNextState = board.map((row) => row.slice());
    // if the cell is empty, place the piece
    if (boardNextState[x][y] === 0) {
      boardNextState[x][y] = player;
      return boardNextState;
    } else {
      return null;
    }
  };

  const generateComparedInfoHTML = (oldPlayerInfo, newPlayerInfo) => {
    // the output is in the same format as generatePlayerInfoHTML, but with change in numbers highlighted
    // for example, if the oldPlayerInfo has 3 openFours and the newPlayerInfo has 4 openFours, the output will be 3(+1) with (+1) being in green
    // if the oldPlayerInfo has 3 openFours and the newPlayerInfo has 2 openFours, the output will be 3(-1) with (-1) being in red

    const infoDiff = {
      openFours: newPlayerInfo.openFours - oldPlayerInfo.openFours,
      closedFours: newPlayerInfo.closedFours - oldPlayerInfo.closedFours,
      openThrees: newPlayerInfo.openThrees - oldPlayerInfo.openThrees,
      closedThrees: newPlayerInfo.closedThrees - oldPlayerInfo.closedThrees,
      openTwos: newPlayerInfo.openTwos - oldPlayerInfo.openTwos,
      closedTwos: newPlayerInfo.closedTwos - oldPlayerInfo.closedTwos,
    };

    if (language === "zh") {
      return `
      <h3>${oldPlayerInfo.player}</h3>
      活四: ${oldPlayerInfo.openFours} ${
        infoDiff.openFours !== 0
          ? `<span style="color: ${
              infoDiff.openFours > 0 ? "green" : "red"
            }">(${infoDiff.openFours > 0 ? "+" : ""}${
              infoDiff.openFours
            })</span>`
          : ""
      } : ${oldPlayerInfo.openFoursList.join(", ")}
      <br/>
      冲四: ${oldPlayerInfo.closedFours} ${
        infoDiff.closedFours !== 0
          ? `<span style="color: ${
              infoDiff.closedFours > 0 ? "green" : "red"
            }">(${infoDiff.closedFours > 0 ? "+" : ""}${
              infoDiff.closedFours
            })</span>`
          : ""
      } : ${oldPlayerInfo.closedFoursList.join(", ")}
      <br/>
      活三: ${oldPlayerInfo.openThrees} ${
        infoDiff.openThrees !== 0
          ? `<span style="color: ${
              infoDiff.openThrees > 0 ? "green" : "red"
            }">(${infoDiff.openThrees > 0 ? "+" : ""}${
              infoDiff.openThrees
            })</span>`
          : ""
      } : ${oldPlayerInfo.openThreesList.join(", ")}
      <br/>
      眠三: ${oldPlayerInfo.closedThrees} ${
        infoDiff.closedThrees !== 0
          ? `<span style="color: ${
              infoDiff.closedThrees > 0 ? "green" : "red"
            }">(${infoDiff.closedThrees > 0 ? "+" : ""}${
              infoDiff.closedThrees
            })</span>`
          : ""
      } : ${oldPlayerInfo.closedThreesList.join(", ")}
      <br/>
      活二: ${oldPlayerInfo.openTwos} ${
        infoDiff.openTwos !== 0
          ? `<span style="color: ${infoDiff.openTwos > 0 ? "green" : "red"}">(${
              infoDiff.openTwos > 0 ? "+" : ""
            }${infoDiff.openTwos})</span>`
          : ""
      } : ${oldPlayerInfo.openTwosList.join(", ")}
      <br/>
      眠二: ${oldPlayerInfo.closedTwos} ${
        infoDiff.closedTwos !== 0
          ? `<span style="color: ${
              infoDiff.closedTwos > 0 ? "green" : "red"
            }">(${infoDiff.closedTwos > 0 ? "+" : ""}${
              infoDiff.closedTwos
            })</span>`
          : ""
      } : ${oldPlayerInfo.closedTwosList.join(", ")}
      <br/>
    `;
    } else {
      return `
      <h3>${oldPlayerInfo.player === "黑" ? "Black" : "Red"}</h3>
      Open Fours: ${oldPlayerInfo.openFours} ${
        infoDiff.openFours !== 0
          ? `<span style="color: ${
              infoDiff.openFours > 0 ? "green" : "red"
            }">(${infoDiff.openFours > 0 ? "+" : ""}${
              infoDiff.openFours
            })</span>`
          : ""
      } : ${oldPlayerInfo.openFoursList.join(", ")}
      <br/>
      Closed Fours: ${oldPlayerInfo.closedFours} ${
        infoDiff.closedFours !== 0
          ? `<span style="color: ${
              infoDiff.closedFours > 0 ? "green" : "red"
            }">(${infoDiff.closedFours > 0 ? "+" : ""}${
              infoDiff.closedFours
            })</span>`
          : ""
      } : ${oldPlayerInfo.closedFoursList.join(", ")}
      <br/>
      Open Threes: ${oldPlayerInfo.openThrees} ${
        infoDiff.openThrees !== 0
          ? `<span style="color: ${
              infoDiff.openThrees > 0 ? "green" : "red"
            }">(${infoDiff.openThrees > 0 ? "+" : ""}${
              infoDiff.openThrees
            })</span>`
          : ""
      } : ${oldPlayerInfo.openThreesList.join(", ")}
      <br/>
      Closed Threes: ${oldPlayerInfo.closedThrees} ${
        infoDiff.closedThrees !== 0
          ? `<span style="color: ${
              infoDiff.closedThrees > 0 ? "green" : "red"
            }">(${infoDiff.closedThrees > 0 ? "+" : ""}${
              infoDiff.closedThrees
            })</span>`
          : ""
      } : ${oldPlayerInfo.closedThreesList.join(", ")}
      <br/>
      Open Twos: ${oldPlayerInfo.openTwos} ${
        infoDiff.openTwos !== 0
          ? `<span style="color: ${infoDiff.openTwos > 0 ? "green" : "red"}">(${
              infoDiff.openTwos > 0 ? "+" : ""
            }${infoDiff.openTwos})</span>`
          : ""
      } : ${oldPlayerInfo.openTwosList.join(", ")}
      <br/>
      Closed Twos: ${oldPlayerInfo.closedTwos} ${
        infoDiff.closedTwos !== 0
          ? `<span style="color: ${
              infoDiff.closedTwos > 0 ? "green" : "red"
            }">(${infoDiff.closedTwos > 0 ? "+" : ""}${
              infoDiff.closedTwos
            })</span>`
          : ""
      } : ${oldPlayerInfo.closedTwosList.join(", ")}
      <br/>
    `;
    }
  };
  const generatePlayerInfoHTML = (board, player) => {
    let playerInfo = getPlayerInfoObject(board, player);
    if (language === "zh") {
      return `
      <h3>${playerInfo.player}</h3>
      活四: ${playerInfo.openFours} : ${playerInfo.openFoursList.join(
        ", "
      )}<br/>
      冲四: ${playerInfo.closedFours} : ${playerInfo.closedFoursList.join(
        ", "
      )}<br/>
      活三: ${playerInfo.openThrees} : ${playerInfo.openThreesList.join(
        ", "
      )}<br/>
      眠三: ${playerInfo.closedThrees} : ${playerInfo.closedThreesList.join(
        ", "
      )}<br/>
      活二: ${playerInfo.openTwos} : ${playerInfo.openTwosList.join(", ")}<br/>
      眠二: ${playerInfo.closedTwos} : ${playerInfo.closedTwosList.join(
        ", "
      )}<br/>
    `;
    } else {
      return `
      <h3>${playerInfo.player === "黑" ? "Black" : "Red"}</h3>
      Open Fours: ${playerInfo.openFours} : ${playerInfo.openFoursList.join(
        ", "
      )}<br/>
      Closed Fours: ${
        playerInfo.closedFours
      } : ${playerInfo.closedFoursList.join(", ")}<br/>
      Open Threes: ${playerInfo.openThrees} : ${playerInfo.openThreesList.join(
        ", "
      )}<br/>
      Closed Threes: ${
        playerInfo.closedThrees
      } : ${playerInfo.closedThreesList.join(", ")}<br/>
      Open Twos: ${playerInfo.openTwos} : ${playerInfo.openTwosList.join(
        ", "
      )}<br/>
      Closed Twos: ${playerInfo.closedTwos} : ${playerInfo.closedTwosList.join(
        ", "
      )}<br/>
    `;
    }
  };

  const updateCurrentInfo = () => {
    const blackPlayerInfo = document.getElementById("blackPlayerInfo");
    blackPlayerInfo.innerHTML = generatePlayerInfoHTML(board, 1);
    const redPlayerInfo = document.getElementById("redPlayerInfo");
    redPlayerInfo.innerHTML = generatePlayerInfoHTML(board, 2);

    // console.log(board);
    // making the player info highlighted when it's their turn
    let nextPieceColor =
      board.flat().reduce((acc, val) => acc + val) % 3 === 0 ? 1 : 2;
    nextPieceColor = nextPieceColor === 1 ? "black" : "red";
    if (nextPieceColor === "black") {
      document.getElementById("blackPlayerInfo").style.border =
        "3px solid black";
      document.getElementById("blackPlayerInfo").style.backgroundColor =
        "white";
      document.getElementById("redPlayerInfo").style.border = "1px solid black";
    }
    if (nextPieceColor === "red") {
      // make it has red border

      document.getElementById("redPlayerInfo").style.border = "2px solid red";
      document.getElementById("redPlayerInfo").style.backgroundColor = "white";
      document.getElementById("blackPlayerInfo").style.border =
        "1px solid black";
    }
  };

  let board = Array(boardSize)
    .fill()
    .map(() => Array(boardSize).fill(0));

  const createLabels = () => {
    for (let i = 0; i < boardSize; i++) {
      const horizontalLabel = document.createElement("div");
      horizontalLabel.textContent = String.fromCharCode(65 + i); // Letters for x-axis
      horizontalLabels.appendChild(horizontalLabel);

      const verticalLabel = document.createElement("div");
      verticalLabel.textContent = i + 1; // Numbers for y-axis
      verticalLabels.appendChild(verticalLabel);
    }
  };

  const createBoard = () => {
    // clear the board
    gameBoard.innerHTML = "";
    board = Array(boardSize)
      .fill()
      .map(() => Array(boardSize).fill(0));
    // if historicalStates is empty, add the initial state
    if (historicalStates.length === 0) {
      historicalStates.push(board.map((row) => row.slice()));
    }
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.setAttribute("data-x", String.fromCharCode(65 + j)); // Letters for x-axis
        cell.setAttribute("data-y", i + 1); // Numbers for y-axis
        cell.addEventListener("click", () => placePiece(i, j, cell));
        // add on hover event
        cell.addEventListener("mouseover", () => {
          const boardNextState = generateBoardNextStateOnHover(board, i, j);
          // console.log(boardNextState);
          if (boardNextState) {
            const newredplayerInfo = getPlayerInfoObject(boardNextState, 2);
            const newblackplayerInfo = getPlayerInfoObject(boardNextState, 1);
            const redplayerInfo = getPlayerInfoObject(board, 2);
            const blackplayerInfo = getPlayerInfoObject(board, 1);
            const redcomparedInfoHTML = generateComparedInfoHTML(
              redplayerInfo,
              newredplayerInfo
            );
            const blackcomparedInfoHTML = generateComparedInfoHTML(
              blackplayerInfo,
              newblackplayerInfo
            );
            const redPlayerInfo = document.getElementById("redPlayerInfo");
            redPlayerInfo.innerHTML = redcomparedInfoHTML;
            const blackPlayerInfo = document.getElementById("blackPlayerInfo");
            blackPlayerInfo.innerHTML = blackcomparedInfoHTML;
          }
        });
        cell.addEventListener("mouseout", () => {
          updateCurrentInfo();
        });

        gameBoard.appendChild(cell);
      }
    }
  };

  const placePiece = (x, y, Piece = null, revert = false) => {
    let cell = gameBoard.children[x * boardSize + y];
    if (cell.children.length > 0) return; // Prevent placing over an existing piece

    // Update board state
    let toPlace =
      board.flat().reduce((acc, val) => acc + val) % 3 === 0 ? 1 : 2;
    if (Piece === 1 || Piece === 2) {
      toPlace = Piece;
    }
    board[x][y] = toPlace;
    const piece = document.createElement("div");
    piece.classList.add("piece", toPlace === 1 ? "black" : "red");
    cell.appendChild(piece);

    // update historical states
    if (!revert) {
      historicalStates = historicalStates.slice(0, currentStateIndex + 1);
      historicalStates.push(board.map((row) => row.slice()));
      currentStateIndex++;
    }

    // Check for win
    currentPlayer = toPlace === 1 ? "black" : "red";
    if (checkWin(x, y, currentPlayer === "black" ? 1 : 2)) {
      alert(`${currentPlayer === "black" ? "黑" : "红"}方胜利!`);
      // Reset or further handling here
    }

    updateCurrentInfo();
  };

  // function that takes a board state and sets the board to that state
  const setBoardToState = (boardState) => {
    createBoard(); // Recreate the board UI
    console.log(boardState, "boardState");
    console.log(board, "board");
    console.log(historicalStates, "historicalStates at setBoardToState");
    // set current state index to be minus 1, but not less than 0

    boardState.forEach((row, i) => {
      row.forEach((Piece, j) => {
        if (Piece === 1 || Piece === 2) {
          placePiece(i, j, Piece, true); // Add true to indicate this is a revert operation
        }
      });
    });
  };

  const revertToPreviousState = () => {
    if (currentStateIndex == 0) return; // Check if there's a state to revert to
    currentStateIndex--;
    // Set the board to the previous state
    setBoardToState(historicalStates[currentStateIndex]);
    console.log(historicalStates, "historicalStates");
    console.log(currentStateIndex, "currentStateIndex");
  };

  const revertButton = document.getElementById("revertButton");
  revertButton.addEventListener("click", revertToPreviousState);
  const resetButton = document.getElementById("resetButton");
  resetButton.addEventListener("click", () => {
    // refresh the page
    window.location.reload();
  });
  const languageButton = document.getElementById("languageButton");
  // on click, toggle the language
  languageButton.addEventListener("click", () => {
    language = language === "en" ? "zh" : "en";
    console.log(language);
    updateCurrentInfo();
  });

  const checkDirection = (x, y, deltaX, deltaY, player) => {
    let count = 0;
    let i = x + deltaX;
    let j = y + deltaY;
    while (
      i >= 0 &&
      i < boardSize &&
      j >= 0 &&
      j < boardSize &&
      board[i][j] === player
    ) {
      count++;
      i += deltaX;
      j += deltaY;
    }
    return count;
  };

  const checkWin = (x, y, player) => {
    // Check horizontal, vertical, and both diagonals
    const directions = [
      { deltaX: 1, deltaY: 0 }, // Horizontal
      { deltaX: 0, deltaY: 1 }, // Vertical
      { deltaX: 1, deltaY: 1 }, // Diagonal down-right
      { deltaX: 1, deltaY: -1 }, // Diagonal up-right
    ];

    return directions.some(({ deltaX, deltaY }) => {
      // Check both directions along the line
      const count =
        1 +
        checkDirection(x, y, deltaX, deltaY, player) +
        checkDirection(x, y, -deltaX, -deltaY, player);
      return count >= 5;
    });
  };

  createLabels();

  createBoard();
  updateCurrentInfo();
});
