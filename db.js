const DB_NAME = 'AloverInvoiceDB';
const DB_VERSION = 1;
const STORE_NAME = 'invoices';

class InvoiceDB {
    constructor() {
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = (event) => {
                console.error("Database error: ", event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                    store.createIndex('date', 'date', { unique: false });
                    store.createIndex('serial', 'serial', { unique: true });
                }
            };
        });
    }

    async saveInvoice(invoice) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error("Database not initialized"));
                return;
            }
            
            const transaction = this.db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            
            // Generate ID if not exists
            if (!invoice.id) {
                invoice.id = 'INV-' + Date.now();
            }
            
            const request = store.put(invoice);
            
            request.onsuccess = () => resolve(invoice);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllInvoices() {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error("Database not initialized"));
                return;
            }
            
            const transaction = this.db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();
            
            request.onsuccess = () => {
                // Sort by date descending
                const invoices = request.result.sort((a, b) => new Date(b.date) - new Date(a.date));
                resolve(invoices);
            };
            request.onerror = () => reject(request.error);
        });
    }

    async getInvoice(id) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error("Database not initialized"));
                return;
            }
            
            const transaction = this.db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(id);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteInvoice(id) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error("Database not initialized"));
                return;
            }
            
            const transaction = this.db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(id);
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}

// Global instance
window.db = new InvoiceDB();
