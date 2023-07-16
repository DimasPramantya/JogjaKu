const express = require('express');

const association = require('./util/dbAssociation');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

association().then(()=>{
    app.listen(5000)
})