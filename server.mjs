
import express from 'express'
import cors from "cors";
import './database.js'
import { Todo } from './models/index.js';

const app = express()
const port = process.env.PORT || 5002;



app.use(express.json())

app.use(
  cors({ origin: ["http://localhost:5173", "https://todo-app-by-ms.surge.sh/"] }),
);



app.get("/api/v1/todos", async (request, response) => {
  try {

    const todos = await Todo.find({},
      { ip: 0, __v: 0, updatedAt: 0 }
    ).sort({ _id: -1 })

    const message = !todos.length ? "todos empty" : "ye lo sab todos";

    response.send({ data: todos, message: message });
  } catch (err) {
    response.status(500).send("Internal server error")
  }
});




app.post('/api/v1/todo', async (request, response) => {

  try {
    const obj = {
      todoContent: request.body.todo,
      ip: request.ip,
      createdAt: new Date(),
      testingDate: new Date()
    }

    console.log("obj:", obj);

    const result = await Todo.create(obj);

    response.send({ message: "todo add ho gya hai", data: result });

  } catch (error) {
    response.status(500).send({ message: "An error occurred while adding the todo", error: error.message });
  }
}
);





app.patch('/api/v1/todo/:id', async (request, response) => {
  const id = request.params.id


  const result = await Todo.findByIdAndUpdate(id,

    { todoContent: request.body.todoContent }
  )

  console.log("result=>", result);


  if (result) {
    response.status(201).send({
      data: { todoContent: request.body.todoContent, id: id, },
      message: 'todo success'
    });
  } else {
    response.status(200).send({ data: null, message: 'todo not found' });
  }




  // let isFound = false;
  // for (let i = 0; i < todos.length; i++) {
  //   if (Todo[i].id === id) {

  //     const result = await Todo.findByIdAndUpdate(id,
  //       { todoContent: request.body.todoContent }
  //     )

  //     Todo[i].todoContent = request.body.todoContent;
  //     isFound = true;
  //     break;
  //   }
  // }



  // console.log("ye hy id: ", id);

});





app.delete('/api/v1/todo/:id', async (request, response) => {
  const id = request.params.id



  const result = await Todo.findByIdAndDelete(id)


  if (result) {
    response.status(201).send({
      // data: { todoContent: request.body.todoContent, id: id, },

      message: 'todo deleted'
    });
  } else {
    response.status(200).send('todo not found')
  }
});



//

app.use((request, response) => {
  response.status(404).send("no route found!");
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})