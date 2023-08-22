const express = require('express');

const association = require('./util/dbAssociation');

const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const notFoundHandler = require('./middleware/errorNotFound');
const errorBadRequestHandler = require('./middleware/badRequest');

const app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE, PATCH");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/admin', adminRoutes);

app.use('/', userRoutes);

app.use(errorBadRequestHandler);

app.use(notFoundHandler);

const PORT = process.env.PORT || 5001

association().then((res)=>{
    app.listen(PORT);
    console.log('connected to db', res)
}).catch(e=>{
    console.log(e);
})