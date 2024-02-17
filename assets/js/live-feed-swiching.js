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
// }
// function focusSwitch(buttonObject){
//     if(buttonObject instanceof HTMLButtonElement){
//         if(buttonObject.innerHTML == "Start focus!") {
//             buttonObject.innerHTML = "Stop focus!";
//             buttonObject.parentElement.classList.add("focus-button-switched");
//         }
//         else {
//             buttonObject.innerHTML = "Start focus!";
//             buttonObject.parentElement.classList.remove("focus-button-switched");
//         }
//     }

//     // if nav is visible, hide it
//     if(document.getElementsByTagName("nav")[0].classList.contains("focus-switch")){
//         document.getElementsByTagName("nav")[0].classList.remove("focus-switch");
//     }
//     // if nav is hidden, show it
//     else{
//         document.getElementsByTagName("nav")[0].classList.add("focus-switch");
//     }

//     // do same with footer (footer has class live-footer)
//     if(document.getElementsByClassName("live-footer")[0].classList.contains("focus-switch")){
//         document.getElementsByClassName("live-footer")[0].classList.remove("focus-switch");
//     }
//     else{
//         document.getElementsByClassName("live-footer")[0].classList.add("focus-switch");
//     }

//     // hide other info
//     if(document.getElementById("live-other-info").classList.contains("focus-switch")){
//         document.getElementById("live-other-info").classList.remove("focus-switch");
//     }
//     else{
//         document.getElementById("live-other-info").classList.add("focus-switch");
//     }
// }