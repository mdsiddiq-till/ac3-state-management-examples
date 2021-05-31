import { gql, StoreObject, useMutation } from "@apollo/client";
import * as AddTodoTypes from "./__generated__/AddTodo";
import { GET_ALL_TODOS } from "../queries/getAllTodos";
import { GetAllTodos } from "../__generated__/GetAllTodos";
import { notifyVar } from "../../cache";

export const ADD_TODO = gql`
  mutation AddTodo($text: String!) {
    addTodo(text: $text) {
      success
      todo {
        id
        text
        completed
      }
      error {
        message
      }
    }
  }
`;

export function useAddTodo() {
  const [mutate, { data, error }] = useMutation<
    AddTodoTypes.AddTodo,
    AddTodoTypes.AddTodoVariables
  >(ADD_TODO, {
    update(cache, { data }) {
      const newTodoFromResponse = data?.addTodo.todo;
      notifyVar(`Created ${newTodoFromResponse?.text}`);
      if (newTodoFromResponse) {
        cache.modify({
          fields: {
            todos(existingTodos, { toReference }) {
              return {
                ...existingTodos,
                edges: [
                  ...existingTodos.edges,
                  {
                    __typename: "TodosEdge",
                    node: toReference(
                      newTodoFromResponse as unknown as StoreObject
                    ),
                  },
                ],
              };
            },
          },
        });
      }
      // const existingTodos = cache.readQuery<GetAllTodos>({
      //   query: GET_ALL_TODOS,
      // });

      // if (existingTodos && newTodoFromResponse) {
      //   cache.writeQuery({
      //     query: GET_ALL_TODOS,
      //     data: {
      //       todos: {
      //         edges: [
      //           ...existingTodos?.todos.edges,
      //           { __typename: 'TodosEdge', node: newTodoFromResponse },
      //         ],
      //       },
      //     },
      //   });
      // }
    },
  });
  return { mutate, data, error };
}
