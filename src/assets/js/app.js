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

// Currency Icon Base64
const CURRENCY_ICON_BASE64 = "data:image/png;base64,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";

function getCurrencyIconHTML(height = '14px', margin = '0 4px 0 0') {
    return `<img src="${CURRENCY_ICON_BASE64}" style="height: ${height}; width: auto; vertical-align: middle; margin: ${margin}; display: inline-block;" alt="AED">`;
}

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
        const handleDateFilterChange = () => {
            window.currentDashboardPage = 1;
            loadDashboard();
        };
        startDateInput.addEventListener('change', handleDateFilterChange);
        startDateInput.addEventListener('input', handleDateFilterChange);
        endDateInput.addEventListener('change', handleDateFilterChange);
        endDateInput.addEventListener('input', handleDateFilterChange);

        btnClearDates.addEventListener('click', () => {
            startDateInput.value = '';
            endDateInput.value = '';
            window.currentDashboardPage = 1;
            loadDashboard();
        });
    }

    // Ensure all date inputs open calendar popup smoothly when clicked directly
    document.querySelectorAll('input[type="date"]').forEach(input => {
        input.addEventListener('click', () => {
            try { if (typeof input.showPicker === 'function') input.showPicker(); } catch (e) {}
        });
    });

    const btnDownloadFiltered = document.getElementById('btn-download-filtered-invoices');
    if (btnDownloadFiltered) {
        btnDownloadFiltered.addEventListener('click', downloadFilteredInvoicesPDF);
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
    const btnEditorDownloadPdf = document.getElementById('btn-editor-download-pdf');
    if (btnEditorDownloadPdf) {
        btnEditorDownloadPdf.addEventListener('click', saveAndDownloadInvoice);
    }
    document.getElementById('btn-preview').addEventListener('click', previewInvoice);
    document.getElementById('btn-save').addEventListener('click', saveAndDownloadInvoice);

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
    if(statTotalVat) statTotalVat.innerHTML = `${getCurrencyIconHTML('16px')} ${formatCurrency(totalVat)}`;

    const totalRev = invoices.reduce((sum, inv) => sum + (parseFloat(inv.total) || 0), 0);
    const statTotalRev = document.getElementById('stat-total-revenue');
    if(statTotalRev) statTotalRev.innerHTML = `${getCurrencyIconHTML('16px')} ${formatCurrency(totalRev)}`;

    // Update Download Invoices Button Visibility (Only show when date filter is applied)
    const btnDownloadFiltered = document.getElementById('btn-download-filtered-invoices');
    if (btnDownloadFiltered) {
        if (startDate || endDate) {
            btnDownloadFiltered.style.display = 'inline-flex';
        } else {
            btnDownloadFiltered.style.display = 'none';
        }
    }

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
            <td class="font-medium" style="color: var(--gray-900); font-weight: 600; white-space: nowrap;">${getCurrencyIconHTML('13px')} ${formatCurrency(inv.total)}</td>
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
function populatePreviewDOM() {
    // Check form validity
    const form = document.getElementById('invoice-form');
    if (!form.checkValidity()) {
        const checkTrnVal = document.getElementById('clientTRN').value;
        if (checkTrnVal && checkTrnVal.length !== 15) {
            alert('Customer TRN must be exactly 15 digits.');
        } else {
            alert('Please fill out all required fields correctly and ensure quantity/price are positive.');
        }
        return false;
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

    return true;
}

function previewInvoice() {
    if (!populatePreviewDOM()) return;
    switchView('preview');
}

async function saveAndDownloadInvoice() {
    const saveBtn = document.getElementById('btn-save');
    if (saveBtn && saveBtn.disabled) return;

    // 1. Automatically validate and save the invoice first (silently into database/dashboard)
    const saved = await saveInvoice(true);
    if (!saved) return;

    // 2. Populate preview DOM
    if (!populatePreviewDOM()) return;

    // 3. Generate and download PDF
    switchView('preview');
    await downloadPDF(saveBtn);

    // 4. Show success alert and return to dashboard
    alert('Invoice saved successfully!');
    switchView('dashboard');
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

async function saveInvoice(silent = false) {
    const form = document.getElementById('invoice-form');
    if (!form.checkValidity()) {
        const checkTrnVal = document.getElementById('clientTRN').value;
        if (checkTrnVal && checkTrnVal.length !== 15) {
            alert('Customer TRN must be exactly 15 digits.');
        } else {
            alert('Please fill out all required fields correctly and ensure quantity/price are positive.');
        }
        return false;
    }

    const isNew = !form.dataset.editId;

    // Update existing or generate new serial if new
    if (isNew && !document.getElementById('invoiceSerial').value) {
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
        return false;
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
        const saved = await window.db.saveInvoice(invoiceData);
        if (saved && saved.id) {
            form.dataset.editId = saved.id;
        }
        
        // Auto-increment the global sequence counter in settings only if it's a new invoice
        if (isNew) {
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
        
        if (!silent) {
            alert('Invoice saved successfully!');
            switchView('dashboard');
        }
        return true;
    } catch (e) {
        console.error("Save error", e);
        alert('Error saving invoice. Serial number might be duplicate.');
        return false;
    }
}

window.exportPdfFromDashboard = async function(id) {
    // Load and switch to preview
    await viewInvoice(id);
    previewInvoice();
    await downloadPDF();
    // Return to dashboard
    resetEditor();
    switchView('dashboard');
};

// Helper to prompt Save As dialog in Electron or browser (High performance ArrayBuffer)
async function savePdfWithDialog(pdf, filename) {
    if (window.electronAPI && typeof window.electronAPI.savePDFDialog === 'function') {
        const arrayBuffer = pdf.output('arraybuffer');
        const res = await window.electronAPI.savePDFDialog({
            defaultFilename: filename,
            bufferData: new Uint8Array(arrayBuffer)
        });
        return res;
    } else if (window.showSaveFilePicker) {
        try {
            const blob = pdf.output('blob');
            const handle = await window.showSaveFilePicker({
                suggestedName: filename,
                types: [{
                    description: 'PDF Document (*.pdf)',
                    accept: { 'application/pdf': ['.pdf'] }
                }]
            });
            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();
            return { success: true };
        } catch (err) {
            if (err.name === 'AbortError') {
                return { success: false, canceled: true };
            }
            pdf.save(filename);
            return { success: true };
        }
    } else {
        pdf.save(filename);
        return { success: true };
    }
}

function downloadPDF(triggerBtn) {
    return new Promise((resolve) => {
        const btn = triggerBtn || document.getElementById('btn-download-pdf');
        let originalText = '';
        if (btn) {
            originalText = btn.innerHTML;
            btn.innerHTML = '<i data-lucide="loader" class="spin"></i> Saving...';
            btn.disabled = true;
            lucide.createIcons();
        }

        const element = document.getElementById('pdf-content');
        
        const originalHeight = element.style.height;
        if (element.scrollHeight < 1060) {
            element.style.height = '280mm';
        }

        const invSerial = document.getElementById('prev-serial').textContent.trim() || '1000';
        const rawClientName = document.getElementById('prev-client-name').textContent.replace(/^Mr\.\/Mrs:\s*/i, '').trim();
        const cleanClientName = rawClientName.replace(/[^a-zA-Z0-9 ]/g, "").trim().replace(/\s+/g, "_");
        let invDate = document.getElementById('prev-date').textContent.trim();
        const cleanDate = invDate.replace(/[\/\\]/g, '-');

        let pdfFilename = `INV_${invSerial}`;
        if (cleanClientName && cleanClientName !== 'N_A' && cleanClientName !== 'NA') {
            pdfFilename += `_${cleanClientName}`;
        }
        if (cleanDate && cleanDate !== 'N-A' && cleanDate !== 'NA') {
            pdfFilename += `_${cleanDate}`;
        }
        pdfFilename += `.pdf`;

        const opt = {
            margin:       0,
            filename:     pdfFilename,
            image:        { type: 'jpeg', quality: 0.92 },
            html2canvas:  { scale: 1.25, scrollY: 0, scrollX: 0, logging: false },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).toPdf().get('pdf').then(async function (pdf) {
            var totalPages = pdf.internal.getNumberOfPages();
            for (var i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setFontSize(9);
                pdf.setTextColor(100);
                pdf.text('Page ' + i + ' of ' + totalPages, 0.4, pdf.internal.pageSize.getHeight() - 0.4);
            }
            await savePdfWithDialog(pdf, pdfFilename);
        }).then(() => {
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

// Download Filtered Invoices PDF Report
function downloadFilteredInvoicesPDF() {
    return new Promise(async (resolve) => {
        const searchQuery = document.getElementById('search-invoice') ? document.getElementById('search-invoice').value : '';
        const startDate = document.getElementById('filter-start-date') ? document.getElementById('filter-start-date').value : '';
        const endDate = document.getElementById('filter-end-date') ? document.getElementById('filter-end-date').value : '';
        
        let invoices = await window.db.getAllInvoices();
        
        if (searchQuery.trim() !== '') {
            const q = searchQuery.toLowerCase();
            invoices = invoices.filter(inv => 
                (inv.serial && String(inv.serial).toLowerCase().includes(q)) || 
                (inv.client && inv.client.name && inv.client.name.toLowerCase().includes(q))
            );
        }

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

        if (invoices.length === 0) {
            alert('No invoices found for the selected date range.');
            resolve();
            return;
        }

        // Sort descending by serial number to match dashboard sequence
        invoices.sort((a, b) => {
            const sA = String(a.serial || '');
            const sB = String(b.serial || '');
            return sB.localeCompare(sA, undefined, { numeric: true });
        });

        const totalVat = invoices.reduce((sum, inv) => sum + (parseFloat(inv.taxAmount) || 0), 0);
        const totalRevenue = invoices.reduce((sum, inv) => sum + (parseFloat(inv.total) || 0), 0);

        const btn = document.getElementById('btn-download-filtered-invoices');
        let originalText = '';
        if (btn) {
            originalText = btn.innerHTML;
            btn.innerHTML = '<i data-lucide="loader" class="spin"></i> Generating PDF...';
            btn.disabled = true;
            lucide.createIcons();
        }

        const formatDisplayDate = (dStr) => {
            if (!dStr) return '';
            if (dStr.includes('-')) {
                const parts = dStr.split('-');
                if (parts.length === 3 && parts[0].length === 4) {
                    return `${parts[2]}/${parts[1]}/${parts[0]}`;
                }
            }
            return dStr;
        };

        let dateRangeText = '';
        if (startDate && endDate) {
            dateRangeText = `Period: ${formatDisplayDate(startDate)} to ${formatDisplayDate(endDate)}`;
        } else if (startDate) {
            dateRangeText = `Period: From ${formatDisplayDate(startDate)}`;
        } else if (endDate) {
            dateRangeText = `Period: Up to ${formatDisplayDate(endDate)}`;
        } else {
            dateRangeText = `Period: All Invoices`;
        }

        const todayStr = new Date().toLocaleDateString('en-GB');

        let rowsHTML = '';
        invoices.forEach((inv, index) => {
            const clientName = (inv.client && inv.client.name) ? inv.client.name : '';
            const invDate = inv.date || '';
            const displayDate = formatDisplayDate(invDate);

            rowsHTML += `
                <tr style="border-bottom: 1px solid #e2e8f0; ${index % 2 === 1 ? 'background-color: #f8fafc;' : 'background-color: #ffffff;'} page-break-inside: avoid; break-inside: avoid;">
                    <td style="padding: 8px 10px; text-align: center; color: #64748b; font-size: 11px;">${index + 1}</td>
                    <td style="padding: 8px 10px; font-weight: 700; color: #0f172a; font-size: 12px;"><span style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; border: 1px solid #e2e8f0;">#${escapeHTML(inv.serial)}</span></td>
                    <td style="padding: 8px 10px; color: #334155; font-size: 11px; font-weight: 500;">${escapeHTML(displayDate)}</td>
                    <td style="padding: 8px 10px; font-weight: 600; color: #1e293b; font-size: 12px;">${escapeHTML(clientName)}</td>
                    <td style="padding: 8px 10px; text-align: right; font-weight: 700; color: #0f172a; font-size: 12px; white-space: nowrap;">${getCurrencyIconHTML('13px', '0 3px 0 0')}${formatCurrency(inv.total)}</td>
                </tr>
            `;
        });

        let reportElement = document.getElementById('filtered-report-document');
        if (!reportElement) {
            reportElement = document.createElement('div');
            reportElement.id = 'filtered-report-document';
            reportElement.className = 'invoice-document';
            const dashView = document.getElementById('view-dashboard');
            if (dashView) {
                dashView.appendChild(reportElement);
            } else {
                document.body.appendChild(reportElement);
            }
        }

        reportElement.style.cssText = 'display: block; width: 100%; max-width: 760px; background: #ffffff; padding: 10px 15px; margin: 1rem auto; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #111827;';
        reportElement.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #16a34a; padding-bottom: 14px; margin-bottom: 18px; page-break-inside: avoid; break-inside: avoid;">
                <div>
                    <h1 style="font-size: 20px; font-weight: 800; color: #15803d; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">Alove vera Landscaping LLC</h1>
                    <p style="font-size: 12px; color: #475569; margin: 3px 0 0 0; font-weight: 500;">Filtered Invoices Statement Report</p>
                </div>
                <div style="text-align: right;">
                    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 4px 10px; border-radius: 6px; display: inline-block;">
                        <span style="font-size: 11px; font-weight: 700; color: #15803d;">${dateRangeText}</span>
                    </div>
                    <div style="font-size: 10px; color: #64748b; margin-top: 4px;">Generated on: ${todayStr}</div>
                </div>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                    <tr style="background: linear-gradient(135deg, #15803d, #16a34a); color: #ffffff;">
                        <th style="padding: 9px 10px; text-align: center; width: 40px; font-size: 11px; font-weight: 700; text-transform: uppercase;">#</th>
                        <th style="padding: 9px 10px; text-align: left; width: 100px; font-size: 11px; font-weight: 700; text-transform: uppercase;">Invoice No</th>
                        <th style="padding: 9px 10px; text-align: left; width: 95px; font-size: 11px; font-weight: 700; text-transform: uppercase;">Date</th>
                        <th style="padding: 9px 10px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase;">Client Name</th>
                        <th style="padding: 9px 10px; text-align: right; width: 130px; font-size: 11px; font-weight: 700; text-transform: uppercase;">Total Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHTML}
                </tbody>
            </table>

            <!-- Final Summary Box (Positioned Just Above Footer, Protected from Page Breaks) -->
            <div style="display: flex; justify-content: flex-end; page-break-inside: avoid; break-inside: avoid; margin-top: 20px; margin-bottom: 10px;">
                <div style="width: 320px; background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <div style="font-size: 12px; font-weight: 700; color: #0f172a; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #e2e8f0; text-transform: uppercase; letter-spacing: 0.05em;">
                        Statement Totals
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; font-size: 12px; color: #475569;">
                        <span>Total Filtered Invoices:</span>
                        <span style="font-weight: 700; color: #0f172a;">${invoices.length}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; font-size: 12px; color: #475569;">
                        <span>Total VAT (5%):</span>
                        <span style="font-weight: 700; color: #0f172a; white-space: nowrap; display: flex; align-items: center;">${getCurrencyIconHTML('13px', '0 4px 0 0')} ${formatCurrency(totalVat)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 6px; border-top: 2px solid #e2e8f0; font-size: 13px; font-weight: 800; color: #0f172a;">
                        <span>Total Revenue:</span>
                        <span style="white-space: nowrap; display: flex; align-items: center; color: #0f172a;">${getCurrencyIconHTML('14px', '0 4px 0 0')} ${formatCurrency(totalRevenue)}</span>
                    </div>
                </div>
            </div>
        `;

        const safeStartDate = startDate ? startDate.replace(/[^a-zA-Z0-9]/g, '_') : 'start';
        const safeEndDate = endDate ? endDate.replace(/[^a-zA-Z0-9]/g, '_') : 'end';
        const pdfFilename = `Invoices_Report_${safeStartDate}_to_${safeEndDate}.pdf`;

        const opt = {
            margin:       [0.4, 0.4, 0.65, 0.4], // inches: top, left, bottom, right (leaves 0.65in at bottom for clean footer)
            filename:     pdfFilename,
            image:        { type: 'jpeg', quality: 0.92 },
            html2canvas:  { scale: 1.25, scrollY: 0, scrollX: 0, logging: false, useCORS: true },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
            pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
        };

        html2pdf().set(opt).from(reportElement).toPdf().get('pdf').then(async function (pdf) {
            var totalPages = pdf.internal.getNumberOfPages();
            var pageWidth = pdf.internal.pageSize.getWidth();
            var pageHeight = pdf.internal.pageSize.getHeight();

            for (var i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                
                // Top border line for bottom footer (at pageHeight - 0.52in)
                pdf.setDrawColor(210, 215, 225);
                pdf.setLineWidth(0.01);
                pdf.line(0.4, pageHeight - 0.52, pageWidth - 0.4, pageHeight - 0.52);

                // Computer generated disclaimer text centered in bottom footer
                pdf.setFontSize(8);
                pdf.setTextColor(100);
                pdf.text('This is a computer generated statement report, Does not require signature', pageWidth / 2, pageHeight - 0.35, { align: 'center' });

                // Page numbering on right
                pdf.setFontSize(8);
                pdf.setTextColor(130);
                pdf.text('Page ' + i + ' of ' + totalPages, pageWidth - 0.4, pageHeight - 0.35, { align: 'right' });
            }
            await savePdfWithDialog(pdf, pdfFilename);
        }).then(() => {
            reportElement.style.display = 'none';
            if (btn) {
                btn.innerHTML = originalText;
                btn.disabled = false;
                lucide.createIcons();
            }
            resolve();
        }).catch((e) => {
            console.error("PDF generation failed", e);
            reportElement.style.display = 'none';
            if (btn) {
                btn.innerHTML = originalText;
                btn.disabled = false;
                lucide.createIcons();
            }
            resolve();
        });
    });
}
