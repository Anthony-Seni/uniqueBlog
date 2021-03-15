
const {globalVariables} = require('./config/configuration');
const express = require('express');
const mongoose = require("mongoose");
const path = require("path");
const {mongoDbUrl, PORT} = require('./config/configuration');
const flash  = require("connect-flash");
const session = require("express-session");
const bodyParser = require("body-parser")
const methodOverride = require("method-override");
const {selectOption} = require('./config/customFunctions');
const fileUpload = require('express-fileupload')
const Handlebars = require('handlebars');
const expressHandlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const passport = require('passport')
const app = express();

app.engine('handlebars', expressHandlebars({handlebars: allowInsecurePrototypeAccess(Handlebars), helpers: {select: selectOption}}));
app.set('view engine', 'handlebars');


/* Method Override Middleware*/
app.use(methodOverride('newMethod'));

// Configure mongoose to connect to MongoDB
mongoose.connect(mongoDbUrl,{ useNewUrlParser: true } )
    .then(response => {
        console.log("MongoDB connected Successfully");
    }).catch(err => {
    console.log("Database connection failed")
});



/* Configure express */
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))


app.use(session({
    secret: 'anysecret',
    saveUninitialized: true,
    resave: true
}))

app.use(flash());


app.use(passport.initialize());
app.use(passport.session());


app.use(globalVariables);


/* file upload middleware */
app.use(fileUpload());




/* Routes */
const defaultRoutes = require('./routes/defaultRoutes');
const adminRoutes = require('./routes/adminRoutes');


app.use('/', defaultRoutes);
app.use('/admin', adminRoutes);



app.listen(PORT, () => {
    console.log("Server is running on port ${PORT}");
})

