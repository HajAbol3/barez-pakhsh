// ===== Sample Data =====
const repairs = [
  {
    id: 1,
    date: '1405/05/01',
    vehicle: '۶۵ ایران ۴۶۳ ع ۹۶',
    mechanic: 'جعفر جعفری',
    part: 'بلبرینگ چرخ جلو',
    description: 'تعویض بلبرینگ دو طرف جلو',
    cost: 8300000,
    paid: 5000000,
    remaining: 3300000
  },
  {
    id: 2,
    date: '1405/06/01',
    vehicle: '۱۲۳ ب ۴۵',
    mechanic: 'علی رضایی',
    part: 'لنت ترمز',
    description: 'تعویض لنت جلو و عقب',
    cost: 1250000,
    paid: 1250000,
    remaining: 0
  },
  {
    id: 3,
    date: '1405/04/20',
    vehicle: '۷۸۹ الف ۱۲',
    mechanic: 'جعفر جعفری',
    part: 'دینام',
    description: 'تعویض دینام کامل',
    cost: 18500000,
    paid: 10000000,
    remaining: 8500000
  },
  {
    id: 4,
    date: '1405/03/08',
    vehicle: '۴۵۶ ج ۷۸',
    mechanic: 'حسین محمدی',
    part: 'روغن موتور + فیلتر',
    description: 'سرویس دوره‌ای',
    cost: 4800000,
    paid: 4800000,
    remaining: 0
  },
  {
    id: 5,
    date: '1405/06/10',
    vehicle: '۳۲۱ د ۹۰',
    mechanic: 'علی رضایی',
    part: 'دیسک ترمز',
    description: 'تعویض دیسک جلو',
    cost: 6200000,
    paid: 3000000,
    remaining: 3200000
  }
];

const mechanics = [
  { name: 'جعفر جعفری', repairs: 12, totalCost: 42000000, remaining: 11800000 },
  { name: 'علی رضایی', repairs: 9, totalCost: 18500000, remaining: 3200000 },
  { name: 'حسین محمدی', repairs: 6, totalCost: 9800000, remaining: 0 },
  { name: 'رضا کاظمی', repairs: 4, totalCost: 7500000, remaining: 1500000 }
];

const parts = [
  { name: 'بلبرینگ چرخ جلو', count: 4, lastUsed: '1405/05/01', totalCost: 18300000, vehicles: 'نیسان، پراید' },
  { name: 'لنت ترمز', count: 7, lastUsed: '1405/06/01', totalCost: 8750000, vehicles: 'پراید، پژو، وانت' },
  { name: 'دینام', count: 2, lastUsed: '1405/04/20', totalCost: 32000000, vehicles: 'پژو، نیسان' },
  { name: 'روغن موتور + فیلتر', count: 11, lastUsed: '1405/03/08', totalCost: 15600000, vehicles: 'همه خودروها' },
  { name: 'دیسک ترمز', count: 3, lastUsed: '1405/06/10', totalCost: 12400000, vehicles: 'نیسان، وانت' }
];

let editingId = null;

// ===== DOM =====
const repairsBody = document.getElementById('repairsBody');
const searchRepair = document.getElementById('searchRepair');
const addRepairBtn = document.getElementById('addRepairBtn');
const repairModal = document.getElementById('repairModal');
const closeRepairModal = document.getElementById('closeRepairModal');
const cancelRepairModal = document.getElementById('cancelRepairModal');
const repairForm = document.getElementById('repairForm');
const repairModalTitle = document.getElementById('repairModalTitle');

// ===== Helpers =====
function formatNumber(num) {
  return new Intl.NumberFormat('fa-IR').format(num);
}

// ===== Update Stats =====
function updateStats() {
  document.getElementById('statTotalRepairs').textContent = formatNumber(repairs.length);
  document.getElementById('statTotalCost').textContent = formatNumber(repairs.reduce((s, r) => s + r.cost, 0));
  document.getElementById('statMechanics').textContent = formatNumber(mechanics.length);
  document.getElementById('statRemaining').textContent = formatNumber(repairs.reduce((s, r) => s + r.remaining, 0));
}

// ===== Render Repairs Table =====
function renderRepairs(data = repairs) {
  repairsBody.innerHTML = '';

  if (data.length === 0) {
    repairsBody.innerHTML = `
      <tr>
        <td colspan="10">
          <div class="table-empty">
            <i class="bi bi-tools"></i>
            <p>موردی یافت نشد</p>
          </div>
        </td>
      </tr>`;
    return;
  }

  data.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${formatNumber(index + 1)}</td>
      <td>${item.date}</td>
      <td>${item.vehicle}</td>
      <td>${item.mechanic}</td>
      <td>${item.part}</td>
      <td>${item.description}</td>
      <td>${formatNumber(item.cost)}</td>
      <td>${formatNumber(item.paid)}</td>
      <td class="remaining ${item.remaining > 0 ? 'has-remain' : 'zero'}">${formatNumber(item.remaining)}</td>
      <td>
        <div class="table-actions">
          <button class="btn-icon edit" title="ویرایش" onclick="editRepair(${item.id})">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn-icon delete" title="حذف" onclick="deleteRepair(${item.id})">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </td>
    `;
    repairsBody.appendChild(row);
  });
}

// ===== Render Mechanics =====
function renderMechanics() {
  const grid = document.getElementById('mechanicsGrid');
  grid.innerHTML = mechanics.map(m => `
    <div class="mechanic-card">
      <div class="mechanic-header">
        <div class="mechanic-avatar">${m.name.charAt(0)}</div>
        <div class="mechanic-info">
          <h4>${m.name}</h4>
          <span>${formatNumber(m.repairs)} تعمیر</span>
        </div>
      </div>
      <div class="mechanic-stats">
        <div class="m-stat">
          <span class="val">${formatNumber(m.totalCost)}</span>
          <span class="lbl">جمع هزینه</span>
        </div>
        <div class="m-stat">
          <span class="val" style="color:${m.remaining > 0 ? '#dc2626' : '#059669'}">${formatNumber(m.remaining)}</span>
          <span class="lbl">مانده</span>
        </div>
      </div>
    </div>
  `).join('');
}

// ===== Render Parts =====
function renderParts() {
  const tbody = document.getElementById('partsBody');
  tbody.innerHTML = parts.map((p, i) => `
    <tr>
      <td>${formatNumber(i + 1)}</td>
      <td><strong>${p.name}</strong></td>
      <td>${formatNumber(p.count)}</td>
      <td>${p.lastUsed}</td>
      <td>${formatNumber(p.totalCost)}</td>
      <td>${p.vehicles}</td>
    </tr>
  `).join('');
}

// ===== Modal Functions =====
function openRepairModal(editData = null) {
  if (!repairModal) return;

  if (editData) {
    editingId = editData.id;
    repairModalTitle.innerHTML = `<i class="bi bi-pencil-square"></i> ویرایش تعمیر`;
    
    document.getElementById('repDate').value = editData.date;
    document.getElementById('repVehicle').value = editData.vehicle;
    document.getElementById('repMechanic').value = editData.mechanic;
    document.getElementById('repPart').value = editData.part;
    document.getElementById('repCost').value = editData.cost;
    document.getElementById('repPaid').value = editData.paid;
    document.getElementById('repDescription').value = editData.description || '';
  } else {
    editingId = null;
    repairModalTitle.innerHTML = `<i class="bi bi-plus-circle"></i> ثبت تعمیر جدید`;
    repairForm.reset();
    document.getElementById('repDate').value = '1405/06/25';
  }

  repairModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeRepairModalFunc() {
  if (repairModal) {
    repairModal.classList.remove('show');
    document.body.style.overflow = '';
    repairForm.reset();
    editingId = null;
  }
}

// ===== Actions =====
function editRepair(id) {
  const item = repairs.find(r => r.id === id);
  if (item) openRepairModal(item);
}

function deleteRepair(id) {
  if (confirm('آیا از حذف این تعمیر مطمئن هستید؟')) {
    const index = repairs.findIndex(r => r.id === id);
    if (index > -1) {
      repairs.splice(index, 1);
      renderRepairs();
      updateStats();
    }
  }
}

// ===== Events =====
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

searchRepair.addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  const filtered = repairs.filter(r =>
    r.vehicle.includes(q) ||
    r.mechanic.toLowerCase().includes(q) ||
    r.part.toLowerCase().includes(q) ||
    r.description.toLowerCase().includes(q)
  );
  renderRepairs(filtered);
});

addRepairBtn.addEventListener('click', () => openRepairModal());

closeRepairModal.addEventListener('click', closeRepairModalFunc);
cancelRepairModal.addEventListener('click', closeRepairModalFunc);

repairModal.addEventListener('click', (e) => {
  if (e.target === repairModal) closeRepairModalFunc();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && repairModal.classList.contains('show')) {
    closeRepairModalFunc();
  }
});

// ===== Submit Form =====
repairForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const cost = Number(document.getElementById('repCost').value) || 0;
  const paid = Number(document.getElementById('repPaid').value) || 0;

  const formData = {
    date: document.getElementById('repDate').value.trim(),
    vehicle: document.getElementById('repVehicle').value,
    mechanic: document.getElementById('repMechanic').value,
    part: document.getElementById('repPart').value.trim(),
    description: document.getElementById('repDescription').value.trim() || '-',
    cost: cost,
    paid: paid,
    remaining: cost - paid
  };

  if (editingId) {
    // ویرایش
    const index = repairs.findIndex(r => r.id === editingId);
    if (index > -1) {
      repairs[index] = { ...repairs[index], ...formData };
    }
    alert('تعمیر با موفقیت ویرایش شد');
  } else {
    // ثبت جدید
    repairs.unshift({
      id: Date.now(),
      ...formData
    });
    alert('تعمیر با موفقیت ثبت شد');
  }

  renderRepairs();
  updateStats();
  closeRepairModalFunc();
});

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  updateStats();
  renderRepairs();
  renderMechanics();
  renderParts();
});

