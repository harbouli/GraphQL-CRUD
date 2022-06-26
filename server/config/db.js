const mongoose = require("mongoose");

const {MONGODB_URI} = process.env;
const connect = async () => {
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`Mongodb Connected`.cyan.underline.bold);
};

module.exports = connect;
