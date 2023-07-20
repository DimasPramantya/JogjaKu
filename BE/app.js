const express = require('express');

const association = require('./util/dbAssociation');

const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const notFoundHandler = require('./middleware/errorNotFound');
const errorBadRequestHandler = require('./middleware/badRequest');
const upload = require('./middleware/uploadFile');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(upload.single('image'));

app.use('/admin', adminRoutes);

app.use('/', userRoutes);

app.use(errorBadRequestHandler);

app.use(notFoundHandler);

association().then(()=>{
    app.listen(5000)
})