// (A) FILE READER + HTML ELEMENTS
let reader = new FileReader(),
    picker = document.getElementById("demoPick"),
    table = document.getElementById("demoTable");

// (B) READ CSV ON FILE PICK
picker.onchange = () => reader.readAsText(picker.files[0]);

// (C) READ CSV & GENERATE TABLE
reader.onloadend = () => {
  table.innerHTML = "";
  for (let row of CSV.parse(reader.result)) {
    let tr = table.insertRow();
    for (let col of row) {
      let td = tr.insertCell();
      td.innerHTML = col;
    }
  }
};