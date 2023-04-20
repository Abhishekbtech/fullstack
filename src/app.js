const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const upload = require("express-fileupload");


require("./db/conn");
const Register = require("./models/registers");
const { json } = require("express");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public" );
const template_path = path.join(__dirname, "../templates/views" );
const partials_path = path.join(__dirname, "../templates/partials" );

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/register", (req, res) =>{
    res.render("register");
})

app.get("/login", (req, res) =>{
    res.render("login");
})

app.get("/logout", (req, res) =>{
    res.render("login");
})

// create a new user in our database
app.post("/register", async (req, res) =>{
    try {

      const password = req.body.password;
      const cpassword = req.body.confirmpassword;

      if(password === cpassword){
        
        const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname:req.body.lastname,
                email:req.body.email,
                gender:req.body.gender,
                phone:req.body.phone,
                age:req.body.age,
                file:req.body.file,
                password:req.body.password,
                confirmpassword:req.body.confirmpassword    
        })
        
        const registered = await registerEmployee.save();
        console.log('A user have successfully register');
        res.status(201).render("index");               
        // send("You have successfully registe")

      }else{
          res.send("password are not matching")
      }
        
    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
})


// login check

app.post("/login", async(req, res) =>{
  try {
     
         const email = req.body.email;
         const password = req.body.password;
 
         const useremail = await Register.findOne({email:email});
        
         if(useremail.password === password){
            res.status(201).send(useremail);
            console.log(`User have successfully login and his loginid ${email}`)
         }else{
            res.send("invalid Password Details");
         }
     
    } catch (error) {
        res.status(400).send("invalid login Details")
    }
})

// delete a id in data base by postman

app.delete('/delete/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const deleteid = await Register.findByIdAndDelete(id);
        if (!deleteid){
            return res.status(404).json({message: `cannot find any product with id ${id}`})
        }
        else{
            res.status(201).send("You have successfully deleted your Account")
            console.log(`A user have successfully deleted his account his account id ${id}`)
        }
        
    } catch (error) {
       res.status(400).send("You enter a invalid id ")
    }
})


app.put('/update/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const product = await Register.findByIdAndUpdate(id, req.body)
        //we cannot find any product in dataase
        if(!product){
            return res.status(404).json({message: `cannot find any product with id ${id}`})
        }
        const updateproduct = await Register.findById(id)
        res.status(200).json(updateproduct)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: error.message})
    }
})

app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
})
