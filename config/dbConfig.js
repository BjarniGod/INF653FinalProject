const mongoose = require("mongoose");

const connectDB = async () => {
    try {

        await mongoose.connect("mongodb+srv://bjarnigod:Draumur99@cluster0.mbeox7z.mongodb.net/StatesDB?retryWrites=true&w=majority", {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
    } catch (err) {
        console.log(err);
    }
};

module.exports = connectDB;