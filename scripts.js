var perscriptionSelection = document.createElement("select");

var oralPerscriptionSelection = document.createElement("select");
var oralDosageText = document.createElement("input");

var oralTableDiv = document.querySelector("#oralTable");
var depotTableDiv = document.querySelector("#depotTable");

var oralTable = document.createElement("table");
var depotTable = document.createElement("table");

var timingsSelection = document.createElement("select");
var dosageText = document.createElement("input");

for (let i = 0; i < oralNames.length; ++i)
{
	let oral = oralNames[i];
  oralPerscriptionSelection.options.add(new Option(oral));
}

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
label.setAttribute("style", "font-weight:normal");

var oralLabel = document.createElement("Label");
oralLabel.innerHTML = "Dosage:";
oralLabel.setAttribute("style", "font-weight:normal");

var addDepotBtn = document.createElement("button");
addDepotBtn.appendChild(document.createTextNode("Add Depot"));
addEvent(addDepotBtn,'click',addDepot);

var addOralBtn = document.createElement("button");
addOralBtn.appendChild(document.createTextNode("Add Oral"));
addEvent(addOralBtn,'click',addOral);

document.getElementById("oral_name").appendChild(oralPerscriptionSelection);
document.getElementById("oral_dosage").appendChild(oralDosageText);
document.getElementById("oral_add").appendChild(addOralBtn);

document.getElementById("depot_name").appendChild(perscriptionSelection);
document.getElementById("depot_timing").appendChild(timingsSelection);
document.getElementById("depot_dosage").appendChild(dosageText);
document.getElementById("depot_add").appendChild(addDepotBtn);

depotTableDiv.appendChild(depotTable);
oralTableDiv.appendChild(oralTable);

var depots = [];
var orals = [];

function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

function addEvent(element, evnt, funct)
{
  if (element.attachEvent)
   return element.attachEvent('on'+evnt, funct);
  else
   return element.addEventListener(evnt, funct, false);
}

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

function generateTable(table, data)
{
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

function addOral()
{
	let dosage = parseInt(oralDosageText.value);
  if (Number.isInteger(dosage) == false || dosage <= 0)
  {
  	alert("Invalid dosage");
    return;
	}

  let index = oralPerscriptionSelection.selectedIndex;
  let maxDosage = maxOralDosages[index];

  let bnf = dosage / maxDosage;

 	let depotEntry = {
		oral: depotNames[index],
    dosage: dosage,
    timing: "1 Day"
    bnf: bnf
	};

  orals.push(depotEntry);

  updateBnfTotals();

  clearTable(oralTable);
  generateTableHead(oralTable, Object.keys(orals[0]));
  generateTable(oralTable, orals);
}

function updateBnfTotals()
{
	let bnfTotalDepot = 0;
  for (let i =0; i<depots.length; ++i)
  {
  	bnfTotalDepot += depots[i].bnf;
	}

  let bnfTotalOral = 0;
  for (let i = 0; i<orals.length; ++i)
  {
  	bnfTotalOral += orals[i].bnf;
	}

  let total = bnfTotalDepot + bnfTotalOral;

  document.getElementById("total_depot_bnf").innerHTML = roundToTwo(bnfTotalDepot);
  document.getElementById("total_oral_bnf").innerHTML = roundToTwo(bnfTotalOral);
  document.getElementById("total_bnf").innerHTML = roundToTwo(total);
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
    timing: timings[weeksIndex],
    bnf: bnf
	};

  depots.push(depotEntry);

  updateBnfTotals();

  clearTable(depotTable);
  generateTableHead(depotTable, Object.keys(depots[0]));
  generateTable(depotTable, depots);
}
