// Get necessary DOM elements
const typeSelect = document.getElementById('type-select');
const descriptionInput = document.getElementById('description-input');
const amountInput = document.getElementById('amount-input');
const addBtn = document.getElementById('add-btn');
const entriesTableBody = document.getElementById('entries-table-body');
const totalIncomeElem = document.getElementById('total-income');
const totalExpenseElem = document.getElementById('total-expense');
const netBalanceElem = document.getElementById('net-balance');

// Initialize data from local storage
let entries = JSON.parse(localStorage.getItem('entries')) || [];
let totalIncome = 0;
let totalExpense = 0;

// Load existing entries
window.onload = function() {
    updateTotals();
    renderEntries();
};

// Add a new entry
addBtn.addEventListener('click', function () {
    const type = typeSelect.value;
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const date = new Date().toLocaleDateString();

    if (!description || isNaN(amount) || amount <= 0) {
        alert("Please enter valid description and amount.");
        return;
    }

    const entry = { type, description, amount, date };
    entries.push(entry);
    localStorage.setItem('entries', JSON.stringify(entries));

    updateTotals();
    renderEntries();

    descriptionInput.value = '';
    amountInput.value = '';
});

// Render all entries
function renderEntries(filter = 'all') {
    entriesTableBody.innerHTML = '';
    const filteredEntries = entries.filter(entry => filter === 'all' || entry.type === filter);

    filteredEntries.forEach((entry, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${entry.description}</td>
            <td>$${entry.amount.toFixed(2)}</td>
            <td>${entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}</td>
            <td>${entry.date}</td>
            <td>
                <button class="edit" onclick="editEntry(${index})">Edit</button>
                <button class="delete" onclick="deleteEntry(${index})">Delete</button>
            </td>
        `;

        entriesTableBody.appendChild(row);
    });
}

// Update totals
function updateTotals() {
    totalIncome = entries.filter(e => e.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    totalExpense = entries.filter(e => e.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    const netBalance = totalIncome - totalExpense;

    totalIncomeElem.textContent = totalIncome.toFixed(2);
    totalExpenseElem.textContent = totalExpense.toFixed(2);
    netBalanceElem.textContent = netBalance.toFixed(2);
}

// Delete an entry
function deleteEntry(index) {
    entries.splice(index, 1);
    localStorage.setItem('entries', JSON.stringify(entries));
    updateTotals();
    renderEntries();
}

// Edit an entry
function editEntry(index) {
    const entry = entries[index];
    descriptionInput.value = entry.description;
    amountInput.value = entry.amount;
    typeSelect.value = entry.type;

    deleteEntry(index);
}

// Filter functionality
document.querySelectorAll('input[name="filter"]').forEach(radio => {
    radio.addEventListener('change', function () {
        renderEntries(this.value);
    });
});
