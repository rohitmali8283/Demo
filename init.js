const mongoose = require("mongoose");
const Chat = require("./models/chat.js");

main()
    .then( () => {
        console.log("connection successful");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/fakeWhatsapp');
}

let AllChats = [
    {
        from: "neha",
        to: "Rohit",
        msg: "Come hear",
        created_at: new Date(),
    },
    {
        from: "rohit",
        to: "priya",
        msg: "I like You",
        created_at: new Date(),
    },
    {
        from: "ram",
        to: "sham",
        msg: "This temple was very big",
        created_at: new Date(),
    },
    {
        from: "rohan",
        to: "aditya",
        msg: "Send me all photos",
        created_at: new Date(),
    },
    {
        from: "prasad",
        to: "harshad",
        msg: "All the best",
        created_at: new Date(),
    },
]

Chat.insertMany(AllChats);