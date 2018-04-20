#include <stdio.h>
#include <stdlib.h>
#include <math.h>

typedef struct stack
{
  int x;
  struct stack *next;
} stack_node;

typedef struct node_tag
{
  int row, col;
  struct node_tag *next;
  struct node_tag *prev;
  stack_node *stack;
} stack_list;

void print_puzzle(int **puzzle, int size)
{
  int i, j;
  for (i = 0; i < size * size; ++i)
  {
    for (j = 0; j < size * size; ++j)
    {
      printf("%d ", puzzle[i][j]);
    }
    printf("\n");
  }
}

void print_stack(stack_node *ptr)
{
  if (ptr != NULL)
  {
    stack_node *temp = ptr;
    while (temp != NULL)
    {
      printf("%d ", temp->x);
      temp = temp->next;
    }
    printf("\n");
  }
  else
  {
    printf("\tStack empty!\n");
  }
}

void validate(int **puzzle, int row, int col, int size, int **impossible)
{
  int i, j;

  for (i = 0; i < size * size; ++i)
  {
    // Array of flags: 0 is flag for possible; 1 is flag for seen in puzzle
    // Flags numbers present in its row
    if (puzzle[row][i] != 0)
    {
      (*impossible)[puzzle[row][i] - 1] = 1;
    }
    // Flags numbers present in its column
    if (puzzle[i][col] != 0)
    {
      (*impossible)[puzzle[i][col] - 1] = 1;
    }
  }

  // Flags numbers present within it's subsquare
  for (i = size * (row / size); i < size * (row / size) + size; ++i)
  {
    for (j = size * (col / size); j < size * (col / size) + size; ++j)
    {
      if (puzzle[i][j] != 0)
      {
        (*impossible)[puzzle[i][j] - 1] = 1;
      }
    }
  }
}

void pop(stack_list *ptr)
{
  stack_node *temp = ptr->stack;
  ptr->stack = ptr->stack->next;
  free(temp);
}

void write_solution(FILE *file_write, int solution, int **puzzle, int size)
{
  int i, j;
  fprintf(file_write, "%d\n", solution);
  for (i = 0; i < size * size; ++i)
  {
    for (j = 0; j < size * size; ++j)
    {
      fprintf(file_write, "%d ", puzzle[i][j]);
    }
    fprintf(file_write, "\n");
  }
}

int main()
{
  int i, j, k;
  int num_of_puzzles = 0;
  int size = 0;
  stack_list *node, *temp = NULL;
  stack_list *root = NULL;
  stack_node *ptr;

  FILE *file_read = NULL;
  FILE *file_write = NULL;

  file_read = fopen("input.txt", "r");
  file_write = fopen("output.txt", "w");
  fscanf(file_read, "%d", &num_of_puzzles);

  for (k = 0; k < num_of_puzzles; ++k)
  {
    fscanf(file_read, "%d", &size);

    int **puzzle = (int **)malloc(sizeof(int *) * size * size);
    int *impossible = (int *)malloc(sizeof(int) * size * size);

    // create 2D puzzle
    for (i = 0; i < size * size; ++i)
    {
      puzzle[i] = (int *)malloc(sizeof(int) * size * size);
      for (j = 0; j < size * size; ++j)
      {
        fscanf(file_read, "%d", &puzzle[i][j]);

        // if cell is 0, initialize stack for it
        if (puzzle[i][j] == 0)
        {
          node = (stack_list *)malloc(sizeof(stack_list));
          node->row = i;
          node->col = j;
          node->next = NULL;
          node->prev = NULL;
          node->stack = NULL;

          // attach node to last node in list of stack nodes
          if (root == NULL)
            root = node;
          else
          {
            temp = root;
            while (temp->next != NULL)
            {
              temp = temp->next;
            }
            temp->next = node;
            node->prev = temp;
          }
        }
      }
    }

    temp = root;
    while (temp != NULL)
    {
      for (i = 0; i < size * size; ++i)
        impossible[i] = 0;
      validate(puzzle, temp->row, temp->col, size, &impossible);

      // populates stack
      for (i = size * size - 1; i >= 0; --i)
      {
        if (impossible[i] == 0)
        {
          ptr = (stack_node *)malloc(sizeof(stack_node));
          ptr->x = i + 1;
          ptr->next = temp->stack;
          temp->stack = ptr;
        }
      }

      // if the current node didnt make a stack
      // backtrack until you find a stack with more than 2 nodes
      while (temp->stack == NULL)
      {
        temp = temp->prev;
        puzzle[temp->row][temp->col] = 0; // reset value of puzzle
        pop(temp);
      }

      int solutions = 0;
      // this means it reached the end of the puzzle
      // and found a solution
      if (temp->next == NULL)
      {
        printf("SOLUTION FOUND\n");
        solutions++;
        puzzle[temp->row][temp->col] = temp->stack->x;
        printf("Row: %d, Col: %d\n", temp->row, temp->col);
        print_stack(temp->stack);
        print_puzzle(puzzle, size);
        write_solution(file_write, solutions, puzzle, size);
        // remove the the stack of the last node
        puzzle[temp->row][temp->col] = 0;
        pop(temp);

        // keep removing stacks until it finds a stack that has 2 or more nodes
        do
        {
          temp = temp->prev;
          // there's a possibility that it will reach the beginning
          if (temp == NULL)
            break;
          puzzle[temp->row][temp->col] = 0;
          pop(temp);
        } while (temp->stack == NULL);
        // has reached the beginning, the puzzle has been solved
        if (temp == NULL)
          break;
      }
      // set the current cell of to the TOS for validation
      puzzle[temp->row][temp->col] = temp->stack->x;

      printf("Row: %d, Col: %d\n", temp->row, temp->col);
      print_stack(temp->stack);
      print_puzzle(puzzle, size);
      // get next node to validate
      temp = temp->next;
    }
    for (i = 0; i < size * size; ++i)
    {
      free(puzzle[i]);
    }
    free(puzzle);
    free(impossible);
  }

  fclose(file_read);
  fclose(file_write);
}
