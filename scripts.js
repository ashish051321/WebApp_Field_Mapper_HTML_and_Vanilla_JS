function dropDownPopUps(){
    var mynodes = document.getElementsByClassName('dropdown-content');
    Array.from(mynodes).forEach(x => {
      if(x.classList.contains("show")){
        x.classList.toggle("show");
      }
    });
}
document.addEventListener("DOMContentLoaded", () => {
  
  //handling clicks on document  to remove popups
  document.querySelector('body').addEventListener('click',dropDownPopUps);
  
  window.masterlist1 = masterlist1 = [];
  window.masterlist2 = masterlist2 = [];
  window.filterlist2 = filterlist2 = [];
  window.selectedList = selectedList = [];

  function createList2() {
    var ip = document.querySelector("#list2").value;
    var list2 = ip.split("\n");
    // alert(list1);
    list2.forEach(item => {
      item = processItem(item);
      if(item.length != 0){
      masterlist2.push(item);  
      }
    });
    filterlist2 = masterlist2.slice(); //just duplicating it
  } //createList2() ends

  window.displayData = function displayData() {
    createList2();

    //now creating list1
    var ip = document.querySelector("#list1").value;
    var list1 = ip.split("\n");
    // alert(list1);
    list1.forEach(item => {
      item = processItem(item);

      if (item.length != 0) {
        masterlist1.push(item);
        var node = document.createElement("div"); // Create a <span> node

        var node1 = document.createElement("span");
        node1.className = "firstNode";
        var textnode = document.createTextNode(item); // Create a text node
        node1.appendChild(textnode); // Append the text to <li>
        node.appendChild(node1);

        var buttontemp = document.querySelector("#filterDropdown");
        var buttontempClon = buttontemp.content.cloneNode(true);
        node.appendChild(buttontempClon);

        node.className = "node";
        document.querySelector("div#oplist1").appendChild(node);
      }
    });
    return false;
  }; //function ends
});



function clearDropDown(parentNode) {
  //search for anchor tags and remove them
  var alist = parentNode.getElementsByTagName("a");
  Array.from(alist).forEach(x => {
    x.parentNode.removeChild(x);
  });
}

function showDropdownAndPopulateList(evt) {
  dropDownPopUps();
  //clearing the dropdown items
  evt.stopPropagation();
  clearDropDown(
    evt.target.parentNode.getElementsByClassName("dropdown-content")[0]
  );

  // filterlist2 is masterlist2 - selectedlist
  filterlist2 = masterlist2.filter(item => {
    if (selectedList.indexOf(item) != -1) {
      return false;
    } else {
      return true;
    }
  });

  evt.target.parentNode
    .querySelector(".dropdown-content")
    .classList.toggle("show");
  
  filterlist2.forEach(item => {
    //display each item as anchor tag incise  .dropdown-content
    var itemNode = document.createElement("a");
    var tnode = document.createTextNode(item);
    itemNode.appendChild(tnode);
    itemNode.setAttribute('tabindex','0');
    itemNode.addEventListener("click", selectOperation);
    itemNode.addEventListener("keydown", selectOperation);
    
    evt.target.parentNode
      .querySelector(".dropdown-content")
      .appendChild(itemNode);
  });

  evt.target.parentNode.querySelector("#myInput").focus();
}

function filterFunction(evt) {
  var input, filter, ul, li, a, i;
  input = evt.target;
  filter = input.value.toUpperCase();
  var div = evt.target.parentNode.parentNode.getElementsByClassName(
    "dropdown-content"
  )[0];
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}

function selectOperation(evt) {
  evt.stopPropagation();
  // alert(evt.target.textContent );
  var theSelectedItem = processItem(evt.target.textContent);
  //-----------------
  selectedList.push(theSelectedItem);

  //hinding the dropdown after selection
  evt.target.parentNode.parentNode
    .querySelector(".dropdown-content")
    .classList.toggle("show");
  var mappedItem = document.createElement("span");
  mappedItem.className = "mappedNode";
  mappedItem.appendChild(document.createTextNode(theSelectedItem));
  mappedItem.addEventListener("click", removeMappedElement);
  //before adding check if there is a mapping already--
  //if yes then free that mapping.
  checkAndFreeMapping(evt.target.parentNode.parentNode.parentNode);
  evt.target.parentNode.parentNode.parentNode.appendChild(mappedItem);
}

function processItem(x) {
  return x.trim().toUpperCase();
}

function checkAndFreeMapping(node) {
  var item = node.getElementsByClassName("mappedNode");
  if (item.length != 0) {
    selectedList.splice(selectedList.indexOf(item[0].textContent), 1);
    item[0].parentNode.removeChild(item[0]);
  }
}

function showResults() {
  document.querySelector(".resultModal").style.display = "flex";
  // div.Node contains -- span.firstNode and span.mappedNode
  var str = "";
  var nodes = document.getElementsByClassName("node");
  // alert(nodes.length);
  Array.from(nodes).forEach(item => {
    var item1 = item.getElementsByClassName("firstNode");
    var item2 = item.getElementsByClassName("mappedNode");
     if(item2.length != 0)
      {str += item1[0].textContent + "   ----   " + item2[0].textContent + "\n";}
    else
      {str += item1[0].textContent + "   ----   " + "MAPPING IS NOT CLEAR" + "\n";}
      
  });
  document.querySelector("#resultsTA1").value = str;
  str="";
  masterlist2.forEach(x => {
    if(selectedList.indexOf(x) != -1){
      
    }
    else{
      str+=x+"\n";
    }
  });
  document.querySelector("#resultsTA2").value = str;
}

function hideModal() {
  document.querySelector(".resultModal").style.display = "none";
}

function removeMappedElement(evt) {
  var node = evt.target;
  node.parentNode.removeChild(node);
  //update the selectedList
  console.log(selectedList.splice(selectedList.indexOf(node.textContent), 1));
}

function resetEverything() {
  history.go(0);
}

function searchList1(evt){
  // console.log('search trigerred');
  //extract value and search the list1 and change the ui accordingly.
  var srchString = evt.target.value;
  srchString = srchString.trim();
  srchString = srchString.toUpperCase();
  console.log(srchString);
  var allNodes = document.querySelectorAll(".node");
  var nodesArray = Array.from(allNodes);
  nodesArray.forEach(x=>{
   if(x.querySelector("span.firstNode").innerHTML.indexOf(srchString) > -1){
     x.style.display = "block";
   }
    else{
      x.style.display = "none";
    }
    
  });
}


function setNodesCorrect(){
  document.querySelector('#searchFirstList').value = "";
  document.querySelector('#searchFirstList').focus();
  document.querySelector('#searchFirstList').dispatchEvent(new KeyboardEvent('keyup',  
   {'key':32}));
}