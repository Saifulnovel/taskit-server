const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri ="mongodb+srv://taskit:Saino150@cluster0.6h4mfox.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    const TaskCollections = client.db("Taskit").collection("taskCollection");
    const UserCollections = client.db("Taskit").collection("users");

    // add Task
    app.post("/addtask", async (req, res) => {
      const task = req.body;
      const result = await TaskCollections.insertOne(task);
      res.send(result);
    });
    // all task
    app.get("/alltask", async (req, res) => {
    //   const email = req.query.email;
    //   console.log(email);
      const query = { };
      const cursor = await TaskCollections.find(query).toArray();
      res.send(cursor);
    });
    // updated
    app.put("/alltask/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const taskComplete = req.body.taskComplete;
      const query = { _id: ObjectId(id) };
      console.log(query);
      const updatedDoc = {
        $set: {
          taskComplete: taskComplete,
        },
      };
      const result = await TaskCollections.updateOne(query, updatedDoc);
      res.send(result);
    });
    // Task delete
    app.delete("/alltask/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: ObjectId(id) };
      const result = await TaskCollections.deleteOne(filter);
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await UserCollections.insertOne(user);
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => {
  console.log(err);
});

app.get("/", (req, res) => {
  console.log(req);
  res.send("taskit server");
});
app.listen(port, () => {
  client.connect((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("connect to Mongodb");
    }
  });
  console.log(`Taskit server is running on PORT ${port}`);
});
