const mongoose = require('mongoose');

const URL = "mongodb://127.0.0.1:27017/Airbnb"
main()
.then(console.log("Database Connected"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(URL);
}