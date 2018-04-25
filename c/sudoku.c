#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#define EMPTY -1

void write_solution(FILE *fpw, int solution, int **puzzle, int puzzleSize)
{
  fprintf(fpw, "SOLUTION #%d\n", solution);
  for (int i = 0; i < puzzleSize; ++i)
  {
    for (int j = 0; j < puzzleSize; ++j)
    {
      fprintf(fpw, "%d ", puzzle[i][j]);
    }
    fprintf(fpw, "\n");
  }
}

void validate(int **puzzle, int row, int col, int size, int **impossible)
{
  for (int i = 0; i < size * size; ++i)
  {
    if (puzzle[row][i] != 0)
      (*impossible)[puzzle[row][i] - 1] = 1;
    if (puzzle[i][col] != 0)
      (*impossible)[puzzle[i][col] - 1] = 1;
  }

  for (int i = size * (row / size); i < size * (row / size) + size; ++i)
    for (int j = size * (col / size); j < size * (col / size) + size; ++j)
      if (puzzle[i][j] != 0)
        (*impossible)[puzzle[i][j] - 1] = 1;
}

void print_puzzle(int **puzzle, int size)
{
  for (int i = 0; i < size; ++i)
  {
    for (int j = 0; j < size; ++j)
      printf("%d ", puzzle[i][j]);

    printf("\n");
  }
}

void print_stack(int *stack, int tos)
{
  for (int i = tos; i >= 0; --i)
    printf("%d ", stack[i]);
  printf("\n");
}

int main()
{
  FILE *fpr = NULL;
  int tests = 0;

  fpr = fopen("input.txt", "r");
  fscanf(fpr, "%d", &tests);
  for (int test = 0; test < tests; ++test)
  {
    // https://stackoverflow.com/questions/4232842/how-to-dynamically-change-filename-while-writing-in-a-loop/4233114
    char buffer[32];
    snprintf(buffer, sizeof(char) * 32, "solutions/output-%i.txt", test + 1);
    FILE *fpw = fopen(buffer, "w");

    int subSize = 0;
    fscanf(fpr, "%d", &subSize);
    int puzzleSize = subSize * subSize;

    int **puzzle = (int **)malloc(sizeof(int *) * puzzleSize);

    // array of row indices
    int *rows = (int *)malloc(sizeof(int) * puzzleSize * puzzleSize);
    // array of column indices
    int *cols = (int *)malloc(sizeof(int) * puzzleSize * puzzleSize);
    // array of top of stack indices
    int *tos = (int *)malloc(sizeof(int) * puzzleSize * puzzleSize);
    // array of stacks
    int **stacks = (int **)malloc(sizeof(int *) * puzzleSize * puzzleSize);

    int blanks = 0; // number of blank cells in the puzzle

    for (int row = 0; row < puzzleSize; ++row)
    {
      puzzle[row] = (int *)malloc(sizeof(int) * puzzleSize);
      for (int col = 0; col < puzzleSize; ++col)
      {
        fscanf(fpr, "%d", &puzzle[row][col]);
        // if cell is blank, create a new stack for it
        if (puzzle[row][col] == 0)
        {
          rows[blanks] = row;
          cols[blanks] = col;
          tos[blanks] = EMPTY;
          stacks[blanks] = (int *)malloc(sizeof(int) * puzzleSize);
          blanks++;
        }
      }
    }

    int solutions = 0;
    int *impossible = (int *)malloc(sizeof(int) * puzzleSize);
    int index = 0; // for current cell
    while (index < blanks)
    {
      // reset impossible solutions
      for (int i = 0; i < puzzleSize; ++i)
        impossible[i] = 0;

      // populates the impossible values, marks 0 for possible solutions
      validate(puzzle, rows[index], cols[index], subSize, &impossible);

      // populate stack for possible solutions
      for (int i = puzzleSize - 1; i >= 0; --i)
      {
        if (impossible[i] == 0)
          stacks[index][++tos[index]] = i + 1;
      }

      // automatically culls stacks that don't get populated
      // then backtracks to last stack for other valid solutions
      while (tos[index] == EMPTY && index > EMPTY)
      {
        index--; // backtrack
        if (index == EMPTY)
          break;
        tos[index]--; // pop
        puzzle[rows[index]][cols[index]] = 0;
      }
      // no more solutions, we already backtracked to start
      if (index == EMPTY)
        break;

      // insert current solution to the puzzle for validation for the next stacks
      puzzle[rows[index]][cols[index]] = stacks[index][tos[index]];

      // if it reached the last blank cell, that means we found a solution
      if (index == blanks - 1)
      {
        solutions++;
        // write solution to current fpw
        write_solution(fpw, solutions, puzzle, puzzleSize);

        // backtrack to next possible solution
        while (index != EMPTY)
        {
          puzzle[rows[index]][cols[index]] = 0;
          tos[index]--; // pop
          // we want to stop backtracking if the current stack
          // has at least one element, even after popping
          if (tos[index] != EMPTY)
            break;
          index--; // backtrack
        }

        // no more solutions, we already backtracked to start
        if (index == EMPTY)
          break;
      }

      // update again, just in case we backtracked
      puzzle[rows[index]][cols[index]] = stacks[index][tos[index]];
      index++;
    }

    if (solutions == 0)
      fprintf(fpw, "NO SOLUTIONS");

    printf("Test[%d] has %d solution/s.\n", test + 1, solutions);

    // free everything that was memory allocated
    for (int row = 0; row < puzzleSize; ++row)
      free(puzzle[row]);
    free(puzzle);
    free(rows);
    free(cols);
    free(tos);
    for (int i = 0; i < blanks; ++i)
      free(stacks[i]);
    free(stacks);
    free(impossible);

    fclose(fpw);
  }
  fclose(fpr);
  return 0;
}