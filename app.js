// Initialize icons
lucide.createIcons();

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Database
    try {
        await window.db.init();
        loadDashboard();
    } catch (e) {
        console.error("Failed to init DB", e);
        alert("Failed to initialize database. Your browser might not support IndexedDB.");
    }

    // Navigation
    const navDashboard = document.getElementById('nav-dashboard');
    const navNewInvoice = document.getElementById('nav-new-invoice');
    
    navDashboard.addEventListener('click', () => switchView('dashboard'));
    navNewInvoice.addEventListener('click', () => {
        resetEditor();
        switchView('invoice-editor');
    });

    // Dashboard Actions
    document.getElementById('btn-create-invoice').addEventListener('click', () => {
        resetEditor();
        switchView('invoice-editor');
    });

    document.getElementById('search-invoice').addEventListener('input', () => {
        loadDashboard(document.getElementById('search-invoice').value);
    });

    // Editor Actions
    document.getElementById('btn-add-item').addEventListener('click', addLineItem);
    document.getElementById('invoice-form').addEventListener('input', calculateTotals);
    document.getElementById('btn-preview').addEventListener('click', previewInvoice);
    document.getElementById('btn-save').addEventListener('click', saveInvoice);

    // Preview Actions
    document.getElementById('btn-back-editor').addEventListener('click', () => switchView('invoice-editor'));
    document.getElementById('btn-download-pdf').addEventListener('click', downloadPDF);
});

// View Management
function switchView(viewName) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(`view-${viewName}`).classList.add('active');

    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const navBtn = document.querySelector(`[data-view="${viewName}"]`);
    if(navBtn) navBtn.classList.add('active');

    if (viewName === 'dashboard') {
        loadDashboard();
    }
}

// Dashboard Logic
async function loadDashboard(searchQuery = '') {
    let invoices = await window.db.getAllInvoices();
    
    if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        invoices = invoices.filter(inv => 
            (inv.serial && inv.serial.toLowerCase().includes(q)) || 
            (inv.client.name && inv.client.name.toLowerCase().includes(q))
        );
    }

    const tbody = document.getElementById('invoice-list');
    
    // Update Stats (only total count reflects all invoices, or filtered? Let's show filtered stats)
    document.getElementById('stat-total-count').textContent = invoices.length;
    const totalRev = invoices.reduce((sum, inv) => sum + parseFloat(inv.total), 0);
    document.getElementById('stat-total-revenue').textContent = formatCurrency(totalRev);

    // Update Table
    tbody.innerHTML = '';
    
    if (invoices.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center empty-state">No invoices found.</td></tr>`;
        return;
    }

    invoices.forEach(inv => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="font-medium">${inv.serial}</td>
            <td>${inv.date}</td>
            <td>${inv.client.name}</td>
            <td class="font-medium">${formatCurrency(inv.total)}</td>
            <td>
                <button class="btn-icon" onclick="viewInvoice('${inv.id}')" title="View"><i data-lucide="eye"></i></button>
                <button class="btn-icon" onclick="deleteInvoice('${inv.id}')" title="Delete"><i data-lucide="trash-2"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    lucide.createIcons();
}

async function viewInvoice(id) {
    const invoice = await window.db.getInvoice(id);
    if (!invoice) return;
    
    // Populate form
    document.getElementById('clientName').value = invoice.client.name;
    document.getElementById('clientMobile').value = invoice.client.mobile || '';
    document.getElementById('clientEmail').value = invoice.client.email || '';
    document.getElementById('clientAddress').value = invoice.client.address;
    document.getElementById('invoiceSerial').value = invoice.serial;
    document.getElementById('invoiceDate').value = invoice.date;
    
    // Populate items
    const tbody = document.getElementById('items-body');
    tbody.innerHTML = '';
    invoice.items.forEach(item => addLineItem(item));
    
    calculateTotals();
    
    // Store current editing ID
    document.getElementById('invoice-form').dataset.editId = invoice.id;
    
    switchView('invoice-editor');
}

async function deleteInvoice(id) {
    if (confirm('Are you sure you want to delete this invoice?')) {
        await window.db.deleteInvoice(id);
        loadDashboard();
    }
}

// Editor Logic
function resetEditor() {
    document.getElementById('invoice-form').reset();
    document.getElementById('items-body').innerHTML = '';
    document.getElementById('invoiceDate').valueAsDate = new Date();
    document.getElementById('invoiceSerial').value = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
    delete document.getElementById('invoice-form').dataset.editId;
    addLineItem();
    calculateTotals();
}

function addLineItem(data = null) {
    const tbody = document.getElementById('items-body');
    const tr = document.createElement('tr');
    tr.className = 'item-row';
    
    tr.innerHTML = `
        <td><input type="text" class="item-desc" placeholder="Service description" value="${data ? data.desc : ''}" required></td>
        <td><input type="number" class="item-qty input-sm" min="1" value="${data ? data.qty : 1}" required></td>
        <td><input type="number" class="item-price input-sm" min="0" step="0.01" value="${data ? data.price : 0}" required></td>
        <td class="item-total-text font-medium">AED 0.00</td>
        <td><button type="button" class="btn-icon text-red" onclick="this.closest('tr').remove(); calculateTotals()"><i data-lucide="trash-2"></i></button></td>
    `;
    tbody.appendChild(tr);
    lucide.createIcons();
    
    // Add event listeners to new inputs
    tr.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', calculateTotals);
    });
    
    if(data) calculateTotals();
}

function calculateTotals() {
    let subtotal = 0;
    
    document.querySelectorAll('.item-row').forEach(row => {
        const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        const total = qty * price;
        
        row.querySelector('.item-total-text').textContent = formatCurrency(total);
        subtotal += total;
    });

    const taxRate = 5;
    const taxAmount = subtotal * (taxRate / 100);
    const grandTotal = subtotal + taxAmount;

    document.getElementById('summary-subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('summary-tax').textContent = formatCurrency(taxAmount);
    document.getElementById('summary-total').textContent = formatCurrency(grandTotal);

    return { subtotal, taxRate, taxAmount, grandTotal };
}

// Preview Logic
function previewInvoice() {
    // Check form validity
    if (!document.getElementById('invoice-form').checkValidity()) {
        alert('Please fill out all required fields.');
        return;
    }

    const totals = calculateTotals();
    
    // Populate Preview
    document.getElementById('prev-client-name').textContent = document.getElementById('clientName').value || 'N/A';
    document.getElementById('prev-client-mobile').textContent = document.getElementById('clientMobile').value || '';
    document.getElementById('prev-client-email').textContent = document.getElementById('clientEmail').value || '';
    document.getElementById('prev-client-address').textContent = document.getElementById('clientAddress').value || '';
    
    document.getElementById('prev-serial').textContent = document.getElementById('invoiceSerial').value || 'N/A';
    document.getElementById('prev-date').textContent = document.getElementById('invoiceDate').value || 'N/A';
    
    const prevItemsBody = document.getElementById('prev-items-body');
    prevItemsBody.innerHTML = '';
    
    document.querySelectorAll('.item-row').forEach(row => {
        const desc = row.querySelector('.item-desc').value;
        const qty = row.querySelector('.item-qty').value;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        const total = parseFloat(qty) * price;
        
        if (desc) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${desc}</td>
                <td>${qty}</td>
                <td>${formatCurrency(price)}</td>
                <td>${formatCurrency(total)}</td>
            `;
            prevItemsBody.appendChild(tr);
        }
    });

    document.getElementById('prev-subtotal').textContent = formatCurrency(totals.subtotal);
    document.getElementById('prev-tax-amount').textContent = formatCurrency(totals.taxAmount);
    document.getElementById('prev-total').textContent = formatCurrency(totals.grandTotal);

    switchView('preview');
}

async function saveInvoice() {
    if (!document.getElementById('invoice-form').checkValidity()) {
        alert('Please fill out all required fields.');
        return;
    }

    const form = document.getElementById('invoice-form');
    const totals = calculateTotals();
    
    const items = [];
    document.querySelectorAll('.item-row').forEach(row => {
        const desc = row.querySelector('.item-desc').value;
        if (desc) {
            items.push({
                desc: desc,
                qty: parseFloat(row.querySelector('.item-qty').value) || 0,
                price: parseFloat(row.querySelector('.item-price').value) || 0
            });
        }
    });

    const invoiceData = {
        id: form.dataset.editId || null,
        serial: document.getElementById('invoiceSerial').value,
        date: document.getElementById('invoiceDate').value,
        client: {
            name: document.getElementById('clientName').value,
            mobile: document.getElementById('clientMobile').value,
            email: document.getElementById('clientEmail').value,
            address: document.getElementById('clientAddress').value
        },
        items: items,
        taxRate: totals.taxRate,
        subtotal: totals.subtotal,
        taxAmount: totals.taxAmount,
        total: totals.grandTotal,
        createdAt: new Date().toISOString()
    };

    try {
        await window.db.saveInvoice(invoiceData);
        alert('Invoice saved successfully!');
        switchView('dashboard');
    } catch (e) {
        console.error("Save error", e);
        alert('Error saving invoice. Serial number might be duplicate.');
    }
}

function downloadPDF() {
    const element = document.getElementById('pdf-content');
    const opt = {
        margin:       0,
        filename:     `Invoice_${document.getElementById('prev-serial').textContent}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    // Use html2pdf
    html2pdf().set(opt).from(element).save();
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-AE', {
        style: 'currency',
        currency: 'AED'
    }).format(amount);
}
