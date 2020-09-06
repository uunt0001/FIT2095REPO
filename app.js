let express = require('express');
let bodyParser = require('body-parser');
let moment = require('moment');
let app = express();
let viewPaths = __dirname + '/views/';
let ejs = require('ejs');
let db = [];

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

// -- get the age
function getAge(dob) {
    let currentDate = new Date(moment().format('YYYY-MM-DD'));
    let age = currentDate.getFullYear() - dob.getFullYear();
    let month = currentDate.getMonth() - dob.getMonth();

    if (month < 0 || (month === 0 && currentDate.getDate() < dob.getDate())) {
        age = age - 1;
    }
    return age;
}


//-------------- Middleware ---------------- //

// -- static files
app.use(express.static('./public/images'));
app.use(express.static('css'));

// -- Body parser
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());




//---------- Endpoints ---------------- //
app.get('/', (req, res) => {
    res.sendFile(viewPaths + 'homepage.html');
});

app.get('/newEmployee', (req, res) => {
    res.sendFile(viewPaths + 'newEmployee.html')
});

app.get('/listEmployees', (req, res) => {
    res.render('listEmployees.html', {employeeList:db});
});

app.post('/addNewEmployee', (req, res) => {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let dob = new Date(req.body.dob);
    let age = getAge(dob);
    if ((firstName.length + lastName.length) < 3 || age < 16) {
        res.sendFile(viewPaths + 'invalid.html');
    } else {
        db.push(req.body);
        res.render('listEmployees.html', {
            employeeList: db
        });
    }
});

app.get('*', (req,res) => {
    res.sendFile(viewPaths + '404.html');
});

app.listen(8080);