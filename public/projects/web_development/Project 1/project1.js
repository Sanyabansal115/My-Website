/**
 * COMP125 - Assignment 1
 * Multiplication Table Generator
 * 
 * This script creates a multiplication table based on user input
 * for the number of rows and columns.
 */

// Wait for the DOM to fully load before executing code
// This ensures all HTML elements are available for manipulation
document.addEventListener('DOMContentLoaded', function() {
    
    // Get references to DOM elements
    // Store references to avoid repeated getElementById calls
    const rowsInput = document.getElementById('rows');           // Input field for number of rows
    const columnsInput = document.getElementById('columns');     // Input field for number of columns
    const generateButton = document.getElementById('generate-table'); // Button to trigger table generation
    const tableContainer = document.getElementById('multiplication-table'); // Container where table will be displayed
    
    // Generate initial table with default values (10x10)
    // Shows user what the table looks like when page first loads
    generateMultiplicationTable(10, 10);
    
    // Add event listener to the generate button
    // Listens for click events on the generate button
    generateButton.addEventListener('click', function() {
        
        // Get values from input fields
        // Convert string input to integer numbers
        const rows = parseInt(rowsInput.value);
        const columns = parseInt(columnsInput.value);
        
        // Validate input
        // Check if values are valid numbers and greater than 0
        if (isNaN(rows) || isNaN(columns) || rows < 1 || columns < 1) {
            alert("Please enter valid numbers for rows and columns (minimum 1)");
            return; // Stop function execution if validation fails
        }
        
        // Generate new table with user input
        // Call function to create table with specified dimensions
        generateMultiplicationTable(rows, columns);
    });
    
    /**
     * Generates a multiplication table with the specified number of rows and columns
     * Creates HTML table structure and fills it with multiplication results
     * @param {number} rows - Number of rows for the table
     * @param {number} columns - Number of columns for the table
     */
    function generateMultiplicationTable(rows, columns) {
        
        // Clear any existing table
        // Remove previous table content before creating new one
        tableContainer.innerHTML = '';
        
        // Create a new table element
        // Main container for the entire table structure
        const table = document.createElement('table');
        
        // Create table header row
        // Contains column numbers across the top
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        // Add empty cell in the top-left corner
        // This is the intersection of row and column headers
        const cornerCell = document.createElement('th');
        headerRow.appendChild(cornerCell);
        
        // Add column headers (1 to columns)
        // Loop through each column number and create header cell
        for (let i = 1; i <= columns; i++) {
            const th = document.createElement('th');
            th.textContent = i; // Set the column number as text
            headerRow.appendChild(th);
        }
        
        // Attach header row to table header section
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Create table body
        // Contains all the data rows with multiplication results
        const tbody = document.createElement('tbody');
        
        // Create rows (1 to rows)
        // Outer loop creates each row of the table
        for (let i = 1; i <= rows; i++) {
            const row = document.createElement('tr');
            
            // Add row header (row number)
            // First cell in each row shows the row multiplier
            const rowHeader = document.createElement('th');
            rowHeader.textContent = i; // Set the row number as text
            row.appendChild(rowHeader);
            
            // Add cells with multiplication results
            // Inner loop creates each data cell in the current row
            for (let j = 1; j <= columns; j++) {
                const cell = document.createElement('td');
                cell.textContent = i * j; // Calculate and display multiplication result
                row.appendChild(cell);
            }
            
            // Add completed row to table body
            tbody.appendChild(row);
        }
        
        // Attach table body to main table
        table.appendChild(tbody);
        
        // Add completed table to the page
        // Insert table into the container div to make it visible
        tableContainer.appendChild(table);
    }
    
}); // End of DOMContentLoaded event listener