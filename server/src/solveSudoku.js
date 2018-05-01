const EMPTY = -1

const checkX = puzzle => {
  const valuesLtoR = {}
  const valuesRtoL = {}

  for (let i = 0; i < puzzle.length; ++i) {
    valuesLtoR[puzzle[i][i]] = 1
    valuesRtoL[puzzle[i][puzzle.length - i - 1]] = 1
  }

  if (
    Object.keys(valuesLtoR).length === puzzle.length &&
    Object.keys(valuesRtoL).length === puzzle.length
  )
    return true
  return false
}

const checkY = puzzle => {
  if (puzzle.length % 2 === 0) return false
  const rightY = {}
  const leftY = {}
  const half = Math.floor(puzzle.length / 2)

  for (let i = 0; i < half; ++i) {
    rightY[puzzle[i][i]] = 1
    leftY[puzzle[i][puzzle.length - i - 1]] = 1
  }
  for (let i = half; i < puzzle.length; ++i) {
    rightY[puzzle[i][half]] = 1
    leftY[puzzle[i][half]] = 1
  }

  if (
    Object.keys(rightY).length === puzzle.length &&
    Object.keys(leftY).length === puzzle.length
  )
    return true
  return false
}

const validate = (puzzle, row, col) => {
  const impossible = []

  for (let i = 0; i < puzzle.length; ++i) impossible.push(0)

  const size = Math.sqrt(puzzle.length)

  for (let i = 0; i < size * size; ++i) {
    // Checks for values present within the same row
    if (puzzle[row][i] != 0) impossible[puzzle[row][i] - 1] = 1
    // Checks for values present within the same column
    if (puzzle[i][col] != 0) impossible[puzzle[i][col] - 1] = 1
  }

  // Checks for values present within the same subsquare
  for (
    let i = size * Math.floor(row / size);
    i < size * Math.floor(row / size) + size;
    ++i
  )
    for (
      let j = size * Math.floor(col / size);
      j < size * Math.floor(col / size) + size;
      ++j
    )
      if (puzzle[i][j] != 0) impossible[puzzle[i][j] - 1] = 1

  return impossible
}

const solve = puzzle => {
  const subSize = Math.sqrt(puzzle.length)
  const puzzleSize = puzzle.length
  const stackList = []

  // initialises stackList based on number of blanks in puzzle
  for (let row = 0; row < puzzleSize; ++row) {
    for (let col = 0; col < puzzleSize; ++col) {
      if (puzzle[row][col] === 0) {
        stackList.push({ row, col, stack: [] })
      }
    }
  }

  const solutions = []
  let xs = 0
  let ys = 0
  let xys = 0
  let index = 0
  while (index < stackList.length) {
    const impossible = validate(
      puzzle,
      stackList[index].row,
      stackList[index].col
    )

    // Populates stack for possible values
    for (let i = puzzleSize - 1; i >= 0; --i) {
      if (impossible[i] == 0) stackList[index].stack.push(i + 1)
    }

    // Calls stacks that don't get populated
    // Backtracks to last stack for other valid solutions
    while (stackList[index].stack.length === 0 && index > EMPTY) {
      index--
      if (index === EMPTY) break
      stackList[index].stack.pop()
      puzzle[stackList[index].row][stackList[index].col] = 0
    }

    // Returned to start; No more solutions
    if (index === EMPTY) break

    puzzle[stackList[index].row][stackList[index].col] =
      stackList[index].stack[stackList[index].stack.length - 1]

    if (index === stackList.length - 1) {
      const x = checkX(puzzle)
      const y = checkY(puzzle)

      if (x) xs++
      if (y) ys++
      if (x && y) xys++

      solutions.push({
        puzzle: puzzle.map(row => row.map(col => col)),
        x,
        y,
      })

      // Backtrack to next possible solution
      while (index !== EMPTY) {
        puzzle[stackList[index].row][stackList[index].col] = 0
        stackList[index].stack.pop()
        // Stop backtracking if stack has at least one element after pop
        if (stackList[index].stack.length !== 0) {
          break
        }
        index--
      }

      // Returned to start; No more solutions
      if (index === EMPTY) break
    }

    // Update when backtracking
    puzzle[stackList[index].row][stackList[index].col] =
      stackList[index].stack[stackList[index].stack.length - 1]
    index++
  }

  return {
    solutions,
    xs,
    ys,
    xys,
  }
}

export default solve
