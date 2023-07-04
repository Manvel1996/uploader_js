import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.post("/upload", (req, res) => {
  res.status(200).json({ message: "Sucssess" });
  // res.status(404).json({message:"Not a found"})
});

app.listen(process.env.PORT || 4444, (err) => {
  if (!err) {
    console.log("Server Ok");
  } else console.log(err);
});
