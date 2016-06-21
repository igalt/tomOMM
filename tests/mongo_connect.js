var mongoose = require('mongoose');

mongoose.connect('mongodb://10.64.195.84:27017/omm-project-db');

var TestRow = mongoose.model('Testing',{id: String, name: String, phone_number: String});

var testRow1 = new TestRow({id: '1', name: 'misha grisha', phone_number: '123-4567890'});

testRow1.save(function (err, testObj) {
    if (err) {
        console.log("Error when trying to submit row to Mongo: ",err);
    } else {
        console.log("Saved Successfully!",testObj);
    }
});

console.log("yay!");
