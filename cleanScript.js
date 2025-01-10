var timeline;
var timelineElements;
var timelineActionElements;

function prepareTimeline() {
    timeline = document.getElementById("timeline");
    timelineElements = timeline.getElementsByClassName("element");
    timelineActionElements = timeline.getElementsByClassName("action-element");

    // set the top position of each element
    var top = 0;
    for (var i = 0; i < timelineElements.length; i++) {
        timelineElements[i].style.top = top + "px";
        top += timelineElements[i].offsetHeight;
    }

    // add to all action elements the click event
    for (var i = 0; i < timelineActionElements.length; i++) {
        timelineActionElements[i].addEventListener("click", function () {
            console.log("click");
            for (var j = 0; j < timelineActionElements.length; j++) {
                timelineActionElements[j].classList.remove("selected");
            }
            this.classList.add("selected");

            // get the id of the clicked element
            var id = this.getAttribute("data-id");
            var offset = Number(String(timelineElements[id].style.top).split("px")[0]);
            for (var j = 0; j < timelineElements.length; j++) {
                timelineElements[j].style.top = (Number(String(timelineElements[j].style.top).split("px")[0]) - offset) + "px";
            }
        });
    }
}

