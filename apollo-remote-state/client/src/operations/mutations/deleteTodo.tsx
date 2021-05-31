import { gql, StoreObject, useMutation } from "@apollo/client";
import * as DeleteTodoTypes from "./__generated__/DeleteTodo";
import { GET_ALL_TODOS } from "../queries/getAllTodos";
import { GetAllTodos } from "../__generated__/GetAllTodos";

export const DELETE_TODO = gql`
  mutation DeleteTodo($id: Int!) {
    deleteTodo(id: $id) {
      success
      todo {
        id
        text
        completed
      }
      error {
        ... on TodoNotFoundError {
          message
        }
      }
    }
  }
`;

export function useDeleteTodo() {
  const [mutate, { data, error }] = useMutation<
    DeleteTodoTypes.DeleteTodo,
    DeleteTodoTypes.DeleteTodoVariables
  >(DELETE_TODO, {
    update(cache, { data }) {
      const deletedTodoId = data?.deleteTodo.todo?.id;
      if (deletedTodoId) {
        console.log(
          "hello",
          cache.identify(data?.deleteTodo.todo as unknown as StoreObject)
        );
        cache.modify({
          id: cache.identify(data?.deleteTodo.todo as unknown as StoreObject),
          fields: {
            text(existingTodos, { DELETE }) {
              return DELETE;
            },
          },
          // fields(value, details)  {
          //   return details.DELETE;
          // },
        });
      }
      // const allTodos = cache.readQuery<GetAllTodos>({
      //   query: GET_ALL_TODOS
      // });

      // cache.writeQuery({
      //   query: GET_ALL_TODOS,
      //   data: {
      //     todos: {
      //       edges: allTodos?.todos.edges.filter((t) => t?.node.id !== deletedTodoId)
      //     },
      //   },
      // });
    },
  });

  return { mutate, data, error };
}
