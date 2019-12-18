const mongoose = require('mongoose');
const DB = 'mongodb+srv://admin:MiaoMiao9!@cluster0-0u0f3.mongodb.net/youphoto?retryWrites=true&w=majority';

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Db Connection Successful');
    })
    .catch(error => {
        console.log(error);
    });
