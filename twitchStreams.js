var currentPage = 1;
var totalPage;
const clientId = "zb1axmxhd63xnikw05drdazynx8u37"; /* API Key for twitch*/

/* Check if it's lastPage */
function isLastPage() {
  return currentPage === totalPage;
}

/* check if it's first page*/
function isFirstPage() {
  return currentPage === 1;
}

/* Go to Previous Page */
function previousPage() {
  if (!isFirstPage()) {
    currentPage -= 1;
    searchStreams();
  }
}
/* Go to Next Page */
function nextPage() {
  if (!isLastPage()) {
    currentPage += 1;
    searchStreams();
  }
}

/*Returns total results and pages to navigate */
function getTotalAndPages(totalItems, totalPage) {
  return (
    "<div class='totalAndPages'> " +
    "   <span id='totalResults'>Total Results: " +
    totalItems +
    "   </span>" +
    "   <span>" +
    "     <span class=" +
    (isFirstPage() ? "'arrowDisabled'" : "'arrow'") +
    " onclick='previousPage()'>&#9664;</span>" +
    currentPage +
    " / " +
    totalPage +
    "     <span class=" +
    (isLastPage() ? "'arrowDisabled'" : "'arrow'") +
    " onclick='nextPage()'>&#9654;</span>" +
    "   </span>" +
    "</div>"
  );
}
/*Return Preview image with size 130x130 */
function getPreviewImage(previewImage) {
  const templatedPreviewImage = previewImage.replace(
    "{width}x{height}",
    "130x130"
  );
  return "<img src=" + templatedPreviewImage + "/>";
}
/* Returns Stream Display Name */
function getStreamDisplayName(displayName) {
  return (
    "<h2>" + (displayName ? displayName : "No Display Name Available") + "</h2>"
  );
}
/* Returns Game name and viewers*/
function getGameNameAndViewers(gameName, viewers) {
  return (
    "<label>" +
    (gameName ? gameName : "Game name not available") +
    " - " +
    (viewers !== undefined
      ? viewers + " viewers"
      : "Viewers info not available") +
    "</label>"
  );
}

/* Returns Stream description*/
function getStreamDescription(description) {
  return (
    "<div><b>Stream Description:</b> " +
    (description ? description : "Not Available") +
    "</div>"
  );
}
/* Return message with h2 tag*/
function getMessage(message) {
  return "<h2 class='noResultsFound'>" + message + "</div>";
}

/* Search for the given query string and display results */
function searchStreams() {
  const output = document.getElementById("output");
  if (!navigator.onLine) {
    output.innerHTML = getMessage("Something went Wrong!!");
  }
  try {
    let searchQuery = document.getElementById("searchField").value;
    searchQuery = searchQuery && searchQuery.trim();
    if (searchQuery) {
      const offset = (currentPage - 1) * 10;
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        const READY_STATE_DONE = 4;
        const STATUS_DONE = 200;
        if (
          this.readyState === READY_STATE_DONE &&
          this.status === STATUS_DONE
        ) {
          const parsedMessage = JSON.parse(this.responseText);
          const totalNumberOfItems = parsedMessage._total;
          if (totalNumberOfItems && totalNumberOfItems > 0) {
            totalPage = Math.ceil(totalNumberOfItems / 10);
            let resultsDetails =
              "<div id='resultsContainer' class='resultsContainer'>";
            resultsDetails += getTotalAndPages(totalNumberOfItems, totalPage);

            resultsDetails += "<div id='results' class='results'>";
            parsedMessage.streams.forEach(function(stream) {
              resultsDetails += "<div class='streamRow'>";
              if (stream.preview && stream.preview.template) {
                resultsDetails += getPreviewImage(stream.preview.template);
              }
              resultsDetails += "<div class='streamDetails'>";
              const channel = stream.channel;
              if (channel) {
                resultsDetails += getStreamDisplayName(channel.display_name);
              }
              resultsDetails += getGameNameAndViewers(
                stream.game,
                stream.viewers
              );
              if (channel) {
                resultsDetails += getStreamDescription(channel.description);
              }
              resultsDetails += "</div>"; // end of StreamDetails
              resultsDetails += "</div>"; // end of StreamRow
            });
            resultsDetails += "</div>"; // end of Results
            resultsDetails += "</div>"; // end of resultsContainer
            output.innerHTML = resultsDetails;
          } else {
            output.innerHTML = getMessage("No Results Found");
          }
        }
      };
      const url =
        "https://api.twitch.tv/kraken/search/streams?limit=10&offset=" +
        offset +
        "&query=" +
        searchQuery;
      xhttp.open("GET", url, true);
      xhttp.setRequestHeader("Client-ID", clientId);
      xhttp.setRequestHeader("Accept", "application/vnd.twitchtv.v5+json");
      xhttp.send();
    }
  } catch (e) {
    output.innerHTML = getMessage("Something went Wrong!!");
  }
  return false;
}
