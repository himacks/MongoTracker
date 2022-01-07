
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

const btnAddRow = document.querySelector('#btnAddRow');

btnAddRow.addEventListener('click', function()
{
    createNewRow();
});

//
// OPTIONS TABLE FUNCTIONS OPTIONS TABLE FUNCTIONS OPTIONS TABLE FUNCTIONS OPTIONS TABLE FUNCTIONS OPTIONS TABLE FUNCTIONS OPTIONS TABLE FUNCTIONS OPTIONS TABLE FUNCTIONS OPTIONS TABLE FUNCTIONS
//

/**
 * Creates a table row in the options table.
 * 
 * @param  {} entry object containing cell data of a singular option row. for a complete row needs every field from var optionFields. 
 */
function createNewRow(entry)
{
    var newRow = tbodyRef.insertRow();
    var entryID = "notCataloged";
        
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

        if(field == "emotions")
        {
            var cellContent = '<td class="' + field + 'Col"><span><span><div class="emotionsDiv"><div class="emotionTagsDiv"></div><input entryId=' + entryID + ' class="' + field + "Input" + '"' + inputTypeData + ' value="' + content + '" /></div></span></td>';
        }
        else
        {
            var cellContent = '<td class="' + field + 'Col"><span><span><input entryId=' + entryID + ' class="' + field + "Input" + '"' + inputTypeData + ' value="' + content + '" /></span></td>';
        }



        newRow.insertAdjacentHTML( 'beforeend', cellContent );
    })

    var delButtonContent = '<td class="removeCol"><span><span id="btnDelSpan" ><span id="btnDelRow" entryId=' + entryID + '>&#10006</span></span></span></td>';
    newRow.insertAdjacentHTML( 'beforeend', delButtonContent );


    newRow.lastChild.lastChild.addEventListener('click', function()
    {

        var currEntryId = $(this).children()[0].firstChild.getAttribute("entryid");

        var parentRow = $(this).parent().parent()[0];

        var rowToDel = parentRow['sectionRowIndex'];

        if( currEntryId != "notCataloged" )
        {
            deleteRow( currEntryId );
        }


        tbodyRef.deleteRow(rowToDel);

    });

    newRow.lastChild.previousSibling.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {          
          createTag($(this));
        }
    });
}

/*
$('.emotionsInput').keypress(function (e) {
    var key = e.which;

    if (key == 13)
    {
        console.log("keypressed");
        var inputWord = $(this).val();
        var currentCell = $(this);
        createTag(currentCell);
    }
})
*/

function createTag(currentCell)
{
    var inputWord = currentCell.find('input').val();

    currentCell.find('input').val("");
    var newTagHTML = '<span class="emotionTag"><span class="emotionWord">' + inputWord + '</span><span class="emotionDel">&#10006</span>';
    currentCell.find('.emotionTagsDiv').append(newTagHTML);
    currentCell.find(".emotionTagsDiv").find(".emotionDel").last().click(function () {
        $(this).parent().remove();
    });    
    
}

//
// IMMEDIATE HANDLING OF CHANGES TO TABLE CELL IMMEDIATE HANDLING OF CHANGES TO TABLE CELL IMMEDIATE HANDLING OF CHANGES TO TABLE CELL IMMEDIATE HANDLING OF CHANGES TO TABLE CELL 
// 

$(document).ready(function () {
    
    $(document).on("change", "#optionsTable :input", function() {
        var cell = $(this);
        var cellValue = cell.val();
        var cellAttribute = cell.attr('class').replace("Input", "");

        var entryID = cell.attr('entryid');
        var cellRow = cell.attr('row');

        var reg=/^([0-9.:]{0,9})$/;
    
        var dontSend = false;

        //handle invalid inputs to text fields here, need to fix 

        if(cellAttribute == "callput")
        {
            if(!(cellValue.toLowerCase() == "call" || cellValue.toLowerCase() == "put"))
            {
                dontSend = true;
                cell.parent().css("box-shadow", "0 0 0 2px red");
                console.log("invalid input");
            }
            else
            {
                dontSend = false;
                cell.parent().css("box-shadow", "0 0 0 2px #000");
            }
        }

        //handles if risk reward is not formatted like 20:10.
        if(cellAttribute == "rr")
        {
            if(!reg.test(cellValue))
            {
                dontSend = true;
                console.log("invalid input");
                cell.parent().css("box-shadow", "0 0 0 2px red");
            }
            else
            {
                dontSend = false;
                cell.parent().css("box-shadow", "0 0 0 2px #000");
            }
            
        }

        var parentRow = cell.parent().parent().parent().parent();

        var rrValue = parentRow.find(".rrInput").val();
        var entryValue = parentRow.find(".entryInput").val();
        var soldValue = parentRow.find(".soldInput").val();
        var numConsValue = parentRow.find(".numConsInput").val();

        //calculate fields handling here

        if(["rr", "entry"].includes(cellAttribute) && rrValue != "" && entryValue != "" && !dontSend)
        {
            calculateStopTarget(parentRow, entryValue, rrValue, cellRow, entryID);
        }

        if((["sold", "entry", "numCons"].includes(cellAttribute)) && numConsValue != "" && !dontSend)
        {
            calculateProfit(parentRow, entryValue, soldValue, numConsValue, cellRow, entryID);
        }

        //console.log("Entry ID: " + entryID + ", Attribute: " + cellAttribute + ", Value: " + cellValue + ", Row: " + cellRow);

        var data = { "entryid": entryID, "cellData": [{"cellAttr": cellAttribute, "cellValue": cellValue}]};

        //if(cellAttribute == "rr" && cellAttribute.value.matches("[0-9:]+"));
        //{
            //console.log("matches");
        //}

        dontSend = true;

        if(!dontSend)
        {
            postData(data, $(this));
        }
    });
});



// COMMUNICATION TO SERVER HERE COMMUNICATION TO SERVER HERE COMMUNICATION TO SERVER HERE COMMUNICATION TO SERVER HERE COMMUNICATION TO SERVER HERE COMMUNICATION TO SERVER HERE 


/**
 * Sends data to server to either log a new row or update a row into the data table depending whether an entryId is given or not.
 * 
 * @param  {} data the data to send to the object, need entryid (id or notCataloged) and row data to send over.
 * @param  {} referenceCell
 * 
 * example of data looks like var data = { "entryid": entryID, "cellData": [{"cellAttr": cellAttribute0, "cellValue": cellValue0}, {"cellAttr": cellAttribute1, "cellValue": cellValue1}]};
 */
function postData(data, referenceCell)
{
    $.ajax({
        url: 'http://localhost:4000/postData',
        data: data,
        type: 'POST',
        success: function( data, status, xhttp) {
            // data will be true or false if you returned a json bool

            if (data["newRow"] == true)
            {
                referenceCell.attr('entryId', data["entryid"]);
            }
       }

    })
}

/**
 * Function to delete a row from the database given an ID.
 * 
 * @param  {} entryID Id of object to delete.
 */
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
 

//
// FORM CALCULATIONS FORM CALCULATIONS FORM CALCULATIONS FORM CALCULATIONS FORM CALCULATIONS FORM CALCULATIONS FORM CALCULATIONS FORM CALCULATIONS FORM CALCULATIONS FORM CALCULATIONS 
//
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
    
    if(sold == "")
    {
        var profit = "";
    }
    else
    {
        var profit = Math.round((sold - entry) * 100) * numCons;
    }

    parentRow.find(".profitInput").val(profit);
    var data = { "entryid": entryID, "cellData": [{"cellAttr": "profit", "cellValue": profit}], "cellRow" : cellRow };
    postData(data);
}

//
// TIPPY JS STUFF HERE (TOOL TIPS, DESCRIPTORS, ETC)
// 

tippy('#dateTableHeader', {
    delay: [25, 50],
    inlinePositioning: true,
    maxWidth: 100,
    offset: [5, 0],
    allowHTML: true,

    content: '<center>The date you entered the trade.</center>',
  });

tippy('#tickerTableHeader', {
    delay: [25, 50],
    inlinePositioning: true,
    maxWidth: 100,
    allowHTML: true,

    content: '<center>The symbol of the ticker.</center>',
});

tippy('#callputTableHeader', {
    delay: [25, 50],
    inlinePositioning: true,
    maxWidth: 110,
    allowHTML: true,

    content: '<center>The option contract type, Call or Put.</center>',
});

tippy('#expiryTableHeader', {
    delay: [25, 50],
    inlinePositioning: true,
    maxWidth: 120,
    allowHTML: true,

    content: '<center>The expiration date of the option contract.</center>',
});

tippy('#numConsTableHeader', {
    delay: [25, 50],
    inlinePositioning: true,
    maxWidth: 100,
    allowHTML: true,

    content: '<center>The number of contracts purchased in this trade.</center>',
});

tippy('#strikeTableHeader', {
    delay: [25, 50],
    inlinePositioning: true,
    maxWidth: 120,
    allowHTML: true,

    content: '<center>The contract strike price of the trade.</center>',
});

tippy('#rrTableHeader', {
    delay: [25, 50],
    inlinePositioning: true,
    maxWidth: 160,
    allowHTML: true,

    content: '<center>The Reward/Risk Percentages on this trade. Eg. 20:10 will yield a 20% reward while risking 10% of your entry.</center>',
});

tippy('#entryTableHeader', {
    delay: [25, 50],
    inlinePositioning: true,
    maxWidth: 130,
    allowHTML: true,

    content: '<center>The cost of entry per contract on this trade.</center>',
});

tippy('#slTableHeader', {
    delay: [25, 50],
    inlinePositioning: true,
    maxWidth: 180,
    allowHTML: true,

    content: '<center>The calculated stop loss of this trade. Use as Reference for exiting this trade. Can edit contents for manual stop price. </center>',
});

tippy('#tpTableHeader', {
    delay: [25, 50],
    inlinePositioning: true,
    maxWidth: 180,
    allowHTML: true,

    content: '<center>The calculated take profit of this trade. Use as Reference for exiting this trade. Can edit contents for manual take profit price. </center>',
});

tippy('#soldTableHeader', {
    delay: [25, 50],
    inlinePositioning: true,
    maxWidth: 130,
    allowHTML: true,

    content: '<center>The sold price of the contract on this trade. </center>',
});

tippy('#profitTableHeader', {
    delay: [25, 50],
    inlinePositioning: true,
    maxWidth: 130,
    allowHTML: true,

    content: '<center>The profit of this trade. </center>',
});

tippy('#tradeNotesTableHeader', {
    delay: [25, 50],
    inlinePositioning: true,
    maxWidth: 180,
    allowHTML: true,

    content: "<center>Any notes you would like to journal on this trade for later reference. Writing mistakes down helps reduce them occuring in the future! </center>",
});

tippy('#emotionsTableHeader', {
    delay: [25, 50],
    inlinePositioning: true,
    maxWidth: 220,
    allowHTML: true,

    content: "<center>Emotions experienced during this trade. This helps for data visualization on your strengths and weaknesses. Eg. Fear, Greed, Overconfidence, Patience. </center>",
});