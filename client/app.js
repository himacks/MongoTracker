
fetch('http://localhost:4000/getdata')
.then(res => res.json())
.then(
    data =>
    { 
        data.forEach(entry => {
            console.log(entry);
            createNewRow(entry);
        })           
    }
)


var tbodyRef = document.getElementById('optionsTable').getElementsByTagName('tbody')[0];
const optionFields = ["date", "ticker", "callput", "expiry", "numCons", "strike", "rr", "entry", "sl", "tp", "sold", "emotions", "tradeNotes", "profit", "id"];

var numRows = 0; 

function createNewRow(entry)
{
    var newRow = tbodyRef.insertRow();

    numRows += 1;
        
    optionFields.forEach(field =>
    {
        if(field != "id")
        {
            if(entry === undefined)
            {
                var content = '""';
                var entryID = "notCataloged";
                
            }
            else
            {
                if(field == "date" || field == "expiry")
                {
                    content = entry[field].slice(0, entry[field].indexOf("T"));
                }
                else
                {
                    content = entry[field];
                }

                entryID = entry["_id"];
            }


            var cellContent = '<td><input entryId=' + entryID + ' row='+ (numRows - 1) + ' class=' + field + ' type="text" value=' + content + ' /></td>';
            newRow.innerHTML += cellContent;
        }

    })

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

        console.log("Entry ID: " + entryID + ", Attribute: " + cellAttribute + ", Value: " + cellValue);

        var data = { "entryid": entryID, "cellAttr": cellAttribute, "cellValue": cellValue };

        postData(data);
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
            ret = data;
            console.log(ret);
       },
    })
}