// PrintForge Pricing Calculator - Frontend JavaScript

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
        custom_margin: parseFloat(document.getElementById('custom_margin').value) || 75
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
            // Update results
            document.getElementById('result_material_cost').textContent = `$${result.material_cost.toFixed(2)}`;
            document.getElementById('result_labor_cost').textContent = `$${result.labor_cost.toFixed(2)}`;
            document.getElementById('result_machine_cost').textContent = 
                `$${result.machine_cost_total.toFixed(2)} (Depreciation: $${result.machine_depreciation.toFixed(2)} + Electricity: $${result.electricity_cost.toFixed(2)})`;
            document.getElementById('result_packaging_cost').textContent = `$${result.packaging_cost.toFixed(2)}`;
            document.getElementById('result_total_cost').textContent = `$${result.total_cost.toFixed(2)}`;
            
            document.getElementById('result_price_50').textContent = `$${result.price_50.toFixed(2)}`;
            document.getElementById('result_price_60').textContent = `$${result.price_60.toFixed(2)}`;
            document.getElementById('result_price_70').textContent = `$${result.price_70.toFixed(2)}`;
            document.getElementById('result_price_custom').textContent = `$${result.price_custom.toFixed(2)}`;

            document.getElementById('cost_per_hour').value = `$${result.cost_per_hour.toFixed(4)} /hour`;

            // Update Quick Summary Card
            updateQuickSummary(result);

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
        if (!input.id || input.id !== 'load-file') {
            input.addEventListener('input', autoCalculate);
        }
    });
    
    // Initial calculation
    calculate();
});

// Save Configuration
async function saveConfig() {
    try {
        const config = collectFormData();
        const filename = `${config.part_name.replace(/ /g, '_')}_Config.json`;
        
        const response = await fetch('/save-config', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filename, config })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Trigger download
            const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
            
            showMessage('Configuration saved!', 'success');
        } else {
            showMessage('Save failed: ' + result.error, 'error');
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
            a.download = `${data.part_name.replace(/ /g, '_')}_Pricing.xlsx`;
            a.click();
            URL.revokeObjectURL(url);
            
            showMessage('Excel file exported!', 'success');
        } else {
            const result = await response.json();
            showMessage('Export failed: ' + result.error, 'error');
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
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeText = document.getElementById('themeText');
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

    // Update icon and text
    if (theme === 'light') {
        themeIcon.innerHTML = sunIcon;
        themeText.textContent = 'Light';
    } else {
        themeIcon.innerHTML = moonIcon;
        themeText.textContent = 'Dark';
    }
}

// Toggle theme
themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

// Listen for system theme changes
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    setTheme(getInitialTheme());
    loadSettings();
    updateMaterialPresetFilters();
});

// Quick Summary Card Functions
function updateQuickSummary(result) {
    document.getElementById('summary_total_cost').textContent = `NZD $${result.total_cost.toFixed(2)}`;
    document.getElementById('summary_recommended_price').textContent = `NZD $${result.price_70.toFixed(2)}`;
    document.getElementById('summary_materials').textContent = `NZD $${result.material_cost.toFixed(2)}`;
    document.getElementById('summary_labor').textContent = `NZD $${result.labor_cost.toFixed(2)}`;
    document.getElementById('summary_machine').textContent = `NZD $${result.machine_cost_total.toFixed(2)}`;
    document.getElementById('summary_packaging').textContent = `NZD $${result.packaging_cost.toFixed(2)}`;
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
// FORMTECH NZ CATALOG DATA
// ============================================================================

const formtechCatalog = {
    supplier: 'Formtech NZ',
    location: 'Christchurch, NZ',
    currency: 'NZD',
    lastUpdated: '2026-01',
    website: 'https://www.formtech.co.nz',

    manufacturers: {
        'Kiwifil': { country: 'New Zealand', eco: true, specialty: 'Local & Sustainable' },
        '3DXTech': { country: 'USA', eco: false, specialty: 'Engineering Grade' },
        'Polymaker': { country: 'China', eco: false, specialty: 'Consumer & Pro' },
        'Fillamentum': { country: 'Czech Republic', eco: false, specialty: 'Premium Quality' },
        'Azurefilm': { country: 'Croatia', eco: false, specialty: 'Value Range' },
        'Prusa': { country: 'Czech Republic', eco: false, specialty: 'Quality Assured' }
    },

    products: [
        // Kiwifil - New Zealand Made
        { id: 'kw-pla-175-1kg', material: 'PLA', manufacturer: 'Kiwifil', name: 'Standard PLA', diameter: 1.75, spoolSize: 1.0, pricePerKg: 45, recycled: false, madeInNZ: true },
        { id: 'kw-rpla-175-1kg', material: 'rPLA', manufacturer: 'Kiwifil', name: 'Recycled PLA Pro', diameter: 1.75, spoolSize: 1.0, pricePerKg: 52, recycled: true, madeInNZ: true },
        { id: 'kw-pla-175-05kg', material: 'PLA', manufacturer: 'Kiwifil', name: 'Standard PLA', diameter: 1.75, spoolSize: 0.5, pricePerKg: 45, recycled: false, madeInNZ: true },
        { id: 'kw-petg-175-1kg', material: 'PETG', manufacturer: 'Kiwifil', name: 'Standard PETG', diameter: 1.75, spoolSize: 1.0, pricePerKg: 58, recycled: false, madeInNZ: true },

        // 3DXTech - Engineering Materials
        { id: '3dx-pla-175-1kg', material: 'PLA', manufacturer: '3DXTech', name: '3DXPLA', diameter: 1.75, spoolSize: 1.0, pricePerKg: 48, recycled: false, madeInNZ: false },
        { id: '3dx-petg-175-1kg', material: 'PETG', manufacturer: '3DXTech', name: '3DXPETG', diameter: 1.75, spoolSize: 1.0, pricePerKg: 62, recycled: false, madeInNZ: false },
        { id: '3dx-petgcf-175-1kg', material: 'PETG-CF', manufacturer: '3DXTech', name: 'Carbon Fiber PETG', diameter: 1.75, spoolSize: 1.0, pricePerKg: 95, recycled: false, madeInNZ: false },
        { id: '3dx-abs-175-1kg', material: 'ABS', manufacturer: '3DXTech', name: 'Engineering ABS', diameter: 1.75, spoolSize: 1.0, pricePerKg: 52, recycled: false, madeInNZ: false },
        { id: '3dx-asa-175-1kg', material: 'ASA', manufacturer: '3DXTech', name: 'Weather Resistant ASA', diameter: 1.75, spoolSize: 1.0, pricePerKg: 68, recycled: false, madeInNZ: false },
        { id: '3dx-nylon-175-1kg', material: 'Nylon', manufacturer: '3DXTech', name: 'Nylon 645', diameter: 1.75, spoolSize: 1.0, pricePerKg: 78, recycled: false, madeInNZ: false },
        { id: '3dx-pc-175-1kg', material: 'PC', manufacturer: '3DXTech', name: 'Polycarbonate', diameter: 1.75, spoolSize: 1.0, pricePerKg: 98, recycled: false, madeInNZ: false },
        { id: '3dx-tpu-175-05kg', material: 'TPU', manufacturer: '3DXTech', name: 'Flexible TPU 95A', diameter: 1.75, spoolSize: 0.5, pricePerKg: 85, recycled: false, madeInNZ: false },

        // Polymaker - Consumer Range
        { id: 'pm-pla-175-1kg', material: 'PLA', manufacturer: 'Polymaker', name: 'PolyLite PLA', diameter: 1.75, spoolSize: 1.0, pricePerKg: 42, recycled: false, madeInNZ: false },
        { id: 'pm-petg-175-1kg', material: 'PETG', manufacturer: 'Polymaker', name: 'PolyLite PETG', diameter: 1.75, spoolSize: 1.0, pricePerKg: 55, recycled: false, madeInNZ: false },
        { id: 'pm-polyterra-175-1kg', material: 'PLA', manufacturer: 'Polymaker', name: 'PolyTerra PLA (Eco)', diameter: 1.75, spoolSize: 1.0, pricePerKg: 46, recycled: false, madeInNZ: false },
        { id: 'pm-abs-175-1kg', material: 'ABS', manufacturer: 'Polymaker', name: 'PolyLite ABS', diameter: 1.75, spoolSize: 1.0, pricePerKg: 48, recycled: false, madeInNZ: false },

        // Fillamentum - Premium
        { id: 'fm-pla-175-1kg', material: 'PLA', manufacturer: 'Fillamentum', name: 'PLA Extrafill', diameter: 1.75, spoolSize: 1.0, pricePerKg: 58, recycled: false, madeInNZ: false },
        { id: 'fm-petg-175-1kg', material: 'PETG', manufacturer: 'Fillamentum', name: 'PETG Extrafill', diameter: 1.75, spoolSize: 1.0, pricePerKg: 65, recycled: false, madeInNZ: false },
        { id: 'fm-asa-175-1kg', material: 'ASA', manufacturer: 'Fillamentum', name: 'ASA Extrafill', diameter: 1.75, spoolSize: 1.0, pricePerKg: 72, recycled: false, madeInNZ: false },
        { id: 'fm-nylon-175-1kg', material: 'Nylon', manufacturer: 'Fillamentum', name: 'Nylon FX256', diameter: 1.75, spoolSize: 1.0, pricePerKg: 82, recycled: false, madeInNZ: false },

        // Prusa - Quality Range
        { id: 'pr-pla-175-1kg', material: 'PLA', manufacturer: 'Prusa', name: 'Prusament PLA', diameter: 1.75, spoolSize: 1.0, pricePerKg: 52, recycled: false, madeInNZ: false },
        { id: 'pr-petg-175-1kg', material: 'PETG', manufacturer: 'Prusa', name: 'Prusament PETG', diameter: 1.75, spoolSize: 1.0, pricePerKg: 58, recycled: false, madeInNZ: false },
        { id: 'pr-asa-175-1kg', material: 'ASA', manufacturer: 'Prusa', name: 'Prusament ASA', diameter: 1.75, spoolSize: 1.0, pricePerKg: 68, recycled: false, madeInNZ: false },

        // Azurefilm - Value Range
        { id: 'az-pla-175-1kg', material: 'PLA', manufacturer: 'Azurefilm', name: 'Azure PLA', diameter: 1.75, spoolSize: 1.0, pricePerKg: 38, recycled: false, madeInNZ: false },
        { id: 'az-petg-175-1kg', material: 'PETG', manufacturer: 'Azurefilm', name: 'Azure PETG', diameter: 1.75, spoolSize: 1.0, pricePerKg: 48, recycled: false, madeInNZ: false },
        { id: 'az-abs-175-1kg', material: 'ABS', manufacturer: 'Azurefilm', name: 'Azure ABS', diameter: 1.75, spoolSize: 1.0, pricePerKg: 45, recycled: false, madeInNZ: false }
    ]
};

// ============================================================================
// SETTINGS MANAGEMENT
// ============================================================================

const defaultSettings = {
    regional: {
        location: 'Christchurch, NZ',
        currency: 'NZD',
        showServiceArea: true
    },
    materialPreferences: {
        defaultSupplier: 'Formtech NZ',
        preferredManufacturer: 'All',
        showRecycled: true,
        nzMadeOnly: false
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
                materialPreferences: { ...defaultSettings.materialPreferences, ...appSettings.materialPreferences },
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

// Toggle settings sidebar
function toggleSettings() {
    const sidebar = document.getElementById('settings-sidebar');
    const overlay = document.getElementById('settings-overlay');

    if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        overlay.classList.remove('visible');
    } else {
        sidebar.classList.add('open');
        overlay.classList.add('visible');
        populateSettingsUI();
    }
}

// Populate settings UI with current values
function populateSettingsUI() {
    // Regional
    document.getElementById('setting_location').value = appSettings.regional.location;
    document.getElementById('setting_currency').value = appSettings.regional.currency;
    document.getElementById('setting_show_service_area').checked = appSettings.regional.showServiceArea;

    // Material Preferences
    document.getElementById('setting_supplier').value = appSettings.materialPreferences.defaultSupplier;
    document.getElementById('setting_manufacturer').value = appSettings.materialPreferences.preferredManufacturer;
    document.getElementById('setting_show_recycled').checked = appSettings.materialPreferences.showRecycled;
    document.getElementById('setting_nz_made_only').checked = appSettings.materialPreferences.nzMadeOnly;

    // Display
    document.getElementById('setting_units').value = appSettings.display.units;
    document.getElementById('setting_decimal_places').value = appSettings.display.decimalPlaces;
    document.getElementById('setting_auto_calculate').checked = appSettings.display.autoCalculate;

    // Export
    document.getElementById('setting_company_name').value = appSettings.export.companyName;
}

// Apply settings from UI
function applySettings() {
    // Regional
    appSettings.regional.location = document.getElementById('setting_location').value;
    appSettings.regional.currency = document.getElementById('setting_currency').value;
    appSettings.regional.showServiceArea = document.getElementById('setting_show_service_area').checked;

    // Material Preferences
    appSettings.materialPreferences.defaultSupplier = document.getElementById('setting_supplier').value;
    appSettings.materialPreferences.preferredManufacturer = document.getElementById('setting_manufacturer').value;
    appSettings.materialPreferences.showRecycled = document.getElementById('setting_show_recycled').checked;
    appSettings.materialPreferences.nzMadeOnly = document.getElementById('setting_nz_made_only').checked;

    // Display
    appSettings.display.units = document.getElementById('setting_units').value;
    appSettings.display.decimalPlaces = parseInt(document.getElementById('setting_decimal_places').value);
    appSettings.display.autoCalculate = document.getElementById('setting_auto_calculate').checked;

    // Export
    appSettings.export.companyName = document.getElementById('setting_company_name').value;

    saveSettings();
    toggleSettings();

    // Update material preset filters
    updateMaterialPresetFilters();
}

// ============================================================================
// ENHANCED MATERIAL PRESET SYSTEM
// ============================================================================

// Filter products based on current settings and selections
function getFilteredProducts() {
    const materialType = document.getElementById('preset_material_type').value;
    const manufacturer = document.getElementById('preset_manufacturer').value;
    const diameter = parseFloat(document.getElementById('preset_diameter').value);
    const spoolSize = parseFloat(document.getElementById('preset_spool_size').value);

    let filtered = formtechCatalog.products;

    // Apply filters
    if (materialType && materialType !== 'All') {
        filtered = filtered.filter(p => p.material === materialType);
    }

    if (manufacturer && manufacturer !== 'All') {
        filtered = filtered.filter(p => p.manufacturer === manufacturer);
    }

    if (diameter) {
        filtered = filtered.filter(p => p.diameter === diameter);
    }

    if (spoolSize) {
        filtered = filtered.filter(p => p.spoolSize === spoolSize);
    }

    // Apply settings filters
    if (appSettings.materialPreferences.nzMadeOnly) {
        filtered = filtered.filter(p => p.madeInNZ);
    }

    if (!appSettings.materialPreferences.showRecycled) {
        filtered = filtered.filter(p => !p.recycled);
    }

    if (appSettings.materialPreferences.preferredManufacturer !== 'All') {
        filtered = filtered.filter(p => p.manufacturer === appSettings.materialPreferences.preferredManufacturer);
    }

    return filtered;
}

// Update material preset filters
function updateMaterialPresetFilters() {
    const products = getFilteredProducts();
    const productSelect = document.getElementById('preset_product');

    // Clear current options
    productSelect.innerHTML = '<option value="">-- Select Product --</option>';

    // Populate with filtered products
    products.forEach(product => {
        const totalPrice = product.pricePerKg * product.spoolSize;
        const nzBadge = product.madeInNZ ? ' 🇳🇿' : '';
        const recycledBadge = product.recycled ? ' ♻️' : '';
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = `${product.manufacturer} ${product.name} ${product.diameter}mm ${product.spoolSize}kg - NZD $${totalPrice.toFixed(2)}${nzBadge}${recycledBadge}`;
        productSelect.appendChild(option);
    });
}

// Apply selected material preset
function applyMaterialPreset() {
    const productId = document.getElementById('preset_product').value;

    if (!productId) {
        showMessage('Please select a product', 'error');
        return;
    }

    const product = formtechCatalog.products.find(p => p.id === productId);

    if (product) {
        const pricePerKg = product.pricePerKg;
        document.getElementById('filament_cost').value = pricePerKg.toFixed(2);

        const totalPrice = product.pricePerKg * product.spoolSize;
        const nzBadge = product.madeInNZ ? ' (Made in NZ 🇳🇿)' : '';
        const recycledBadge = product.recycled ? ' (Recycled ♻️)' : '';

        showMessage(
            `Applied: ${product.manufacturer} ${product.name} - NZD $${pricePerKg.toFixed(2)}/kg (${product.spoolSize}kg spool = $${totalPrice.toFixed(2)})${nzBadge}${recycledBadge}`,
            'success'
        );

        autoCalculate();
    }
}

// Keyboard Shortcuts
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
