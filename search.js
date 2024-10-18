// wait for an elemnt to be loaded
function waitForElement(id, timeout) {
  return new Promise(resolve => {
    const interval = setInterval(() => {
      const element = document.getElementById(id);
      if (element) {
        clearInterval(interval);
        resolve(element);
      }
    }, timeout);
  });
}

// set the date and time to input after it has been loaded
waitForElement('bookings_table_filter', 100).then(bookings_table_filter => {
  var inputField = bookings_table_filter.firstChild.children[0];
  const queryString = window.location.search;
  var urlParams = new URLSearchParams(queryString);
  const year = urlParams.get('year');
  const month = urlParams.get('month');
  const day = urlParams.get('day');
  const row = urlParams.get('row');
  //const col = urlParams.get('col');
  const len = urlParams.get('len');

  var dateStr = getDateString(year, month, day);
  var timeStr = getTimeString(row, len);
  
  inputField.value = dateStr + ' ' + timeStr;

  waitForElement('bookings_table_info', 100).then(() => {
    var enterEvent = new KeyboardEvent('keyup', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true
    });
    // press enter to search
    inputField.dispatchEvent(enterEvent);

    // sort by court asc if not already
    if (getCourtColHeader().className !== 'sorting_asc') {
        getCourtColHeader().click();
    }
  });
});

// get the table header of court for clicking it to sort
function getCourtColHeader() {
  return document.getElementsByClassName('dataTables_scrollHeadInner')[0]
         .firstChild.firstChild.firstChild.children[2];
}

// get the time string from row and length (how many quarter hours) 
//in the booking calendar
function getTimeString(row, len) {
  row -= 1 // start from 0
  len = parseInt(len);

  var startHours = Math.floor((row  / 4) + 5);
  var startQuartersPast = row % 4;
  var endHours = startHours + Math.floor(len / 4);
  var endQuartersPast = startQuartersPast + len % 4;
  if (endQuartersPast >= 4) {
    endHours += 1;
    endQuartersPast -= 4;
  }
  var startHourStr = startHours.toString().padStart(2, '0');
  var startQuarterStr = (startQuartersPast * 15).toString().padEnd(2, '0');
  var endHourStr = endHours.toString().padStart(2, '0');
  var endQuarterStr = (endQuartersPast * 15).toString().padEnd(2, '0');
  var result = startHourStr + ':' + startQuarterStr 
      + ' - ' + endHourStr + ':' + endQuarterStr;

  return result
}

// get the date string in the correct format from year, month and day
function getDateString(year, month, day) {
  return year + '-' + month.padStart(2, '0') + '-' + day.padStart(2, '0');
}
