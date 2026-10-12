// ===== Sample Data =====
const returnsData = [
  {
    id: 1,
    date: '1405/06/20',
    route: 'منطقه ۲',
    items: 12,
    cost: 1850000,
    description: 'خرابی بسته‌بندی'
  },
  {
    id: 2,
    date: '1405/06/18',
    route: 'منطقه ۵',
    items: 5,
    cost: 720000,
    description: 'اشتباه در سفارش مشتری'
  },
  {
    id: 3,
    date: '1405/06/15',
    route: 'حومه',
    items: 8,
    cost: 1450000,
    description: 'تاریخ انقضا نزدیک'
  },
  {
    id: 4,
    date: '1405/06/12',
    route: 'منطقه ۱',
    items: 3,
    cost: 480000,
    description: 'کالای آسیب‌دیده'
  },
  {
    id: 5,
    date: '1405/06/10',
    route: 'منطقه ۳',
    items: 15,
    cost: 2300000,
    description: 'لغو سفارش توسط مشتری'
  },
  {
    id: 6,
    date: '1405/06/08',
    route: 'منطقه ۴',
    items: 7,
    cost: 980000,
    description: 'مغایرت تعداد'
  }
];

let currentPage = 1;
const rowsPerPage = 8;
let filteredData = [...returnsData];
let editingId = null;

// ===== DOM =====
const returnsBody = document.getElementById('returnsBody');
const searchInput = document.getElementById('searchReturn');
const tableInfo = document.getElementById('tableInfo');
const pagination = document.getElementById('pagination');
const addReturnBtn = document.getElementById('addReturnBtn');

const returnModal = document.getElementById('returnModal');
const closeReturnModal = document.getElementById('closeReturnModal');
const cancelReturnModal = document.getElementById('cancelReturnModal');
const returnForm = document.getElementById('returnForm');
const returnModalTitle = document.getElementById('returnModalTitle');

// ===== Helpers =====
function formatNumber(num) {
  return new Intl.NumberFormat('fa-IR').format(num);
}

// ===== Update Stats =====
function updateStats() {
  document.getElementById('statCount').textContent = formatNumber(returnsData.length);
  document.getElementById('statItems').textContent = formatNumber(returnsData.reduce((s, r) => s + r.items, 0));
  document.getElementById('statCost').textContent = formatNumber(returnsData.reduce((s, r) => s + r.cost, 0));
}

// ===== Render Table =====
function renderTable() {
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageData = filteredData.slice(start, end);

  returnsBody.innerHTML = '';

  if (pageData.length === 0) {
    returnsBody.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="table-empty">
            <i class="bi bi-arrow-return-left"></i>
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
        <td>${item.date}</td>
        <td>${item.route}</td>
        <td>${formatNumber(item.items)}</td>
        <td>${formatNumber(item.cost)}</td>
        <td>${item.description}</td>
        <td>
          <div class="table-actions">
            <button class="btn-icon edit" title="ویرایش" onclick="editReturn(${item.id})">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn-icon delete" title="حذف" onclick="deleteReturn(${item.id})">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      `;
      returnsBody.appendChild(row);
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
  prevBtn.onclick = () => { if (currentPage > 1) { currentPage--; renderTable(); } };
  pagination.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
    btn.textContent = formatNumber(i);
    btn.onclick = () => { currentPage = i; renderTable(); };
    pagination.appendChild(btn);
  }

  const nextBtn = document.createElement('button');
  nextBtn.className = 'page-btn';
  nextBtn.innerHTML = '<i class="bi bi-chevron-left"></i>';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => { if (currentPage < totalPages) { currentPage++; renderTable(); } };
  pagination.appendChild(nextBtn);
}

// ===== Search =====
function applyFilters() {
  const search = searchInput.value.trim().toLowerCase();

  filteredData = returnsData.filter(item => {
    return !search ||
      item.route.includes(search) ||
      item.description.toLowerCase().includes(search) ||
      item.date.includes(search);
  });

  currentPage = 1;
  renderTable();
}

// ===== Modal Functions =====
function openReturnModal(editData = null) {
  if (!returnModal) return;

  if (editData) {
    editingId = editData.id;
    returnModalTitle.innerHTML = `<i class="bi bi-pencil-square"></i> ویرایش برگشتی`;

    document.getElementById('retDate').value = editData.date;
    document.getElementById('retRoute').value = editData.route;
    document.getElementById('retItems').value = editData.items;
    document.getElementById('retCost').value = editData.cost;
    document.getElementById('retDescription').value = editData.description || '';
  } else {
    editingId = null;
    returnModalTitle.innerHTML = `<i class="bi bi-plus-circle"></i> ثبت برگشتی جدید`;
    returnForm.reset();
    document.getElementById('retDate').value = '1405/06/25';
  }

  returnModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeReturnModalFunc() {
  if (returnModal) {
    returnModal.classList.remove('show');
    document.body.style.overflow = '';
    returnForm.reset();
    editingId = null;
  }
}

// ===== Events =====
searchInput.addEventListener('input', applyFilters);

addReturnBtn.addEventListener('click', () => openReturnModal());

closeReturnModal.addEventListener('click', closeReturnModalFunc);
cancelReturnModal.addEventListener('click', closeReturnModalFunc);

returnModal.addEventListener('click', (e) => {
  if (e.target === returnModal) closeReturnModalFunc();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && returnModal.classList.contains('show')) {
    closeReturnModalFunc();
  }
});

// ===== Submit Form =====
returnForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = {
    date: document.getElementById('retDate').value.trim(),
    route: document.getElementById('retRoute').value,
    items: Number(document.getElementById('retItems').value) || 0,
    cost: Number(document.getElementById('retCost').value) || 0,
    description: document.getElementById('retDescription').value.trim() || '-'
  };

  if (editingId) {
    const index = returnsData.findIndex(r => r.id === editingId);
    if (index > -1) {
      returnsData[index] = { ...returnsData[index], ...formData };
    }
    alert('برگشتی با موفقیت ویرایش شد');
  } else {
    returnsData.unshift({
      id: Date.now(),
      ...formData
    });
    alert('برگشتی با موفقیت ثبت شد');
  }

  applyFilters();
  updateStats();
  closeReturnModalFunc();
});

// ===== Actions =====
function editReturn(id) {
  const item = returnsData.find(r => r.id === id);
  if (item) openReturnModal(item);
}

function deleteReturn(id) {
  if (confirm('آیا از حذف این مورد مطمئن هستید؟')) {
    const index = returnsData.findIndex(r => r.id === id);
    if (index > -1) {
      returnsData.splice(index, 1);
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