const express = require('express');
const mongoose = require('mongoose');
const app = express();
//const ejs = require('ejs');
const cors = require('cors');
const bodyParser = require('body-parser');

const databaseName = 'logSheet';
const password = 'wolf2010';

app.use( bodyParser.json() );

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors());

mongoose.connect('mongodb+srv://maxim3210:' + password + '@optionlog.wvxgv.mongodb.net/' + databaseName + '?retryWrites=true&w=majority');

const optionsEntrySchema =  {
    date: Date,
    ticker: String,
    callput: String,
    expiry: Date,
    numCons: Number,
    strike: Number,
    rr: Number,
    entry: Number,
    sl: Number,
    tp: Number,
    sold: Number,
    emotions: String,
    tradeNotes: String,
    profit: Number,
    id: Number
}

const optionsEntry = mongoose.model('optionentries', optionsEntrySchema);

app.get('/', (req, res) => {
    res.send("Welcome to the server");
})

app.use('/getdata', (req, res) => {
    optionsEntry.find({}, function(err, optionEntries) {
        res.send(JSON.stringify(optionEntries));
    });
});

app.use("/postData", (req, res) => {
    if (req.method == 'POST') {
        console.log("Entry ID: " + req.body.entryid + ", Attribute: " + req.body.cellAttr + ", Value: " + req.body.cellValue);
        if (req.body.entryid == "notCataloged")
        {
            res.send("Created new entry, cataloged as 411251512513531");
        }
        else
        {
            res.send("Updated entry");
        }
    }
})


app.listen(4000, function () {
    console.log('server is running');
})