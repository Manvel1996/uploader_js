import express from "express";
import cors from "cors";

const app = express();
const PORT = 8080

app.use(cors());

app.post("/upload", (req, res) => {
  res.status(200).json({ message: "Success" });
  // res.status(404).json({message:"Not a found"})
});

app.listen(PORT, (err) => {
  if (!err) {
    console.log("Server Ok");
  } else console.log(err);
});
