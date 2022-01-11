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