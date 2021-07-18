itemIndex = 0;

var itemList = [];

var active = false;

var targetElement;
var targetItem;

var board;



window.onload=function(){
    var colorPicker = document.getElementById("colorButton");
    colorPicker.addEventListener("input",changeBackground);
    
    board = document.getElementsByClassName("board")[0];
}


function changeBackground(e) {
    var newColor = e.target.value;
    board.style.backgroundColor = newColor;
}

function item() {
    this.itemType = "";
    this.itemNum = -1;
    this.currentX;
    this.currentY;
    this.initialX;
    this.initialY;
    this.xOffset = 0;
    this.yOffset = 0;

    this.initialWidth;
    this.initialHeight;
}

function toggleMenu() {
    document.getElementById("addMenuDropdown").classList.toggle("show");
}

window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

function addItem(itemType) {
    if(document.getElementsByClassName("board")[0].innerHTML.trim().length <= 0) {
        var clearButton = document.getElementsByClassName("clearAll")[0];
        clearButton.style.display = "block";
        console.log("yessir");
    }
    
    if(itemType == "image") {
        var imgItem = new item();
        imgItem.itemType = "image";
        imgItem.itemNum = itemIndex;

        var image = document.createElement("div");
        image.innerHTML = document.getElementById('imageTemplate').innerHTML;

        var imageID = "image-" + itemIndex;
        image.setAttribute("id", imageID);
        image.setAttribute("class", "imageBoxEmpty");

        var body = document.getElementsByClassName("board")[0];

        body.insertBefore(image, body.firstChild);

        itemList.push(imgItem);

        image.style.zIndex = itemIndex;

        itemIndex++;

        image.addEventListener("touchstart", dragStart, false);
        image.addEventListener("touchend", dragEnd, false);
        document.addEventListener("touchmove", drag, false);

        image.addEventListener("mousedown", dragStart, false);
        image.addEventListener("mouseup", dragEnd, false);
        document.addEventListener("mousemove", drag, false);

    }
    else if(itemType == "text") {
        var textItem = new item();
        textItem.itemType = "text";
        textItem.itemNum = itemIndex;

        var text = document.createElement("div");
        text.innerHTML = document.getElementById('textTemplate').innerHTML;

        var textID = "text-" + itemIndex;
        text.setAttribute("id", textID);
        text.setAttribute("class", "textBox");

        var body = document.getElementsByClassName("board")[0];

        body.insertBefore(text, body.firstChild);

        itemList.push(textItem);

        text.style.zIndex = itemIndex;
        text.style.borderColor = "#121212";
        itemIndex++;

        text.addEventListener("touchstart", dragStart, false);
        text.addEventListener("touchend", dragEnd, false);
        document.addEventListener("touchmove", drag, false);

        text.addEventListener("mousedown", dragStart, false);
        text.addEventListener("mouseup", dragEnd, false);
        document.addEventListener("mousemove", drag, false);
        
        
        
        text.innerHTML += document.getElementById('textToolbar').innerHTML; // adds text toolbar
        
        text.getElementsByTagName("div")[0].setAttribute("class", "textToolbarFixed");
        
        /* text.addEventListener("mouseover", displayToolbar(text,"text"));
        text.addEventListener("mouseout", hideToolbar(text,"text")); */
        
        var textInput = text.getElementsByTagName("input")[0];
        
        
        
        // displayToolbar(text, "text"); //shows toolbar upon creation of text item
        
        textInput.focus(); // focuses text cursor on input box
    }
}

/* function displayToolbar(item, itemType) {
    if(itemType =="text") {
        var itemToolbar = item.getElementsByTagName("div")[0];
        
        itemToolbar.setAttribute("class", "textToolbarVisible");
        
        console.log("displayed");
        
    }
    else if(itemType == "image") {
        var itemToolbar = item.getElementsByTagName("div")[0];
        
        itemToolbar.setAttribute("class", "imageToolbarVisible");
    }
} 

function hideToolbar(item, itemType) {
    if(itemType =="text") {
        var itemToolbar = item.getElementsByTagName("div")[0];
        
        itemToolbar.setAttribute("class", "textToolbar");
        
        console.log("hidden");
        console.log(itemToolbar);
    }
    else if(itemType == "image") {
        var itemToolbar = item.getElementsByTagName("div")[0];
        
        itemToolbar.setAttribute("class", "imageToolbar");
    }
}  */

function loadFile(event) {
    var imageBox = event.target.parentElement;
    var image = imageBox.getElementsByTagName("img")[0];

    image.src = URL.createObjectURL(event.target.files[0]);

    var itemNum = imageBox.id.replace(/\D/g,'');
    var imageItem = itemList[itemNum];

    image.onload = function () { imageItem.initalWidth = this.width; imageItem.initialHeight = this.height;}

    imageBox.removeChild(imageBox.getElementsByTagName("button")[0]);

    imageBox.removeChild(imageBox.getElementsByTagName("label")[0]);
    imageBox.setAttribute("class", "imageBox");

    imageBox.innerHTML += document.getElementById('imageToolbar').innerHTML;
    
    imageBox.getElementsByTagName("img")[0].style.height = "300px";

}

function dragStart(e) {
    if(e.target.className == "imageBox" || e.target.className =="imageBoxEmpty" ||e.target.className=="textBox"){
        var itemNum = e.target.id.replace(/\D/g,'');
        targetItem = itemList[itemNum];

        if (e.type === "touchstart") {
            targetItem.initialX = e.touches[0].clientX - targetItem.xOffset;
            targetItem.initialY = e.touches[0].clientY - targetItem.yOffset;
        } else {
            targetItem.initialX = e.clientX - targetItem.xOffset;
            targetItem.initialY = e.clientY - targetItem.yOffset;
        }

        active = true;
        targetElement = e.target;
    }

}

function dragEnd(e) {
    if(e.target.className == "imageBox" || e.target.className =="imageBoxEmpty" ||e.target.className=="textBox"){
        targetItem.initialX = targetItem.currentX;
        targetItem.initialY = targetItem.currentY;

        active = false;
    }
}

function drag(e) {
    if (active) {

        e.preventDefault();

        if (e.type === "touchmove") {
            targetItem.currentX = e.touches[0].clientX - targetItem.initialX;
            targetItem.currentY = e.touches[0].clientY - targetItem.initialY;
        } else {
            targetItem.currentX = e.clientX - targetItem.initialX;
            targetItem.currentY = e.clientY - targetItem.initialY;
        }

        targetItem.xOffset = targetItem.currentX;
        targetItem.yOffset = targetItem.currentY;

        setTranslate(targetItem.currentX, targetItem.currentY, targetElement);
    }
}

function scaleItem(item) {
    if(item.parentNode.className == "imageToolbar" || item.parentNode.className =="imageToolbarFixed") {
    var imageBox = item.parentNode.parentNode;
    var itemNum = imageBox.id.replace(/\D/g,'');
    var imageItem = itemList[itemNum];
    var image = imageBox.getElementsByTagName("img")[0];

    var scale = item.value;

    /* image.style.width = imageItem.initialWidth * scale;
    image.style.height = imageItem.initialHeight * scale;
    */
        image.style.height = item.value;
    }
    else if(item.parentNode.className =="textToolbar" || item.parentNode.className =="textToolbarFixed"){
        var text = item.parentNode.parentNode.children[0];
        text.style.fontSize = item.value;
    }
}

function setTranslate(xPos, yPos, el) {
    el.style.transform = "translate(" + xPos + "px, " + yPos + "px)";
}

function moveUp(item){
    var indexNum = parseInt(item.style.zIndex);
    item.style.zIndex = indexNum +1;
}

function moveDown(item){
    var indexNum = parseInt(item.style.zIndex);
    
    if(indexNum !== 0){
        item.style.zIndex = indexNum - 1;
    }
}


function removeItem(item) {
    var imageBox = item.parentNode;
    imageBox.remove();
}

function toggleEdit(item) {
    var text = item.children[0];
    
    if(text.contentEditable == "true") {
        text.setAttribute('contenteditable', "false");
        
        
        text.style.pointerEvents = "none";
        item.getElementsByClassName("toggleEdit")[0].innerHTML = "Edit";
        text.parentElement.style.borderColor = "";
        
        var textToolbar = item.getElementsByTagName("div")[0];
        textToolbar.setAttribute("class", "textToolbar");
        
        var editTextToolbar = textToolbar.getElementsByClassName("editTextToolbar")[0];
        editTextToolbar.style.display = "none";
    }
    else {
        text.setAttribute('contenteditable', "true");
        text.style.pointerEvents = "auto";
        text.parentElement.style.borderColor = "#121212";
        text.focus();
        text.setSelectionRange(0,0);
        item.getElementsByClassName("toggleEdit")[0].innerHTML = "Done";
        
        var textToolbar = item.getElementsByTagName("div")[0];
        textToolbar.setAttribute("class", "textToolbarFixed");
        
        console.log(textToolbar);
        
        var editTextToolbar = textToolbar.getElementsByClassName("editTextToolbar")[0];
        editTextToolbar.style.display = "inline";
    }
    
    
}

function toggleBold(e) {
    var textBox = e.target.parentElement.parentElement.parentElement;
    var textInput = textBox.getElementsByClassName("textInput")[0];
    
    if(event.target.value == "normal") {
        textInput.style.fontWeight = "bold";
        event.target.value = "bold";
        event.target.style.backgroundColor = "#B8B8B8"
        event.target.style.borderColor = "#121212";
    }
    else {
        textInput.style.fontWeight = 'normal';
        event.target.value = "normal";
        event.target.style.backgroundColor = "#121212"
        event.target.style.borderColor = "transparent";
    }
}

function toggleItalic(e) {
    var textBox = e.target.parentElement.parentElement.parentElement;
    var textInput = textBox.getElementsByClassName("textInput")[0];
    
    if(event.target.value == "normal") {
        textInput.style.fontStyle = "italic";
        event.target.value = "italic";
        event.target.style.backgroundColor = "#B8B8B8"
        event.target.style.borderColor = "#121212";
    }
    else {
        textInput.style.fontStyle = "normal";
        event.target.value = "normal";
        event.target.style.backgroundColor = "#121212"
        event.target.style.borderColor = "transparent";
    }
}

function changeTextColor(e) {
    var textBox = e.target.parentElement.parentElement.parentElement;
    var textInput = textBox.getElementsByClassName("textInput")[0];
    textInput.style.color = e.target.value;
    
}

function clearBoard() {
    itemList = [];
    document.getElementsByClassName("board")[0].innerHTML ="";
    itemIndex = 0;
    
    var clearAll = document.getElementsByClassName("clearAll")[0];
    
    clearAll.style.display = "none";
}

var shotit = function() {
  html2canvas(document.getElementsByClassName("board")[0]).then(canvas => {
      document.body.appendChild(canvas);
      leCanvas = document.getElementsByTagName("canvas")[document.getElementsByTagName("canvas").length - 1];
      var img  = leCanvas.toDataURL("image/png");
      var myImage = new Image;
      myImage.src = img;
      
      var link = document.getElementById('link');
  link.setAttribute('download', 'myimage.png');
  link.setAttribute('href', img.replace("image/png", "image/octet-stream"));
  link.click();
  });
}
