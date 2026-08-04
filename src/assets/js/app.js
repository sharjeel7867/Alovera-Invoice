// Global settings
window.appSettings = {
    startingInvoiceNo: 1000,
    vatRate: 5
};

// Security Utility
function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Initialize icons
lucide.createIcons();

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Database
    try {
        await window.db.init();
        
        window.appSettings = await window.db.getSettings();
        document.getElementById('settingStartInvoice').value = window.appSettings.startingInvoiceNo;
        document.getElementById('settingVatRate').value = window.appSettings.vatRate;
        
        loadDashboard();
    } catch (e) {
        console.error("Failed to init DB", e);
        alert("Failed to initialize database. Your browser might not support IndexedDB.");
    }

    // Navigation
    const navDashboard = document.getElementById('nav-dashboard');
    const navNewInvoice = document.getElementById('nav-new-invoice');
    const navCustomers = document.getElementById('nav-customers');
    const navSettings = document.getElementById('nav-settings');
    
    navDashboard.addEventListener('click', () => switchView('dashboard'));
    navNewInvoice.addEventListener('click', async () => {
        await resetEditor();
        switchView('invoice-editor');
    });
    if (navCustomers) navCustomers.addEventListener('click', () => switchView('customers'));
    if (navSettings) navSettings.addEventListener('click', () => switchView('settings'));
    
    // Back to Dashboard buttons
    document.querySelectorAll('.btn-back-dashboard').forEach(btn => {
        btn.addEventListener('click', () => switchView('dashboard'));
    });

    // Dashboard Actions
    document.getElementById('btn-create-invoice').addEventListener('click', async () => {
        await resetEditor();
        switchView('invoice-editor');
    });

    let searchTimeout;
    document.getElementById('search-invoice').addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            window.currentDashboardPage = 1;
            loadDashboard();
        }, 300);
    });

    const startDateInput = document.getElementById('filter-start-date');
    const endDateInput = document.getElementById('filter-end-date');
    const btnClearDates = document.getElementById('btn-clear-dates');

    if (startDateInput && endDateInput && btnClearDates) {
        startDateInput.addEventListener('change', () => {
            window.currentDashboardPage = 1;
            loadDashboard();
        });
        endDateInput.addEventListener('change', () => {
            window.currentDashboardPage = 1;
            loadDashboard();
        });
        btnClearDates.addEventListener('click', () => {
            startDateInput.value = '';
            endDateInput.value = '';
            window.currentDashboardPage = 1;
            loadDashboard();
        });
    }

    // Customer Actions
    document.getElementById('btn-create-customer').addEventListener('click', () => {
        resetCustomerEditor();
        switchView('customer-editor');
    });
    
    let searchCustomerTimeout;
    document.getElementById('search-customer').addEventListener('input', () => {
        clearTimeout(searchCustomerTimeout);
        searchCustomerTimeout = setTimeout(() => {
            loadCustomers(document.getElementById('search-customer').value);
        }, 300);
    });
    
    document.getElementById('btn-back-customers').addEventListener('click', () => switchView('customers'));
    document.getElementById('btn-save-customer').addEventListener('click', saveCustomerForm);

    // Settings Actions
    const btnSaveSettings = document.getElementById('btn-save-settings');
    if (btnSaveSettings) {
        btnSaveSettings.addEventListener('click', async () => {
            const newStart = parseInt(document.getElementById('settingStartInvoice').value) || 1000;
            const newVat = parseFloat(document.getElementById('settingVatRate').value) || 5;
            window.appSettings.startingInvoiceNo = newStart;
            window.appSettings.vatRate = newVat;
            await window.db.saveSettings(window.appSettings);
            calculateTotals(); // Update open invoice if any
            alert('Settings saved successfully!');
        });
    }

    // Data Export/Import Actions
    const btnExportData = document.getElementById('btn-export-data');
    if (btnExportData) {
        btnExportData.addEventListener('click', async () => {
            const invoices = await window.db.getAllInvoices();
            const customers = await window.db.getAllCustomers();
            const settings = await window.db.getSettings();
            
            const exportData = { invoices, customers, settings, exportDate: new Date().toISOString() };
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
            
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "Alover_Invoice_Backup_" + new Date().toISOString().split('T')[0] + ".json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        });
    }

    const importFileInput = document.getElementById('import-file');
    if (importFileInput) {
        importFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const importedData = JSON.parse(event.target.result);
                    if (!importedData.invoices || !importedData.customers) {
                        throw new Error("Invalid backup file format.");
                    }
                    
                    if (confirm("Warning: Importing data will replace any matching existing records. Do you want to proceed?")) {
                        for (const cust of importedData.customers) await window.db.saveCustomer(cust);
                        for (const inv of importedData.invoices) await window.db.saveInvoice(inv);
                        if (importedData.settings) {
                            await window.db.saveSettings(importedData.settings);
                            window.appSettings = importedData.settings;
                            document.getElementById('settingStartInvoice').value = window.appSettings.startingInvoiceNo;
                            document.getElementById('settingVatRate').value = window.appSettings.vatRate;
                        }
                        alert("Data imported successfully!");
                        loadDashboard(); // Refresh UI if on dashboard
                    }
                } catch (error) {
                    console.error("Import error", error);
                    alert("Error importing data. Make sure it is a valid JSON backup file.");
                }
                e.target.value = ''; // Reset file input
            };
            reader.readAsText(file);
        });
    }

    // Custom Autocomplete and Autofill logic
    const clientNameInput = document.getElementById('clientName');
    const suggestionsContainer = document.getElementById('customers-suggestions');
    
    const showSuggestions = async () => {
        const value = clientNameInput.value.toLowerCase().trim();
        const customers = await window.db.getAllCustomers();
        suggestionsContainer.innerHTML = '';
        
        if (!value) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        const filtered = customers.filter(c => c.name.toLowerCase().includes(value));
        if (filtered.length === 0) {
            suggestionsContainer.style.display = 'none';
            return;
        }
        
        filtered.forEach(cust => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.textContent = cust.name;
            div.addEventListener('mousedown', (e) => {
                // use mousedown so it fires before blur
                e.preventDefault(); 
                clientNameInput.value = cust.name;
                suggestionsContainer.style.display = 'none';
                clientNameInput.dispatchEvent(new Event('change'));
            });
            suggestionsContainer.appendChild(div);
        });
        suggestionsContainer.style.display = 'block';
    };

    let suggestionsTimeout;
    const debouncedShowSuggestions = () => {
        clearTimeout(suggestionsTimeout);
        suggestionsTimeout = setTimeout(showSuggestions, 300);
    };

    if (clientNameInput && suggestionsContainer) {
        clientNameInput.addEventListener('input', debouncedShowSuggestions);
        clientNameInput.addEventListener('focus', showSuggestions);
        clientNameInput.addEventListener('blur', () => {
            suggestionsContainer.style.display = 'none';
        });
    }

    // Autofill when a customer is selected
    if (clientNameInput) {
        clientNameInput.addEventListener('change', async (e) => {
            const val = e.target.value;
            const customer = await window.db.findCustomerByName(val);
            if (customer) {
                document.getElementById('clientMobile').value = customer.mobile || '';
                document.getElementById('clientEmail').value = customer.email || '';
                document.getElementById('clientAddress').value = customer.address || '';
                document.getElementById('clientTRN').value = customer.trn || '';
            }
        });
    }

    // Editor Actions
    document.getElementById('btn-add-item').addEventListener('click', () => {
        const descInput = document.getElementById('new-item-desc');
        const qtyInput = document.getElementById('new-item-qty');
        const priceInput = document.getElementById('new-item-price');
        
        if (!descInput.value.trim()) {
            descInput.focus();
            return;
        }

        addLineItem({
            desc: descInput.value,
            qty: qtyInput.value,
            price: priceInput.value
        });
        
        // Reset the form fields
        descInput.value = '';
        qtyInput.value = 1;
        priceInput.value = '0.00';
        descInput.focus();
    });
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
    let navId = viewName;
    if (viewName === 'invoice-editor' || viewName === 'preview') navId = 'new-invoice';
    const navBtn = document.querySelector(`[data-view="${navId}"]`);
    if(navBtn) navBtn.classList.add('active');

    if (viewName === 'invoice-editor' || viewName === 'preview') {
        document.getElementById('app').classList.add('fullscreen-mode');
    } else {
        document.getElementById('app').classList.remove('fullscreen-mode');
    }

    if (viewName === 'dashboard') {
        window.currentDashboardPage = 1;
        const searchInput = document.getElementById('search-invoice');
        if (searchInput) searchInput.value = '';
        loadDashboard();
    }
    if (viewName === 'customers') {
        loadCustomers();
    }
}

// Dashboard Logic
window.currentDashboardPage = 1;
const ITEMS_PER_PAGE = 50;

async function loadDashboard() {
    const searchQuery = document.getElementById('search-invoice') ? document.getElementById('search-invoice').value : '';
    const startDate = document.getElementById('filter-start-date') ? document.getElementById('filter-start-date').value : '';
    const endDate = document.getElementById('filter-end-date') ? document.getElementById('filter-end-date').value : '';
    
    let invoices = await window.db.getAllInvoices();
    
    if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        invoices = invoices.filter(inv => 
            (inv.serial && String(inv.serial).toLowerCase().includes(q)) || 
            (inv.client.name && inv.client.name.toLowerCase().includes(q))
        );
    }

    // Helper function to parse varying date formats safely
    const parseInvoiceDate = (dateStr) => {
        if (!dateStr) return null;
        let dStr = dateStr;
        if (dStr.includes('/') && dStr.split('/')[0].length <= 2) {
            const p = dStr.split('/');
            dStr = `${p[2]}-${p[1]}-${p[0]}`;
        } else if (dStr.includes('-') && dStr.split('-')[0].length <= 2) {
            const p = dStr.split('-');
            dStr = `${p[2]}-${p[1]}-${p[0]}`;
        }
        const d = new Date(dStr);
        return isNaN(d.getTime()) ? null : d.setHours(0, 0, 0, 0);
    };

    if (startDate) {
        const start = new Date(startDate).setHours(0, 0, 0, 0);
        invoices = invoices.filter(inv => {
            const parsed = parseInvoiceDate(inv.date);
            return parsed !== null && parsed >= start;
        });
    }
    if (endDate) {
        const end = new Date(endDate).setHours(0, 0, 0, 0);
        invoices = invoices.filter(inv => {
            const parsed = parseInvoiceDate(inv.date);
            return parsed !== null && parsed <= end;
        });
    }

    // Sort invoices in descending order by serial number
    invoices.sort((a, b) => {
        const sA = String(a.serial || '');
        const sB = String(b.serial || '');
        return sB.localeCompare(sA, undefined, { numeric: true });
    });

    const tbody = document.getElementById('invoice-list');
    
    // Update Stats
    document.getElementById('stat-total-count').textContent = invoices.length;
    
    const totalVat = invoices.reduce((sum, inv) => sum + (parseFloat(inv.taxAmount) || 0), 0);
    const statTotalVat = document.getElementById('stat-total-vat');
    if(statTotalVat) statTotalVat.textContent = formatCurrency(totalVat);

    const totalRev = invoices.reduce((sum, inv) => sum + (parseFloat(inv.total) || 0), 0);
    document.getElementById('stat-total-revenue').textContent = formatCurrency(totalRev);

    // Calculate Pagination
    const totalPages = Math.ceil(invoices.length / ITEMS_PER_PAGE) || 1;
    if (window.currentDashboardPage > totalPages) window.currentDashboardPage = totalPages;
    
    const startIndex = (window.currentDashboardPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedInvoices = invoices.slice(startIndex, endIndex);

    // Update Table
    tbody.innerHTML = '';
    
    if (paginatedInvoices.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center empty-state">No invoices found.</td></tr>`;
        renderPagination(0);
        return;
    }

    paginatedInvoices.forEach(inv => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="font-medium"><span class="badge">#${escapeHTML(inv.serial)}</span></td>
            <td style="color: var(--gray-500); font-size: 0.8rem;">${escapeHTML(inv.date)}</td>
            <td class="font-medium">${escapeHTML(inv.client.name)}</td>
            <td class="font-medium" style="color: var(--primary-700);">${formatCurrency(inv.total)}</td>
            <td>
                <button class="btn-icon" onclick="viewInvoice('${inv.id}')" title="View"><i data-lucide="eye"></i></button>
                <button class="btn-icon" onclick="exportPdfFromDashboard('${inv.id}')" title="Export PDF" style="color: var(--primary-600);"><i data-lucide="download"></i></button>
                <button class="btn-icon btn-delete" onclick="deleteInvoice('${inv.id}')" title="Delete"><i data-lucide="trash-2"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    lucide.createIcons();
    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    let paginationContainer = document.getElementById('dashboard-pagination');
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'dashboard-pagination';
        paginationContainer.className = 'pagination-controls';
        paginationContainer.style.cssText = 'display: flex; justify-content: flex-end; align-items: center; padding: 1rem; background: white; border: 1px solid var(--gray-200); border-top: none; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;';
        const tableContainer = document.querySelector('#view-dashboard .table-container');
        tableContainer.parentNode.insertBefore(paginationContainer, tableContainer.nextSibling);
    }
    
    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }
    
    paginationContainer.style.display = 'flex';
    paginationContainer.innerHTML = `
        <button class="btn btn-secondary btn-sm" ${window.currentDashboardPage === 1 ? 'disabled' : ''} onclick="changeDashboardPage(${window.currentDashboardPage - 1})" style="padding: 0.25rem 0.75rem;">
            Previous
        </button>
        <span style="margin: 0 1rem; font-size: 0.875rem; color: var(--gray-600); font-weight: 500;">Page ${window.currentDashboardPage} of ${totalPages}</span>
        <button class="btn btn-secondary btn-sm" ${window.currentDashboardPage === totalPages ? 'disabled' : ''} onclick="changeDashboardPage(${window.currentDashboardPage + 1})" style="padding: 0.25rem 0.75rem;">
            Next
        </button>
    `;
}

window.changeDashboardPage = function(newPage) {
    window.currentDashboardPage = newPage;
    loadDashboard();
};

async function viewInvoice(id) {
    const invoice = await window.db.getInvoice(id);
    if (!invoice) return;
    
    // Populate form
    document.getElementById('clientName').value = invoice.client.name;
    document.getElementById('clientMobile').value = invoice.client.mobile || '';
    document.getElementById('clientEmail').value = invoice.client.email || '';
    document.getElementById('clientAddress').value = invoice.client.address;
    document.getElementById('clientTRN').value = invoice.client.trn || '';
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
async function getNextSerialNumber() {
    return window.appSettings.startingInvoiceNo;
}

async function resetEditor() {
    document.getElementById('invoice-form').reset();
    document.getElementById('items-body').innerHTML = '';
    document.getElementById('invoiceDate').valueAsDate = new Date();
    
    const nextSerial = await getNextSerialNumber();
    document.getElementById('invoiceSerial').value = nextSerial;
    
    delete document.getElementById('invoice-form').dataset.editId;
    calculateTotals();
    populateCustomersDatalist();
}

function updateSerialNumbers() {
    document.querySelectorAll('.item-row').forEach((row, index) => {
        const snoCell = row.querySelector('.item-sno');
        if (snoCell) snoCell.textContent = index + 1;
    });
}

function addLineItem(data = null) {
    const tbody = document.getElementById('items-body');
    const tr = document.createElement('tr');
    tr.className = 'item-row';
    
    tr.innerHTML = `
        <td class="item-sno font-medium text-center" style="vertical-align: middle;"></td>
        <td><input type="text" class="item-desc" placeholder="Item description" value="${data ? escapeHTML(data.desc) : ''}" required></td>
        <td><input type="number" class="item-qty input-sm" min="1" value="${data ? data.qty : 1}" required></td>
        <td><input type="number" class="item-price input-sm" min="0" step="0.01" value="${data ? data.price : 0}" required></td>
        <td class="item-total-text font-medium">0.00</td>
        <td><button type="button" class="btn-icon btn-delete" onclick="this.closest('tr').remove(); calculateTotals(); updateSerialNumbers();"><i data-lucide="trash-2"></i></button></td>
    `;
    tbody.appendChild(tr);
    lucide.createIcons();
    
    // Add event listeners to new inputs
    tr.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', calculateTotals);
    });
    
    if(data) calculateTotals();
    updateSerialNumbers();
}

function calculateTotals() {
    let subtotal = 0;
    
    document.querySelectorAll('.item-row').forEach((row, index) => {
        row.querySelector('.item-sno').textContent = index + 1;
        
        const qty = Math.max(0, parseFloat(row.querySelector('.item-qty').value) || 0);
        const price = Math.max(0, parseFloat(row.querySelector('.item-price').value) || 0);
        const total = qty * price;
        
        row.querySelector('.item-total-text').textContent = formatCurrency(total);
        subtotal += total;
    });

    const taxRate = window.appSettings ? window.appSettings.vatRate : 5;
    const taxAmount = subtotal * (taxRate / 100);
    const grandTotal = subtotal + taxAmount;

    // Update labels dynamically
    const taxLabels = document.querySelectorAll('#summary-tax-label, #preview-tax-label');
    taxLabels.forEach(l => {
        if (l) l.textContent = `VAT (${taxRate}%)${l.id === 'preview-tax-label' ? ':' : ''}`;
    });

    document.getElementById('summary-subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('summary-tax').textContent = formatCurrency(taxAmount);
    document.getElementById('summary-total').textContent = formatCurrency(grandTotal);

    return { subtotal, taxRate, taxAmount, grandTotal };
}

// Preview Logic
function previewInvoice() {
    // Check form validity
    const form = document.getElementById('invoice-form');
    if (!form.checkValidity()) {
        const checkTrnVal = document.getElementById('clientTRN').value;
        if (checkTrnVal && checkTrnVal.length !== 15) {
            alert('Customer TRN must be exactly 15 digits.');
        } else {
            alert('Please fill out all required fields correctly and ensure quantity/price are positive.');
        }
        return;
    }

    const totals = calculateTotals();
    
    // Populate Preview
    const clientNameVal = document.getElementById('clientName').value;
    document.getElementById('prev-client-name').textContent = clientNameVal ? 'Mr./Mrs: ' + clientNameVal : 'N/A';
    const mobileVal = document.getElementById('clientMobile').value;
    document.getElementById('prev-client-mobile').textContent = 'Contact No: ' + (mobileVal || '');
    
    const emailVal = document.getElementById('clientEmail').value;
    document.getElementById('prev-client-email').textContent = 'Email: ' + (emailVal || '');
    
    const addressVal = document.getElementById('clientAddress').value;
    document.getElementById('prev-client-address').textContent = 'Address: ' + (addressVal || '');
    
    const trnVal = document.getElementById('clientTRN').value;
    document.getElementById('prev-client-trn').textContent = 'Customer TRN: ' + (trnVal || '');
    
    document.getElementById('prev-serial').textContent = document.getElementById('invoiceSerial').value || 'N/A';
    let dateVal = document.getElementById('invoiceDate').value;
    if (dateVal) {
        const parts = dateVal.split('-');
        if (parts.length === 3) {
            dateVal = `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
    }
    document.getElementById('prev-date').textContent = dateVal || 'N/A';
    
    const prevItemsBody = document.getElementById('prev-items-body');
    prevItemsBody.innerHTML = '';
    
    let sno = 1;
    document.querySelectorAll('.item-row').forEach(row => {
        const desc = row.querySelector('.item-desc').value;
        const qty = row.querySelector('.item-qty').value;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        const total = parseFloat(qty) * price;
        
        if (desc) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="text-align: center; white-space: nowrap;">${sno++}</td>
                <td style="white-space: pre-wrap;">${escapeHTML(desc)}</td>
                <td style="text-align: center; white-space: nowrap;">${qty}</td>
                <td style="white-space: nowrap;">${formatCurrency(price)}</td>
                <td style="white-space: nowrap;">${formatCurrency(total)}</td>
            `;
            prevItemsBody.appendChild(tr);
        }
    });

    document.getElementById('prev-subtotal').textContent = formatCurrency(totals.subtotal);
    document.getElementById('prev-tax-amount').textContent = formatCurrency(totals.taxAmount);
    document.getElementById('prev-total').textContent = formatCurrency(totals.grandTotal);
    document.getElementById('prev-amount-words').textContent = numberToWords(totals.grandTotal);

    // Generate QR Code
    const trnNumber = "100033495100003";
    const qrContainer = document.getElementById("invoice-qrcode");
    qrContainer.innerHTML = '';
    new QRCode(qrContainer, {
        text: "https://avlandscaping.ae/",
        width: 80,
        height: 80,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M
    });

    switchView('preview');
}

function numberToWords(num) {
    if (num === 0) return 'zero';
    const a = ['','one','two','three','four', 'five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
    const b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

    function convert(n) {
        if (n < 20) return a[n] + ' ';
        if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] + ' ' : ' ');
        if (n < 1000) return a[Math.floor(n / 100)] + ' hundred ' + (n % 100 === 0 ? '' : 'and ' + convert(n % 100));
        if (n < 1000000) return convert(Math.floor(n / 1000)) + ' thousand ' + (n % 1000 === 0 ? '' : convert(n % 1000));
        return convert(Math.floor(n / 1000000)) + ' million ' + (n % 1000000 === 0 ? '' : convert(n % 1000000));
    }
    
    let integerPart = Math.floor(num);
    let decimalPart = Math.round((num - integerPart) * 100);
    
    let words = convert(integerPart).trim();
    if (decimalPart > 0) {
        words += ' and ' + convert(decimalPart).trim() + ' fils';
    }
    
    return words.split(' ').map(word => {
        if (word.toLowerCase() === 'and') return 'and';
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
}

async function saveInvoice() {
    const form = document.getElementById('invoice-form');
    if (!form.checkValidity()) {
        const checkTrnVal = document.getElementById('clientTRN').value;
        if (checkTrnVal && checkTrnVal.length !== 15) {
            alert('Customer TRN must be exactly 15 digits.');
        } else {
            alert('Please fill out all required fields correctly and ensure quantity/price are positive.');
        }
        return;
    }

    // Update existing or generate new serial if new
    if (!form.dataset.editId) {
        const nextSerial = await getNextSerialNumber();
        document.getElementById('invoiceSerial').value = nextSerial;
    }

    const totals = calculateTotals();
    
    const items = [];
    document.querySelectorAll('.item-row').forEach(row => {
        const desc = row.querySelector('.item-desc').value;
        if (desc) {
            items.push({
                desc: desc,
                qty: Math.max(0, parseFloat(row.querySelector('.item-qty').value) || 0),
                price: Math.max(0, parseFloat(row.querySelector('.item-price').value) || 0)
            });
        }
    });

    if (items.length === 0) {
        alert("You must add at least one item to the invoice before saving.");
        return;
    }

    const invoiceData = {
        id: form.dataset.editId || null,
        serial: document.getElementById('invoiceSerial').value,
        date: document.getElementById('invoiceDate').value,
        client: {
            name: document.getElementById('clientName').value,
            mobile: document.getElementById('clientMobile').value,
            email: document.getElementById('clientEmail').value,
            address: document.getElementById('clientAddress').value,
            trn: document.getElementById('clientTRN').value
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
        
        // Auto-increment the global sequence counter in settings only if it's a new invoice
        if (!form.dataset.editId) {
            let savedSerial = parseInt(invoiceData.serial, 10);
            if (!isNaN(savedSerial)) {
                window.appSettings.startingInvoiceNo = savedSerial + 1;
                await window.db.saveSettings(window.appSettings);
                
                // Update the UI setting form to reflect this change
                document.getElementById('settingStartInvoice').value = window.appSettings.startingInvoiceNo;
            }
        }
        
        // Auto-save customer if new
        const existingCust = await window.db.findCustomerByName(invoiceData.client.name);
        if (!existingCust && invoiceData.client.name.trim() !== '') {
            await window.db.saveCustomer({
                name: invoiceData.client.name,
                mobile: invoiceData.client.mobile,
                email: invoiceData.client.email,
                address: invoiceData.client.address,
                trn: invoiceData.client.trn,
                dateAdded: invoiceData.date
            });
        }
        
        alert('Invoice saved successfully!');
        switchView('dashboard');
    } catch (e) {
        console.error("Save error", e);
        alert('Error saving invoice. Serial number might be duplicate.');
    }
}

window.exportPdfFromDashboard = async function(id) {
    // Load and switch to preview
    await viewInvoice(id);
    previewInvoice();
    
    // Small delay to ensure the DOM is rendered before capturing
    await new Promise(r => setTimeout(r, 150));
    
    await downloadPDF();
    
    // Return to dashboard
    resetEditor();
    switchView('dashboard');
};

function downloadPDF() {
    return new Promise((resolve) => {
        const btn = document.getElementById('btn-download-pdf');
        let originalText = '';
        if (btn) {
            originalText = btn.innerHTML;
            btn.innerHTML = '<i data-lucide="loader" class="spin"></i> Generating...';
            btn.disabled = true;
            lucide.createIcons();
        }

        const element = document.getElementById('pdf-content');
        
        const originalHeight = element.style.height;
        if (element.scrollHeight < 1060) {
            element.style.height = '280mm';
        }

        const invSerial = document.getElementById('prev-serial').textContent.trim();
        const rawClientName = document.getElementById('prev-client-name').textContent.replace('Mr./Mrs: ', '').trim();
        const cleanClientName = rawClientName.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_");
        const invDate = document.getElementById('prev-date').textContent.trim();
        const pdfFilename = `INV_${invSerial}_${cleanClientName}_${invDate}.pdf`;

        const opt = {
            margin:       0,
            filename:     pdfFilename,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 1.5, scrollY: 0, scrollX: 0, logging: false },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).toPdf().get('pdf').then(function (pdf) {
            var totalPages = pdf.internal.getNumberOfPages();
            for (var i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setFontSize(9);
                pdf.setTextColor(100);
                pdf.text('Page ' + i + ' of ' + totalPages, 0.4, pdf.internal.pageSize.getHeight() - 0.4);
            }
        }).save().then(() => {
            element.style.height = originalHeight;
            if (btn) {
                btn.innerHTML = originalText;
                btn.disabled = false;
                lucide.createIcons();
            }
            resolve();
        }).catch((e) => {
            console.error("PDF generation failed", e);
            if (btn) {
                btn.innerHTML = originalText;
                btn.disabled = false;
                lucide.createIcons();
            }
            resolve();
        });
    });
}

function formatCurrency(amount) {
    const formattedNum = new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
    return `${formattedNum}`;
}

// Customers Logic
async function loadCustomers(searchQuery = '') {
    let customers = await window.db.getAllCustomers();
    
    if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        customers = customers.filter(c => 
            (c.name && c.name.toLowerCase().includes(q)) || 
            (c.trn && c.trn.toLowerCase().includes(q))
        );
    }

    const tbody = document.getElementById('customers-list');
    tbody.innerHTML = '';
    
    if (customers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center empty-state">No customers found.</td></tr>`;
        return;
    }

    // Limit to 50 results to prevent UI freezing
    const paginatedCustomers = customers.slice(0, 50);

    paginatedCustomers.forEach(cust => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="font-medium">${escapeHTML(cust.name)}</td>
            <td>${cust.trn ? `<span class="badge">${escapeHTML(cust.trn)}</span>` : '-'}</td>
            <td style="color: var(--gray-500); font-size: 0.85rem;">${escapeHTML(cust.mobile) || '-'}</td>
            <td style="color: var(--gray-500); font-size: 0.85rem;">${escapeHTML(cust.dateAdded) || '-'}</td>
            <td>
                <button class="btn-icon" onclick="viewCustomer('${cust.id}')" title="Edit"><i data-lucide="edit"></i></button>
                <button class="btn-icon btn-delete" onclick="deleteCustomer('${cust.id}')" title="Delete"><i data-lucide="trash-2"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    lucide.createIcons();
}

async function viewCustomer(id) {
    const cust = await window.db.getCustomer(id);
    if (!cust) return;
    
    document.getElementById('custFormName').value = cust.name || '';
    document.getElementById('custFormMobile').value = cust.mobile || '';
    document.getElementById('custFormEmail').value = cust.email || '';
    document.getElementById('custFormAddress').value = cust.address || '';
    document.getElementById('custFormTRN').value = cust.trn || '';
    
    document.getElementById('customer-form').dataset.editId = cust.id;
    switchView('customer-editor');
}

async function deleteCustomer(id) {
    if (confirm('Are you sure you want to delete this customer?')) {
        await window.db.deleteCustomer(id);
        loadCustomers();
    }
}

function resetCustomerEditor() {
    document.getElementById('customer-form').reset();
    delete document.getElementById('customer-form').dataset.editId;
}

async function saveCustomerForm() {
    const form = document.getElementById('customer-form');
    if (!form.checkValidity()) {
        const checkTrnVal = document.getElementById('custFormTRN').value;
        if (checkTrnVal && checkTrnVal.length !== 15) {
            alert('Customer TRN must be exactly 15 digits.');
        } else {
            alert('Please fill out all required fields correctly.');
        }
        return;
    }

    const isEdit = !!form.dataset.editId;
    let existingDate = null;
    if (isEdit) {
        const existing = await window.db.getCustomer(form.dataset.editId);
        if (existing) existingDate = existing.dateAdded;
    }

    const custData = {
        id: form.dataset.editId || null,
        name: document.getElementById('custFormName').value,
        mobile: document.getElementById('custFormMobile').value,
        email: document.getElementById('custFormEmail').value,
        address: document.getElementById('custFormAddress').value,
        trn: document.getElementById('custFormTRN').value,
        dateAdded: existingDate || new Date().toISOString().split('T')[0]
    };

    try {
        await window.db.saveCustomer(custData);
        alert('Customer saved successfully!');
        switchView('customers');
    } catch (e) {
        console.error("Save error", e);
        alert('Error saving customer.');
    }
}

async function populateCustomersDatalist() {
    const datalist = document.getElementById('customers-datalist');
    if (!datalist) return;
    
    const customers = await window.db.getAllCustomers();
    datalist.innerHTML = '';
    customers.forEach(cust => {
        const option = document.createElement('option');
        option.value = cust.name;
        datalist.appendChild(option);
    });
}
