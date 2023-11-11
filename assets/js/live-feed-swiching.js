function setToMainFeed(buttonObject){
    // validate if buttonObject is HTML Button Element
    if(buttonObject instanceof HTMLButtonElement){
        // get properties to change betweeen
        let newIframe = buttonObject.parentElement.getElementsByClassName("live-iframe-container")[0].getElementsByTagName("iframe")[0];
        let newText = buttonObject.parentElement.getElementsByTagName("h2")[0].innerHTML;
        let oldIframe = document.getElementById("live-main-feed").getElementsByTagName("iframe")[0];
        let oldText = document.getElementById("live-main-feed").getElementsByTagName("h2")[0].innerHTML;

        // set main iframe
        document.getElementById("live-main-feed").getElementsByClassName("live-iframe-container")[0].innerHTML = "";
        document.getElementById("live-main-feed").getElementsByClassName("live-iframe-container")[0].appendChild(newIframe);
        // set main text
        document.getElementById("live-main-feed").getElementsByTagName("h2")[0].innerHTML = newText;
        
        // set small iframe
        buttonObject.parentElement.getElementsByClassName("live-iframe-container")[0].innerHTML = "";
        buttonObject.parentElement.getElementsByClassName("live-iframe-container")[0].appendChild(oldIframe);
        // set small text
        buttonObject.parentElement.getElementsByTagName("h2")[0].innerHTML = oldText;
    }


}