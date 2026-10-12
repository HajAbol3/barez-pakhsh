// ===== Sample Data =====
const payrollData = [
  {
    id: 1,
    driver: 'ابوذر دهقان اناری',
    distance: 81407,
    customers: 4386,
    deliveries: 194,
    food: 1850000,
    years: 2400000,
    insurance: 1200000,
    extra: 950000,
    advance: -3000000,
    penalty: -450000,
    deliveryPay: 12500000,
    commission: 3200000,
    finalPay: 0
  },
  {
    id: 2,
    driver: 'علی محمدی',
    distance: 62340,
    customers: 3120,
    deliveries: 156,
    food: 1600000,
    years: 1800000,
    insurance: 1100000,
    extra: 700000,
    advance: -1500000,
    penalty: 0,
    deliveryPay: 9800000,
    commission: 2450000,
    finalPay: 0
  },
  {
    id: 3,
    driver: 'رضا کریمی',
    distance: 58920,
    customers: 2875,
    deliveries: 132,
    food: 1450000,
    years: 1500000,
    insurance: 1050000,
    extra: 600000,
    advance: -2000000,
    penalty: -200000,
    deliveryPay: 8900000,
    commission: 2100000,
    finalPay: 0
  },
  {
    id: 4,
    driver: 'حسین رضایی',
    distance: 41250,
    customers: 1980,
    deliveries: 98,
    food: 1200000,
    years: 1200000,
    insurance: 950000,
    extra: 400000,
    advance: 0,
    penalty: 0,
    deliveryPay: 7200000,
    commission: 1650000,
    finalPay: 0
  },
  {
    id: 5,
    driver: 'سعید نوری',
    distance: 67890,
    customers: 3450,
    deliveries: 145,
    food: 1700000,
    years: 2000000,
    insurance: 1150000,
    extra: 800000,
    advance: -1000000,
    penalty: -150000,
    deliveryPay: 11000000,
    commission: 2800000,
    finalPay: 0
  },
  {
    id: 6,
    driver: 'محمد احمدی',
    distance: 35680,
    customers: 1650,
    deliveries: 87,
    food: 1100000,
    years: 900000,
    insurance: 900000,
    extra: 300000,
    advance: -500000,
    penalty: 0,
    deliveryPay: 6500000,
    commission: 1400000,
    finalPay: 0
  }
];

let editingId = null;

// ===== DOM =====
const payrollModal = document.getElementById('payrollModal');
const closePayrollModal = document.getElementById('closePayrollModal');
const cancelPayrollModal = document.getElementById('cancelPayrollModal');
const payrollForm = document.getElementById('payrollForm');
const payrollModalTitle = document.getElementById('payrollModalTitle');

// ===== Helpers =====
function formatNumber(num) {
  return new Intl.NumberFormat('fa-IR').format(Math.abs(num));
}

function formatMoney(num) {
  if (num < 0) return '-' + formatNumber(num);
  return formatNumber(num);
}

// ===== محاسبه حقوق هر راننده =====
function calculateFinalPay(item) {
  // فرمول ساده:
  // پرداخت نهایی = (تغذیه + سنوات + بیمه + اضافات + حق پخش + پورسانت) + مساعده + جریمه
  return (
    item.food +
    item.years +
    item.insurance +
    item.extra +
    item.deliveryPay +
    item.commission +
    item.advance +
    item.penalty
  );
}

// ===== محاسبه همه حقوق‌ها =====
function calculateAllPayroll() {
  payrollData.forEach(item => {
    item.finalPay = calculateFinalPay(item);
  });
}

// ===== Render Table =====
function renderTable(data = payrollData) {
  const tbody = document.getElementById('payrollBody');
  tbody.innerHTML = '';

  if (data.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="15">
          <div class="table-empty">
            <i class="bi bi-cash-stack"></i>
            <p>داده‌ای برای این ماه یافت نشد</p>
          </div>
        </td>
      </tr>
    `;
    updateSummary([]);
    return;
  }

  data.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${formatNumber(index + 1)}</td>
      <td><strong>${item.driver}</strong></td>
      <td>${formatNumber(item.distance)}</td>
      <td>${formatNumber(item.customers)}</td>
      <td>${formatNumber(item.deliveries)}</td>
      <td>${formatMoney(item.food)}</td>
      <td>${formatMoney(item.years)}</td>
      <td>${formatMoney(item.insurance)}</td>
      <td>${formatMoney(item.extra)}</td>
      <td class="${item.advance < 0 ? 'negative' : ''}">${formatMoney(item.advance)}</td>
      <td class="${item.penalty < 0 ? 'negative' : ''}">${formatMoney(item.penalty)}</td>
      <td>${formatMoney(item.deliveryPay)}</td>
      <td>${formatMoney(item.commission)}</td>
      <td class="final-pay">${formatMoney(item.finalPay)}</td>
      <td>
        <div class="table-actions">
          <button class="btn-icon edit" title="ویرایش" onclick="editPayroll(${item.id})">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn-icon delete" title="حذف" onclick="deletePayroll(${item.id})">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });

  updateSummary(data);
}

// ===== Update Summary =====
function updateSummary(data) {
  document.getElementById('sumDrivers').textContent = formatNumber(data.length);
  document.getElementById('sumDelivery').textContent = formatNumber(data.reduce((s, i) => s + i.deliveryPay, 0));
  document.getElementById('sumCommission').textContent = formatNumber(data.reduce((s, i) => s + i.commission, 0));
  document.getElementById('sumFinal').textContent = formatNumber(data.reduce((s, i) => s + i.finalPay, 0));
}

// ===== Modal Functions =====
function openPayrollModal(editData) {
  if (!payrollModal || !editData) return;

  editingId = editData.id;
  payrollModalTitle.innerHTML = `<i class="bi bi-pencil-square"></i> ویرایش حقوق - ${editData.driver}`;

  document.getElementById('payDriver').value = editData.driver;
  document.getElementById('payDistance').value = editData.distance;
  document.getElementById('payCustomers').value = editData.customers;
  document.getElementById('payDeliveries').value = editData.deliveries;
  document.getElementById('payFood').value = editData.food;
  document.getElementById('payYears').value = editData.years;
  document.getElementById('payInsurance').value = editData.insurance;
  document.getElementById('payExtra').value = editData.extra;
  document.getElementById('payAdvance').value = editData.advance;
  document.getElementById('payPenalty').value = editData.penalty;
  document.getElementById('payDeliveryPay').value = editData.deliveryPay;
  document.getElementById('payCommission').value = editData.commission;
  document.getElementById('payFinal').value = editData.finalPay;

  payrollModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closePayrollModalFunc() {
  if (payrollModal) {
    payrollModal.classList.remove('show');
    document.body.style.overflow = '';
    payrollForm.reset();
    editingId = null;
  }
}

// ===== Events =====
document.getElementById('searchDriver').addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  const filtered = payrollData.filter(item => item.driver.toLowerCase().includes(q));
  renderTable(filtered);
});

document.getElementById('yearSelect').addEventListener('change', () => {
  renderTable(payrollData);
});

document.getElementById('monthSelect').addEventListener('change', () => {
  renderTable(payrollData);
});

// ===== دکمه محاسبه حقوق =====
document.getElementById('calcBtn').addEventListener('click', () => {
  // انجام محاسبه
  calculateAllPayroll();

  // رفرش جدول و کارت‌ها
  renderTable(payrollData);

  // نمایش نتیجه
  const totalFinal = payrollData.reduce((s, i) => s + i.finalPay, 0);
  const year = document.getElementById('yearSelect').value;
  const monthText = document.getElementById('monthSelect').options[document.getElementById('monthSelect').selectedIndex].text;

  alert(`محاسبه حقوق با موفقیت انجام شد\n\nسال: ${year}\nماه: ${monthText}\nجمع پرداخت نهایی: ${formatMoney(totalFinal)} تومان`);
});

// Modal close events
if (closePayrollModal) closePayrollModal.addEventListener('click', closePayrollModalFunc);
if (cancelPayrollModal) cancelPayrollModal.addEventListener('click', closePayrollModalFunc);

if (payrollModal) {
  payrollModal.addEventListener('click', (e) => {
    if (e.target === payrollModal) closePayrollModalFunc();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && payrollModal && payrollModal.classList.contains('show')) {
    closePayrollModalFunc();
  }
});

// ===== Submit Form =====
if (payrollForm) {
  payrollForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!editingId) return;

    const index = payrollData.findIndex(p => p.id === editingId);
    if (index === -1) return;

    const updated = {
      ...payrollData[index],
      distance: Number(document.getElementById('payDistance').value) || 0,
      customers: Number(document.getElementById('payCustomers').value) || 0,
      deliveries: Number(document.getElementById('payDeliveries').value) || 0,
      food: Number(document.getElementById('payFood').value) || 0,
      years: Number(document.getElementById('payYears').value) || 0,
      insurance: Number(document.getElementById('payInsurance').value) || 0,
      extra: Number(document.getElementById('payExtra').value) || 0,
      advance: Number(document.getElementById('payAdvance').value) || 0,
      penalty: Number(document.getElementById('payPenalty').value) || 0,
      deliveryPay: Number(document.getElementById('payDeliveryPay').value) || 0,
      commission: Number(document.getElementById('payCommission').value) || 0
    };

    // محاسبه مجدد پرداخت نهایی
    updated.finalPay = calculateFinalPay(updated);

    payrollData[index] = updated;

    alert('حقوق با موفقیت ویرایش و محاسبه شد');
    renderTable();
    closePayrollModalFunc();
  });
}

// ===== Edit Function =====
function editPayroll(id) {
  const item = payrollData.find(p => p.id === id);
  if (item) openPayrollModal(item);
}

// ===== Delete Function =====
function deletePayroll(id) {
  if (!confirm('آیا از حذف این رکورد حقوق مطمئن هستید؟')) return;

  const index = payrollData.findIndex(p => p.id === id);
  if (index > -1) {
    payrollData.splice(index, 1);
    renderTable();
    alert('رکورد با موفقیت حذف شد');
  }
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  // اول یکبار محاسبه کن تا جدول خالی نباشه
  calculateAllPayroll();
  renderTable();
});