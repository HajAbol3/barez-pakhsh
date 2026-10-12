// ===== Sample Data =====
const companyLoans = [
  {
    id: 1,
    driver: 'ابوذر دهقان اناری',
    principal: 450000000,
    paid: 170000000,
    remaining: 280000000,
    lastInstallment: '1405/06/15',
    status: 'active'
  },
  {
    id: 2,
    driver: 'علی محمدی',
    principal: 320000000,
    paid: 320000000,
    remaining: 0,
    lastInstallment: '1405/05/20',
    status: 'finished'
  },
  {
    id: 3,
    driver: 'رضا کریمی',
    principal: 280000000,
    paid: 95000000,
    remaining: 185000000,
    lastInstallment: '1405/06/10',
    status: 'active'
  },
  {
    id: 4,
    driver: 'حسین رضایی',
    principal: 150000000,
    paid: 60000000,
    remaining: 90000000,
    lastInstallment: '1405/06/05',
    status: 'active'
  }
];

const personalLoans = [
  {
    id: 101,
    driver: 'ابوذر دهقان اناری',
    principal: 50000000,
    paid: 32000000,
    remaining: 18000000,
    lastInstallment: '1405/06/12',
    status: 'active'
  },
  {
    id: 102,
    driver: 'سعید نوری',
    principal: 30000000,
    paid: 30000000,
    remaining: 0,
    lastInstallment: '1405/04/25',
    status: 'finished'
  },
  {
    id: 103,
    driver: 'محمد احمدی',
    principal: 80000000,
    paid: 25000000,
    remaining: 55000000,
    lastInstallment: '1405/06/18',
    status: 'active'
  },
  {
    id: 104,
    driver: 'امیر حسینی',
    principal: 40000000,
    paid: 15000000,
    remaining: 25000000,
    lastInstallment: '1405/06/08',
    status: 'active'
  }
];

let editingId = null;
let editingType = null; // 'company' یا 'personal'

// ===== DOM =====
const loanModal = document.getElementById('loanModal');
const closeLoanModal = document.getElementById('closeLoanModal');
const cancelLoanModal = document.getElementById('cancelLoanModal');
const loanForm = document.getElementById('loanForm');
const loanModalTitle = document.getElementById('loanModalTitle');

// ===== Helpers =====
function formatNumber(num) {
  return new Intl.NumberFormat('fa-IR').format(num);
}

// ===== Update Stats =====
function updateStats() {
  const allLoans = [...companyLoans, ...personalLoans];
  const activeCount = allLoans.filter(l => l.status === 'active').length;
  const totalPaid = allLoans.reduce((s, l) => s + l.paid, 0);
  const totalRemaining = allLoans.reduce((s, l) => s + l.remaining, 0);
  const installmentsCount = allLoans.filter(l => l.paid > 0).length;

  document.getElementById('statActiveLoans').textContent = formatNumber(activeCount);
  document.getElementById('statPaid').textContent = formatNumber(totalPaid);
  document.getElementById('statInstallments').textContent = formatNumber(installmentsCount);
  document.getElementById('statRemaining').textContent = formatNumber(totalRemaining);
}

// ===== Render Table =====
function renderTable(data, tbodyId) {
  const tbody = document.getElementById(tbodyId);
  tbody.innerHTML = '';

  if (data.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8">
          <div class="table-empty">
            <i class="bi bi-credit-card"></i>
            <p>وامی یافت نشد</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  data.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${formatNumber(index + 1)}</td>
      <td><strong>${item.driver}</strong></td>
      <td>${formatNumber(item.principal)}</td>
      <td>${formatNumber(item.paid)}</td>
      <td class="remaining-amount ${item.remaining > 0 ? 'has-remain' : 'zero'}">${formatNumber(item.remaining)}</td>
      <td>${item.lastInstallment}</td>
      <td>
        <span class="loan-status ${item.status}">
          ${item.status === 'active' ? 'فعال' : 'تسویه شده'}
        </span>
      </td>
      <td>
        <div class="table-actions">
          <button class="btn-icon edit" title="ویرایش" onclick="editLoan('${tbodyId}', ${item.id})">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn-icon delete" title="حذف" onclick="deleteLoan('${tbodyId}', ${item.id})">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// ===== Modal Functions =====
function openLoanModal(type = 'company', editData = null) {
  if (!loanModal) return;

  editingType = type;

  if (editData) {
    editingId = editData.id;
    loanModalTitle.innerHTML = `<i class="bi bi-pencil-square"></i> ویرایش وام`;

    document.getElementById('loanType').value = type;
    document.getElementById('loanDriver').value = editData.driver;
    document.getElementById('loanPrincipal').value = editData.principal;
    document.getElementById('loanPaid').value = editData.paid;
    document.getElementById('loanLastInstallment').value = editData.lastInstallment;
    document.getElementById('loanStatus').value = editData.status;
  } else {
    editingId = null;
    loanModalTitle.innerHTML = `<i class="bi bi-plus-circle"></i> افزودن وام`;
    loanForm.reset();
    document.getElementById('loanType').value = type;
    document.getElementById('loanStatus').value = 'active';
  }

  loanModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeLoanModalFunc() {
  if (loanModal) {
    loanModal.classList.remove('show');
    document.body.style.overflow = '';
    loanForm.reset();
    editingId = null;
    editingType = null;
  }
}

// ===== Tabs =====
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// ===== Search =====
document.getElementById('searchCompany').addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  const filtered = companyLoans.filter(l => l.driver.toLowerCase().includes(q));
  renderTable(filtered, 'companyLoansBody');
});

document.getElementById('searchPersonal').addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  const filtered = personalLoans.filter(l => l.driver.toLowerCase().includes(q));
  renderTable(filtered, 'personalLoansBody');
});

// ===== Add Buttons =====
document.getElementById('addCompanyLoanBtn').addEventListener('click', () => {
  openLoanModal('company');
});

document.getElementById('addPersonalLoanBtn').addEventListener('click', () => {
  openLoanModal('personal');
});

// ===== Modal Events =====
closeLoanModal.addEventListener('click', closeLoanModalFunc);
cancelLoanModal.addEventListener('click', closeLoanModalFunc);

loanModal.addEventListener('click', (e) => {
  if (e.target === loanModal) closeLoanModalFunc();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && loanModal.classList.contains('show')) {
    closeLoanModalFunc();
  }
});

// ===== Submit Form =====
loanForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const principal = Number(document.getElementById('loanPrincipal').value) || 0;
  const paid = Number(document.getElementById('loanPaid').value) || 0;
  const type = document.getElementById('loanType').value;

  const formData = {
    driver: document.getElementById('loanDriver').value,
    principal: principal,
    paid: paid,
    remaining: principal - paid,
    lastInstallment: document.getElementById('loanLastInstallment').value.trim(),
    status: document.getElementById('loanStatus').value
  };

  if (editingId) {
    // ویرایش
    if (type === 'company') {
      const index = companyLoans.findIndex(l => l.id === editingId);
      if (index > -1) companyLoans[index] = { ...companyLoans[index], ...formData };
    } else {
      const index = personalLoans.findIndex(l => l.id === editingId);
      if (index > -1) personalLoans[index] = { ...personalLoans[index], ...formData };
    }
    alert('وام با موفقیت ویرایش شد');
  } else {
    // ثبت جدید
    const newLoan = {
      id: Date.now(),
      ...formData
    };
    if (type === 'company') {
      companyLoans.unshift(newLoan);
    } else {
      personalLoans.unshift(newLoan);
    }
    alert('وام با موفقیت ثبت شد');
  }

  // رفرش جداول
  renderTable(companyLoans, 'companyLoansBody');
  renderTable(personalLoans, 'personalLoansBody');
  updateStats();
  closeLoanModalFunc();
});

// ===== Actions =====
function editLoan(tbodyId, id) {
  const isCompany = tbodyId === 'companyLoansBody';
  const list = isCompany ? companyLoans : personalLoans;
  const item = list.find(l => l.id === id);
  
  if (item) {
    openLoanModal(isCompany ? 'company' : 'personal', item);
  }
}

function deleteLoan(tbodyId, id) {
  if (!confirm('آیا از حذف این وام مطمئن هستید؟')) return;

  if (tbodyId === 'companyLoansBody') {
    const index = companyLoans.findIndex(l => l.id === id);
    if (index > -1) companyLoans.splice(index, 1);
    renderTable(companyLoans, 'companyLoansBody');
  } else {
    const index = personalLoans.findIndex(l => l.id === id);
    if (index > -1) personalLoans.splice(index, 1);
    renderTable(personalLoans, 'personalLoansBody');
  }
  updateStats();
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  updateStats();
  renderTable(companyLoans, 'companyLoansBody');
  renderTable(personalLoans, 'personalLoansBody');
});