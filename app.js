var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require('connect-flash'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    User = require("./models/user"),
    methodOverride = require("method-override"),
    blogRoutes = require("./routes/blogs"),
    productRoutes = require("./routes/products")
serviceRoutes = require("./routes/services")
    //add faq, newsletter routes once the schema is final like blog, product and service as shown
indexRoutes = require("./routes/index")
const database = async ()=> await mongoose.connect("mongodb+srv://rohan:rohan@cluster0.29lux.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{ useNewUrlParser: true,useUnifiedTopology: true,useFindAndModify: false, }).then(x =>{console.log("connected to database sucessfully")}).catch(error=>{console.error('Error connecting to mongo', err);});
database();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");
app.use(require("express-session")({
    secret: "hello world",
    resave: false,
    saveUninitialized: false
}));
passport.use(new LocalStrategy(User.authenticate()));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
app.use("/", indexRoutes);
app.use("/blogs", blogRoutes);
app.use("/products", productRoutes);
app.use("/services", serviceRoutes);

const port =process.env.PORT || 3006
app.listen(port, function() {
    console.log("App about to start",process.env.PORT);
});