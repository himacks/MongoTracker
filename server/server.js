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

        var entryID = req.body.entryid;
        var cellAttr = req.body.cellAttr;
        var cellVal = req.body.cellValue;
        var cellRow = req.body.cellRow;
        var newRow;

        //console.log("Entry ID: " + entryID + ", Attribute: " + cellAttr + ", Value: " + cellVal + ", Cell Row: " + cellRow);
        if (entryID == "notCataloged")
        {
            console.log("CREATING OBJECT");
            var newEntryIDObject = mongoose.Types.ObjectId();
            var creationData = {"_id": newEntryIDObject, [cellAttr]: cellVal};
            entryID = newEntryIDObject.toString();
            newRow = true;
            createNewObject(creationData);
        }
        else
        {
            console.log("UPDATING OBJECT");
            newRow = false;
            var updateData = {[cellAttr]: cellVal};
            updateObject(entryID, updateData);
        }
        //console.log(returnData);
        var returnData = { "entryid": entryID, "newRow": newRow, "cellRow": cellRow};
        res.send(returnData);
    }
})


app.use("/delRow", (req, res) => {
    if (req.method == 'POST') {

        var entryID = req.body.entryid;

        deleteObject(entryID);

    }
})

app.listen(4000, function () {
    console.log('server is running');
})


function createNewObject(data)
{   
    optionsEntry.create(data, function(err, result) {
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log("RESULT: " + result);
        }
    });
}

function updateObject(objectID, data)
{
    optionsEntry.findByIdAndUpdate(objectID, data, function(err, result) {
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log("RESULT: " + result);
        }
    });
}

function deleteObject(objectID)
{

    console.log("attempting to delete " + objectID);

    optionsEntry.deleteOne({ "_id" : objectID}, function(err, result) {
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log("RESULT: " + result);
        }
    });
}