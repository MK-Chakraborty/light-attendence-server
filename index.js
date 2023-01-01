import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://CaseBuzz:edFUuOcEWhCJfziu@cluster0.3wwer8f.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db("attendanceLog");
    const studentCollection = database.collection("students");

    app.post("/students", async (req, res) => {
      const newStudent = req.body;
      const result = await studentCollection.insertOne(newStudent);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.json(result);
    });

    app.get("/students", async (req, res) => {
      const cursor = studentCollection.find({});
      if ((await cursor.count()) === 0) {
        console.log("no user found");
      }
      const students = await cursor.toArray();
      res.send(students);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
