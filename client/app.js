
fetch('http://localhost:4000/getdata')
.then(res => res.json())
.then(
    data =>
    { 
        data.forEach(entryData => {
            createNewRow(entryData);
        })           
    }
)

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
 * @param  {} entryData object containing cell data of a singular option row. for a complete row needs every field from var optionFields. 
 */

var savedBigBoxElements = [];

var uncatalogedIndex = 0;

function createNewRow(entryData)
{
    $( "#optionsDiv" ).append( '<div class="optionsRow"></div>' );
    $( ".optionsRow" ).last().append( '<div class="optionsRowEntry"></div>' );

    var rowRef = $( ".optionsRowEntry" ).last();

    var entryID = "notCataloged";

    if(entryData != undefined)
    {
        entryID = entryData["_id"];
    }
    else
    {
        entryID += uncatalogedIndex;
        uncatalogedIndex++;
    }
        
    optionFields.forEach(field =>
    {   
  
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

        if(entryData === undefined || entryData[field] === undefined || entryData[field] === null)
        {
            if(field == 'tradeNotes')
            {
                content = '';
            }
            else
            {
                content = '""';
            }
        }
        else if(field == "date" || field == "expiry")
        {
            content = entryData[field].slice(0, entryData[field].indexOf("T"));
        }
        else
        {
            content = entryData[field];
        }

        if(field == "emotions")
        {
            var cellContent = '<div class="colEntry ' + field + 'Col ' + field + 'ColEntry" entryId=' + entryID + '><div class="emotionsDiv"><div class="emotionTagsDiv"><input class="' + field + "Input" + '"' + inputTypeData + ' value="" /></div></div></div>';
            rowRef.append( cellContent );

            var emotionsColRef = rowRef.find('.emotionsInput');

            if(entryData != undefined)
            {
                entryData[field].forEach(inputWord => {
                    if(inputWord.length > 0)
                    {
                        createTag(emotionsColRef, inputWord, false );                 
                    }
                });
            }
        }
        else if(field == "tradeNotes")
        {
            var cellContent = '<div class="colEntry ' + field + 'Col ' + field + 'ColEntry" entryId=' + entryID + ' ><span class="inputBorder"><textarea class="' + field + "Input" + '"' + inputTypeData + '/></textarea></span></div>';
            rowRef.append( cellContent );

            var tradeNotesColRef = rowRef.find('.tradeNotesInput');

            tradeNotesColRef.val(content);
        }
        else
        {
            var cellContent = '<div class="colEntry ' + field + 'Col ' + field + 'ColEntry" entryId=' + entryID + ' ><span class="inputBorder"><input class="' + field + "Input" + '"' + inputTypeData + ' value="' + content + '" /></span></div>';
            rowRef.append( cellContent );
        }

        
    })
    var addLegButtonContent = '<button class="menuButton entryButton" type="button" entryId=' + entryID + '><span aria-hidden="true"><i class="fa fa-bars"></i></span></button>';
    var delRowButtonContent = '<button class="delRowButton entryButton" type="button" entryId=' + entryID + '><span aria-hidden="true"><i class="fa fa-close"></i></span></button>';

    rowRef.append( addLegButtonContent );
    rowRef.append( delRowButtonContent );

    rowRef.find( ".delRowButton" ).click( function()
    {

        var currEntryId = $(this).attr("entryid");

        $(this).parent().parent().remove();


        if( currEntryId.indexOf("notCataloged") == -1 )
        {
            console.log("deleting from database");
            deleteRow( currEntryId );
        }

    });

    rowRef.find('.emotionsInput').on('keypress',function(e) {
        if(e.which == 13) {       
          createTag($(this), $(this).val(), true);
        }
    });

    var heightInitial;

    rowRef.find('.tradeNotesColEntry').last().hover(function (e) {


        //console.log("hovering small box");
    
        //attempts to find existing expanded box
    
        var clonedAbsoluteElement = $('.tradeNotesColExpanded[entryid="' + $(this).attr('entryid') + '"]');
    
        //if no expanding box is found for this row, it creates one and gives it required properties.
    
        if(clonedAbsoluteElement.length == 0)
        {
            clonedAbsoluteElement = $(this).clone();
            //console.log("cloning element, not yet created");
            $(this).parent().parent().parent().append(clonedAbsoluteElement);
    
            var positionCoords = $(this).position();
    
            clonedAbsoluteElement.attr('class', 'colEntry tradeNotesCol tradeNotesColEntry tradeNotesColExpanded')
    
            // initialization properties
    
            var textArea = clonedAbsoluteElement.find('.tradeNotesInput');
        
            var inputBorder = clonedAbsoluteElement.find('.inputBorder');
    
            textArea.css({
                height: '68px',
                width: '18em',
                transition: 'width 0.4s ease-out, height 0.4s ease-out'
            })

            inputBorder.css({
                "border-radius": '13px',
                padding: '5px 5px 5px 0px'
            })
    
            clonedAbsoluteElement.css({
                position: "absolute",
                top: $(this).position()['top'] + "px",
                left: $(this).position()['left'] + "px",
                width: '18em',
                transition: 'width 0.4s ease-out'
            });

            //sets initial height if there is pre-existing text larger than the default height of the expanded box height. uses ratio of new height to original height
            //because textArea.prop('scrollHeight') gets the height of the text before the text area is expanded horizontally so it takes up more vertical space.
            heightInitial = (Math.max(textArea.prop('scrollHeight') * 11.9 / 18.0, 68.0)) + "px";

        }
        else
        {
            //console.log("element already created");
            clonedAbsoluteElement.css({
                visibility: 'visible'
            });

            if( $(this).position()['top'] != clonedAbsoluteElement.position()['top'] || $(this).position()['left'] != clonedAbsoluteElement.position()['left']) {
                clonedAbsoluteElement.css({
                    top: $(this).position()['top'] + "px",
                    left: $(this).position()['left'] + "px",
                });
            }
        }
        
    }, function(e) {
    
        var originalRelativeElement = $(this);

        var entryID = originalRelativeElement.attr('entryid');
    
        var clonedAbsoluteElement = $('.tradeNotesColExpanded[entryid="' + entryID + '"]');
    
        if(!savedBigBoxElements.includes(clonedAbsoluteElement[0]))
        {
            savedBigBoxElements.push(clonedAbsoluteElement[0]);
    
            //console.log("unhovering small box")
    
            var textArea = clonedAbsoluteElement.find('.tradeNotesInput');
    
            var inputBorder = clonedAbsoluteElement.find('.inputBorder');
    
            var savedHeight = heightInitial;
    
            var height;
                
            clonedAbsoluteElement.hover(
                function(e) {
    
                    //console.log("hovering big box");
    
                    $(this).css({
                        width: '18rem',
                        transition: 'width 0.4s ease-out',
                    })
                    
                    height = savedHeight;
    
                    textArea.css({
                        height: savedHeight,
                        "margin-left": '5px',
                        transition: 'height 0.4s ease-out'
                    })
    
    
    
    
                    var scrollHeightOld = 0;
    
                    textArea.on('propertychange input', function (e) {
    
                        if(textArea.prop('scrollHeight') > 74)
                        {
                            textArea.css({
                                transition: 'none'
                            });
    
                            textArea.height(0);
                
                            if(textArea.prop('scrollHeight') != scrollHeightOld)
                            {   
                                textArea.height(textArea.prop('scrollHeight'));
                                scrollHeightOld = textArea.prop('scrollHeight');
                            }
                        }
                        else
                        {
                            textArea.height('68px');
                            
                        }
                        height = textArea.height();
                    })
    
            },  function(e) {
    
                    savedHeight = height;
    
                    //console.log("unhovering big box");
    
                    $(this).css({
                        width: '12rem',
                        visibility: "hidden"
                    })
    
                    textArea.css({
                        height: '1.14em',
                    })
    
                    var smallTextBox = originalRelativeElement.find('.tradeNotesInput');

                    if(smallTextBox.val() != textArea.val())
                    {
                        smallTextBox.val(textArea.val());

                        var data = { "entryid": entryID, "cellData": [{"cellAttr": "tradeNotes", "cellValue": textArea.val()}]};
                        
                        postData(data, smallTextBox);
                    }
                })
        }
    });

}

function createTag(currentCell, givenWord, isNew)
{
    var parentCell = currentCell.parent();


    if(givenWord != undefined && givenWord.length > 0)
    {
        var inputWord = givenWord;
        
        currentCell.val("");
        var newTagHTML = '<span class="emotionTag"><span class="emotionWord">' + inputWord + '</span><span class="emotionDel">&#10006</span>';
        currentCell.before(newTagHTML);

        parentCell.find(".emotionTag").last().css("background-color", function() {
            color = "hsl(" + Math.random() * 360 + ", 100%, 85%)";
            return color;
        });

        parentCell.find(".emotionDel").last().click(function () {
            $(this).parent().remove();

            modifyEmotionArray(currentCell, inputWord, "remove")

        });

        if(isNew)
        {
            modifyEmotionArray(currentCell, inputWord, "add");
        }
    }

}

function modifyEmotionArray(currentCell, inputWord, operation)
{
    var entryID = currentCell.parent().parent().parent().attr('entryid');

    var cellAttribute = "emotions";
    var cellValue = inputWord;

    var data = { "entryid": entryID, "cellData": [{"cellAttr": cellAttribute, "cellValue": cellValue}, {"cellAttr": "operation", "cellValue": operation}]};

    postData(data, currentCell);
}

//
// IMMEDIATE HANDLING OF CHANGES TO TABLE CELL IMMEDIATE HANDLING OF CHANGES TO TABLE CELL IMMEDIATE HANDLING OF CHANGES TO TABLE CELL IMMEDIATE HANDLING OF CHANGES TO TABLE CELL 
// 

$(document).ready(function () {
    
    $(document).on("change", "#optionsDiv :input", function() {
        var cell = $(this);
        var cellValue = cell.val();
        var cellAttribute = cell.attr('class').replace("Input", "");

        var entryID = cell.parent().parent().attr('entryid');

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
        if(cellAttribute == "emotions")
        {
            dontSend = true;
        }

        var parentRow = cell.parent().parent().parent();


        var rrValue = parentRow.find(".rrInput").val();
        var entryValue = parentRow.find(".entryInput").val();
        var soldValue = parentRow.find(".soldInput").val();
        var numConsValue = parentRow.find(".numConsInput").val();

        //calculate fields handling here

        if(["rr", "entry"].includes(cellAttribute) && rrValue != "" && entryValue != "" && !dontSend)
        {
            calculateStopTarget(parentRow, entryValue, rrValue, entryID);
        }

        if((["sold", "entry", "numCons"].includes(cellAttribute)) && numConsValue != "" && !dontSend)
        {
            calculateProfit(parentRow, entryValue, soldValue, numConsValue, entryID);
        }

        //console.log("Entry ID: " + entryID + ", Attribute: " + cellAttribute + ", Value: " + cellValue + ", Row: " + cellRow);

        var data = { "entryid": entryID, "cellData": [{"cellAttr": cellAttribute, "cellValue": cellValue}]};

        //if(cellAttribute == "rr" && cellAttribute.value.matches("[0-9:]+"));
        //{
            //console.log("matches");
        //}

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
                console.log("new row");

                referenceCell.parent().parent().parent().children().attr('entryId', data["entryid"]);
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
function calculateStopTarget(parentRow, entry, rr, entryID)
{

    console.log('calculating daskljdskld');

    var a = rr.split(":");
    var reward = 1 + a[0] / 100;
    var risk = 1 - a[1] / 100;

    var sl = Math.round(entry * risk * 100) / 100;
    var tp = Math.round(entry * reward * 100) / 100;

    parentRow.find(".slInput").val(sl);
    parentRow.find(".tpInput").val(tp);

    var data = { "entryid": entryID, "cellData": [{"cellAttr": "tp", "cellValue": tp}, {"cellAttr": "sl", "cellValue": sl}]};

    postData(data);
}

function calculateProfit(parentRow, entry, sold, numCons, entryID)
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
    var data = { "entryid": entryID, "cellData": [{"cellAttr": "profit", "cellValue": profit}]};
    postData(data);
}

//
// TIPPY JS STUFF HERE (TOOL TIPS, DESCRIPTORS, ETC)
// 

tippy('.dateColTitle', {
    delay: [25, 50],
    inlinePositioning: true,
    maxWidth: 100,
    offset: [5, 0],
    allowHTML: true,

    content: '<center>The date you entered the trade.</center>',
  });

tippy('.tickerColTitle', {
    delay: [25, 50],
    inlinePositioning: true,
    maxWidth: 100,
    allowHTML: true,

    content: '<center>The symbol of the ticker.</center>',
});

tippy('.callputColTitle', {
    delay: [25, 50],
    inlinePositioning: true,
    maxWidth: 110,
    allowHTML: true,

    content: '<center>The option contract type, Call or Put.</center>',
});

tippy('.expiryColTitle', {
    delay: [25, 50],
    inlinePositioning: true,
    maxWidth: 120,
    allowHTML: true,

    content: '<center>The expiration date of the option contract.</center>',
});

tippy('.numConsColTitle', {
    delay: [25, 50],
    inlinePositioning: true,
    maxWidth: 100,
    allowHTML: true,

    content: '<center>The number of contracts purchased in this trade.</center>',
});

tippy('.strikeColTitle', {
    delay: [25, 50],
    inlinePositioning: true,
    maxWidth: 120,
    allowHTML: true,

    content: '<center>The contract strike price of the trade.</center>',
});

tippy('.rrColTitle', {
    delay: [25, 50],
    inlinePositioning: true,
    maxWidth: 160,
    allowHTML: true,

    content: '<center>The Reward/Risk Percentages on this trade. Eg. 20:10 will yield a 20% reward while risking 10% of your entry.</center>',
});

tippy('.entryColTitle', {
    delay: [25, 50],
    inlinePositioning: true,
    maxWidth: 130,
    allowHTML: true,

    content: '<center>The cost of entry per contract on this trade.</center>',
});

tippy('.slColTitle', {
    delay: [25, 50],
    inlinePositioning: true,
    maxWidth: 180,
    allowHTML: true,

    content: '<center>The calculated stop loss of this trade. Use as Reference for exiting this trade. Can edit contents for manual stop price. </center>',
});

tippy('.tpColTitle', {
    delay: [25, 50],
    inlinePositioning: true,
    maxWidth: 180,
    allowHTML: true,

    content: '<center>The calculated take profit of this trade. Use as Reference for exiting this trade. Can edit contents for manual take profit price. </center>',
});

tippy('.soldColTitle', {
    delay: [25, 50],
    inlinePositioning: true,
    maxWidth: 130,
    allowHTML: true,

    content: '<center>The sold price of the contract on this trade. </center>',
});

tippy('.profitColTitle', {
    delay: [25, 50],
    inlinePositioning: true,
    maxWidth: 130,
    allowHTML: true,

    content: '<center>The profit of this trade. </center>',
});

tippy('.tradeNotesColTitle', {
    delay: [25, 50],
    inlinePositioning: true,
    maxWidth: 180,
    allowHTML: true,

    content: "<center>Any notes you would like to journal on this trade for later reference. Writing mistakes down helps reduce them occuring in the future! </center>",
});

tippy('.emotionsColTitle', {
    delay: [25, 50],
    inlinePositioning: true,
    maxWidth: 220,
    allowHTML: true,

    content: "<center>Emotions experienced during this trade. This helps for data visualization on your strengths and weaknesses. Eg. Fear, Greed, Overconfidence, Patience. </center>",
});