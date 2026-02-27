/**
 * app.js - Core UI and application logic
 */

document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
    Theme.init();
    UI.init();
    Tables.init();
});

// --- Authentication ---
const Auth = {
    init() {
        const session = localStorage.getItem('dashboard_session');
        const isAuthPage = window.location.pathname.includes('login.html') ||
                           window.location.pathname.includes('register.html') ||
                           window.location.pathname.includes('forgot-password.html') ||
                           window.location.pathname.includes('reset-password.html') ||
                           window.location.pathname.includes('verify-email.html');

        if (!session && !isAuthPage) {
            window.location.href = 'login.html';
        } else if (session && isAuthPage) {
            window.location.href = 'dashboard.html';
        }
    },
    login(email, password) {
        // Mock login
        let role = 'Viewer';
        if (email.includes('admin')) role = 'Admin';
        else if (email.includes('manager')) role = 'Manager';

        const session = { email, role, token: 'mock-token-' + Date.now() };
        localStorage.setItem('dashboard_session', JSON.stringify(session));
        UI.toast('Welcome back!', 'success');
        setTimeout(() => window.location.href = 'dashboard.html', 1000);
    },
    logout() {
        localStorage.removeItem('dashboard_session');
        window.location.href = 'login.html';
    },
    getUser() {
        return JSON.parse(localStorage.getItem('dashboard_session'));
    }
};

// --- Theme & Appearance ---
const Theme = {
    init() {
        const dark = localStorage.getItem('theme_dark') === 'true';
        const accent = localStorage.getItem('theme_accent') || 'blue';
        this.setDarkMode(dark);
        this.setAccent(accent);

        // Bind theme toggles if they exist
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) themeBtn.onclick = () => this.toggleDarkMode();

        const accentPickers = document.querySelectorAll('.accent-picker');
        accentPickers.forEach(p => {
            p.onclick = () => this.setAccent(p.dataset.accent);
        });
    },
    setDarkMode(isDark) {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme_dark', isDark);
    },
    toggleDarkMode() {
        const isDark = !document.documentElement.classList.contains('dark');
        this.setDarkMode(isDark);
    },
    setAccent(color) {
        const colors = {
            blue: { primary: '#3b82f6', ring: 'rgba(59, 130, 246, 0.5)' },
            emerald: { primary: '#10b981', ring: 'rgba(16, 185, 129, 0.5)' },
            violet: { primary: '#8b5cf6', ring: 'rgba(139, 92, 246, 0.5)' }
        };
        const selected = colors[color] || colors.blue;
        document.documentElement.style.setProperty('--color-primary', selected.primary);
        document.documentElement.style.setProperty('--color-primary-ring', selected.ring);
        localStorage.setItem('theme_accent', color);

        // Update accent-specific classes in Tailwind can be tricky with CDN,
        // so we use CSS variables and custom classes.
        // We'll add a class to body for easier CSS targeting.
        document.body.classList.remove('accent-blue', 'accent-emerald', 'accent-violet');
        document.body.classList.add(`accent-${color}`);
    }
};

// --- UI Components ---
const UI = {
    init() {
        this.initSidebar();
        this.initDropdowns();
        this.initModals();
        this.initAccordions();
        this.initTabs();
        this.initTooltips();
        this.initCarousels();
    },

    initSidebar() {
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const sidebarClose = document.getElementById('sidebar-close');
        const overlay = document.getElementById('sidebar-overlay');

        if (sidebarToggle && sidebar) {
            sidebarToggle.onclick = () => {
                sidebar.classList.toggle('-translate-x-full');
                if (overlay) overlay.classList.toggle('hidden');
            };
        }

        if (sidebarClose && sidebar) {
            sidebarClose.onclick = () => {
                sidebar.classList.add('-translate-x-full');
                if (overlay) overlay.classList.add('hidden');
            };
        }

        if (overlay) {
            overlay.onclick = () => {
                sidebar.classList.add('-translate-x-full');
                overlay.classList.add('hidden');
            }
        }

        // Submenus
        const submenus = document.querySelectorAll('.sidebar-submenu-toggle');
        submenus.forEach(btn => {
            btn.onclick = () => {
                const sub = btn.nextElementSibling;
                const icon = btn.querySelector('.chevron-icon');
                sub.classList.toggle('hidden');
                if (icon) icon.classList.toggle('rotate-180');
            };
        });

        // Active link highlighting
        const currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';
        const navLinks = document.querySelectorAll('#sidebar a');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('bg-primary/10', 'text-primary', 'font-semibold');
                // Ensure parent submenu is open
                let parent = link.closest('.sidebar-submenu');
                if (parent) {
                    parent.classList.remove('hidden');
                    let toggle = parent.previousElementSibling;
                    if (toggle) {
                        let icon = toggle.querySelector('.chevron-icon');
                        if (icon) icon.classList.add('rotate-180');
                    }
                }
            }
        });
    },

    initDropdowns() {
        document.addEventListener('click', (e) => {
            const toggle = e.target.closest('.dropdown-toggle');
            const dropdown = toggle ? toggle.nextElementSibling : null;

            // Close all other dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (menu !== dropdown) menu.classList.add('hidden');
            });

            if (toggle && dropdown) {
                dropdown.classList.toggle('hidden');
                e.stopPropagation();
            } else {
                // Clicking elsewhere closes dropdowns
                document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.add('hidden'));
            }
        });
    },

    initModals() {
        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('[data-modal-target]');
            if (trigger) {
                const modalId = trigger.dataset.modalTarget;
                this.showModal(modalId);
            }

            const closer = e.target.closest('[data-modal-close]');
            if (closer) {
                const modal = closer.closest('.modal');
                if (modal) this.hideModal(modal.id);
            }

            // Close on overlay click
            if (e.target.classList.contains('modal')) {
                this.hideModal(e.target.id);
            }
        });

        // ESC key to close modal
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal:not(.hidden)');
                if (openModal) this.hideModal(openModal.id);
            }
        });
    },

    showModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            document.body.style.overflow = 'hidden';
            // Focus trap - basic implementation
            const focusables = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusables.length) focusables[0].focus();
        }
    },

    hideModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            document.body.style.overflow = '';
        }
    },

    toast(message, type = 'info') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'fixed bottom-4 right-4 z-[100] flex flex-col gap-2';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        const bg = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        }[type] || 'bg-gray-800';

        toast.className = `${bg} text-white px-4 py-3 rounded shadow-lg transition-all duration-300 transform translate-y-10 opacity-0 flex items-center justify-between min-w-[200px]`;
        toast.innerHTML = `
            <span>${message}</span>
            <button class="ml-4 hover:opacity-75" onclick="this.parentElement.remove()">&times;</button>
        `;

        container.appendChild(toast);
        setTimeout(() => {
            toast.classList.remove('translate-y-10', 'opacity-0');
        }, 10);

        setTimeout(() => {
            toast.classList.add('opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    initAccordions() {
        document.addEventListener('click', (e) => {
            const toggle = e.target.closest('.accordion-toggle');
            if (toggle) {
                const content = toggle.nextElementSibling;
                const icon = toggle.querySelector('.chevron-icon');
                content.classList.toggle('hidden');
                if (icon) icon.classList.toggle('rotate-180');
            }
        });
    },

    initTabs() {
        document.addEventListener('click', (e) => {
            const tabBtn = e.target.closest('.tab-btn');
            if (tabBtn) {
                const targetId = tabBtn.dataset.tabTarget;
                const parent = tabBtn.closest('.tabs-container');

                parent.querySelectorAll('.tab-btn').forEach(btn => {
                    btn.classList.remove('border-primary', 'text-primary');
                    btn.classList.add('border-transparent', 'text-gray-500');
                });
                tabBtn.classList.add('border-primary', 'text-primary');
                tabBtn.classList.remove('border-transparent', 'text-gray-500');

                parent.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
                document.getElementById(targetId).classList.remove('hidden');
            }
        });
    },

    initTooltips() {
        // Simple CSS-based tooltips are better for static.
        // But can be added via JS if needed.
    },

    initCarousels() {
        const carousels = document.querySelectorAll('.carousel');
        carousels.forEach(c => {
            const items = c.querySelectorAll('.carousel-item');
            let activeIndex = 0;
            const nextBtn = c.querySelector('.carousel-next');
            const prevBtn = c.querySelector('.carousel-prev');

            const update = () => {
                items.forEach((item, i) => {
                    item.classList.toggle('hidden', i !== activeIndex);
                });
            };

            if (nextBtn) nextBtn.onclick = () => {
                activeIndex = (activeIndex + 1) % items.length;
                update();
            };
            if (prevBtn) prevBtn.onclick = () => {
                activeIndex = (activeIndex - 1 + items.length) % items.length;
                update();
            };
        });
    }
};

// --- Table Utilities ---
const Tables = {
    init() {
        // Shared logic for sorting, filtering, etc.
        // Usually called per page but we can provide helpers.
    },
    render(containerId, data, columns, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Implementation of a dynamic table with search, sort, paginate
        // For static demo, we'll mostly use hardcoded markup in HTML
        // but provide JS helpers for the interactions.
    },
    exportCSV(filename, rows) {
        if (!rows.length) return;
        const keys = Object.keys(rows[0]);
        const csvContent = "data:text/csv;charset=utf-8,"
            + keys.join(",") + "\n"
            + rows.map(r => keys.map(k => r[k]).join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
