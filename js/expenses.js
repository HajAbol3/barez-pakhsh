// ===== Sample Data =====
const expenses = [
  {
    id: 1,
    date: '1405/06/20',
    type: 'تعمیرات',
    receiver: 'جعفر جعفری',
    description: 'تعویض بلبرینگ چرخ جلو - نیسان ۶۵ ع ۹۶',
    amount: 8300000
  },
  {
    id: 2,
    date: '1405/06/18',
    type: 'بیمه',
    receiver: 'بیمه ایران',
    description: 'تمدید بیمه شخص ثالث - پراید ۱۲۳ ب ۴۵',
    amount: 4200000
  },
  {
    id: 3,
    date: '1405/06/15',
    type: 'وام',
    receiver: 'بانک ملت',
    description: 'قسط ماهانه وام خودرو',
    amount: 12500000
  },
  {
    id: 4,
    date: '1405/06/12',
    type: 'چک',
    receiver: 'شرکت پخش مواد غذایی',
    description: 'پرداخت چک شماره ۸۹۴۵۶',
    amount: 45000000
  },
  {
    id: 5,
    date: '1405/06/10',
    type: 'بدهی',
    receiver: 'تعمیرگاه برادران',
    description: 'بدهی باقیمانده تعمیرات قبلی',
    amount: 3500000
  },
  {
    id: 6,
    date: '1405/06/08',
    type: 'سایر',
    receiver: 'پمپ بنزین آزادی',
    description: 'سوخت ناوگان',
    amount: 18700000
  },
  {
    id: 7,
    date: '1405/06/05',
    type: 'تعمیرات',
    receiver: 'علی رضایی',
    description: 'تعویض لنت ترمز - پژو ۷۸۹ الف ۱۲',
    amount: 1250000
  },
  {
    id: 8,
    date: '1405/06/02',
    type: 'بیمه',
    receiver: 'بیمه آسیا',
    description: 'بیمه بدنه وانت ۴۵۶ ج ۷۸',
    amount: 6800000
  },
  {
    id: 9,
    date: '1405/05/28',
    type: 'وام',
    receiver: 'بانک صادرات',
    description: 'قسط وام ضروری',
    amount: 2500000
  },
  {
    id: 10,
    date: '1405/05/25',
    type: 'سایر',
    receiver: 'اداره مالیات',
    description: 'عوارض سالانه خودروها',
    amount: 3200000
  }
];

let currentPage = 1;
const rowsPerPage = 8;
let currentFilter = 'all';
let filteredData = [...expenses];
let editingId = null; // برای تشخیص حالت ویرایش

// ===== DOM Elements =====
const expensesBody = document.getElementById('expensesBody');
const searchInput = document.getElementById('searchExpense');
const filterChips = document.getElementById('filterChips');
const tableInfo = document.getElementById('tableInfo');
const pagination = document.getElementById('pagination');
const addExpenseBtn = document.getElementById('addExpenseBtn');

// Modal Elements
const expenseModal = document.getElementById('expenseModal');
const closeModalBtn = document.getElementById('closeModal');
const cancelModalBtn = document.getElementById('cancelModal');
const expenseForm = document.getElementById('expenseForm');

// ===== Helpers =====
function formatNumber(num) {
  return new Intl.NumberFormat('fa-IR').format(num);
}

// ===== Update Stats =====
function updateStats() {
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const paid = Math.round(totalExpense * 0.72);
  const debt = Math.round(totalExpense * 0.18);
  const credit = Math.round(totalExpense * 0.10);

  document.getElementById('statExpense').textContent = formatNumber(totalExpense);
  document.getElementById('statPaid').textContent = formatNumber(paid);
  document.getElementById('statDebt').textContent = formatNumber(debt);
  document.getElementById('statCredit').textContent = formatNumber(credit);
}

// ===== Render Table =====
function renderTable() {
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageData = filteredData.slice(start, end);

  expensesBody.innerHTML = '';

  if (pageData.length === 0) {
    expensesBody.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="table-empty">
            <i class="bi bi-wallet2"></i>
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
        <td><span class="type-badge">${item.type}</span></td>
        <td>${item.receiver}</td>
        <td>${item.description}</td>
        <td class="amount">${formatNumber(item.amount)}</td>
        <td>
          <div class="table-actions">
            <button class="btn-icon edit" title="ویرایش" onclick="editExpense(${item.id})">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn-icon delete" title="حذف" onclick="deleteExpense(${item.id})">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      `;
      expensesBody.appendChild(row);
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

  filteredData = expenses.filter(item => {
    const matchFilter = currentFilter === 'all' || item.type === currentFilter;
    const matchSearch = !search ||
      item.description.toLowerCase().includes(search) ||
      item.receiver.toLowerCase().includes(search) ||
      item.type.includes(search);

    return matchFilter && matchSearch;
  });

  currentPage = 1;
  renderTable();
}

// ===== Modal Functions =====
function openModal(editData = null) {
  if (!expenseModal) return;

  const modalTitle = expenseModal.querySelector('.modal-header h3');

  if (editData) {
    // حالت ویرایش
    editingId = editData.id;
    modalTitle.innerHTML = `<i class="bi bi-pencil-square"></i> ویرایش هزینه`;

    document.getElementById('expDate').value = editData.date;
    document.getElementById('expType').value = editData.type;
    document.getElementById('expReceiver').value = editData.receiver;
    document.getElementById('expAmount').value = editData.amount;
    document.getElementById('expDescription').value = editData.description === '-' ? '' : editData.description;
  } else {
    // حالت ثبت جدید
    editingId = null;
    modalTitle.innerHTML = `<i class="bi bi-plus-circle"></i> ثبت هزینه جدید`;
    expenseForm.reset();
    document.getElementById('expDate').value = '1405/06/25';
  }

  expenseModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (expenseModal) {
    expenseModal.classList.remove('show');
    document.body.style.overflow = '';
    if (expenseForm) expenseForm.reset();
    editingId = null;
  }
}

// ===== Events =====
filterChips.addEventListener('click', (e) => {
  if (e.target.classList.contains('chip')) {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    e.target.classList.add('active');
    currentFilter = e.target.dataset.filter;
    applyFilters();
  }
});

searchInput.addEventListener('input', applyFilters);

// باز کردن مودال برای ثبت جدید
if (addExpenseBtn) {
  addExpenseBtn.addEventListener('click', () => openModal());
}

// بستن مودال
if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

// بستن با کلیک روی پس‌زمینه
if (expenseModal) {
  expenseModal.addEventListener('click', (e) => {
    if (e.target === expenseModal) closeModal();
  });
}

// بستن با کلید Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && expenseModal && expenseModal.classList.contains('show')) {
    closeModal();
  }
});

// ===== Submit Form =====
if (expenseForm) {
  expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
      date: document.getElementById('expDate').value.trim(),
      type: document.getElementById('expType').value,
      receiver: document.getElementById('expReceiver').value.trim(),
      description: document.getElementById('expDescription').value.trim() || '-',
      amount: Number(document.getElementById('expAmount').value) || 0
    };

    if (editingId) {
      // ----- ویرایش -----
      const index = expenses.findIndex(e => e.id === editingId);
      if (index > -1) {
        expenses[index] = {
          ...expenses[index],
          ...formData
        };
      }
      alert('هزینه با موفقیت ویرایش شد');
    } else {
      // ----- ثبت جدید -----
      const newExpense = {
        id: Date.now(),
        ...formData
      };
      expenses.unshift(newExpense);
      alert('هزینه با موفقیت ثبت شد');
    }

    // رفرش جدول و آمار
    applyFilters();
    updateStats();
    closeModal();
  });
}

// ===== Actions =====
function editExpense(id) {
  const expense = expenses.find(e => e.id === id);
  if (expense) {
    openModal(expense);
  }
}

function deleteExpense(id) {
  if (confirm('آیا از حذف این مورد مطمئن هستید؟')) {
    const index = expenses.findIndex(e => e.id === id);
    if (index > -1) {
      expenses.splice(index, 1);
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