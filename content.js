let clickedEl = null;

// get right clicked element
document.addEventListener("mousedown", function(event){
  if(event.button == 2) { 
    clickedEl = event.target;
  }
}, true);

// Handle message from background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.command == "onContextMenuClicked") {
    var clickedType = getTypeCode(clickedEl.innerText);
    if (clickedType === null) {
        return;
    }

    // get the area, year, month and day from currently selected day's link from the calendar
    var calendar = document.getElementById("sticky_day");
    const queryString = calendar.firstChild.href.split(".php")[1];
    var urlParams = new URLSearchParams(queryString);
    const area = urlParams.get('area');
    const year = urlParams.get('year');
    const month = urlParams.get('month');
    const day = urlParams.get('day');

    //var clickedCol = clickedEl.parentElement.parentElement.parentElement.cellIndex;
    var clickedRow = clickedEl.parentElement.parentElement.parentElement.parentElement.rowIndex;
    var shiftLen = clickedEl.parentElement.parentElement.parentElement.rowSpan;
    var targetUrl = makeTargetURL(area, clickedType, day, month, year, clickedRow, shiftLen);

    chrome.runtime.sendMessage({command: "onContextMenuClicked", url: targetUrl});
  }
});

// make url for the enrollments page to be opened in a new tab
function makeTargetURL(org, type, day, month, year, row, len) {
    return "https://www.tuni.fi/sportuni/uusi/enroll.php?org=" + org
      + "&type=" + type + "&day=" + day + "&month=" + month + "&year=" + year
      + "&row=" + row + "&len=" + len;
}

// get the type code used in erollment page url from the type of the booking in the calendar
function getTypeCode(type) {
  switch (type) {
    case "Sulkapallo":
      return "H";
    case "Varattava ryhmäliikuntasalivuoro":
      return "P";
    case "Biljardi":
      return "O";
    case "Beach Volley":
      return "L";
    default:
      return null;
  }
}