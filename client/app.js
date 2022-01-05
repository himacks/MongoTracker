
fetch('http://localhost:4000/getdata')
.then(res => res.json())
.then(
    data =>
    { 
        data.forEach(entry => {
            createNewRow(entry);
        })           
    }
)


var tbodyRef = document.getElementById('optionsTable').getElementsByTagName('tbody')[0];
const optionFields = ["date", "ticker", "callput", "expiry", "numCons", "strike", "rr", "entry", "sl", "tp", "sold", "profit", "tradeNotes", "emotions"];

var numRows = 0; 

function createNewRow(entry)
{
    var newRow = tbodyRef.insertRow();
    var entryID = "notCataloged";

    numRows += 1;
        
    optionFields.forEach(field =>
    {   

        if(entry != undefined)
        {
            entryID = entry["_id"];
        }
  
        if(["date", "expiry"].includes(field))
        {
            inputTypeData = ' type="date"';

        }
        else if(["strike", "entry", "sl", "tp", "sold"].includes(field)) 
        {
            inputTypeData = ' type="number" step="0.01" min="0"';

        }
        else if(["numCons", "profit"].includes(field))
        {
            inputTypeData = ' type="number"';
        }
        else if(field == "callput")
        {
            inputTypeData = ' type="text" required maxlength="4"';
            
        }
        else
        {
            inputTypeData = ' type="text"';
        }

        if(entry === undefined || entry[field] === undefined || entry[field] === null)
        {
            content = '""';
        }
        else if(field == "date" || field == "expiry")
        {
            content = entry[field].slice(0, entry[field].indexOf("T"));
        }
        else
        {
            content = entry[field];
        }



        var cellContent = '<td class="' + field + 'Col"><span><span><input entryId=' + entryID + ' row='+ (numRows - 1) + ' class="' + field + "Input" + '"' + inputTypeData + ' value="' + content + '" /></span></td>';
        newRow.insertAdjacentHTML( 'beforeend', cellContent );
    })

    var delButtonContent = '<td class="removeCol"><span><span id="btnDelRow" entryId=' + entryID + ' row=' + (numRows - 1) + '>&#10006</span></span></td>';
    newRow.insertAdjacentHTML( 'beforeend', delButtonContent );


    newRow.lastChild.addEventListener('click', function()
    {

        var currEntryId = newRow.lastChild.firstChild.getAttribute("entryID");

        if( currEntryId != "notCataloged" )
        {
            deleteRow(  currEntryId );
        }

        var rowToDel = parseInt(newRow.lastChild.firstChild.getAttribute("row")) + 1;

        //console.log(rowToDel);

        tbodyRef.deleteRow(rowToDel);

        numRows -= 1;
        
        validateRows();
    });
}


function validateRows()
{
    var rowNum = -1;
    for (var child of tbodyRef.children) {
        for (var cell of child.children) {
            cell.firstChild.setAttribute("row", rowNum);
        }

        rowNum += 1;
    }
}


const btnAddRow = document.querySelector('#btnAddRow');

btnAddRow.addEventListener('click', function()
{
    createNewRow();
});


$(document).ready(function () {
    
    $(document).on("change", "#optionsTable :input", function() {
        var cell = $(this);
        var cellValue = cell.val();
        var cellAttribute = cell.attr('class').replace("Input", "");
        var entryID = cell.attr('entryid');
        var cellRow = cell.attr('row');

        var reg=/^([0-9.:]{0,9})$/;
    
        var dontSend = false;

        //handle invalid inputs to text fields here

        if(cellAttribute == "callput")
        {
            if(!(cellValue.toLowerCase() == "call" || cellValue.toLowerCase() == "put"))
            {
                dontSend = true;
                cell.css("border-color", "red");
            }
            else
            {
                dontSend = false;
                cell.css("border-color", "black");
            }
        }

        //handles if risk reward is not formatted like 20:10.
        if(cellAttribute == "rr")
        {
            if(!reg.test(cellValue))
            {
                dontSend = true;
                cell.css("border-color", "red");
            }
            else
            {
                dontSend = false;
                cell.css("border-color", "black");
            }
            
        }

        var parentRow = cell.parent().parent();
        var rrValue = parentRow.find(".rrInput").val();
        var entryValue = parentRow.find(".entryInput").val();
        var soldValue = parentRow.find(".soldInput").val();
        var numConsValue = parentRow.find(".numConsInput").val();

        //calculate fields handling here

        if(["rr", "entry"].includes(cellAttribute) && rrValue != "" && entryValue != "" && !dontSend)
        {
            calculateStopTarget(parentRow, entryValue, rrValue, cellRow, entryID);
        }

        if((["sold", "entry", "numCons"].includes(cellAttribute)) && soldValue != "" && entryValue != "" && numConsValue != "" && !dontSend)
        {
            calculateProfit(parentRow, entryValue, soldValue, numConsValue, cellRow, entryID);
        }

        //console.log("Entry ID: " + entryID + ", Attribute: " + cellAttribute + ", Value: " + cellValue + ", Row: " + cellRow);

        var data = { "entryid": entryID, "cellData": [{"cellAttr": cellAttribute, "cellValue": cellValue}], "cellRow" : cellRow };

        //if(cellAttribute == "rr" && cellAttribute.value.matches("[0-9:]+"));
        //{
            //console.log("matches");
        //}
        if(!dontSend)
        {
            postData(data);
        }
    });
});

function calculateStopTarget(parentRow, entry, rr, cellRow, entryID)
{
    var a = rr.split(":");
    var reward = 1 + a[0] / 100;
    var risk = 1 - a[1] / 100;

    var sl = Math.round(entry * risk * 100) / 100;
    var tp = Math.round(entry * reward * 100) / 100;

    parentRow.find(".slInput").val(sl);
    parentRow.find(".tpInput").val(tp);

    var data = { "entryid": entryID, "cellData": [{"cellAttr": "tp", "cellValue": tp}, {"cellAttr": "sl", "cellValue": sl}], "cellRow" : cellRow };

    postData(data);
}

function calculateProfit(parentRow, entry, sold, numCons, cellRow, entryID)
{
    var profit = Math.round((sold - entry) * 100) * numCons;

    parentRow.find(".profitInput").val(profit);

    var data = { "entryid": entryID, "cellData": [{"cellAttr": "profit", "cellValue": profit}], "cellRow" : cellRow };

    postData(data);
}

function postData(data)
{
    $.ajax({
        url: 'http://localhost:4000/postData',
        data: data,
        type: 'POST',
        success: function( data, status, xhttp) {
            // data will be true or false if you returned a json bool
            if (data["newRow"] == true)
            {
                $('#optionsTable :input').filter('[row="' + parseInt(data["cellRow"]) + '"]').each(function() {
                    $(this).attr('entryId', data["entryid"]);
                });
            }
       },
    })
}

function deleteRow(entryID)
{
    var data = {"entryid" : entryID};

    $.ajax({
        url: 'http://localhost:4000/delRow',
        data: data,
        type: 'POST',
        success: function( data, status, xhttp) {
            // data will be true or false if you returned a json bool
            //console.log("success");
       },
    })
}