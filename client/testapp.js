$( ".delRowButton" ).click( function() {
    $(this).parent().parent().remove();
});




function createNewLeg(referenceRow, entryData)
{
    const optionLegFields = ["date", "ticker", "callput", "expiry", "numCons", "strike", "rr", "entry", "sl", "tp", "sold", "profit"];

    var entryID = "notCataloged";

    optionLegFields.forEach(field =>
    {   

        if(entryData != undefined && false /* fix me so that it finds entrydata */ )
        {
            entryID = entryData["_id"];
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

        if(entryData === undefined || entryData[field] === undefined || entryData[field] === null)
        {
            content = '""';
        }
        else if(field == "date" || field == "expiry")
        {
            content = entryData[field].slice(0, entryData[field].indexOf("T"));
        }
        else
        {
            content = entryData[field];
        }

        var cellContent = '<div class="colEntry ' + field + 'Col ' + field + 'ColEntry" entryId=' + entryID + ' ><span class="inputBorder"><input class="' + field + "Input" + '"' + inputTypeData + ' value="' + content + '" /></span></div>';
        referenceRow.append( cellContent );

    });
}

$( ".addLegButton" ).click( function() {
    // have the plus button toggle between a minus and a plus
    // if there are no legs and the plus button is showing, create a new leg and display it.
    // if there are legs and the minus button is showing, hide all legs on press and change minus to plus.
    // if there are legs and the plus button is showing, add another leg on press.

    //$(this).parent().parent().append( '<div class="optionsRowLeg"></div>' );

    //createNewLeg($(this).parent().parent().find(".optionsRowLeg").last());
});

$('.emotionsInput').keypress(function (e) {
    var key = e.which;

    if (key == 13)
    {
        console.log("keypressed");
        var currentCell = $(this);
        createTag(currentCell);
        var width = $(this).outerWidth(true);

        console.log((width));

    }
})

var savedBigBoxElements = [];

$('.tradeNotesColEntry').hover(function (e) {


//console.log("hovering small box");
    
        //attempts to find existing expanded box
    
        var clonedAbsoluteElement = $('.tradeNotesColExpanded[entryid="' + $(this).attr('entryid') + '"]');
    
        //if no expanding box is found for this row, it creates one and gives it required properties.
    
        if(clonedAbsoluteElement.length == 0)
        {
            clonedAbsoluteElement = $(this).clone();
            //console.log("cloning element, not yet created");
            $(this).parent().parent().parent().append(clonedAbsoluteElement);
        
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
                        width: '11.9rem',
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


function createTag(currentCell)
{
    var parentCell = currentCell.parent();

    var inputWord = currentCell.val();

    var randomID = Math.floor(Math.random() * 100);

    currentCell.val("");
    var newTagHTML = '<span class="emotionTag" id="' + randomID + '"><span class="emotionWord">' + inputWord + '</span><span class="emotionDel">&#10006</span>';
    currentCell.before(newTagHTML);

    parentCell.find(".emotionTag").last().css("background-color", function() {
        color = "hsl(" + Math.random() * 360 + ", 100%, 95%)";
        return color;
    });

    parentCell.find(".emotionDel").last().click(function () {
        $(this).parent().remove();
    });
}