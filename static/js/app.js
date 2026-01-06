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

// Calculate Pricing
async function calculate() {
    try {
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
