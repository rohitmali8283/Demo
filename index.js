const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Chat = require("./models/chat");
const path = require("path");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError");

app.set("views", path.join(__dirname,"views"));
app.set("view engine" , "ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended: true}));
app.use(methodOverride("_method"));

main()
    .then( () => {
        console.log("connection successful");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/fakeWhatsapp');
}

//index Route
app.get("/chats", async (req,res,next)=>{
    try{
        let chats = await Chat.find();
        res.render("index.ejs" , { chats } );
    }catch(err){
        next(err);
    }
    
});

//New Route
app.get("/chats/new", (req , res) => {
    // throw new ExpressError ( 404 , "Page not Found");
    res.render("new.ejs");
});


//Create Route
app.post("/chats" ,async (req , res , next) => {
    try{
        let {from ,to ,msg} = req.body;
        let newChat = new Chat({
            from: from,
            to: to,
            msg: msg,
            created_at: new Date(),
        });
        await newChat.save()
            // .then((res)=>{
            //     console.log("Chat was saved");
            // })
            // .catch((err)=>{
            //     console.log(err);
            // });
            res.redirect("/chats");
    }catch(err){
        next(err);
    }
    
});

function asyncWrap(fn) {
    return function(req , res , next) {
        fn(req , res , next).catch((err) => next(err));
    };
}

// New - Show Route
app.get("/chats/:id" ,asyncWrap(async (req , res , next) => {
    let {id} = req.params;
    let chat = await Chat.findById(id);
    if (!chat) {
        next(new ExpressError ( 404 , "Chat not Found"));
    }
    res.render("edit.ejs" , { chat });
    // res.send("Working");
    })
);

//Edit Route
app.get("/chats/:id/edit" , asyncWrap(async (req ,res)=>{
    let {id} = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs" , { chat });
    })
);

app.put("/chats/:id",asyncWrap( async (req,res)=>{
    let {id} = req.params;
    let {msg:newMsg} = req.body;
    
    let updatedChat = await Chat.findByIdAndUpdate(
        id,
        {msg: newMsg},
        {runValidators:true , new: true},
    );
    console.log(updatedChat);
    res.redirect("/chats");
    })
);

//Distroy Route
app.delete("/chats/:id" , asyncWrap(async (req , res) =>{
    let {id} = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id);
    console.log(deletedChat);
    res.redirect("/chats");
    })
);

// let chat1 = new Chat({
//     from: "neha",
//     to: "priya",
//     msg: "send me your exam sheets",
//     created_at: new Date(),
// });

// chat1.save()
//     .then( (res)=>{
//         console.log(res);
//     })
//     .catch((err)=>(console.log(err)));

app.get("/",(req,res)=>{
    res.send("Server Working");
});

const handleValidationErr = (err) =>{
    console.log("This was a Validation Error.Please follow rules");
    console.dir(err.message);
    return err;
}

app.use((err , req , res , next)=>{
    console.log(err.name);
    if(err.name === "ValidationError"){
        
    }
    next(err);
})

// Error Handling Middleware
app.use((err , req , res , next) => {
    let {status = 500 , message = "Some Error"} = err;
    res.status(status).send(message);
});

app.listen(8080 , ()=>{
    console.log("app is listening on port 8080");
});