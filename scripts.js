var div = document.querySelector("#container"),
    frag = document.createDocumentFragment(),
    perscriptionSelection = document.createElement("select");
    
var depotTable = document.createElement("table");
    
var timingsSelection = document.createElement("select");
var dosageText = document.createElement("input");


for(let i = 0; i < depotNames.length; i++)
{
	let depot = depotNames[i];
  perscriptionSelection.options.add(new Option(depot)); 
}

for (let i = 0; i<timings.length; ++i)
{
	let timing = timings[i];
  timingsSelection.options.add(new Option(timing));
}

var label = document.createElement("Label");
label.innerHTML = "Dosage:";     

//Assign different attributes to the element.
dosageText.setAttribute("type", "text");
dosageText.setAttribute("value", "");
dosageText.setAttribute("name", "Test Name");
dosageText.setAttribute("style", "width:40px");

label.setAttribute("style", "font-weight:normal");

var addDepotBtn = document.createElement("button");
addDepotBtn.appendChild(document.createTextNode("Add Depot"));


function addEvent(element, evnt, funct){
  if (element.attachEvent)
   return element.attachEvent('on'+evnt, funct);
  else
   return element.addEventListener(evnt, funct, false);
}

addEvent(addDepotBtn,'click',addDepot);

frag.appendChild(perscriptionSelection);
frag.appendChild(timingsSelection);
frag.appendChild(label);
frag.appendChild(dosageText);
frag.appendChild(addDepotBtn);

div.appendChild(frag);
div.appendChild(depotTable);

var depots = [];

function generateTableHead(table, data) 
{
  let thead = table.createTHead();
  let row = thead.insertRow();
  for (let key of data) 
  {
    let th = document.createElement("th");
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
}

function clearTable(table)
{
	while(table.hasChildNodes())
  {
     table.removeChild(table.firstChild);
  }
}

function generateTable(table, data) {
	
  for (let element of data) 
  {
    let row = table.insertRow();
    for (key in element) 
    {
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      cell.appendChild(text);
    }
  }
}

function addDepot() 
{
	let dosage = parseInt(dosageText.value);
  if (Number.isInteger(dosage) == false || dosage <= 0)
  {
  	alert("Invalid dosage");
    return;
	}
  
  let index = perscriptionSelection.selectedIndex;
  let maxDosage = maxDepotDosages[index];
  
  let maxTiming = depotMaxTimings[index] * 7;
  
  let weeksIndex = timingsSelection.selectedIndex;
  let weeks = depotTimingDivisor[weeksIndex] ;
  let days = weeks * 7;
  
  let bnf = (dosage / (days/maxTiming)) / maxDosage;
  
 	let depotEntry = {
		depot: depotNames[index],
    dosage: dosage,
    weeks: timings[weeksIndex],
    bnf: bnf
	};
  
  depots.push(depotEntry);
  
  clearTable(depotTable);
  generateTableHead(depotTable, Object.keys(depots[0]));
  generateTable(depotTable, depots);
}
