// PrintForge Pricing Calculator - Frontend JavaScript
// Updated: 2026-01-09 16:00

// Global Variables
let clients = [];
let editingClientId = null;
let quoteTemplates = [];
let editingTemplateId = null;

// Desktop Mode Detection
function isDesktopMode() {
    return window.pywebview !== undefined;
}

// Helper function to switch tabs programmatically
function switchToTab(tabName) {
    // Remove active class from all tabs and buttons
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

    // Add active class to the target tab
    const targetButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (targetButton) {
        targetButton.classList.add('active');
    }
    document.getElementById(`${tabName}-tab`).classList.add('active');

    // Populate settings UI when settings tab is opened
    if (tabName === 'settings') {
        populateSettingsUI();
    }

    // Load backup history when backups tab is opened
    if (tabName === 'backups') {
        loadBackupHistory();
    }

    // Show client form when clients tab is opened
    if (tabName === 'clients') {
        const formSection = document.getElementById('client-form-section');
        if (formSection) {
            formSection.style.display = 'block';
            document.getElementById('client-form-title').textContent = 'Add Client';

            // Clear form
            document.getElementById('client_name').value = '';
            document.getElementById('client_contact').value = '';
            document.getElementById('client_email').value = '';
            document.getElementById('client_phone').value = '';
            document.getElementById('client_address').value = '';
            document.getElementById('client_discount').value = '0';
            document.getElementById('client_notes').value = '';

            editingClientId = null;
        }
    }

    // Close sidebar on mobile
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    }
}

// Tab Switching
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        const tabName = button.getAttribute('data-tab');

        // Remove active class from all tabs and buttons
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

        // Add active class to clicked button and corresponding pane
        button.classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');

        // Populate settings UI when settings tab is opened
        if (tabName === 'settings') {
            populateSettingsUI();
        }

        // Close sidebar on mobile/when sidebar is open
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (sidebar && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        }
    });
});

// Hardware Table Management
function addHardwareRow() {
    const table = document.getElementById('hardware-table').getElementsByTagName('tbody')[0];
    const row = table.insertRow();
    
    row.innerHTML = `
        <td><input type="text" placeholder="Item name" class="hw-name"></td>
        <td><input type="number" value="1" step="1" min="0" class="hw-quantity" onchange="updateHardwareTotal(this)"></td>
        <td><input type="number" value="0.00" step="0.01" min="0" class="hw-cost" onchange="updateHardwareTotal(this)"></td>
        <td class="hw-total">$0.00</td>
        <td><button class="remove-btn" onclick="removeHardwareRow(this)">Remove</button></td>
    `;
    
    autoCalculate();
}

function removeHardwareRow(btn) {
    const row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
    autoCalculate();
}

function updateHardwareTotal(input) {
    const row = input.parentNode.parentNode;
    const quantity = parseFloat(row.querySelector('.hw-quantity').value) || 0;
    const cost = parseFloat(row.querySelector('.hw-cost').value) || 0;
    const total = quantity * cost;
    row.querySelector('.hw-total').textContent = `$${total.toFixed(2)}`;
    autoCalculate();
}

// Packaging Table Management
function addPackagingRow() {
    const table = document.getElementById('packaging-table').getElementsByTagName('tbody')[0];
    const row = table.insertRow();
    
    row.innerHTML = `
        <td><input type="text" placeholder="Item name" class="pkg-name"></td>
        <td><input type="number" value="1" step="1" min="0" class="pkg-quantity" onchange="updatePackagingTotal(this)"></td>
        <td><input type="number" value="0.00" step="0.01" min="0" class="pkg-cost" onchange="updatePackagingTotal(this)"></td>
        <td class="pkg-total">$0.00</td>
        <td><button class="remove-btn" onclick="removePackagingRow(this)">Remove</button></td>
    `;
    
    autoCalculate();
}

function removePackagingRow(btn) {
    const row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
    autoCalculate();
}

function updatePackagingTotal(input) {
    const row = input.parentNode.parentNode;
    const quantity = parseFloat(row.querySelector('.pkg-quantity').value) || 0;
    const cost = parseFloat(row.querySelector('.pkg-cost').value) || 0;
    const total = quantity * cost;
    row.querySelector('.pkg-total').textContent = `$${total.toFixed(2)}`;
    autoCalculate();
}

// Get Hardware Items
function getHardwareItems() {
    const items = [];
    document.querySelectorAll('#hardware-table tbody tr').forEach(row => {
        const name = row.querySelector('.hw-name').value;
        const quantity = parseFloat(row.querySelector('.hw-quantity').value) || 0;
        const unit_cost = parseFloat(row.querySelector('.hw-cost').value) || 0;
        
        if (name || quantity > 0 || unit_cost > 0) {
            items.push({ name, quantity, unit_cost });
        }
    });
    return items;
}

// Get Packaging Items
function getPackagingItems() {
    const items = [];
    document.querySelectorAll('#packaging-table tbody tr').forEach(row => {
        const name = row.querySelector('.pkg-name').value;
        const quantity = parseFloat(row.querySelector('.pkg-quantity').value) || 0;
        const unit_cost = parseFloat(row.querySelector('.pkg-cost').value) || 0;
        
        if (name || quantity > 0 || unit_cost > 0) {
            items.push({ name, quantity, unit_cost });
        }
    });
    return items;
}

// Collect Form Data
function collectFormData() {
    return {
        // Basic Info
        part_name: document.getElementById('part_name').value,
        revision: document.getElementById('revision').value,
        prepared_by: document.getElementById('prepared_by').value,
        material_type: document.getElementById('material_type').value,
        filament_cost: parseFloat(document.getElementById('filament_cost').value) || 0,
        filament_required: parseFloat(document.getElementById('filament_required').value) || 0,
        print_time: parseFloat(document.getElementById('print_time').value) || 0,
        labor_time: parseFloat(document.getElementById('labor_time').value) || 0,
        
        // Hardware & Packaging
        hardware_items: getHardwareItems(),
        packaging_items: getPackagingItems(),
        shipping_cost: parseFloat(document.getElementById('shipping_cost').value) || 0,
        
        // Advanced Settings
        printer_cost: parseFloat(document.getElementById('printer_cost').value) || 0,
        upfront_cost: parseFloat(document.getElementById('upfront_cost').value) || 0,
        annual_maintenance: parseFloat(document.getElementById('annual_maintenance').value) || 0,
        printer_life: parseFloat(document.getElementById('printer_life').value) || 0,
        average_uptime: parseFloat(document.getElementById('average_uptime').value) || 0,
        power_consumption: parseFloat(document.getElementById('power_consumption').value) || 0,
        electricity_rate: parseFloat(document.getElementById('electricity_rate').value) || 0,
        electricity_daily: parseFloat(document.getElementById('electricity_daily').value) || 0,
        efficiency_factor: parseFloat(document.getElementById('efficiency_factor').value) || 1,
        labor_rate: parseFloat(document.getElementById('labor_rate').value) || 0,
        custom_margin: parseFloat(document.getElementById('custom_margin').value) || 75,

        // Quote Notes
        quote_notes: document.getElementById('quote_notes')?.value || ''
    };
}

// Form Validation
function validateForm() {
    const errors = [];

    // Get form values
    const partName = document.getElementById('part_name').value.trim();
    const filamentCost = parseFloat(document.getElementById('filament_cost').value) || 0;
    const filamentRequired = parseFloat(document.getElementById('filament_required').value) || 0;
    const printTime = parseFloat(document.getElementById('print_time').value) || 0;

    // Clear previous validation states
    document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));

    // Validate required fields
    if (!partName) {
        errors.push({ field: 'part_name', message: 'Part name is required' });
    }

    // Validate numeric ranges
    if (filamentCost < 0) {
        errors.push({ field: 'filament_cost', message: 'Filament cost cannot be negative' });
    }

    if (filamentRequired < 0) {
        errors.push({ field: 'filament_required', message: 'Filament required cannot be negative' });
    }

    if (printTime < 0) {
        errors.push({ field: 'print_time', message: 'Print time cannot be negative' });
    }

    // Apply invalid class to fields with errors
    errors.forEach(error => {
        const field = document.getElementById(error.field);
        if (field) {
            field.classList.add('invalid');
        }
    });

    return errors;
}

// Calculate Pricing
async function calculate() {
    try {
        // Validate form first
        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            const errorMessage = validationErrors.map(e => e.message).join(', ');
            showMessage(`Validation Error: ${errorMessage}`, 'error');
            return;
        }

        const data = collectFormData();
        
        const response = await fetch('/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();

        if (result.success) {
            // Apply client discount if client selected
            const clientId = document.getElementById('selected_client')?.value;
            let discount = 0;
            let discountAmount = 0;
            if (clientId) {
                const client = clients.find(c => c.id === clientId);
                if (client && client.defaultDiscount) {
                    discount = client.defaultDiscount;
                    discountAmount = result.total_cost * (discount / 100);
                    result.total_cost = result.total_cost - discountAmount;
                    result.price_50 = result.price_50 - (result.price_50 * (discount / 100));
                    result.price_60 = result.price_60 - (result.price_60 * (discount / 100));
                    result.price_70 = result.price_70 - (result.price_70 * (discount / 100));
                    result.price_custom = result.price_custom - (result.price_custom * (discount / 100));
                }
            }

            // Update results
            document.getElementById('result_material_cost').textContent = `$${result.material_cost.toFixed(2)}`;
            document.getElementById('result_labor_cost').textContent = `$${result.labor_cost.toFixed(2)}`;
            document.getElementById('result_machine_cost').textContent =
                `$${result.machine_cost_total.toFixed(2)} (Depreciation: $${result.machine_depreciation.toFixed(2)} + Electricity: $${result.electricity_cost.toFixed(2)})`;
            document.getElementById('result_packaging_cost').textContent = `$${result.packaging_cost.toFixed(2)}`;

            // Show discount if applied
            let totalCostText = `$${result.total_cost.toFixed(2)}`;
            if (discount > 0) {
                totalCostText += ` <span style="color: var(--success-color); font-size: 0.875rem;">(${discount}% discount applied: -$${discountAmount.toFixed(2)})</span>`;
                // Show discount in cost breakdown
                document.getElementById('result_discount_item').style.display = 'block';
                document.getElementById('result_discount').textContent = `-$${discountAmount.toFixed(2)} (${discount}%)`;
            } else {
                document.getElementById('result_discount_item').style.display = 'none';
            }
            document.getElementById('result_total_cost').innerHTML = totalCostText;

            document.getElementById('result_price_50').textContent = `$${result.price_50.toFixed(2)}`;
            document.getElementById('result_price_60').textContent = `$${result.price_60.toFixed(2)}`;
            document.getElementById('result_price_70').textContent = `$${result.price_70.toFixed(2)}`;
            document.getElementById('result_price_custom').textContent = `$${result.price_custom.toFixed(2)}`;

            document.getElementById('cost_per_hour').value = `$${result.cost_per_hour.toFixed(4)} /hour`;

            // Update Quick Summary Card
            updateQuickSummary(result, discount, discountAmount);

            // Check price alert
            checkPriceAlert(result);

            // Add to history
            addToHistory({
                partName: data.part_name,
                material: data.material_type,
                weight: data.filament_required,
                printTime: data.print_time,
                totalCost: result.total_cost,
                materialCost: result.material_cost,
                laborCost: result.labor_cost,
                machineCost: result.machine_cost_total,
                packagingCost: result.packaging_cost,
                notes: data.quote_notes
            });

            // Update client stats if client selected
            updateClientQuoteStats(result.total_cost);

            showMessage('Calculation complete!', 'success');
        } else {
            showMessage('Calculation failed: ' + result.error, 'error');
        }
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
}

// Auto-calculate after short delay
let autoCalcTimeout;
function autoCalculate() {
    clearTimeout(autoCalcTimeout);
    autoCalcTimeout = setTimeout(() => {
        calculate();
    }, 500);
}

// Add auto-calculate to all inputs
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input, select').forEach(input => {
        // Exclude file inputs and client selector (has its own handler)
        if (!input.id || (input.id !== 'load-file' && input.id !== 'selected_client')) {
            input.addEventListener('input', autoCalculate);
        }
    });

    // Initial calculation removed - no need to calculate on page load
    // calculate();
});

// Save Configuration
async function saveConfig() {
    try {
        const config = collectFormData();
        const defaultFilename = `${config.part_name.replace(/ /g, '_')}_config.json`;

        // Desktop mode: use native file dialog
        if (isDesktopMode()) {
            const filepath = await window.pywebview.api.save_file_dialog(
                defaultFilename,
                'JSON Files (*.json)'
            );

            if (!filepath) {
                // User cancelled
                return;
            }

            const response = await fetch('/save-file-to-path', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    filepath: filepath,
                    content: JSON.stringify(config, null, 2),
                    content_type: 'json'
                })
            });

            const result = await response.json();
            if (result.success) {
                showMessage('Configuration saved!', 'success');
            } else {
                showMessage('Save failed: ' + result.error, 'error');
            }
        } else {
            // Web mode: use browser download
            const response = await fetch('/save-config', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ filename: defaultFilename, config })
            });

            const result = await response.json();

            if (result.success) {
                // Trigger download
                const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = defaultFilename;
                a.click();
                URL.revokeObjectURL(url);

                showMessage('Configuration saved!', 'success');
            } else {
                showMessage('Save failed: ' + result.error, 'error');
            }
        }
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
}

// Load Configuration
async function loadConfig(event) {
    try {
        const file = event.target.files[0];
        if (!file) return;
        
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/load-config', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            const config = result.config;
            
            // Load basic info
            if (config.part_name) document.getElementById('part_name').value = config.part_name;
            if (config.revision) document.getElementById('revision').value = config.revision;
            if (config.prepared_by) document.getElementById('prepared_by').value = config.prepared_by;
            if (config.material_type) document.getElementById('material_type').value = config.material_type;
            if (config.filament_cost !== undefined) document.getElementById('filament_cost').value = config.filament_cost;
            if (config.filament_required !== undefined) document.getElementById('filament_required').value = config.filament_required;
            if (config.print_time !== undefined) document.getElementById('print_time').value = config.print_time;
            if (config.labor_time !== undefined) document.getElementById('labor_time').value = config.labor_time;
            
            // Load hardware items
            const hardwareTable = document.getElementById('hardware-table').getElementsByTagName('tbody')[0];
            hardwareTable.innerHTML = '';
            if (config.hardware_items) {
                config.hardware_items.forEach(item => {
                    addHardwareRow();
                    const rows = hardwareTable.getElementsByTagName('tr');
                    const lastRow = rows[rows.length - 1];
                    lastRow.querySelector('.hw-name').value = item.name || '';
                    lastRow.querySelector('.hw-quantity').value = item.quantity || 0;
                    lastRow.querySelector('.hw-cost').value = item.unit_cost || 0;
                    updateHardwareTotal(lastRow.querySelector('.hw-quantity'));
                });
            }
            
            // Load packaging items
            const packagingTable = document.getElementById('packaging-table').getElementsByTagName('tbody')[0];
            packagingTable.innerHTML = '';
            if (config.packaging_items) {
                config.packaging_items.forEach(item => {
                    addPackagingRow();
                    const rows = packagingTable.getElementsByTagName('tr');
                    const lastRow = rows[rows.length - 1];
                    lastRow.querySelector('.pkg-name').value = item.name || '';
                    lastRow.querySelector('.pkg-quantity').value = item.quantity || 0;
                    lastRow.querySelector('.pkg-cost').value = item.unit_cost || 0;
                    updatePackagingTotal(lastRow.querySelector('.pkg-quantity'));
                });
            }
            
            if (config.shipping_cost !== undefined) document.getElementById('shipping_cost').value = config.shipping_cost;
            
            // Load advanced settings
            if (config.printer_cost !== undefined) document.getElementById('printer_cost').value = config.printer_cost;
            if (config.upfront_cost !== undefined) document.getElementById('upfront_cost').value = config.upfront_cost;
            if (config.annual_maintenance !== undefined) document.getElementById('annual_maintenance').value = config.annual_maintenance;
            if (config.printer_life !== undefined) document.getElementById('printer_life').value = config.printer_life;
            if (config.average_uptime !== undefined) document.getElementById('average_uptime').value = config.average_uptime;
            if (config.power_consumption !== undefined) document.getElementById('power_consumption').value = config.power_consumption;
            if (config.electricity_rate !== undefined) document.getElementById('electricity_rate').value = config.electricity_rate;
            if (config.electricity_daily !== undefined) document.getElementById('electricity_daily').value = config.electricity_daily;
            if (config.efficiency_factor !== undefined) document.getElementById('efficiency_factor').value = config.efficiency_factor;
            if (config.labor_rate !== undefined) document.getElementById('labor_rate').value = config.labor_rate;
            if (config.custom_margin !== undefined) document.getElementById('custom_margin').value = config.custom_margin;
            
            showMessage('Configuration loaded!', 'success');
            calculate();
        } else {
            showMessage('Load failed: ' + result.error, 'error');
        }
        
        // Reset file input
        event.target.value = '';
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
}

// Export to Excel
async function exportToExcel() {
    try {
        const data = collectFormData();

        // Add results to data
        const results = {
            material_cost: parseFloat(document.getElementById('result_material_cost').textContent.replace('$', '')) || 0,
            labor_cost: parseFloat(document.getElementById('result_labor_cost').textContent.replace('$', '')) || 0,
            machine_cost_total: parseFloat(document.getElementById('result_machine_cost').textContent.split('$')[1].split(' ')[0]) || 0,
            packaging_cost: parseFloat(document.getElementById('result_packaging_cost').textContent.replace('$', '')) || 0,
            total_cost: parseFloat(document.getElementById('result_total_cost').textContent.replace('$', '')) || 0,
            price_50: parseFloat(document.getElementById('result_price_50').textContent.replace('$', '')) || 0,
            price_60: parseFloat(document.getElementById('result_price_60').textContent.replace('$', '')) || 0,
            price_70: parseFloat(document.getElementById('result_price_70').textContent.replace('$', '')) || 0,
            price_custom: parseFloat(document.getElementById('result_price_custom').textContent.replace('$', '')) || 0,
            custom_margin: parseFloat(document.getElementById('custom_margin').value) || 75
        };

        data.results = results;

        const defaultFilename = `${data.part_name.replace(/ /g, '_')}_Pricing.xlsx`;

        // Desktop mode: use native file dialog
        if (isDesktopMode()) {
            const filepath = await window.pywebview.api.save_file_dialog(
                defaultFilename,
                'Excel Files (*.xlsx)'
            );

            if (!filepath) {
                // User cancelled
                return;
            }

            const response = await fetch('/export-excel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const blob = await response.blob();
                const arrayBuffer = await blob.arrayBuffer();
                const bytes = new Uint8Array(arrayBuffer);

                // Convert to base64 for transmission
                let binary = '';
                for (let i = 0; i < bytes.length; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                const base64 = btoa(binary);

                const saveResponse = await fetch('/save-file-to-path', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        filepath: filepath,
                        content: base64,
                        content_type: 'excel'
                    })
                });

                const result = await saveResponse.json();
                if (result.success) {
                    showMessage('Excel file exported!', 'success');
                } else {
                    showMessage('Export failed: ' + result.error, 'error');
                }
            } else {
                const result = await response.json();
                showMessage('Export failed: ' + result.error, 'error');
            }
        } else {
            // Web mode: use browser download
            const response = await fetch('/export-excel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = defaultFilename;
                a.click();
                URL.revokeObjectURL(url);

                showMessage('Excel file exported!', 'success');
            } else {
                const result = await response.json();
                showMessage('Export failed: ' + result.error, 'error');
            }
        }
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
}

// Show Message
function showMessage(text, type) {
    const div = document.createElement('div');
    div.className = type === 'success' ? 'success-message' : 'error-message';
    div.textContent = text;
    document.body.appendChild(div);

    setTimeout(() => {
        div.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => div.remove(), 300);
    }, 3000);
}

// Theme Toggle
const htmlElement = document.documentElement;

// SVG Icons
const moonIcon = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
const sunIcon = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';

// Load saved theme or detect system preference
function getInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }

    // Detect system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
    }

    return 'dark';
}

// Set theme
function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// Listen for system theme changes
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

// Calculate and navigate to Results tab
function calculateAndShowResults() {
    calculate();
    // Navigate to Results tab
    setTimeout(() => {
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
        document.querySelector('.tab-button[data-tab="results"]').classList.add('active');
        document.getElementById('results-tab').classList.add('active');
    }, 100);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    setTheme(getInitialTheme());
    loadSettings();
    loadCustomPresets(); // Load custom material presets
    loadPrintProfiles(); // Load print profiles
    loadHistory(); // Load quote history
    loadClients(); // Load client management
    loadTemplates(); // Load quote templates
    loadBackupSettings(); // Load backup settings and backup history
    addBatchRow(); // Initialize batch with one row

    // Setup sidebar theme toggle
    const sidebarThemeToggle = document.getElementById('sidebarThemeToggle');
    if (sidebarThemeToggle) {
        sidebarThemeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
            updateSidebarThemeButton(newTheme);
        });
    }

    // Update sidebar theme button on load
    updateSidebarThemeButton(getInitialTheme());
});

// Update sidebar theme button text
function updateSidebarThemeButton(theme) {
    const sidebarThemeText = document.getElementById('sidebarThemeText');
    if (sidebarThemeText) {
        sidebarThemeText.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    }
}

// Quick Summary Card Functions
function updateQuickSummary(result, discount = 0, discountAmount = 0) {
    document.getElementById('summary_total_cost').textContent = `NZD $${result.total_cost.toFixed(2)}`;
    document.getElementById('summary_recommended_price').textContent = `NZD $${result.price_70.toFixed(2)}`;
    document.getElementById('summary_materials').textContent = `NZD $${result.material_cost.toFixed(2)}`;
    document.getElementById('summary_labor').textContent = `NZD $${result.labor_cost.toFixed(2)}`;
    document.getElementById('summary_machine').textContent = `NZD $${result.machine_cost_total.toFixed(2)}`;
    document.getElementById('summary_packaging').textContent = `NZD $${result.packaging_cost.toFixed(2)}`;

    // Show/hide discount
    if (discount > 0) {
        document.getElementById('summary_discount_item').style.display = 'block';
        document.getElementById('summary_discount').textContent = `-NZD $${discountAmount.toFixed(2)} (${discount}%)`;
    } else {
        document.getElementById('summary_discount_item').style.display = 'none';
    }
}

function toggleSummary() {
    const content = document.getElementById('summary-content');
    const btn = document.querySelector('.collapse-btn');

    if (content.style.display === 'none') {
        content.style.display = 'block';
        btn.textContent = '−';
    } else {
        content.style.display = 'none';
        btn.textContent = '+';
    }
}

// ============================================================================
// SETTINGS MANAGEMENT
// ============================================================================

const defaultSettings = {
    regional: {
        location: 'Christchurch, NZ',
        currency: 'NZD'
    },
    display: {
        units: 'metric', // 'metric' or 'imperial'
        decimalPlaces: 2,
        showBreakdowns: true,
        autoCalculate: true
    },
    export: {
        companyName: '',
        defaultFilename: 'printforge_quote'
    }
};

let appSettings = { ...defaultSettings };

// Load settings from localStorage
function loadSettings() {
    const saved = localStorage.getItem('printforge_settings');
    if (saved) {
        try {
            appSettings = JSON.parse(saved);
            // Merge with defaults to ensure new settings are present
            appSettings = {
                regional: { ...defaultSettings.regional, ...appSettings.regional },
                display: { ...defaultSettings.display, ...appSettings.display },
                export: { ...defaultSettings.export, ...appSettings.export }
            };
        } catch (e) {
            console.error('Failed to load settings:', e);
            appSettings = { ...defaultSettings };
        }
    }
    return appSettings;
}

// Save settings to localStorage
function saveSettings() {
    localStorage.setItem('printforge_settings', JSON.stringify(appSettings));
    showMessage('Settings saved successfully', 'success');
}

// Reset settings to defaults
function resetSettings() {
    if (confirm('Reset all settings to defaults? This cannot be undone.')) {
        appSettings = { ...defaultSettings };
        localStorage.setItem('printforge_settings', JSON.stringify(appSettings));
        populateSettingsUI();
        showMessage('Settings reset to defaults', 'success');
    }
}

// Toggle navigation sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    } else {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    }
}

// Populate settings UI with current values (called when Settings tab is opened)
function populateSettingsUI() {
    // Regional
    document.getElementById('setting_location').value = appSettings.regional.location;
    document.getElementById('setting_currency').value = appSettings.regional.currency;

    // Display
    document.getElementById('setting_units').value = appSettings.display.units;
    document.getElementById('setting_decimal_places').value = appSettings.display.decimalPlaces;
    document.getElementById('setting_auto_calculate').checked = appSettings.display.autoCalculate;

    // Export
    document.getElementById('setting_company_name').value = appSettings.export.companyName;

    // Price Alerts
    document.getElementById('setting_price_threshold').value = appSettings.priceThreshold || '';
}

// Apply settings from UI
function applySettings() {
    // Regional
    appSettings.regional.location = document.getElementById('setting_location').value;
    appSettings.regional.currency = document.getElementById('setting_currency').value;

    // Display
    appSettings.display.units = document.getElementById('setting_units').value;
    appSettings.display.decimalPlaces = parseInt(document.getElementById('setting_decimal_places').value);
    appSettings.display.autoCalculate = document.getElementById('setting_auto_calculate').checked;

    // Export
    appSettings.export.companyName = document.getElementById('setting_company_name').value;

    // Price Alerts
    const threshold = document.getElementById('setting_price_threshold').value;
    appSettings.priceThreshold = threshold ? parseFloat(threshold) : null;

    saveSettings();
    showMessage('Settings saved successfully!', 'success');
}

// ============================================================================
// MATERIAL PRESETS
// ============================================================================

let customMaterialPresets = [];
let editingPresetId = null;

// System presets mapping
const systemPresets = {
    'preset-system-pla': { material: 'PLA', cost: 40.00 },
    'preset-system-petg': { material: 'PETG', cost: 55.00 },
    'preset-system-abs': { material: 'ABS', cost: 50.00 },
    'preset-system-tpu': { material: 'TPU', cost: 75.00 },
    'preset-system-nylon': { material: 'Nylon', cost: 80.00 }
};

// Load custom presets from localStorage
function loadCustomPresets() {
    const saved = localStorage.getItem('printforge_material_presets');
    if (saved) {
        try {
            customMaterialPresets = JSON.parse(saved);
        } catch (e) {
            console.error('Failed to load custom presets:', e);
            customMaterialPresets = [];
        }
    }
    populateUserPresetsInDropdown();
}

// Save custom presets to localStorage
function saveCustomPresets() {
    localStorage.setItem('printforge_material_presets', JSON.stringify(customMaterialPresets));
}

// Handle material type selection
function handleMaterialSelection() {
    const select = document.getElementById('material_type');
    const value = select.value;

    if (value === '_add_preset') {
        // Open modal to create custom preset
        openMaterialPresetModal();
        // Reset to previous value (PLA default)
        select.value = 'PLA';
        return;
    }

    // Check if it's a system preset
    if (value.startsWith('preset-system-')) {
        const preset = systemPresets[value];
        if (preset) {
            document.getElementById('filament_cost').value = preset.cost.toFixed(2);
            showMessage(`Applied ${preset.material} preset - NZD $${preset.cost.toFixed(2)}/kg`, 'success');
            autoCalculate();
        }
        return;
    }

    // Check if it's a user preset
    if (value.startsWith('preset-user-')) {
        const presetId = value.replace('preset-user-', '');
        const preset = customMaterialPresets.find(p => p.id === presetId);
        if (preset) {
            document.getElementById('filament_cost').value = preset.cost.toFixed(2);
            showMessage(`Applied "${preset.name}" - NZD $${preset.cost.toFixed(2)}/kg`, 'success');
            autoCalculate();
        }
        return;
    }

    // Regular material selection - do nothing special
}

// Populate user presets in the material type dropdown
function populateUserPresetsInDropdown() {
    const userGroup = document.getElementById('user-presets-group');

    // Clear existing user presets
    userGroup.innerHTML = '<!-- User presets populated dynamically -->';

    if (customMaterialPresets.length === 0) {
        const option = document.createElement('option');
        option.disabled = true;
        option.textContent = 'No custom presets yet';
        userGroup.appendChild(option);
        return;
    }

    customMaterialPresets.forEach(preset => {
        const option = document.createElement('option');
        option.value = `preset-user-${preset.id}`;
        option.setAttribute('data-cost', preset.cost);
        option.textContent = `${preset.name} - ${preset.material} @ NZD $${preset.cost.toFixed(2)}/kg`;

        // Add delete icon in the text (user can right-click to manage)
        option.title = `${preset.supplier || 'Custom'} - Right-click in form to manage`;

        userGroup.appendChild(option);
    });
}

// Open material preset modal
function openMaterialPresetModal(presetId = null) {
    editingPresetId = presetId;

    if (presetId) {
        const preset = customMaterialPresets.find(p => p.id === presetId);
        if (preset) {
            document.getElementById('material-preset-title').textContent = 'Edit Material Preset';
            document.getElementById('preset_name').value = preset.name;
            document.getElementById('preset_material').value = preset.material;
            document.getElementById('preset_cost').value = preset.cost;
            document.getElementById('preset_supplier').value = preset.supplier || '';
        }
    } else {
        document.getElementById('material-preset-title').textContent = 'Add Material Preset';
        document.getElementById('preset_name').value = '';
        document.getElementById('preset_material').value = '';
        document.getElementById('preset_cost').value = '';
        document.getElementById('preset_supplier').value = '';
    }

    // Close preset manager if open
    closePresetManager();

    document.getElementById('material-preset-modal').style.display = 'flex';
}

// Close material preset modal
function closeMaterialPresetModal() {
    document.getElementById('material-preset-modal').style.display = 'none';
    editingPresetId = null;
}

// Save material preset
function saveMaterialPreset() {
    const name = document.getElementById('preset_name').value.trim();
    const material = document.getElementById('preset_material').value.trim();
    const cost = parseFloat(document.getElementById('preset_cost').value);
    const supplier = document.getElementById('preset_supplier').value.trim() || 'Custom';

    if (!name || !material || !cost || cost <= 0) {
        showMessage('Please fill in all required fields with valid values', 'error');
        return;
    }

    if (editingPresetId) {
        // Edit existing preset
        const preset = customMaterialPresets.find(p => p.id === editingPresetId);
        if (preset) {
            preset.name = name;
            preset.material = material;
            preset.cost = cost;
            preset.supplier = supplier;
            showMessage(`Preset "${name}" updated successfully`, 'success');
        }
    } else {
        // Create new preset
        const preset = {
            id: `${Date.now()}`,
            name,
            material,
            cost,
            supplier
        };
        customMaterialPresets.push(preset);
        showMessage(`Preset "${name}" saved successfully`, 'success');
    }

    saveCustomPresets();
    populateUserPresetsInDropdown();
    updatePresetManagerTable();
    closeMaterialPresetModal();

    // Re-open preset manager if we were editing from there
    if (editingPresetId) {
        setTimeout(() => openPresetManager(), 100);
    }
}

// Delete material preset (called from context menu or management interface)
function deleteMaterialPreset(presetId) {
    const preset = customMaterialPresets.find(p => p.id === presetId);

    if (preset && confirm(`Delete preset "${preset.name}"?`)) {
        customMaterialPresets = customMaterialPresets.filter(p => p.id !== presetId);
        saveCustomPresets();
        populateUserPresetsInDropdown();
        updatePresetManagerTable();
        showMessage(`Preset "${preset.name}" deleted`, 'info');
    }
}

// Open preset manager modal
function openPresetManager() {
    updatePresetManagerTable();
    document.getElementById('preset-manager-modal').style.display = 'flex';
}

// Close preset manager modal
function closePresetManager() {
    document.getElementById('preset-manager-modal').style.display = 'none';
}

// Update preset manager table
function updatePresetManagerTable() {
    const tbody = document.getElementById('preset-manager-tbody');

    if (!tbody) return;

    if (customMaterialPresets.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No custom presets yet. Click "Add New Preset" to create one.</td></tr>';
        return;
    }

    tbody.innerHTML = customMaterialPresets.map(preset => `
        <tr>
            <td><strong>${preset.name}</strong></td>
            <td>${preset.material}</td>
            <td>NZD $${preset.cost.toFixed(2)}/kg</td>
            <td>${preset.supplier || 'Custom'}</td>
            <td>
                <button class="btn btn-sm" onclick="openMaterialPresetModal('${preset.id}')">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteMaterialPreset('${preset.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

// ============================================================================
// BATCH QUOTE MODE
// ============================================================================

let batchQuotes = [];
let batchRowId = 0;

// Add a new row to the batch table
function addBatchRow() {
    const tbody = document.getElementById('batch-tbody');
    const rowId = ++batchRowId;

    const row = document.createElement('tr');
    row.id = `batch-row-${rowId}`;
    row.dataset.rowId = rowId;

    row.innerHTML = `
        <td class="batch-row-number">${rowId}</td>
        <td><input type="text" class="batch-input" id="batch-name-${rowId}" placeholder="Part ${rowId}" /></td>
        <td>
            <select class="batch-input" id="batch-material-${rowId}">
                <option value="PLA">PLA</option>
                <option value="PLA+">PLA+</option>
                <option value="PETG">PETG</option>
                <option value="ABS">ABS</option>
                <option value="TPU">TPU</option>
                <option value="Nylon">Nylon</option>
                <option value="PC">PC</option>
                <option value="ASA">ASA</option>
            </select>
        </td>
        <td><input type="number" class="batch-input" id="batch-weight-${rowId}" placeholder="50" min="0" step="0.1" /></td>
        <td><input type="number" class="batch-input" id="batch-time-${rowId}" placeholder="2.5" min="0" step="0.1" /></td>
        <td><input type="number" class="batch-input" id="batch-qty-${rowId}" placeholder="1" min="1" value="1" /></td>
        <td class="batch-cost" id="batch-cost-${rowId}">-</td>
        <td class="batch-actions">
            <button class="btn-icon" onclick="duplicateBatchRow(${rowId})" title="Duplicate">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
            </button>
            <button class="btn-icon btn-delete" onclick="deleteBatchRow(${rowId})" title="Delete">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
            </button>
        </td>
    `;

    tbody.appendChild(row);
    renumberBatchRows();
}

// Duplicate a batch row
function duplicateBatchRow(rowId) {
    const sourceRow = document.getElementById(`batch-row-${rowId}`);
    if (!sourceRow) return;

    addBatchRow();
    const newRowId = batchRowId;

    // Copy values from source row
    const fields = ['name', 'material', 'weight', 'time', 'qty'];
    fields.forEach(field => {
        const sourceEl = document.getElementById(`batch-${field}-${rowId}`);
        const targetEl = document.getElementById(`batch-${field}-${newRowId}`);
        if (sourceEl && targetEl) {
            targetEl.value = sourceEl.value;
        }
    });

    showMessage('Row duplicated', 'success');
}

// Delete a batch row
function deleteBatchRow(rowId) {
    const row = document.getElementById(`batch-row-${rowId}`);
    if (row) {
        row.remove();
        renumberBatchRows();
        updateBatchTotals();
        showMessage('Row deleted', 'info');
    }
}

// Renumber batch rows after deletion
function renumberBatchRows() {
    const rows = document.querySelectorAll('#batch-tbody tr');
    rows.forEach((row, index) => {
        const numberCell = row.querySelector('.batch-row-number');
        if (numberCell) {
            numberCell.textContent = index + 1;
        }
    });
}

// Clear all batch quotes
function clearBatchQuotes() {
    if (confirm('Clear all batch quotes? This cannot be undone.')) {
        document.getElementById('batch-tbody').innerHTML = '';
        batchQuotes = [];
        batchRowId = 0;
        updateBatchTotals();
        showMessage('Batch cleared', 'info');
    }
}

// Calculate all batch quotes
function calculateBatchQuotes() {
    const rows = document.querySelectorAll('#batch-tbody tr');
    if (rows.length === 0) {
        showMessage('No parts in batch. Click "Add Part" to get started.', 'error');
        return;
    }

    batchQuotes = [];
    let hasErrors = false;

    rows.forEach(row => {
        const rowId = row.dataset.rowId;

        const partName = document.getElementById(`batch-name-${rowId}`).value || `Part ${rowId}`;
        const material = document.getElementById(`batch-material-${rowId}`).value;
        const weight = parseFloat(document.getElementById(`batch-weight-${rowId}`).value) || 0;
        const printTime = parseFloat(document.getElementById(`batch-time-${rowId}`).value) || 0;
        const quantity = parseInt(document.getElementById(`batch-qty-${rowId}`).value) || 1;

        if (weight <= 0 || printTime <= 0) {
            document.getElementById(`batch-cost-${rowId}`).textContent = 'Invalid';
            document.getElementById(`batch-cost-${rowId}`).style.color = '#ff4d4f';
            hasErrors = true;
            return;
        }

        // Calculate using current settings
        const cost = calculateBatchPartCost(weight, printTime, quantity);

        batchQuotes.push({
            rowId,
            partName,
            material,
            weight,
            printTime,
            quantity,
            unitCost: cost / quantity,
            totalCost: cost
        });

        document.getElementById(`batch-cost-${rowId}`).textContent = `NZD $${cost.toFixed(2)}`;
        document.getElementById(`batch-cost-${rowId}`).style.color = 'var(--text-primary)';
    });

    if (hasErrors) {
        showMessage('Some rows have invalid data. Please check weight and print time values.', 'error');
    } else {
        showMessage(`Calculated ${batchQuotes.length} parts successfully`, 'success');
    }

    updateBatchTotals();
}

// Calculate cost for a single batch part
function calculateBatchPartCost(weight, printTime, quantity) {
    // Get current form values for calculation
    const filamentCost = parseFloat(document.getElementById('filament_cost').value) || 40;
    const laborRate = parseFloat(document.getElementById('labor_rate').value) || 20;
    const printerCost = parseFloat(document.getElementById('printer_cost').value) || 1000;
    const upfrontCost = parseFloat(document.getElementById('upfront_cost').value) || 0;
    const annualMaintenance = parseFloat(document.getElementById('annual_maintenance').value) || 75;
    const printerLife = parseFloat(document.getElementById('printer_life').value) || 3;
    const avgUptime = parseFloat(document.getElementById('average_uptime').value) || 50;
    const powerConsumption = parseFloat(document.getElementById('power_consumption').value) || 250;
    const electricityRate = parseFloat(document.getElementById('electricity_rate').value) || 0.30;
    const packagingCost = parseFloat(document.getElementById('packaging_cost').value) || 0;

    // Material cost
    const materialCost = (weight / 1000) * filamentCost;

    // Labor cost
    const laborCost = printTime * laborRate;

    // Machine cost
    const totalMachineCost = printerCost + upfrontCost;
    const totalLifetimeHours = (printerLife * 365 * 24 * (avgUptime / 100));
    const depreciationPerHour = totalMachineCost / totalLifetimeHours;
    const maintenancePerHour = annualMaintenance / (365 * 24 * (avgUptime / 100));
    const costPerHour = depreciationPerHour + maintenancePerHour;
    const machineCost = printTime * costPerHour;

    // Electricity cost
    const electricityCost = ((powerConsumption / 1000) * printTime) * electricityRate;

    // Total cost per unit
    const unitCost = materialCost + laborCost + machineCost + electricityCost + packagingCost;

    // Total cost for quantity
    return unitCost * quantity;
}

// Update batch totals
function updateBatchTotals() {
    let totalQty = 0;
    let totalCost = 0;

    batchQuotes.forEach(quote => {
        totalQty += quote.quantity;
        totalCost += quote.totalCost;
    });

    document.getElementById('batch-total-qty').textContent = totalQty;
    document.getElementById('batch-total-cost').textContent = `NZD $${totalCost.toFixed(2)}`;
}

// Export batch to Excel
function exportBatchToExcel() {
    if (batchQuotes.length === 0) {
        showMessage('No calculated quotes to export. Calculate batch first.', 'error');
        return;
    }

    // TODO: Implement Excel export for batch quotes
    showMessage('Batch Excel export coming soon!', 'info');
}

// Export batch to PDF
function exportBatchToPDF() {
    if (batchQuotes.length === 0) {
        showMessage('No calculated quotes to export. Calculate batch first.', 'error');
        return;
    }

    // TODO: Implement PDF export for batch quotes
    showMessage('Batch PDF export coming soon!', 'info');
}

// (Batch initialization moved to main DOMContentLoaded listener)

// ============================================================================
// PRINT PROFILE TEMPLATES
// ============================================================================

let printProfiles = [];

// Load profiles from localStorage
function loadPrintProfiles() {
    const saved = localStorage.getItem('printforge_profiles');
    if (saved) {
        try {
            printProfiles = JSON.parse(saved);
        } catch (e) {
            console.error('Failed to load profiles:', e);
            printProfiles = [];
        }
    }

    // Add default profiles if none exist
    if (printProfiles.length === 0) {
        printProfiles = [
            {
                id: 'default-budget',
                name: 'Budget Printer',
                description: 'Entry-level printer setup',
                settings: {
                    printer_cost: 300,
                    upfront_cost: 0,
                    annual_maintenance: 50,
                    printer_life: 2,
                    average_uptime: 40,
                    power_consumption: 200,
                    electricity_rate: 0.30,
                    labor_rate: 15
                },
                isDefault: true
            },
            {
                id: 'default-pro',
                name: 'Professional Setup',
                description: 'Mid-range professional printer',
                settings: {
                    printer_cost: 1500,
                    upfront_cost: 200,
                    annual_maintenance: 150,
                    printer_life: 4,
                    average_uptime: 60,
                    power_consumption: 300,
                    electricity_rate: 0.30,
                    labor_rate: 25
                },
                isDefault: true
            },
            {
                id: 'default-production',
                name: 'High-End Production',
                description: 'Industrial-grade production setup',
                settings: {
                    printer_cost: 5000,
                    upfront_cost: 1000,
                    annual_maintenance: 500,
                    printer_life: 5,
                    average_uptime: 80,
                    power_consumption: 400,
                    electricity_rate: 0.30,
                    labor_rate: 35
                },
                isDefault: true
            }
        ];
        savePrintProfiles();
    }

    return printProfiles;
}

// Save profiles to localStorage
function savePrintProfiles() {
    localStorage.setItem('printforge_profiles', JSON.stringify(printProfiles));
}

// Open profile manager modal
function openProfileManager() {
    const modal = document.getElementById('profile-modal');
    if (!modal) {
        createProfileModal();
    }

    populateProfileList();
    document.getElementById('profile-modal').style.display = 'flex';
}

// Close profile manager modal
function closeProfileManager() {
    document.getElementById('profile-modal').style.display = 'none';
}

// Create profile modal HTML
function createProfileModal() {
    const modalHTML = `
        <div id="profile-modal" class="modal" style="display: none;">
            <div class="modal-content profile-modal-content">
                <div class="modal-header">
                    <h2>Print Profile Manager</h2>
                    <button class="close-btn" onclick="closeProfileManager()">✕</button>
                </div>

                <div class="modal-body">
                    <div class="profile-list" id="profile-list">
                        <!-- Profiles will be populated here -->
                    </div>

                    <div class="profile-actions">
                        <button class="btn btn-primary" onclick="saveCurrentAsProfile()">
                            💾 Save Current as New Profile
                        </button>
                        <button class="btn btn-secondary" onclick="exportProfiles()">
                            📤 Export All Profiles
                        </button>
                        <button class="btn btn-secondary" onclick="document.getElementById('import-profiles-file').click()">
                            📥 Import Profiles
                        </button>
                        <input type="file" id="import-profiles-file" accept=".json" style="display: none;" onchange="importProfiles(event)">
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Close modal when clicking outside
    document.getElementById('profile-modal').addEventListener('click', (e) => {
        if (e.target.id === 'profile-modal') {
            closeProfileManager();
        }
    });
}

// Populate profile list
function populateProfileList() {
    const profileList = document.getElementById('profile-list');
    if (!profileList) return;

    profileList.innerHTML = '';

    printProfiles.forEach(profile => {
        const profileCard = document.createElement('div');
        profileCard.className = 'profile-card';
        profileCard.innerHTML = `
            <div class="profile-info">
                <h3>${profile.name} ${profile.isDefault ? '<span class="badge">Default</span>' : ''}</h3>
                <p>${profile.description || 'Custom profile'}</p>
            </div>
            <div class="profile-card-actions">
                <button class="btn btn-sm btn-primary" onclick="applyProfile('${profile.id}')">Apply</button>
                ${!profile.isDefault ? `<button class="btn btn-sm btn-secondary" onclick="deleteProfile('${profile.id}')">Delete</button>` : ''}
            </div>
        `;
        profileList.appendChild(profileCard);
    });
}

// Save current settings as a new profile
function saveCurrentAsProfile() {
    const name = prompt('Enter profile name:');
    if (!name) return;

    const description = prompt('Enter profile description (optional):') || '';

    const profile = {
        id: `custom-${Date.now()}`,
        name,
        description,
        settings: {
            printer_cost: parseFloat(document.getElementById('printer_cost').value) || 1000,
            upfront_cost: parseFloat(document.getElementById('upfront_cost').value) || 0,
            annual_maintenance: parseFloat(document.getElementById('annual_maintenance').value) || 75,
            printer_life: parseFloat(document.getElementById('printer_life').value) || 3,
            average_uptime: parseFloat(document.getElementById('average_uptime').value) || 50,
            power_consumption: parseFloat(document.getElementById('power_consumption').value) || 250,
            electricity_rate: parseFloat(document.getElementById('electricity_rate').value) || 0.30,
            labor_rate: parseFloat(document.getElementById('labor_rate').value) || 20
        },
        isDefault: false
    };

    printProfiles.push(profile);
    savePrintProfiles();
    populateProfileList();
    showMessage(`Profile "${name}" saved successfully`, 'success');
}

// Apply a profile
function applyProfile(profileId) {
    const profile = printProfiles.find(p => p.id === profileId);
    if (!profile) return;

    const settings = profile.settings;

    // Apply all settings to form
    document.getElementById('printer_cost').value = settings.printer_cost;
    document.getElementById('upfront_cost').value = settings.upfront_cost;
    document.getElementById('annual_maintenance').value = settings.annual_maintenance;
    document.getElementById('printer_life').value = settings.printer_life;
    document.getElementById('average_uptime').value = settings.average_uptime;
    document.getElementById('power_consumption').value = settings.power_consumption;
    document.getElementById('electricity_rate').value = settings.electricity_rate;
    document.getElementById('labor_rate').value = settings.labor_rate;

    closeProfileManager();
    showMessage(`Profile "${profile.name}" applied`, 'success');

    // Recalculate if on results tab
    const activeTab = document.querySelector('.tab-button.active');
    if (activeTab && activeTab.dataset.tab === 'results') {
        calculate();
    }
}

// Delete a profile
function deleteProfile(profileId) {
    const profile = printProfiles.find(p => p.id === profileId);
    if (!profile || profile.isDefault) return;

    if (confirm(`Delete profile "${profile.name}"?`)) {
        printProfiles = printProfiles.filter(p => p.id !== profileId);
        savePrintProfiles();
        populateProfileList();
        showMessage(`Profile "${profile.name}" deleted`, 'info');
    }
}

// Export profiles to JSON
function exportProfiles() {
    const dataStr = JSON.stringify(printProfiles, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `printforge_profiles_${new Date().toISOString().split('T')[0]}.json`;
    a.click();

    URL.revokeObjectURL(url);
    showMessage('Profiles exported', 'success');
}

// Import profiles from JSON
function importProfiles(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            if (!Array.isArray(imported)) {
                throw new Error('Invalid profile format');
            }

            // Merge imported profiles (skip duplicates by name)
            imported.forEach(profile => {
                if (!printProfiles.find(p => p.name === profile.name && !p.isDefault)) {
                    profile.id = `custom-${Date.now()}-${Math.random()}`;
                    profile.isDefault = false;
                    printProfiles.push(profile);
                }
            });

            savePrintProfiles();
            populateProfileList();
            showMessage(`Imported ${imported.length} profiles`, 'success');
        } catch (err) {
            showMessage('Failed to import profiles. Invalid file format.', 'error');
        }
    };

    reader.readAsText(file);
}

// Initialize profiles on page load
loadPrintProfiles();

// ============================================================================
// KEYBOARD SHORTCUTS
// ============================================================================

document.addEventListener('keydown', (e) => {
    // Ctrl+S: Save Config
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveConfig();
        showMessage('Saving configuration... (Ctrl+S)', 'success');
    }

    // Ctrl+E: Export to Excel
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        exportToExcel();
        showMessage('Exporting to Excel... (Ctrl+E)', 'success');
    }

    // Ctrl+L: Load Config
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        document.getElementById('load-file').click();
    }

    // Ctrl+R: Recalculate (override browser refresh)
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        calculate();
        showMessage('Recalculating... (Ctrl+R)', 'success');
    }
});

// ============================================================
// Cost History & Analytics
// ============================================================

let quoteHistory = [];
let historyChart = null;

// Load history from localStorage
function loadHistory() {
    const saved = localStorage.getItem('printforge_history');
    if (saved) {
        quoteHistory = JSON.parse(saved);
        updateHistoryDisplay();
    }
}

// Save history to localStorage
function saveHistory() {
    localStorage.setItem('printforge_history', JSON.stringify(quoteHistory));
}

// Add quote to history (called from calculate function)
function addToHistory(quoteData) {
    const historyEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        partName: quoteData.partName || 'Unnamed Part',
        material: quoteData.material || 'PLA',
        weight: parseFloat(quoteData.weight) || 0,
        printTime: parseFloat(quoteData.printTime) || 0,
        totalCost: parseFloat(quoteData.totalCost) || 0,
        notes: quoteData.notes || '',
        starred: false,
        breakdown: {
            material: parseFloat(quoteData.materialCost) || 0,
            labor: parseFloat(quoteData.laborCost) || 0,
            machine: parseFloat(quoteData.machineCost) || 0,
            packaging: parseFloat(quoteData.packagingCost) || 0
        }
    };

    quoteHistory.unshift(historyEntry); // Add to beginning

    // Keep only last 100 quotes
    if (quoteHistory.length > 100) {
        quoteHistory = quoteHistory.slice(0, 100);
    }

    saveHistory();
    updateHistoryDisplay();
}

// Update history display (table and stats)
function updateHistoryDisplay() {
    updateHistoryTable();
    updateHistoryStats();
    updateHistoryChart();
}

// Update history table
function updateHistoryTable() {
    const favoriteFilter = document.getElementById('history_favorite_filter')?.value || 'all';
    const tbody = document.getElementById('history-tbody');

    // Filter data based on favorites
    let displayData = quoteHistory;
    if (favoriteFilter === 'favorites') {
        displayData = quoteHistory.filter(q => q.starred);
    }

    if (displayData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No quotes found</td></tr>';
        return;
    }

    tbody.innerHTML = displayData.slice(0, 20).map(entry => {
        const date = new Date(entry.timestamp);
        const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const starIcon = entry.starred ? '★' : '☆';
        const starClass = entry.starred ? 'starred' : '';

        return `
            <tr>
                <td>
                    <button class="star-btn ${starClass}"
                            onclick="toggleStarQuote(${entry.id})"
                            title="${entry.starred ? 'Remove from favorites' : 'Add to favorites'}">
                        ${starIcon}
                    </button>
                </td>
                <td>${formattedDate}</td>
                <td>${entry.partName}</td>
                <td>${entry.material}</td>
                <td>${entry.weight.toFixed(2)}</td>
                <td>${entry.printTime.toFixed(2)}</td>
                <td style="font-weight: 600; color: var(--primary-color);">NZD $${entry.totalCost.toFixed(2)}</td>
                <td>
                    <button class="btn-icon" onclick="loadHistoryEntry(${entry.id})" title="Load this quote">
                        Load
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteHistoryEntry(${entry.id})" title="Delete">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Update statistics
function updateHistoryStats() {
    const totalQuotes = quoteHistory.length;
    const starredCount = quoteHistory.filter(q => q.starred).length;
    const costs = quoteHistory.map(q => q.totalCost);
    const avgCost = costs.length > 0 ? costs.reduce((a, b) => a + b, 0) / costs.length : 0;
    const maxCost = costs.length > 0 ? Math.max(...costs) : 0;
    const minCost = costs.length > 0 ? Math.min(...costs) : 0;

    document.getElementById('stat_total_quotes').textContent = `${totalQuotes} (${starredCount} starred)`;
    document.getElementById('stat_avg_cost').textContent = `NZD $${avgCost.toFixed(2)}`;
    document.getElementById('stat_max_cost').textContent = `NZD $${maxCost.toFixed(2)}`;
    document.getElementById('stat_min_cost').textContent = `NZD $${minCost.toFixed(2)}`;
}

// Toggle star status
function toggleStarQuote(entryId) {
    const entry = quoteHistory.find(q => q.id === entryId);
    if (!entry) return;

    entry.starred = !entry.starred;
    saveHistory();
    updateHistoryDisplay();

    const message = entry.starred ? 'Added to favorites' : 'Removed from favorites';
    showMessage(message, 'success');
}

// Update chart
function updateHistoryChart() {
    const canvas = document.getElementById('history_chart');
    const ctx = canvas.getContext('2d');

    // Get filter values
    const dateFilter = parseInt(document.getElementById('history_date_filter')?.value || 'all');
    const materialFilter = document.getElementById('history_material_filter')?.value || 'all';
    const chartType = document.getElementById('history_chart_type')?.value || 'line';

    // Filter data
    let filteredData = quoteHistory;

    // Filter by date
    if (dateFilter !== 'all') {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - dateFilter);
        filteredData = filteredData.filter(q => new Date(q.timestamp) >= cutoffDate);
    }

    // Filter by material
    if (materialFilter !== 'all') {
        filteredData = filteredData.filter(q => q.material === materialFilter);
    }

    // Prepare chart data
    const labels = filteredData.slice().reverse().map(q => {
        const date = new Date(q.timestamp);
        return date.toLocaleDateString();
    });

    const costData = filteredData.slice().reverse().map(q => q.totalCost);

    // Destroy existing chart
    if (historyChart) {
        historyChart.destroy();
    }

    // Create new chart
    historyChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Cost (NZD $)',
                data: costData,
                borderColor: 'rgb(255, 107, 53)',
                backgroundColor: 'rgba(255, 107, 53, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                fill: chartType === 'line'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim()
                    }
                },
                title: {
                    display: true,
                    text: 'Quote Cost History',
                    color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim(),
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'NZD $' + value.toFixed(2);
                        },
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
                    },
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim()
                    }
                },
                x: {
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
                    },
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim()
                    }
                }
            }
        }
    });
}

// Load a history entry into the form
function loadHistoryEntry(entryId) {
    const entry = quoteHistory.find(q => q.id === entryId);
    if (!entry) return;

    // Load basic info
    document.getElementById('part_name').value = entry.partName;
    document.getElementById('material_type').value = entry.material;
    document.getElementById('filament_required').value = entry.weight;
    document.getElementById('print_time').value = entry.printTime;

    // Load notes if present
    const notesField = document.getElementById('quote_notes');
    if (notesField) notesField.value = entry.notes || '';

    // Switch to basic tab
    const basicTab = document.querySelector('[data-tab="basic"]');
    if (basicTab) basicTab.click();

    showMessage('Quote loaded from history', 'success');
}

// Delete a history entry
function deleteHistoryEntry(entryId) {
    if (!confirm('Delete this quote from history?')) return;

    quoteHistory = quoteHistory.filter(q => q.id !== entryId);
    saveHistory();
    updateHistoryDisplay();
    showMessage('Quote deleted from history', 'success');
}

// Clear all history
function clearHistory() {
    if (!confirm('Clear all quote history? This cannot be undone.')) return;

    quoteHistory = [];
    saveHistory();
    updateHistoryDisplay();
    showMessage('History cleared', 'success');
}

// Export history to Excel
function exportHistoryToExcel() {
    if (quoteHistory.length === 0) {
        showMessage('No history to export', 'error');
        return;
    }

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Prepare data for history sheet
    const historyData = quoteHistory.map(entry => ({
        'Date': new Date(entry.timestamp).toLocaleString(),
        'Part Name': entry.partName,
        'Material': entry.material,
        'Weight (g)': entry.weight,
        'Print Time (h)': entry.printTime,
        'Material Cost': entry.breakdown.material,
        'Labor Cost': entry.breakdown.labor,
        'Machine Cost': entry.breakdown.machine,
        'Packaging Cost': entry.breakdown.packaging,
        'Total Cost': entry.totalCost
    }));

    const ws = XLSX.utils.json_to_sheet(historyData);
    XLSX.utils.book_append_sheet(wb, ws, 'Quote History');

    // Save file
    const filename = `printforge_history_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, filename);

    showMessage('History exported to Excel', 'success');
}

// ============================================================
// Export Menu Toggle
// ============================================================

function toggleExportMenu() {
    const menu = document.getElementById('export-menu');
    if (menu.style.display === 'none' || !menu.style.display) {
        menu.style.display = 'block';
    } else {
        menu.style.display = 'none';
    }
}

// Close export menu when clicking outside
document.addEventListener('click', (e) => {
    const exportDropdown = e.target.closest('.export-dropdown');
    if (!exportDropdown) {
        const menu = document.getElementById('export-menu');
        if (menu) menu.style.display = 'none';
    }
});

// ============================================================
// Advanced PDF Export
// ============================================================

async function exportToPDF() {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Get current form data
        const data = collectFormData();

        // Calculate if not already done
        const response = await fetch('/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();

        if (!result.success) {
            showMessage('Please calculate quote first', 'error');
            return;
        }

        // Get settings
        const settings = appSettings || {};
        const companyName = settings.export?.companyName || 'PrintForge';
        const location = settings.regional?.location || 'Christchurch, NZ';
        const currency = settings.regional?.currency || 'NZD';

        // Colors
        const primaryColor = [255, 107, 53]; // Orange
        const darkGray = [60, 60, 60];
        const lightGray = [200, 200, 200];

        // Page setup
        let yPos = 20;
        const pageWidth = doc.internal.pageSize.width;
        const margin = 20;

        // Header with company branding
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, pageWidth, 30, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text(companyName, margin, 20);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(location, pageWidth - margin, 20, { align: 'right' });

        yPos = 45;

        // Quote title
        doc.setTextColor(...darkGray);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('3D Printing Quote', margin, yPos);

        yPos += 5;
        doc.setDrawColor(...lightGray);
        doc.setLineWidth(0.5);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 10;

        // Quote info
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, yPos);
        doc.text(`Quote #: ${Date.now()}`, pageWidth - margin, yPos, { align: 'right' });
        yPos += 6;
        doc.text(`Part Name: ${data.part_name || 'Unnamed Part'}`, margin, yPos);
        yPos += 6;
        doc.text(`Revision: ${data.revision || 'V1'}`, margin, yPos);
        doc.text(`Prepared By: ${data.prepared_by || '—'}`, pageWidth - margin, yPos, { align: 'right' });
        yPos += 12;

        // Print specifications section
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...primaryColor);
        doc.text('Print Specifications', margin, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...darkGray);

        const specs = [
            ['Material:', data.material_type || 'PLA'],
            ['Filament Required:', `${data.filament_required || 0} g`],
            ['Print Time:', `${data.print_time || 0} hours`],
            ['Labor Time:', `${data.labor_time || 0} minutes`]
        ];

        specs.forEach(([label, value]) => {
            doc.text(label, margin, yPos);
            doc.text(value, margin + 60, yPos);
            yPos += 6;
        });

        yPos += 6;

        // Cost breakdown table
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...primaryColor);
        doc.text('Cost Breakdown', margin, yPos);
        yPos += 2;

        doc.autoTable({
            startY: yPos,
            head: [['Cost Category', 'Amount']],
            body: [
                ['Material Cost', `${currency} $${result.material_cost.toFixed(2)}`],
                ['Labor Cost', `${currency} $${result.labor_cost.toFixed(2)}`],
                ['Machine Cost (Depreciation)', `${currency} $${result.machine_depreciation.toFixed(2)}`],
                ['Electricity Cost', `${currency} $${result.electricity_cost.toFixed(2)}`],
                ['Packaging & Shipping', `${currency} $${result.packaging_cost.toFixed(2)}`]
            ],
            foot: [['Total Cost', `${currency} $${result.total_cost.toFixed(2)}`]],
            theme: 'grid',
            headStyles: {
                fillColor: primaryColor,
                textColor: 255,
                fontSize: 10,
                fontStyle: 'bold'
            },
            footStyles: {
                fillColor: [240, 240, 240],
                textColor: darkGray,
                fontSize: 11,
                fontStyle: 'bold'
            },
            bodyStyles: {
                textColor: darkGray,
                fontSize: 10
            },
            columnStyles: {
                0: { cellWidth: 120 },
                1: { cellWidth: 'auto', halign: 'right' }
            },
            margin: { left: margin, right: margin }
        });

        yPos = doc.lastAutoTable.finalY + 12;

        // Pricing options table
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...primaryColor);
        doc.text('Pricing Options', margin, yPos);
        yPos += 2;

        doc.autoTable({
            startY: yPos,
            head: [['Margin', 'Recommended Price']],
            body: [
                ['50% Margin', `${currency} $${result.price_50.toFixed(2)}`],
                ['60% Margin', `${currency} $${result.price_60.toFixed(2)}`],
                ['70% Margin (Recommended)', `${currency} $${result.price_70.toFixed(2)}`],
                ['Custom Margin', `${currency} $${result.price_custom.toFixed(2)}`]
            ],
            theme: 'grid',
            headStyles: {
                fillColor: primaryColor,
                textColor: 255,
                fontSize: 10,
                fontStyle: 'bold'
            },
            bodyStyles: {
                textColor: darkGray,
                fontSize: 10
            },
            columnStyles: {
                0: { cellWidth: 120 },
                1: { cellWidth: 'auto', halign: 'right', fontStyle: 'bold' }
            },
            margin: { left: margin, right: margin }
        });

        yPos = doc.lastAutoTable.finalY + 12;

        // Hardware items if any
        if (data.hardware && data.hardware.length > 0) {
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...primaryColor);
            doc.text('Hardware Components', margin, yPos);
            yPos += 2;

            const hardwareData = data.hardware.map(item => [
                item.name,
                item.quantity,
                `${currency} $${item.unit_cost.toFixed(2)}`,
                `${currency} $${(item.quantity * item.unit_cost).toFixed(2)}`
            ]);

            doc.autoTable({
                startY: yPos,
                head: [['Item', 'Qty', 'Unit Cost', 'Total']],
                body: hardwareData,
                theme: 'grid',
                headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 9 },
                bodyStyles: { textColor: darkGray, fontSize: 9 },
                margin: { left: margin, right: margin }
            });

            yPos = doc.lastAutoTable.finalY + 12;
        }

        // Add notes section if present
        const notes = data.quote_notes;
        if (notes && notes.trim()) {
            yPos += 6;
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...primaryColor);
            doc.text('Quote Notes', margin, yPos);
            yPos += 8;

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...darkGray);

            // Split long text into lines
            const splitNotes = doc.splitTextToSize(notes, pageWidth - (margin * 2));
            doc.text(splitNotes, margin, yPos);
            yPos += splitNotes.length * 6;
        }

        // Footer
        const footerY = doc.internal.pageSize.height - 20;
        doc.setDrawColor(...lightGray);
        doc.line(margin, footerY, pageWidth - margin, footerY);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.setFont('helvetica', 'italic');
        doc.text('Generated by PrintForge Pricing Calculator', pageWidth / 2, footerY + 5, { align: 'center' });
        doc.text(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, pageWidth / 2, footerY + 10, { align: 'center' });

        // Save PDF
        const filename = `${data.part_name.replace(/ /g, '_')}_Quote_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);

        showMessage('PDF exported successfully', 'success');

    } catch (error) {
        console.error('PDF export error:', error);
        showMessage('PDF export failed: ' + error.message, 'error');
    }
}

// Export Batch to PDF
async function exportBatchToPDF() {
    try {
        if (batchQuotes.length === 0) {
            showMessage('No batch quotes to export', 'error');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const settings = appSettings || {};
        const companyName = settings.export?.companyName || 'PrintForge';
        const location = settings.regional?.location || 'Christchurch, NZ';
        const currency = settings.regional?.currency || 'NZD';

        const primaryColor = [255, 107, 53];
        const darkGray = [60, 60, 60];
        const lightGray = [200, 200, 200];

        let yPos = 20;
        const pageWidth = doc.internal.pageSize.width;
        const margin = 20;

        // Header
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, pageWidth, 30, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text(companyName, margin, 20);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(location, pageWidth - margin, 20, { align: 'right' });

        yPos = 45;

        // Title
        doc.setTextColor(...darkGray);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Batch Quote Summary', margin, yPos);

        yPos += 5;
        doc.setDrawColor(...lightGray);
        doc.setLineWidth(0.5);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 10;

        // Quote info
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, yPos);
        doc.text(`Total Parts: ${batchQuotes.length}`, pageWidth - margin, yPos, { align: 'right' });
        yPos += 12;

        // Batch quotes table
        const batchData = batchQuotes.map(quote => [
            quote.partName || `Part ${quote.rowId}`,
            quote.material || 'PLA',
            quote.weight.toFixed(2),
            quote.printTime.toFixed(2),
            quote.quantity,
            `${currency} $${quote.totalCost.toFixed(2)}`
        ]);

        const totalCost = batchQuotes.reduce((sum, q) => sum + q.totalCost, 0);

        doc.autoTable({
            startY: yPos,
            head: [['Part Name', 'Material', 'Weight (g)', 'Time (h)', 'Qty', 'Total Cost']],
            body: batchData,
            foot: [[{ content: 'Batch Total:', colSpan: 5, styles: { halign: 'right', fontStyle: 'bold' } }, `${currency} $${totalCost.toFixed(2)}`]],
            theme: 'grid',
            headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 9, fontStyle: 'bold' },
            footStyles: { fillColor: [240, 240, 240], textColor: darkGray, fontSize: 11, fontStyle: 'bold' },
            bodyStyles: { textColor: darkGray, fontSize: 9 },
            margin: { left: margin, right: margin }
        });

        // Footer
        const footerY = doc.internal.pageSize.height - 20;
        doc.setDrawColor(...lightGray);
        doc.line(margin, footerY, pageWidth - margin, footerY);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.setFont('helvetica', 'italic');
        doc.text('Generated by PrintForge Pricing Calculator', pageWidth / 2, footerY + 5, { align: 'center' });

        // Save PDF
        const filename = `PrintForge_Batch_Quote_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);

        showMessage('Batch PDF exported successfully', 'success');

    } catch (error) {
        console.error('Batch PDF export error:', error);
        showMessage('Batch PDF export failed: ' + error.message, 'error');
    }
}

// ============================================================
// Quote Comparison Tool
// ============================================================

let comparisonSlots = [];
let comparisonIdCounter = 0;

function addCompareSlot() {
    if (comparisonSlots.length >= 3) {
        showMessage('Maximum 3 comparison slots', 'error');
        return;
    }

    const slotId = ++comparisonIdCounter;
    const slotData = {
        id: slotId,
        name: `Option ${slotId}`,
        material: 'PLA',
        weight: 50,
        printTime: 2,
        cost: null
    };

    comparisonSlots.push(slotData);
    renderComparisonSlots();
}

function renderComparisonSlots() {
    const grid = document.getElementById('comparison-grid');

    if (comparisonSlots.length === 0) {
        grid.innerHTML = '<p class="empty-state">Click "Add Option" to start comparing quotes</p>';
        return;
    }

    grid.innerHTML = comparisonSlots.map(slot => `
        <div class="comparison-slot" data-slot-id="${slot.id}">
            <div class="slot-header">
                <input type="text" value="${slot.name}"
                       onchange="updateSlotName(${slot.id}, this.value)"
                       class="slot-name-input">
                <button class="btn-icon btn-delete" onclick="removeCompareSlot(${slot.id})" title="Remove">✖</button>
            </div>

            <div class="slot-inputs">
                <div class="form-group">
                    <label>Material:</label>
                    <select onchange="updateSlotField(${slot.id}, 'material', this.value)">
                        <option value="PLA" ${slot.material === 'PLA' ? 'selected' : ''}>PLA</option>
                        <option value="PETG" ${slot.material === 'PETG' ? 'selected' : ''}>PETG</option>
                        <option value="ABS" ${slot.material === 'ABS' ? 'selected' : ''}>ABS</option>
                        <option value="TPU" ${slot.material === 'TPU' ? 'selected' : ''}>TPU</option>
                        <option value="Nylon" ${slot.material === 'Nylon' ? 'selected' : ''}>Nylon</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Weight (g):</label>
                    <input type="number" value="${slot.weight}" step="0.1"
                           onchange="updateSlotField(${slot.id}, 'weight', this.value)">
                </div>

                <div class="form-group">
                    <label>Print Time (h):</label>
                    <input type="number" value="${slot.printTime}" step="0.1"
                           onchange="updateSlotField(${slot.id}, 'printTime', this.value)">
                </div>
            </div>

            <button class="btn btn-primary" onclick="calculateCompareSlot(${slot.id})" style="width: 100%; margin-top: 12px;">
                Calculate
            </button>

            <div class="slot-results" id="slot-results-${slot.id}">
                ${slot.cost !== null ? `
                    <div class="result-card">
                        <div class="result-label">Total Cost:</div>
                        <div class="result-value">NZD $${slot.cost.toFixed(2)}</div>
                    </div>
                ` : '<p class="empty-state">Click Calculate</p>'}
            </div>
        </div>
    `).join('');
}

function updateSlotField(slotId, field, value) {
    const slot = comparisonSlots.find(s => s.id === slotId);
    if (slot) {
        slot[field] = field === 'material' ? value : parseFloat(value);
        slot.cost = null; // Reset cost when inputs change
        renderComparisonSlots();
    }
}

function updateSlotName(slotId, name) {
    const slot = comparisonSlots.find(s => s.id === slotId);
    if (slot) slot.name = name;
}

async function calculateCompareSlot(slotId) {
    const slot = comparisonSlots.find(s => s.id === slotId);
    if (!slot) return;

    // Collect base form data
    const baseData = collectFormData();

    // Override with slot-specific values
    const slotData = {
        ...baseData,
        material_type: slot.material,
        filament_required: slot.weight,
        print_time: slot.printTime
    };

    try {
        const response = await fetch('/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(slotData)
        });

        const result = await response.json();

        if (result.success) {
            slot.cost = result.total_cost;
            renderComparisonSlots();
            showMessage(`${slot.name} calculated`, 'success');
        } else {
            showMessage('Calculation failed: ' + result.error, 'error');
        }
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
}

function removeCompareSlot(slotId) {
    comparisonSlots = comparisonSlots.filter(s => s.id !== slotId);
    renderComparisonSlots();
}

function clearComparison() {
    if (!confirm('Clear all comparison slots?')) return;
    comparisonSlots = [];
    renderComparisonSlots();
}

// ==================== Quick Calculator Widget ====================

let widgetLastResult = null;

// ==================== Price Alerts ====================

function checkPriceAlert(result) {
    const banner = document.getElementById('price-alert-banner');
    const alertMessage = document.getElementById('alert-message');
    const threshold = appSettings.priceThreshold;

    // Hide banner if no threshold set
    if (!threshold || threshold <= 0) {
        banner.style.display = 'none';
        return;
    }

    // Get the quantity from the form
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    const totalPrice = result.price_custom * quantity;

    // Check if price exceeds threshold
    if (totalPrice > threshold) {
        const overAmount = totalPrice - threshold;
        const overPercent = ((overAmount / threshold) * 100).toFixed(1);

        alertMessage.innerHTML = `Quote total <strong>$${totalPrice.toFixed(2)}</strong> exceeds your target price of <strong>$${threshold.toFixed(2)}</strong> by <strong>$${overAmount.toFixed(2)}</strong> (${overPercent}% over).`;
        banner.style.display = 'block';
    } else {
        banner.style.display = 'none';
    }
}

function dismissPriceAlert() {
    const banner = document.getElementById('price-alert-banner');
    banner.style.display = 'none';
}

// ================================
// CLIENT MANAGEMENT
// ================================

function loadClients() {
    const saved = localStorage.getItem('printforge_clients');
    if (saved) {
        try {
            clients = JSON.parse(saved);
        } catch (e) {
            console.error('Failed to load clients:', e);
            clients = [];
        }
    }
    updateClientDisplay();
    populateClientSelector();
}

function saveClients() {
    localStorage.setItem('printforge_clients', JSON.stringify(clients));
}

function updateClientDisplay() {
    updateClientTable();
    updateClientStats();
    populateClientSelector();
}

function updateClientTable() {
    const filter = document.getElementById('client_filter')?.value || 'all';
    const search = document.getElementById('client_search')?.value.toLowerCase() || '';
    const tbody = document.getElementById('clients-tbody');

    if (!tbody) return;

    let displayData = clients;

    if (filter === 'starred') {
        displayData = displayData.filter(c => c.starred);
    } else if (filter === 'active') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        displayData = displayData.filter(c => c.lastQuoteDate && new Date(c.lastQuoteDate) >= thirtyDaysAgo);
    }

    if (search) {
        displayData = displayData.filter(c =>
            c.name.toLowerCase().includes(search) ||
            c.email.toLowerCase().includes(search) ||
            (c.contactName && c.contactName.toLowerCase().includes(search))
        );
    }

    if (displayData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="empty-state">No clients found. Use the form above to add your first client.</td></tr>';
        return;
    }

    tbody.innerHTML = displayData.map(client => {
        const starIcon = client.starred ? '★' : '☆';
        const starClass = client.starred ? 'starred' : '';

        return `
            <tr>
                <td>
                    <button class="star-btn ${starClass}" onclick="toggleStarClient('${client.id}')">
                        ${starIcon}
                    </button>
                </td>
                <td><strong>${client.name}</strong></td>
                <td>${client.contactName || '-'}</td>
                <td>${client.email}</td>
                <td>${client.phone || '-'}</td>
                <td>${client.defaultDiscount || 0}%</td>
                <td>${client.totalQuotes || 0}</td>
                <td>NZD $${(client.totalSpent || 0).toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm" onclick="editClient('${client.id}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteClient('${client.id}')">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}

function updateClientStats() {
    const totalClients = clients.length;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeClients = clients.filter(c => c.lastQuoteDate && new Date(c.lastQuoteDate) >= thirtyDaysAgo).length;

    const totalRevenue = clients.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
    const totalQuotes = clients.reduce((sum, c) => sum + (c.totalQuotes || 0), 0);
    const avgQuote = totalQuotes > 0 ? totalRevenue / totalQuotes : 0;

    const statElements = {
        'stat_total_clients': totalClients,
        'stat_active_clients': activeClients,
        'stat_total_revenue': `NZD $${totalRevenue.toFixed(2)}`,
        'stat_avg_quote': `NZD $${avgQuote.toFixed(2)}`
    };

    Object.keys(statElements).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = statElements[id];
    });
}

function populateClientSelector() {
    const selector = document.getElementById('selected_client');
    if (!selector) return;

    const currentValue = selector.value;
    selector.innerHTML = '<option value="">-- No Client --</option><option value="_add_new">+ Add New Client</option>';

    clients
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = `${client.name} (${client.totalQuotes || 0} quotes)`;
            selector.appendChild(option);
        });

    selector.value = currentValue;
}

// Open client form (new approach - show form in tab instead of modal)
function openClientForm() {
    editingClientId = null;

    // Switch to clients tab
    switchToTab('clients');

    // Show the form section
    const formSection = document.getElementById('client-form-section');
    if (formSection) {
        formSection.style.display = 'block';
        document.getElementById('client-form-title').textContent = 'Add Client';

        // Clear form
        document.getElementById('client_name').value = '';
        document.getElementById('client_contact').value = '';
        document.getElementById('client_email').value = '';
        document.getElementById('client_phone').value = '';
        document.getElementById('client_address').value = '';
        document.getElementById('client_discount').value = '0';
        document.getElementById('client_notes').value = '';

        // Scroll to form
        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Legacy function for backward compatibility
function openClientModal() {
    openClientForm();
}

// Close/cancel client form
function cancelClientForm() {
    const formSection = document.getElementById('client-form-section');
    if (formSection) {
        formSection.style.display = 'none';
    }
    editingClientId = null;
}

// Legacy function for backward compatibility
function closeClientModal() {
    cancelClientForm();
}

function editClient(clientId) {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    editingClientId = clientId;

    // Switch to clients tab
    switchToTab('clients');

    // Show the form section
    const formSection = document.getElementById('client-form-section');
    if (formSection) {
        formSection.style.display = 'block';
        document.getElementById('client-form-title').textContent = 'Edit Client';

        // Populate form with client data
        document.getElementById('client_name').value = client.name;
        document.getElementById('client_contact').value = client.contactName || '';
        document.getElementById('client_email').value = client.email;
        document.getElementById('client_phone').value = client.phone || '';
        document.getElementById('client_address').value = client.address || '';
        document.getElementById('client_discount').value = client.defaultDiscount || 0;
        document.getElementById('client_notes').value = client.notes || '';

        // Scroll to form
        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function saveClient() {
    const name = document.getElementById('client_name').value.trim();
    const email = document.getElementById('client_email').value.trim();

    if (!name || !email) {
        showMessage('Please enter client name and email', 'error');
        return;
    }

    const clientData = {
        name: name,
        contactName: document.getElementById('client_contact').value.trim(),
        email: email,
        phone: document.getElementById('client_phone').value.trim(),
        address: document.getElementById('client_address').value.trim(),
        defaultDiscount: parseFloat(document.getElementById('client_discount').value) || 0,
        notes: document.getElementById('client_notes').value.trim()
    };

    if (editingClientId) {
        const client = clients.find(c => c.id === editingClientId);
        if (client) {
            Object.assign(client, clientData);
            showMessage('Client updated successfully', 'success');
        }
    } else {
        const newClient = {
            id: `client-${Date.now()}`,
            ...clientData,
            createdAt: new Date().toISOString(),
            lastQuoteDate: null,
            totalQuotes: 0,
            totalSpent: 0,
            starred: false
        };
        clients.push(newClient);
        showMessage('Client added successfully', 'success');
    }

    saveClients();
    updateClientDisplay();
    cancelClientForm();
}

function deleteClient(clientId) {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    if (!confirm(`Delete client "${client.name}"? This cannot be undone.`)) return;

    clients = clients.filter(c => c.id !== clientId);
    saveClients();
    updateClientDisplay();
    showMessage('Client deleted', 'info');
}

function toggleStarClient(clientId) {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    client.starred = !client.starred;
    saveClients();
    updateClientDisplay();

    const message = client.starred ? 'Added to favorites' : 'Removed from favorites';
    showMessage(message, 'success');
}

function handleClientSelection() {
    const select = document.getElementById('selected_client');
    if (!select) {
        console.error('Client select element not found');
        return;
    }

    const value = select.value;

    if (value === '_add_new') {
        // Open the client form to add a new client
        openClientForm();
        // Reset to "No Client"
        select.value = '';
        return;
    }

    // Apply client defaults if a client is selected
    if (value) {
        applyClientDefaults();
    }
}

function applyClientDefaults() {
    const clientId = document.getElementById('selected_client')?.value;
    if (!clientId) return;

    const client = clients.find(c => c.id === clientId);
    if (!client || !client.defaultDiscount) return;

    showMessage(`Applied ${client.defaultDiscount}% discount for ${client.name}`, 'info');
}

function updateClientQuoteStats(totalCost) {
    const clientId = document.getElementById('selected_client')?.value;
    if (!clientId) return;

    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    client.totalQuotes = (client.totalQuotes || 0) + 1;
    client.totalSpent = (client.totalSpent || 0) + totalCost;
    client.lastQuoteDate = new Date().toISOString();

    saveClients();
    updateClientDisplay();
}

function clearAllClients() {
    if (!confirm('Delete all clients? This cannot be undone.')) return;

    clients = [];
    saveClients();
    updateClientDisplay();
    showMessage('All clients deleted', 'info');
}

function exportClientsToCSV() {
    if (clients.length === 0) {
        showMessage('No clients to export', 'error');
        return;
    }

    const headers = ['Name', 'Contact Person', 'Email', 'Phone', 'Address', 'Total Quotes', 'Total Spent', 'Default Discount', 'Notes'];
    const rows = clients.map(c => [
        c.name,
        c.contactName || '',
        c.email,
        c.phone || '',
        c.address || '',
        c.totalQuotes || 0,
        (c.totalSpent || 0).toFixed(2),
        c.defaultDiscount || 0,
        c.notes || ''
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `printforge_clients_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    showMessage('Clients exported to CSV', 'success');
}

// Client modal event listener removed - now using in-tab form


// ================================
// QUOTE TEMPLATES
// ================================

// Default templates
const defaultTemplates = [
    {
        id: 'template-default-1',
        name: 'Standard PLA',
        description: 'Basic PLA prints with standard packaging',
        category: 'Standard',
        isDefault: true,
        createdAt: new Date().toISOString(),
        clientId: null,
        template: {
            material_type: 'PLA',
            filament_cost: 40.00,
            filament_required: 0,
            print_time: 0,
            shipping_cost: 0,
            hardware_items: [],
            packaging_items: [
                { name: 'Standard Box', quantity: 1, unit_cost: 2.50 }
            ],
            printer_cost: 1000,
            upfront_cost: 0,
            annual_maintenance: 75,
            printer_life: 3,
            average_uptime: 50,
            power_consumption: 250,
            electricity_rate: 0.30,
            electricity_daily: 1.50,
            efficiency_factor: 1.1,
            labor_rate: 20
        }
    },
    {
        id: 'template-default-2',
        name: 'Premium Carbon Fiber',
        description: 'Carbon fiber prints with premium packaging',
        category: 'Premium',
        isDefault: true,
        createdAt: new Date().toISOString(),
        clientId: null,
        template: {
            material_type: 'Carbon Fiber',
            filament_cost: 85.00,
            filament_required: 0,
            print_time: 0,
            shipping_cost: 0,
            hardware_items: [],
            packaging_items: [
                { name: 'Premium Box', quantity: 1, unit_cost: 5.00 },
                { name: 'Protective Foam', quantity: 1, unit_cost: 2.00 }
            ],
            printer_cost: 3000,
            upfront_cost: 0,
            annual_maintenance: 200,
            printer_life: 5,
            average_uptime: 60,
            power_consumption: 350,
            electricity_rate: 0.30,
            electricity_daily: 2.00,
            efficiency_factor: 1.15,
            labor_rate: 35
        }
    },
    {
        id: 'template-default-3',
        name: 'Economy Bulk',
        description: 'Budget PLA prints with minimal packaging',
        category: 'Economy',
        isDefault: true,
        createdAt: new Date().toISOString(),
        clientId: null,
        template: {
            material_type: 'PLA',
            filament_cost: 35.00,
            filament_required: 0,
            print_time: 0,
            shipping_cost: 0,
            hardware_items: [],
            packaging_items: [
                { name: 'Basic Bag', quantity: 1, unit_cost: 0.50 }
            ],
            printer_cost: 500,
            upfront_cost: 0,
            annual_maintenance: 50,
            printer_life: 2,
            average_uptime: 40,
            power_consumption: 200,
            electricity_rate: 0.30,
            electricity_daily: 1.00,
            efficiency_factor: 1.05,
            labor_rate: 15
        }
    }
];

function loadTemplates() {
    const saved = localStorage.getItem('printforge_quote_templates');
    if (saved) {
        try {
            const userTemplates = JSON.parse(saved);
            quoteTemplates = [...defaultTemplates, ...userTemplates];
        } catch (e) {
            console.error('Failed to load templates:', e);
            quoteTemplates = [...defaultTemplates];
        }
    } else {
        quoteTemplates = [...defaultTemplates];
    }
    updateQuickTemplateList();
}

function saveTemplates() {
    const userTemplates = quoteTemplates.filter(t => !t.isDefault);
    localStorage.setItem('printforge_quote_templates', JSON.stringify(userTemplates));
}

function toggleTemplateMenu() {
    const menu = document.getElementById('template-menu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function updateQuickTemplateList() {
    const container = document.getElementById('quick-template-list');
    if (!container) return;

    if (quoteTemplates.length === 0) {
        container.innerHTML = '<div class="empty-menu-item">No templates saved</div>';
        return;
    }

    container.innerHTML = quoteTemplates
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(template => `
            <button onclick="applyTemplate('${template.id}'); toggleTemplateMenu();">
                ${template.name}
                <span class="template-category">${template.category}</span>
            </button>
        `).join('');
}

function openTemplateManager() {
    toggleTemplateMenu();
    document.getElementById('template-manager-modal').style.display = 'flex';
    filterTemplatesByCategory('all');
}

function closeTemplateManager() {
    document.getElementById('template-manager-modal').style.display = 'none';
}

function filterTemplatesByCategory(category) {
    document.querySelectorAll('.template-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-category') === category) {
            tab.classList.add('active');
        }
    });
    renderTemplateGrid(category);
}

function renderTemplateGrid(category = 'all') {
    const grid = document.getElementById('template-grid');
    if (!grid) return;

    const search = document.getElementById('template_search')?.value.toLowerCase() || '';
    let filtered = quoteTemplates;

    if (category !== 'all') {
        filtered = filtered.filter(t => t.category === category);
    }

    if (search) {
        filtered = filtered.filter(t =>
            t.name.toLowerCase().includes(search) ||
            t.description.toLowerCase().includes(search)
        );
    }

    if (filtered.length === 0) {
        grid.innerHTML = '<div class="empty-state">No templates found</div>';
        return;
    }

    grid.innerHTML = filtered.map(template => {
        const isDefault = template.isDefault;
        const deleteBtn = isDefault ? '' : `<button class="btn btn-sm btn-danger" onclick="deleteTemplate('${template.id}')">Delete</button>`;

        return `
            <div class="template-card">
                <div class="template-card-header">
                    <h3>${template.name}</h3>
                    <span class="template-badge template-badge-${template.category.toLowerCase()}">${template.category}</span>
                </div>
                <p class="template-description">${template.description || 'No description'}</p>
                <div class="template-details">
                    <div class="template-detail-item">
                        <span class="template-detail-label">Material:</span>
                        <span class="template-detail-value">${template.template.material_type}</span>
                    </div>
                    <div class="template-detail-item">
                        <span class="template-detail-label">Labor Rate:</span>
                        <span class="template-detail-value">NZD $${template.template.labor_rate}/hr</span>
                    </div>
                </div>
                <div class="template-card-actions">
                    <button class="btn btn-sm btn-primary" onclick="applyTemplate('${template.id}'); closeTemplateManager();">Apply</button>
                    <button class="btn btn-sm" onclick="duplicateTemplate('${template.id}')">Duplicate</button>
                    ${deleteBtn}
                </div>
            </div>
        `;
    }).join('');
}

function filterTemplates() {
    const activeCategory = document.querySelector('.template-tab.active')?.getAttribute('data-category') || 'all';
    renderTemplateGrid(activeCategory);
}

function openSaveTemplateModal() {
    toggleTemplateMenu();
    editingTemplateId = null;
    document.getElementById('save-template-title').textContent = 'Save as Template';
    document.getElementById('template_name').value = '';
    document.getElementById('template_description').value = '';
    document.getElementById('template_category').value = 'Standard';
    document.getElementById('template_link_client').checked = false;
    document.getElementById('template_client_selector_group').style.display = 'none';

    // Populate client dropdown
    const clientSelect = document.getElementById('template_client');
    if (clientSelect && clients) {
        clientSelect.innerHTML = '<option value="">-- Select Client --</option>' +
            clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }

    document.getElementById('save-template-modal').style.display = 'flex';
}

function closeSaveTemplateModal() {
    document.getElementById('save-template-modal').style.display = 'none';
}

// Toggle client selector visibility
document.addEventListener('DOMContentLoaded', function() {
    const linkCheckbox = document.getElementById('template_link_client');
    if (linkCheckbox) {
        linkCheckbox.addEventListener('change', function() {
            const selectorGroup = document.getElementById('template_client_selector_group');
            if (selectorGroup) {
                selectorGroup.style.display = this.checked ? 'block' : 'none';
            }
        });
    }
});

function getCurrentFormState() {
    return {
        material_type: document.getElementById('material_type')?.value || '',
        filament_cost: parseFloat(document.getElementById('filament_cost')?.value) || 0,
        filament_required: parseFloat(document.getElementById('filament_required')?.value) || 0,
        print_time: parseFloat(document.getElementById('print_time')?.value) || 0,
        shipping_cost: parseFloat(document.getElementById('shipping_cost')?.value) || 0,
        hardware_items: getHardwareItems(),
        packaging_items: getPackagingItems(),
        printer_cost: parseFloat(document.getElementById('printer_cost')?.value) || 0,
        upfront_cost: parseFloat(document.getElementById('upfront_cost')?.value) || 0,
        annual_maintenance: parseFloat(document.getElementById('annual_maintenance')?.value) || 0,
        printer_life: parseFloat(document.getElementById('printer_life')?.value) || 0,
        average_uptime: parseFloat(document.getElementById('average_uptime')?.value) || 0,
        power_consumption: parseFloat(document.getElementById('power_consumption')?.value) || 0,
        electricity_rate: parseFloat(document.getElementById('electricity_rate')?.value) || 0,
        electricity_daily: parseFloat(document.getElementById('electricity_daily')?.value) || 0,
        efficiency_factor: parseFloat(document.getElementById('efficiency_factor')?.value) || 0,
        labor_rate: parseFloat(document.getElementById('labor_rate')?.value) || 0
    };
}

function getHardwareItems() {
    const table = document.getElementById('hardware-table');
    if (!table) return [];

    const rows = table.querySelectorAll('tbody tr');
    return Array.from(rows).map(row => {
        return {
            name: row.querySelector('.hw-name')?.value || '',
            quantity: parseFloat(row.querySelector('.hw-quantity')?.value) || 0,
            unit_cost: parseFloat(row.querySelector('.hw-cost')?.value) || 0
        };
    }).filter(item => item.name);
}

function getPackagingItems() {
    const table = document.getElementById('packaging-table');
    if (!table) return [];

    const rows = table.querySelectorAll('tbody tr');
    return Array.from(rows).map(row => {
        return {
            name: row.querySelector('.pkg-name')?.value || '',
            quantity: parseFloat(row.querySelector('.pkg-quantity')?.value) || 0,
            unit_cost: parseFloat(row.querySelector('.pkg-cost')?.value) || 0
        };
    }).filter(item => item.name);
}

function saveQuoteTemplate() {
    const name = document.getElementById('template_name').value.trim();
    const description = document.getElementById('template_description').value.trim();
    const category = document.getElementById('template_category').value;
    const linkToClient = document.getElementById('template_link_client').checked;
    const clientId = linkToClient ? document.getElementById('template_client')?.value : null;

    if (!name) {
        showMessage('Please enter a template name', 'error');
        return;
    }

    const templateData = {
        id: editingTemplateId || `template-${Date.now()}`,
        name: name,
        description: description,
        category: category,
        isDefault: false,
        createdAt: new Date().toISOString(),
        clientId: clientId,
        template: getCurrentFormState()
    };

    if (editingTemplateId) {
        const index = quoteTemplates.findIndex(t => t.id === editingTemplateId);
        if (index !== -1) {
            quoteTemplates[index] = templateData;
            showMessage('Template updated successfully', 'success');
        }
    } else {
        quoteTemplates.push(templateData);
        showMessage('Template saved successfully', 'success');
    }

    saveTemplates();
    updateQuickTemplateList();
    closeSaveTemplateModal();
    renderTemplateGrid(document.querySelector('.template-tab.active')?.getAttribute('data-category') || 'all');
}

function applyTemplate(templateId) {
    const template = quoteTemplates.find(t => t.id === templateId);
    if (!template) return;

    const t = template.template;

    // Basic Info
    if (document.getElementById('material_type')) document.getElementById('material_type').value = t.material_type || '';
    if (document.getElementById('filament_cost')) document.getElementById('filament_cost').value = t.filament_cost || 0;
    if (document.getElementById('filament_required')) document.getElementById('filament_required').value = t.filament_required || 0;
    if (document.getElementById('print_time')) document.getElementById('print_time').value = t.print_time || 0;
    if (document.getElementById('shipping_cost')) document.getElementById('shipping_cost').value = t.shipping_cost || 0;

    // Hardware Items
    clearHardwareTable();
    if (t.hardware_items && t.hardware_items.length > 0) {
        t.hardware_items.forEach(item => {
            addHardwareRow();
            const rows = document.querySelectorAll('#hardware-table tbody tr');
            const lastRow = rows[rows.length - 1];
            lastRow.querySelector('.hw-name').value = item.name;
            lastRow.querySelector('.hw-quantity').value = item.quantity;
            lastRow.querySelector('.hw-cost').value = item.unit_cost;
            updateHardwareTotal(lastRow.querySelector('.hw-quantity'));
        });
    }

    // Packaging Items
    clearPackagingTable();
    if (t.packaging_items && t.packaging_items.length > 0) {
        t.packaging_items.forEach(item => {
            addPackagingRow();
            const rows = document.querySelectorAll('#packaging-table tbody tr');
            const lastRow = rows[rows.length - 1];
            lastRow.querySelector('.pkg-name').value = item.name;
            lastRow.querySelector('.pkg-quantity').value = item.quantity;
            lastRow.querySelector('.pkg-cost').value = item.unit_cost;
            updatePackagingTotal(lastRow.querySelector('.pkg-quantity'));
        });
    }

    // Advanced Settings
    if (document.getElementById('printer_cost')) document.getElementById('printer_cost').value = t.printer_cost || 0;
    if (document.getElementById('upfront_cost')) document.getElementById('upfront_cost').value = t.upfront_cost || 0;
    if (document.getElementById('annual_maintenance')) document.getElementById('annual_maintenance').value = t.annual_maintenance || 0;
    if (document.getElementById('printer_life')) document.getElementById('printer_life').value = t.printer_life || 0;
    if (document.getElementById('average_uptime')) document.getElementById('average_uptime').value = t.average_uptime || 0;
    if (document.getElementById('power_consumption')) document.getElementById('power_consumption').value = t.power_consumption || 0;
    if (document.getElementById('electricity_rate')) document.getElementById('electricity_rate').value = t.electricity_rate || 0;
    if (document.getElementById('electricity_daily')) document.getElementById('electricity_daily').value = t.electricity_daily || 0;
    if (document.getElementById('efficiency_factor')) document.getElementById('efficiency_factor').value = t.efficiency_factor || 0;
    if (document.getElementById('labor_rate')) document.getElementById('labor_rate').value = t.labor_rate || 0;

    showMessage(`Applied template: ${template.name}`, 'success');
}

function clearHardwareTable() {
    const table = document.getElementById('hardware-table');
    if (table) {
        const tbody = table.querySelector('tbody');
        tbody.innerHTML = '';
    }
}

function clearPackagingTable() {
    const table = document.getElementById('packaging-table');
    if (table) {
        const tbody = table.querySelector('tbody');
        tbody.innerHTML = '';
    }
}

function duplicateTemplate(templateId) {
    const template = quoteTemplates.find(t => t.id === templateId);
    if (!template) return;

    const newTemplate = {
        ...template,
        id: `template-${Date.now()}`,
        name: `${template.name} (Copy)`,
        isDefault: false,
        createdAt: new Date().toISOString()
    };

    quoteTemplates.push(newTemplate);
    saveTemplates();
    updateQuickTemplateList();
    renderTemplateGrid(document.querySelector('.template-tab.active')?.getAttribute('data-category') || 'all');
    showMessage('Template duplicated', 'success');
}

function deleteTemplate(templateId) {
    const template = quoteTemplates.find(t => t.id === templateId);
    if (!template) return;

    if (!confirm(`Delete template "${template.name}"? This cannot be undone.`)) return;

    quoteTemplates = quoteTemplates.filter(t => t.id !== templateId);
    saveTemplates();
    updateQuickTemplateList();
    renderTemplateGrid(document.querySelector('.template-tab.active')?.getAttribute('data-category') || 'all');
    showMessage('Template deleted', 'info');
}

// ================================
// AUTOMATIC BACKUPS SYSTEM
// ================================

let backups = [];
let backupSettings = {
    enabled: false,
    frequency: 'daily',
    autoDownload: false,
    include: {
        settings: true,
        clients: true,
        templates: true,
        inventory: true,
        history: true,
        profiles: true,
        presets: true
    },
    lastBackup: null
};

// Load backup settings and backups from localStorage
function loadBackupSettings() {
    const saved = localStorage.getItem('printforge_backup_settings');
    if (saved) {
        try {
            backupSettings = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading backup settings:', e);
        }
    }

    const savedBackups = localStorage.getItem('printforge_backups');
    if (savedBackups) {
        try {
            backups = JSON.parse(savedBackups);
        } catch (e) {
            console.error('Error loading backups:', e);
        }
    }

    // Update UI
    updateBackupSettingsUI();
}

// Save backup settings to localStorage
function saveBackupSettings() {
    localStorage.setItem('printforge_backup_settings', JSON.stringify(backupSettings));
}

// Save backups to localStorage
function saveBackups() {
    localStorage.setItem('printforge_backups', JSON.stringify(backups));
}

// Update backup settings UI
function updateBackupSettingsUI() {
    const enabledCheckbox = document.getElementById('backup_enabled');
    const detailsSection = document.getElementById('backup-settings-details');
    const frequencySelect = document.getElementById('backup_frequency');
    const autoDownloadCheckbox = document.getElementById('backup_auto_download');
    const lastTimeSpan = document.getElementById('backup_last_time');

    if (enabledCheckbox) enabledCheckbox.checked = backupSettings.enabled;
    if (detailsSection) detailsSection.style.display = backupSettings.enabled ? 'block' : 'none';
    if (frequencySelect) frequencySelect.value = backupSettings.frequency;
    if (autoDownloadCheckbox) autoDownloadCheckbox.checked = backupSettings.autoDownload;

    // Update include checkboxes
    if (backupSettings.include) {
        Object.keys(backupSettings.include).forEach(key => {
            const checkbox = document.getElementById(`backup_include_${key}`);
            if (checkbox) checkbox.checked = backupSettings.include[key];
        });
    }

    // Update last backup time
    if (lastTimeSpan) {
        if (backupSettings.lastBackup) {
            const date = new Date(backupSettings.lastBackup);
            lastTimeSpan.textContent = date.toLocaleString();
        } else {
            lastTimeSpan.textContent = 'Never';
        }
    }
}

// Toggle backup enabled
document.getElementById('backup_enabled')?.addEventListener('change', function() {
    backupSettings.enabled = this.checked;
    saveBackupSettings();
    updateBackupSettingsUI();

    if (this.checked) {
        showMessage('Automatic backups enabled', 'success');
        scheduleNextBackup();
    } else {
        showMessage('Automatic backups disabled', 'info');
    }
});

// Update backup frequency
document.getElementById('backup_frequency')?.addEventListener('change', function() {
    backupSettings.frequency = this.value;
    saveBackupSettings();
    showMessage(`Backup frequency set to ${this.value}`, 'success');
    if (backupSettings.enabled) {
        scheduleNextBackup();
    }
});

// Update auto-download setting
document.getElementById('backup_auto_download')?.addEventListener('change', function() {
    backupSettings.autoDownload = this.checked;
    saveBackupSettings();
    showMessage(this.checked ? 'Auto-download enabled' : 'Auto-download disabled', 'info');
});

// Update include settings
['settings', 'clients', 'templates', 'inventory', 'history', 'profiles', 'presets'].forEach(key => {
    document.getElementById(`backup_include_${key}`)?.addEventListener('change', function() {
        backupSettings.include[key] = this.checked;
        saveBackupSettings();
    });
});

// Create a backup
function createBackup(isManual = false) {
    const backup = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        type: isManual ? 'Manual' : 'Automatic',
        data: {}
    };

    // Collect data based on settings
    if (backupSettings.include.settings) {
        backup.data.settings = {
            theme: localStorage.getItem('theme'),
            backupSettings: backupSettings
        };
    }

    if (backupSettings.include.clients) {
        backup.data.clients = localStorage.getItem('printforge_clients');
    }

    if (backupSettings.include.templates) {
        backup.data.templates = localStorage.getItem('printforge_quote_templates');
    }

    if (backupSettings.include.inventory) {
        backup.data.inventory = localStorage.getItem('printforge_inventory');
    }

    if (backupSettings.include.history) {
        backup.data.history = localStorage.getItem('printforge_history');
    }

    if (backupSettings.include.profiles) {
        backup.data.profiles = localStorage.getItem('printforge_profiles');
    }

    if (backupSettings.include.presets) {
        backup.data.presets = localStorage.getItem('printforge_material_presets');
    }

    // Calculate backup stats
    const dataStr = JSON.stringify(backup.data);
    backup.size = new Blob([dataStr]).size;
    backup.itemCount = Object.keys(backup.data).length;
    backup.dataTypes = Object.keys(backup.data);

    // Add to backups array
    backups.unshift(backup);

    // Keep only last 30 backups
    if (backups.length > 30) {
        backups = backups.slice(0, 30);
    }

    // Save backups
    saveBackups();

    // Update last backup time
    backupSettings.lastBackup = backup.timestamp;
    saveBackupSettings();
    updateBackupSettingsUI();

    return backup;
}

// Create manual backup
function createManualBackup() {
    const backup = createBackup(true);
    showMessage('Backup created successfully!', 'success');

    // Auto-download if enabled
    if (backupSettings.autoDownload) {
        exportBackup(backup.id);
    }

    // Refresh backup history (now using tab instead of modal)
    loadBackupHistory();
}

// Schedule next automatic backup
function scheduleNextBackup() {
    if (!backupSettings.enabled) return;

    const now = Date.now();
    let nextBackupTime = 0;

    if (backupSettings.lastBackup) {
        const lastBackup = new Date(backupSettings.lastBackup).getTime();

        switch (backupSettings.frequency) {
            case 'daily':
                nextBackupTime = lastBackup + (24 * 60 * 60 * 1000); // 24 hours
                break;
            case 'weekly':
                nextBackupTime = lastBackup + (7 * 24 * 60 * 60 * 1000); // 7 days
                break;
            case 'monthly':
                nextBackupTime = lastBackup + (30 * 24 * 60 * 60 * 1000); // 30 days
                break;
        }
    } else {
        // First backup - do it immediately
        nextBackupTime = now;
    }

    // If it's time for backup, create one
    if (now >= nextBackupTime) {
        const backup = createBackup(false);

        if (backupSettings.autoDownload) {
            exportBackup(backup.id);
        }
    }
}

// Open backup manager (now switches to backups tab)
function openBackupManager() {
    switchToTab('backups');
}

// Close backup manager (deprecated - kept for compatibility)
function closeBackupManager() {
    // No longer needed as we use tabs instead of modal
}

// Load and display backup history
function loadBackupHistory() {
    console.log('loadBackupHistory called, backups array:', backups);
    const tbody = document.getElementById('backup-history-tbody');
    if (!tbody) {
        console.error('backup-history-tbody element not found!');
        return;
    }

    if (backups.length === 0) {
        console.log('No backups found, showing empty state');
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 20px; color: var(--text-secondary);">
                    No backups found. Create your first backup to get started.
                </td>
            </tr>
        `;
        return;
    }

    console.log('Rendering', backups.length, 'backups');
    tbody.innerHTML = backups.map(backup => {
        const date = new Date(backup.timestamp);
        const sizeKB = (backup.size / 1024).toFixed(2);
        const dataTypes = backup.dataTypes.join(', ');

        return `
            <tr>
                <td>${date.toLocaleString()}</td>
                <td><span class="badge ${backup.type === 'Manual' ? 'badge-primary' : 'badge-secondary'}">${backup.type}</span></td>
                <td>${backup.itemCount} categories</td>
                <td>${sizeKB} KB</td>
                <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${dataTypes}">${dataTypes}</td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="restoreBackup('${backup.id}')" title="Restore this backup">
                        Restore
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="exportBackup('${backup.id}')" title="Download as JSON">
                        Download
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteBackup('${backup.id}')" title="Delete backup">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Restore from backup
function restoreBackup(backupId) {
    const backup = backups.find(b => b.id === backupId);
    if (!backup) {
        showMessage('Backup not found', 'error');
        return;
    }

    if (!confirm(`Restore backup from ${new Date(backup.timestamp).toLocaleString()}?\n\nThis will overwrite your current data. This action cannot be undone.`)) {
        return;
    }

    // Restore data
    Object.keys(backup.data).forEach(key => {
        if (key === 'settings') {
            if (backup.data.settings.theme) {
                localStorage.setItem('theme', backup.data.settings.theme);
            }
        } else {
            const storageKey = getStorageKeyForDataType(key);
            if (storageKey && backup.data[key]) {
                localStorage.setItem(storageKey, backup.data[key]);
            }
        }
    });

    showMessage('Backup restored successfully! Reloading page...', 'success');

    setTimeout(() => {
        location.reload();
    }, 1500);
}

// Get localStorage key for data type
function getStorageKeyForDataType(type) {
    const keyMap = {
        'clients': 'printforge_clients',
        'templates': 'printforge_quote_templates',
        'inventory': 'printforge_inventory',
        'history': 'printforge_history',
        'profiles': 'printforge_profiles',
        'presets': 'printforge_material_presets'
    };
    return keyMap[type];
}

// Export backup to JSON file
async function exportBackup(backupId) {
    const backup = backups.find(b => b.id === backupId);
    if (!backup) {
        showMessage('Backup not found', 'error');
        return;
    }

    const date = new Date(backup.timestamp);
    const defaultFilename = `printforge_backup_${date.toISOString().split('T')[0]}.json`;

    const dataStr = JSON.stringify(backup, null, 2);

    // Desktop mode: use native file dialog
    if (isDesktopMode()) {
        const filepath = await window.pywebview.api.save_file_dialog(
            defaultFilename,
            'JSON Files (*.json)'
        );

        if (!filepath) {
            // User cancelled
            return;
        }

        const response = await fetch('/save-file-to-path', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filepath: filepath,
                content: dataStr,
                content_type: 'json'
            })
        });

        const result = await response.json();
        if (result.success) {
            showMessage('Backup exported!', 'success');
        } else {
            showMessage('Export failed: ' + result.error, 'error');
        }
    } else {
        // Web mode: use browser download
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = defaultFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showMessage('Backup exported!', 'success');
    }
}

// Delete backup
function deleteBackup(backupId) {
    const backup = backups.find(b => b.id === backupId);
    if (!backup) return;

    if (!confirm(`Delete backup from ${new Date(backup.timestamp).toLocaleString()}?`)) {
        return;
    }

    backups = backups.filter(b => b.id !== backupId);
    saveBackups();
    loadBackupHistory();
    showMessage('Backup deleted', 'info');
}

// Clear all backup history
function clearBackupHistory() {
    if (!confirm('Delete all backups? This cannot be undone.\n\nConsider exporting important backups before clearing.')) {
        return;
    }

    backups = [];
    saveBackups();
    loadBackupHistory();
    showMessage('All backups cleared', 'info');
}

// Restore from uploaded file
function restoreFromFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const backup = JSON.parse(e.target.result);

            if (!backup.data || !backup.timestamp) {
                showMessage('Invalid backup file format', 'error');
                return;
            }

            if (!confirm(`Restore backup from ${new Date(backup.timestamp).toLocaleString()}?\n\nThis will overwrite your current data. This action cannot be undone.`)) {
                return;
            }

            // Restore data
            Object.keys(backup.data).forEach(key => {
                if (key === 'settings') {
                    if (backup.data.settings.theme) {
                        localStorage.setItem('theme', backup.data.settings.theme);
                    }
                } else {
                    const storageKey = getStorageKeyForDataType(key);
                    if (storageKey && backup.data[key]) {
                        localStorage.setItem(storageKey, backup.data[key]);
                    }
                }
            });

            showMessage('Backup restored successfully! Reloading page...', 'success');

            setTimeout(() => {
                location.reload();
            }, 1500);

        } catch (error) {
            console.error('Error restoring backup:', error);
            showMessage('Error reading backup file', 'error');
        }
    };
    reader.readAsText(file);

    // Reset file input
    event.target.value = '';
}

// Initialize backup system on page load
loadBackupSettings();

// Check for scheduled backups every hour
setInterval(() => {
    scheduleNextBackup();
}, 60 * 60 * 1000); // Check every hour

// Also check on page load
scheduleNextBackup();

