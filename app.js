import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { title } from "process";

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
const app=express();
const port =3000;
const posts =[];
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("home", { posts: posts });

});
app.post("/compose", (req, res) => {
  const post = {
    id:Date.now().toString(),
    title: req.body.title,
    content: req.body.content,
  };
  posts.push(post); 
  res.redirect("/");
});

app.get("/posts/:postTitle",(req,res)=>{
    const requiredTitle =req.params.postTitle.toLowerCase();

    const foundPost=posts.find(post => post.title.toLowerCase() === requiredTitle);

    if(foundPost) {
        res.render("post",{ post: foundPost});
    } else {
        res.status(404).send("Post not Found ");
    }
})
app.post("/delete/:id",(req,res)=>{
    const id=req.params.id;
    const index =posts.findIndex(post => post.id === id);
    if(index !=-1) {
        posts.splice(index,1);
    }
    res.redirect("/");
})

app.get("/edit/:id",(req,res)=>{
    const id=req.params.id;
    const post =posts.find(p=>p.id=== id);
    if(post) {
        res.render("edit",{ post });

    } else {
        res.status(404).send("Post not Found");
    }
});

app.post("/edit/:id",(req,res) =>{
    const id=req.params.id;
    const post=posts.find(p=>p.id===id);
    if(post) {
        post.title=req.body.title;
        post.content=req.body.content;
    }
    res.redirect("/");  
})
app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(port,()=>{
    console.log(`The Server is running in ${port}`);
})