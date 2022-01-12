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

$('.tradeNotesColEntry').hover(function (e) {

    var originalRelativeElement = $(this);

    var clonedAbsoluteElement = $('.tradeNotesColExpanded[entryid="' + $(this).attr('entryid') + '"]');

    if(clonedAbsoluteElement.length == 0)
    {
        clonedAbsoluteElement = $(this).clone();
        console.log("cloning element, not yet created");
        $(this).parent().parent().parent().append(clonedAbsoluteElement);
        clonedAbsoluteElement.attr('class', 'colEntry tradeNotesCol tradeNotesColEntry tradeNotesColExpanded')

        clonedAbsoluteElement.find('.tradeNotesInput').css({
            height: '5.14em'
        })
    }
    else
    {
        clonedAbsoluteElement.css("visibility", "visible");
    }

    var positionCoords = $(this).position();

    var inputBorder = clonedAbsoluteElement.find('.inputBorder');

    var textArea = clonedAbsoluteElement.find('.tradeNotesInput');

    $(this).css({
        visibility: "hidden"
    });

    clonedAbsoluteElement.css({
        position: "absolute",
        top: positionCoords['top'] + "px",
        left: positionCoords['left'] + "px",
        width: '15em'
    });

    inputBorder.css({
        "border-radius": '13px',
        padding: '5px 5px 5px 0px'
    })

    textArea.css({
        width: '15em',
    });

    var scrollHeightOld = 0;

    clonedAbsoluteElement.hover(function (e) { /* do hover stuff here */ }, function(e) {
        if(originalRelativeElement.find('.tradeNotesInput').val() != textArea.val())
        originalRelativeElement.find('.tradeNotesInput').val(textArea.val());
        clonedAbsoluteElement.css({
            visibility: 'hidden'
        });
        originalRelativeElement.css({
            visibility: 'visible'
        });
    });

    textArea.on('propertychange input', function (e) {

        if(textArea.prop('scrollHeight') > 74)
        {
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

        
    })
    
})



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