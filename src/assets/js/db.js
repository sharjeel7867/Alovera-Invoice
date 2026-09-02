class InvoiceDB {
    constructor() {
        this.data = {
            invoices: [],
            customers: [],
            settings: {
                id: 'app_settings',
                startingInvoiceNo: 1000,
                vatRate: 5
            }
        };
    }

    async init() {
        try {
            let hasLoadedData = false;

            // 1. Try Electron IPC
            if (window.electronAPI && window.electronAPI.loadData) {
                try {
                    const loadedData = await window.electronAPI.loadData();
                    if (loadedData && (loadedData.invoices?.length > 0 || loadedData.customers?.length > 0)) {
                        if (loadedData.invoices) this.data.invoices = loadedData.invoices;
                        if (loadedData.customers) this.data.customers = loadedData.customers;
                        if (loadedData.settings) Object.assign(this.data.settings, loadedData.settings);
                        hasLoadedData = true;
                    }
                } catch (e) {
                    console.warn("Electron load error:", e);
                }
            }

            // 2. Check localStorage (as backup / web mode)
            try {
                const localStr = localStorage.getItem('alover_invoice_data');
                if (localStr) {
                    const localData = JSON.parse(localStr);
                    if (localData) {
                        if (!hasLoadedData && (localData.invoices?.length > 0 || localData.customers?.length > 0)) {
                            if (localData.invoices) this.data.invoices = localData.invoices;
                            if (localData.customers) this.data.customers = localData.customers;
                            if (localData.settings) Object.assign(this.data.settings, localData.settings);
                            hasLoadedData = true;
                        }
                    }
                }
            } catch (lsErr) {
                console.warn("localStorage read error:", lsErr);
            }

            // Always sync both destinations
            await this._save();
        } catch (error) {
            console.error("Database initialization error:", error);
            throw error;
        }
    }

    async _save() {
        // Save to Electron IPC if available
        if (window.electronAPI && window.electronAPI.saveData) {
            try {
                await window.electronAPI.saveData(this.data);
            } catch (e) {
                console.warn("Electron save error:", e);
            }
        }
        // Always save to localStorage so it works in every context
        try {
            localStorage.setItem('alover_invoice_data', JSON.stringify(this.data));
        } catch (lsErr) {
            console.warn("localStorage save error:", lsErr);
        }
    }

    async saveInvoice(invoice) {
        if (!invoice.id) {
            invoice.id = 'INV-' + Date.now();
        }
        const index = this.data.invoices.findIndex(i => i.id === invoice.id);
        if (index >= 0) {
            this.data.invoices[index] = invoice;
        } else {
            this.data.invoices.push(invoice);
        }
        await this._save();
        return invoice;
    }

    async getAllInvoices() {
        return [...this.data.invoices];
    }

    async getInvoice(id) {
        return this.data.invoices.find(i => i.id === id);
    }

    async deleteInvoice(id) {
        this.data.invoices = this.data.invoices.filter(i => i.id !== id);
        await this._save();
    }

    // --- Customers Methods ---
    
    async saveCustomer(customer) {
        if (!customer.id) {
            customer.id = 'CUST-' + Date.now();
        }
        const index = this.data.customers.findIndex(c => c.id === customer.id);
        if (index >= 0) {
            this.data.customers[index] = customer;
        } else {
            this.data.customers.push(customer);
        }
        await this._save();
        return customer;
    }

    async getAllCustomers() {
        return [...this.data.customers].sort((a, b) => {
            const nameA = (a.name || '').toLowerCase();
            const nameB = (b.name || '').toLowerCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        });
    }

    async getCustomer(id) {
        return this.data.customers.find(c => c.id === id);
    }

    async deleteCustomer(id) {
        this.data.customers = this.data.customers.filter(c => c.id !== id);
        await this._save();
    }

    async findCustomerByName(name) {
        return this.data.customers.find(c => c.name.toLowerCase() === name.toLowerCase());
    }

    // --- Settings Methods ---
    async getSettings() {
        return this.data.settings;
    }

    async saveSettings(settings) {
        settings.id = 'app_settings';
        this.data.settings = settings;
        await this._save();
        return settings;
    }
}

// Global instance
window.db = new InvoiceDB();
