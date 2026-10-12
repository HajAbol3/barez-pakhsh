// ===== Sample Data =====
const insuranceData = [
  {
    id: 1,
    plate: '۶۵ ایران ۴۶۳ ع ۹۶',
    type: 'شخص ثالث',
    company: 'بیمه ایران',
    expireDate: '1405/08/15',
    status: 'valid'
  },
  {
    id: 2,
    plate: '۶۵ ایران ۴۶۳ ع ۹۶',
    type: 'بدنه',
    company: 'بیمه آسیا',
    expireDate: '1405/09/01',
    status: 'valid'
  },
  {
    id: 3,
    plate: '۱۲۳ ب ۴۵',
    type: 'شخص ثالث',
    company: 'بیمه ایران',
    expireDate: '1405/07/10',
    status: 'expiring'
  },
  {
    id: 4,
    plate: '۱۲۳ ب ۴۵',
    type: 'معاینه فنی',
    company: 'مرکز معاینه ۳',
    expireDate: '1405/11/20',
    status: 'valid'
  },
  {
    id: 5,
    plate: '۷۸۹ الف ۱۲',
    type: 'شخص ثالث',
    company: 'بیمه پاسارگاد',
    expireDate: '1405/06/28',
    status: 'expiring'
  },
  {
    id: 6,
    plate: '۴۵۶ ج ۷۸',
    type: 'بدنه',
    company: 'بیمه آسیا',
    expireDate: '1404/12/05',
    status: 'expired'
  },
  {
    id: 7,
    plate: '۳۲۱ د ۹۰',
    type: 'شخص ثالث',
    company: 'بیمه ایران',
    expireDate: '1405/10/12',
    status: 'valid'
  },
  {
    id: 8,
    plate: '۳۲۱ د ۹۰',
    type: 'معاینه فنی',
    company: 'مرکز معاینه ۱',
    expireDate: '1405/04/18',
    status: 'expired'
  },
  {
    id: 9,
    plate: '۱۴۷ ی ۵۶',
    type: 'شخص ثالث',
    company: 'بیمه معلم',
    expireDate: '1405/07/22',
    status: 'expiring'
  },
  {
    id: 10,
    plate: '۹۸۷ و ۳۴',
    type: 'بدنه',
    company: 'بیمه ایران',
    expireDate: '1405/12/01',
    status: 'valid'
  }
];

let currentPage = 1;
const rowsPerPage = 8;
let currentStatus = 'all';
let filteredData = [...insuranceData];
let editingId = null;

// ===== DOM =====
const insuranceBody = document.getElementById('insuranceBody');
const searchInput = document.getElementById('searchInsurance');
const statusFilters = document.getElementById('statusFilters');
const tableInfo = document.getElementById('tableInfo');
const pagination = document.getElementById('pagination');
const addInsuranceBtn = document.getElementById('addInsuranceBtn');

// Modal Elements
const insuranceModal = document.getElementById('insuranceModal');
const closeInsuranceModal = document.getElementById('closeInsuranceModal');
const cancelInsuranceModal = document.getElementById('cancelInsuranceModal');
const insuranceForm = document.getElementById('insuranceForm');
const insuranceModalTitle = document.getElementById('insuranceModalTitle');

// ===== Helpers =====
function formatNumber(num) {
  return new Intl.NumberFormat('fa-IR').format(num);
}

function getStatusLabel(status) {
  const map = {
    valid: 'معتبر',
    expiring: 'نزدیک سررسید',
    expired: 'منقضی'
  };
  return map[status] || status;
}

// ===== Update Stats =====
function updateStats() {
  document.getElementById('statValid').textContent = formatNumber(insuranceData.filter(i => i.status === 'valid').length);
  document.getElementById('statExpiring').textContent = formatNumber(insuranceData.filter(i => i.status === 'expiring').length);
  document.getElementById('statExpired').textContent = formatNumber(insuranceData.filter(i => i.status === 'expired').length);
  document.getElementById('statTotal').textContent = formatNumber(insuranceData.length);
}

// ===== Render Table =====
function renderTable() {
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageData = filteredData.slice(start, end);

  insuranceBody.innerHTML = '';

  if (pageData.length === 0) {
    insuranceBody.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="table-empty">
            <i class="bi bi-shield"></i>
            <p>موردی یافت نشد</p>
          </div>
        </td>
      </tr>
    `;
  } else {
    pageData.forEach((item, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${formatNumber(start + index + 1)}</td>
        <td><strong>${item.plate}</strong></td>
        <td><span class="type-badge">${item.type}</span></td>
        <td>${item.company}</td>
        <td>${item.expireDate}</td>
        <td>
          <span class="status-badge ${item.status}">
            ${getStatusLabel(item.status)}
          </span>
        </td>
        <td>
          <div class="table-actions">
            <button class="btn-icon edit" title="ویرایش" onclick="editInsurance(${item.id})">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn-icon delete" title="حذف" onclick="deleteInsurance(${item.id})">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      `;
      insuranceBody.appendChild(row);
    });
  }

  const total = filteredData.length;
  const showingStart = total === 0 ? 0 : start + 1;
  const showingEnd = Math.min(end, total);
  tableInfo.textContent = `نمایش ${formatNumber(showingStart)} تا ${formatNumber(showingEnd)} از ${formatNumber(total)} مورد`;

  renderPagination();
}

// ===== Pagination =====
function renderPagination() {
  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  pagination.innerHTML = '';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'page-btn';
  prevBtn.innerHTML = '<i class="bi bi-chevron-right"></i>';
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  };
  pagination.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
    btn.textContent = formatNumber(i);
    btn.onclick = () => {
      currentPage = i;
      renderTable();
    };
    pagination.appendChild(btn);
  }

  const nextBtn = document.createElement('button');
  nextBtn.className = 'page-btn';
  nextBtn.innerHTML = '<i class="bi bi-chevron-left"></i>';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderTable();
    }
  };
  pagination.appendChild(nextBtn);
}

// ===== Filter & Search =====
function applyFilters() {
  const search = searchInput.value.trim().toLowerCase();

  filteredData = insuranceData.filter(item => {
    const matchStatus = currentStatus === 'all' || item.status === currentStatus;
    const matchSearch = !search ||
      item.plate.includes(search) ||
      item.company.toLowerCase().includes(search) ||
      item.type.includes(search);

    return matchStatus && matchSearch;
  });

  currentPage = 1;
  renderTable();
}

// ===== Modal Functions =====
function openInsuranceModal(editData = null) {
  if (!insuranceModal) return;

  if (editData) {
    editingId = editData.id;
    insuranceModalTitle.innerHTML = `<i class="bi bi-pencil-square"></i> ویرایش بیمه / معاینه`;

    document.getElementById('insPlate').value = editData.plate;
    document.getElementById('insType').value = editData.type;
    document.getElementById('insCompany').value = editData.company;
    document.getElementById('insExpireDate').value = editData.expireDate;
    document.getElementById('insStatus').value = editData.status;
  } else {
    editingId = null;
    insuranceModalTitle.innerHTML = `<i class="bi bi-plus-circle"></i> افزودن بیمه / معاینه`;
    insuranceForm.reset();
    document.getElementById('insStatus').value = 'valid';
  }

  insuranceModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeInsuranceModalFunc() {
  if (insuranceModal) {
    insuranceModal.classList.remove('show');
    document.body.style.overflow = '';
    insuranceForm.reset();
    editingId = null;
  }
}

// ===== Events =====
statusFilters.addEventListener('click', (e) => {
  if (e.target.classList.contains('chip')) {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    e.target.classList.add('active');
    currentStatus = e.target.dataset.status;
    applyFilters();
  }
});

searchInput.addEventListener('input', applyFilters);

addInsuranceBtn.addEventListener('click', () => openInsuranceModal());

closeInsuranceModal.addEventListener('click', closeInsuranceModalFunc);
cancelInsuranceModal.addEventListener('click', closeInsuranceModalFunc);

insuranceModal.addEventListener('click', (e) => {
  if (e.target === insuranceModal) closeInsuranceModalFunc();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && insuranceModal.classList.contains('show')) {
    closeInsuranceModalFunc();
  }
});

// ===== Submit Form =====
insuranceForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = {
    plate: document.getElementById('insPlate').value,
    type: document.getElementById('insType').value,
    company: document.getElementById('insCompany').value.trim(),
    expireDate: document.getElementById('insExpireDate').value.trim(),
    status: document.getElementById('insStatus').value
  };

  if (editingId) {
    // ویرایش
    const index = insuranceData.findIndex(i => i.id === editingId);
    if (index > -1) {
      insuranceData[index] = { ...insuranceData[index], ...formData };
    }
    alert('با موفقیت ویرایش شد');
  } else {
    // ثبت جدید
    insuranceData.unshift({
      id: Date.now(),
      ...formData
    });
    alert('با موفقیت ثبت شد');
  }

  applyFilters();
  updateStats();
  closeInsuranceModalFunc();
});

// ===== Actions =====
function editInsurance(id) {
  const item = insuranceData.find(i => i.id === id);
  if (item) openInsuranceModal(item);
}

function deleteInsurance(id) {
  if (confirm('آیا از حذف این مورد مطمئن هستید؟')) {
    const index = insuranceData.findIndex(i => i.id === id);
    if (index > -1) {
      insuranceData.splice(index, 1);
      applyFilters();
      updateStats();
    }
  }
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  updateStats();
  renderTable();
});