
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
const optionFields = ["date", "ticker", "callput", "expiry", "numCons", "strike", "rr", "entry", "sl", "tp", "sold", "emotions", "tradeNotes", "profit"];

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
        else if(["strike", "rr", "entry", "sl", "tp", "sold"].includes(field)) 
        {
            inputTypeData = ' type="number" step="0.01" min="0"';

        }
        else if(["numCons", "profit"].includes(field))
        {
            inputTypeData = ' type="number"';
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




        var cellContent = '<td><input entryId=' + entryID + ' row='+ (numRows - 1) + ' class=' + field + inputTypeData + ' value=' + content + ' /></td>';
        newRow.insertAdjacentHTML( 'beforeend', cellContent );
    })

    var delButtonContent = '<td><span id="btnDelRow" entryId=' + entryID + ' row=' + (numRows - 1) + '>&#10006</span></td>';
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
        var cellAttribute = cell.attr('class');
        var entryID = cell.attr('entryid');
        var cellRow = cell.attr('row');

        //console.log("Entry ID: " + entryID + ", Attribute: " + cellAttribute + ", Value: " + cellValue + ", Row: " + cellRow);

        var data = { "entryid": entryID, "cellAttr": cellAttribute, "cellValue": cellValue, "cellRow" : cellRow };

        var test = postData(data);

    });
});



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