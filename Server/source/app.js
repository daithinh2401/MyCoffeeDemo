var express = require('express');
var { connectDatabase } = require('./database/DbHelper')
var bodyParser = require('body-parser')

var app = express();
var PORT = 3000;

app.use(bodyParser.json());

// Import routes
const coffeeDataRouter = require('./routes/Routes');
app.use('/CoffeeData', coffeeDataRouter);

// Import User Info routes
const userInfoRoutes = require('./routes/UserInfoRoutes');
app.use('/UserInfo', userInfoRoutes);

app.listen(process.env.PORT || 5000, '', () => {
    console.log('Server is running...');
});

connectDatabase();