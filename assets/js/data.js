/**
 * data.js - Seed data and localStorage CRUD helpers
 */

const SEED_DATA = {
    users: [
        { id: 1, name: 'John Doe', email: 'admin@example.com', role: 'Admin', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=1' },
        { id: 2, name: 'Jane Smith', email: 'manager@example.com', role: 'Manager', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=2' },
        { id: 3, name: 'Bob Johnson', email: 'viewer@example.com', role: 'Viewer', status: 'Inactive', avatar: 'https://i.pravatar.cc/150?u=3' },
    ],
    products: [
        { id: 1, name: 'Premium Widget', category: 'Gadgets', price: 49.99, stock: 120, status: 'In Stock' },
        { id: 2, name: 'Super Gadget', category: 'Gadgets', price: 99.99, stock: 45, status: 'In Stock' },
        { id: 3, name: 'Standard Tool', category: 'Tools', price: 19.99, stock: 0, status: 'Out of Stock' },
    ],
    orders: [
        { id: 'ORD-1001', customer: 'John Doe', date: '2023-10-01', total: 149.97, status: 'Completed', items: [{ productId: 1, quantity: 3, price: 49.99 }] },
        { id: 'ORD-1002', customer: 'Jane Smith', date: '2023-10-05', total: 99.99, status: 'Processing', items: [{ productId: 2, quantity: 1, price: 99.99 }] },
        { id: 'ORD-1003', customer: 'Bob Johnson', date: '2023-10-10', total: 19.99, status: 'Pending', items: [{ productId: 3, quantity: 1, price: 19.99 }] },
    ],
    posts: [
        { id: 1, title: 'Welcome to our blog', content: '<p>This is the first post.</p>', author: 'Admin', date: '2023-10-01', status: 'Published' },
        { id: 2, title: 'New Features', content: '<p>Check out our latest features.</p>', author: 'Manager', date: '2023-10-15', status: 'Draft' },
    ],
    tickets: [
        { id: 'TKT-101', subject: 'Login issue', customer: 'Bob Johnson', priority: 'High', status: 'Open', lastUpdate: '2023-10-20 10:00', messages: [{ sender: 'Bob Johnson', text: 'I cannot login.', time: '2023-10-20 10:00' }] },
        { id: 'TKT-102', subject: 'Payment failed', customer: 'Jane Smith', priority: 'Medium', status: 'Closed', lastUpdate: '2023-10-21 14:00', messages: [{ sender: 'Jane Smith', text: 'My payment failed twice.', time: '2023-10-21 14:00' }, { sender: 'Admin', text: 'We have resolved the issue.', time: '2023-10-21 15:00' }] },
    ],
    auditLogs: [
        { id: 1, user: 'Admin', action: 'Login', module: 'Auth', timestamp: '2023-10-25 08:30:00', details: 'Successful login from IP 192.168.1.1' },
        { id: 2, user: 'Manager', action: 'Update Product', module: 'Products', timestamp: '2023-10-25 09:15:00', details: 'Updated stock for Premium Widget' },
    ],
    notifications: [
        { id: 1, title: 'New Order received', message: 'Order ORD-1003 has been placed.', time: '5 minutes ago', read: false, type: 'info' },
        { id: 2, title: 'Stock Alert', message: 'Standard Tool is out of stock.', time: '1 hour ago', read: true, type: 'warning' },
    ]
};

const DB = {
    init() {
        if (!localStorage.getItem('dashboard_db')) {
            localStorage.setItem('dashboard_db', JSON.stringify(SEED_DATA));
        }
    },
    get(key) {
        const data = JSON.parse(localStorage.getItem('dashboard_db'));
        return data[key] || [];
    },
    save(key, items) {
        const data = JSON.parse(localStorage.getItem('dashboard_db'));
        data[key] = items;
        localStorage.setItem('dashboard_db', JSON.stringify(data));
    },
    create(key, item) {
        const items = this.get(key);
        const newItem = { ...item, id: item.id || Date.now() };
        items.push(newItem);
        this.save(key, items);
        return newItem;
    },
    update(key, id, updatedItem) {
        const items = this.get(key);
        const index = items.findIndex(i => String(i.id) === String(id));
        if (index !== -1) {
            items[index] = { ...items[index], ...updatedItem };
            this.save(key, items);
            return items[index];
        }
        return null;
    },
    delete(key, id) {
        let items = this.get(key);
        items = items.filter(i => String(i.id) !== String(id));
        this.save(key, items);
    }
};

DB.init();
