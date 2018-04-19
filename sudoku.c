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
}

void validate(int **puzzle, int row, int col, int size, int **impossible)
{
  int i, j;

  int rowIndex;
  for (i = 0; i < size * size; ++i)
  {
    // 0 is flag for possible
    // 1 is flag for seen in puzzle
    // rowIndex = puzzle[row][i];
    // printf("row index: %d\n", rowIndex);
    if (puzzle[row][i] != 0)
    {
      (*impossible)[puzzle[row][i] - 1] = 1;
    }
    if (puzzle[i][col] != 0)
    {
      (*impossible)[puzzle[i][col] - 1] = 1;
    }
  }

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

int main()
{
  int i, j, k;
  int num_of_puzzles = 0;
  int size = 0;
  stack_list *node, *temp = NULL;
  stack_list *root = NULL;
  stack_node *ptr;
  int *impossible = NULL;
  int **puzzle = NULL;

  FILE *fp = NULL;
  fp = fopen("graph.in", "r");
  fscanf(fp, "%d", &num_of_puzzles);

  printf("Num of puzzles: %d\n", num_of_puzzles);
  for (k = 0; k < num_of_puzzles; ++k)
  {
    fscanf(fp, "%d", &size);

    puzzle = (int **)malloc(sizeof(int *) * size * size);
    impossible = (int *)malloc(sizeof(int) * size * size);
    // create 2D puzzle
    for (i = 0; i < size * size; ++i)
    {
      puzzle[i] = (int *)malloc(sizeof(int) * size * size);
      for (j = 0; j < size * size; ++j)
      {
        fscanf(fp, "%d", &puzzle[i][j]);
        // printf("puzzle[i][j]: %d\n", puzzle[i][j]);

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
          {
            root = node;
          }
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

      // for (i = 0; i < size * size; ++i)
      //   printf("%d ", impossible[i]);
      // printf("\n");

      // populates stack
      for (i = size * size - 1; i >= 0; --i)
      {
        if (impossible[i] == 0)
        {
          ptr = (stack_node *)malloc(sizeof(stack_node));
          ptr->x = i + 1;
          if (temp->stack == NULL)
          {
            temp->stack = ptr;
          }
          else
          {
            ptr->next = temp->stack;
            temp->stack = ptr;
          }
        }
      }
      printf("row: %d, col: %d\n", temp->row, temp->col);

      // inserts value of the current nodes TOS into the puzzle
      // this is to correctly validate the next node
      if (temp->stack)
      {
        puzzle[temp->row][temp->col] = temp->stack->x;
        print_puzzle(puzzle, size);
      }
      else
      {
        printf("going back\n");
        while (temp->stack == NULL)
        {

          // printf("setting temp back\n");
          temp = temp->prev;
          // do pop
          // printf("make a pointer to the current temp and it's x is %d\n", temp->stack->x);
          stack_node *ptr = temp->stack;

          // printf("repoint TOS to the next node\n");
          temp->stack = temp->stack->next;

          // puzzle[temp->row][temp->col] = temp->stack->x;
          free(ptr);

          printf("row: %d, col: %d\n", temp->row, temp->col);
        }
      }
      temp = temp->next;
    }

    // for (i = 0; i < size * size; ++i)
    // {
    //   free(puzzle[i]);
    // }
    // free(puzzle);
    // free(impossible);
  }

  fclose(fp);
}
