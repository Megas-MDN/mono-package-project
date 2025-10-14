import { app } from "./app";

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(
    `Server started on port %s 🚀 \n${new Date()}\n${"=".repeat(50)}`,
    port,
  );
});
