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

        var positionCoords = $(this).position();

        clonedAbsoluteElement.attr('class', 'colEntry tradeNotesCol tradeNotesColEntry tradeNotesColExpanded')

        // initialization properties

        var textArea = clonedAbsoluteElement.find('.tradeNotesInput');

        var inputBorder = clonedAbsoluteElement.find('.inputBorder');

        textArea.css({
            height: '5.14em',
            width: '18em',
            transition: 'width 0.5s, height 0.5s'
        })

        inputBorder.css({
            "border-radius": '13px',
            padding: '5px 5px 5px 0px'
        })

        clonedAbsoluteElement.css({
            position: "absolute",
            top: positionCoords['top'] + "px",
            left: positionCoords['left'] + "px",
            width: '18em',
            transition: 'width 0.5s'
        });
    }
    else
    {
        //console.log("element already created");
        clonedAbsoluteElement.css({
            visibility: 'visible'
        });
    }

    /*

    else
    {
        clonedAbsoluteElement.css("visibility", "visible");
    }



    $(this).css({
        visibility: "hidden"
    });


    

    textArea.css({
    });


    clonedAbsoluteElement.hover(
    function (e) { 

        console.log("hovered");

    }, 
    function(e) {

        if(originalRelativeElement.find('.tradeNotesInput').val() != textArea.val())
        originalRelativeElement.find('.tradeNotesInput').val(textArea.val());
        clonedAbsoluteElement.css({
            visibility: 'hidden'
        });
        originalRelativeElement.css({
            visibility: 'visible'
        });
    });


    */
    
}, function(e) {

    var originalRelativeElement = $(this);

    var clonedAbsoluteElement = $('.tradeNotesColExpanded[entryid="' + $(this).attr('entryid') + '"]');

    if(!savedBigBoxElements.includes(clonedAbsoluteElement[0]))
    {
        savedBigBoxElements.push(clonedAbsoluteElement[0]);

        //console.log("unhovering small box")

        var textArea = clonedAbsoluteElement.find('.tradeNotesInput');

        var inputBorder = clonedAbsoluteElement.find('.inputBorder');

        var savedHeight = '5.14em';

        var height;

        console.log(savedHeight);
        
        clonedAbsoluteElement.hover(
            function(e) {

                //console.log("hovering big box");

                $(this).css({
                    width: '18rem',
                    transition: 'width 0.5s',
                })
                
                console.log(savedHeight);

                height = savedHeight;

                textArea.css({
                    height: savedHeight,
                    transition: 'height 0.5s'
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
                        textArea.height('5.14em');
                        
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

                originalRelativeElement.find('.tradeNotesInput').val(textArea.val());
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