// Fetch the JSON data from the bangs.json file
fetch("./json/bangs.json")
  .then((response) => response.json())
  .then((data) => {
    // Calculate the number of bangs
    const numBangs = Object.keys(data).length;

    // Get the table element from the HTML
    const table1 = document.getElementById("bangs-table1");
    const table2 = document.getElementById("bangs-table2");

    // Calculate the number of rows and columns in the table
    const numRows = Math.ceil(numBangs / 2);
    const numCols = 2;

    // Loop through each row and column and add the data to the table
    let row = null;
    let col = null;

    for (let i = 0; i < numBangs; i++) {
      // Calculate the row and column index for the current bang
      row = Math.floor(i / numCols);
      col = i % numCols;

      // Get the bang data for the current index
      const bang = Object.keys(data)[i];
      const bangName = data[bang].name;
      const bangUrl = data[bang].url;
      const baseUrl = bangUrl.replace(/^(https?:\/\/[^\/]+).*$/, "$1");

      // Create the HTML elements for the current bang
      const tdBang = document.createElement("td");
      tdBang.textContent = bang;

      const tdName = document.createElement("td");
      tdName.textContent = bangName;

      const tr = document.createElement("tr");
      tr.appendChild(tdBang);
      tr.appendChild(tdName);

      // Add the HTML elements to the table
      if (col === 0) {
        tr.setAttribute("onClick", `window.location.href = '${baseUrl}';`);
        table1.appendChild(tr);
      } else {
        tr.setAttribute("onClick", `window.location.href = '${baseUrl}';`);
        table2.appendChild(tr);
      }
    }
  })
  .catch((error) => {
    console.error("Error loading bangs.json:", error);
  });
