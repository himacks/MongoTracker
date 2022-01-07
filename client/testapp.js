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

function createTag(currentCell)
{
    var parentCell = currentCell.parent()

    var inputWord = currentCell.val();

    var randomID = Math.floor(Math.random() * 100);

    currentCell.val("");
    var newTagHTML = '<span class="emotionTag" id="' + randomID + '"><span class="emotionWord">' + inputWord + '</span><span class="emotionDel">&#10006</span>';
    parentCell.children("#emotionTagsDiv").append(newTagHTML);
    parentCell.children("#emotionTagsDiv").find(".emotionDel").last().click(function () {
        $(this).parent().remove();
    });

    console.log(currentCell);
}