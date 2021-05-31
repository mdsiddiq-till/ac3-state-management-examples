import React from "react";
import { notifyVar } from "../cache";
import Header from "../components/Header";
import { useAddTodo } from "../operations/mutations/addTodo";

export default function () {
  const { mutate } = useAddTodo();
  const notify = notifyVar();
  console.log("notify in main ", notify);
  return (
    <>
      {<pre><b>{'Notification: ' +JSON.stringify(notify)}</b></pre>}
      <Header addTodo={(text) => mutate({ variables: { text } })} />
    </>
  );
}
