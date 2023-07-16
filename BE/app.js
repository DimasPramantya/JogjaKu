const express = require('express');

const association = require('./util/dbAssociation');

const userRoutes = require('./routes/user')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', userRoutes);

association().then(()=>{
    app.listen(5000)
})