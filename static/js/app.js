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
    loadCustomPresets(); // Load custom material presets
    addBatchRow(); // Initialize batch with one row
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
// SETTINGS MANAGEMENT
// ============================================================================

const defaultSettings = {
    regional: {
        location: 'Christchurch, NZ',
        currency: 'NZD',
        showServiceArea: true
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

    // Display
    appSettings.display.units = document.getElementById('setting_units').value;
    appSettings.display.decimalPlaces = parseInt(document.getElementById('setting_decimal_places').value);
    appSettings.display.autoCalculate = document.getElementById('setting_auto_calculate').checked;

    // Export
    appSettings.export.companyName = document.getElementById('setting_company_name').value;

    saveSettings();
    toggleSettings();
}

// ============================================================================
// SIMPLIFIED MATERIAL PRESET SYSTEM
// ============================================================================

let customMaterialPresets = [];

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
    populateCustomPresets();
}

// Save custom presets to localStorage
function saveCustomPresets() {
    localStorage.setItem('printforge_material_presets', JSON.stringify(customMaterialPresets));
}

// Toggle preset creation form
function togglePresetForm() {
    const form = document.getElementById('preset-form');
    const btn = document.getElementById('preset-toggle-btn');

    if (form.style.display === 'none') {
        form.style.display = 'block';
        btn.textContent = '✖ Cancel';
    } else {
        form.style.display = 'none';
        btn.textContent = '➕ Create Custom Preset';
        // Clear form
        document.getElementById('new_preset_name').value = '';
        document.getElementById('new_preset_material').value = '';
        document.getElementById('new_preset_cost').value = '';
        document.getElementById('new_preset_supplier').value = '';
    }
}

// Save a new custom preset
function saveCustomPreset() {
    const name = document.getElementById('new_preset_name').value.trim();
    const material = document.getElementById('new_preset_material').value.trim();
    const cost = parseFloat(document.getElementById('new_preset_cost').value);
    const supplier = document.getElementById('new_preset_supplier').value.trim() || 'Custom';

    if (!name || !material || !cost || cost <= 0) {
        showMessage('Please fill in all required fields with valid values', 'error');
        return;
    }

    const preset = {
        id: `preset-${Date.now()}`,
        name,
        material,
        cost,
        supplier
    };

    customMaterialPresets.push(preset);
    saveCustomPresets();
    populateCustomPresets();
    togglePresetForm();
    showMessage(`Preset "${name}" saved successfully`, 'success');
}

// Populate custom preset dropdown
function populateCustomPresets() {
    const select = document.getElementById('custom_preset_select');
    select.innerHTML = '<option value="">-- Select a Preset --</option>';

    customMaterialPresets.forEach(preset => {
        const option = document.createElement('option');
        option.value = preset.id;
        option.textContent = `${preset.name} - ${preset.material} @ NZD $${preset.cost.toFixed(2)}/kg (${preset.supplier})`;
        select.appendChild(option);
    });

    // Show/hide delete button based on selection
    const actions = document.getElementById('preset-actions');
    actions.style.display = customMaterialPresets.length > 0 ? 'block' : 'none';
}

// Apply selected custom preset
function applyCustomPreset() {
    const select = document.getElementById('custom_preset_select');
    const presetId = select.value;

    if (!presetId) return;

    const preset = customMaterialPresets.find(p => p.id === presetId);

    if (preset) {
        document.getElementById('filament_cost').value = preset.cost.toFixed(2);
        showMessage(`Applied preset: ${preset.name} - NZD $${preset.cost.toFixed(2)}/kg`, 'success');
        autoCalculate();
    }
}

// Delete selected preset
function deleteSelectedPreset() {
    const select = document.getElementById('custom_preset_select');
    const presetId = select.value;

    if (!presetId) {
        showMessage('Please select a preset to delete', 'error');
        return;
    }

    const preset = customMaterialPresets.find(p => p.id === presetId);

    if (preset && confirm(`Delete preset "${preset.name}"?`)) {
        customMaterialPresets = customMaterialPresets.filter(p => p.id !== presetId);
        saveCustomPresets();
        populateCustomPresets();
        showMessage(`Preset "${preset.name}" deleted`, 'info');
    }
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
                    <h2>⚙️ Print Profile Manager</h2>
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
