let users = [
  { id: 1, name: 'مدیر سیستم', phone: '09120000000', password: '123456', role: 'admin', status: 'active', createdAt: '1405/01/15' },
  { id: 2, name: 'سارا محمدی', phone: '09121234567', password: '123456', role: 'staff', status: 'active', createdAt: '1405/03/20' },
  { id: 3, name: 'رضا کریمی', phone: '09129876543', password: '123456', role: 'staff', status: 'active', createdAt: '1405/04/10' },
  { id: 4, name: 'مینا احمدی', phone: '09123334444', password: '123456', role: 'admin', status: 'inactive', createdAt: '1405/05/01' }
];

let editingId = null;
let currentPage = 1;
const rowsPerPage = 8;
let filteredUsers = [...users];

const usersBody = document.getElementById('usersBody');
const searchUser = document.getElementById('searchUser');
const filterRole = document.getElementById('filterRole');
const filterStatus = document.getElementById('filterStatus');
const tableInfo = document.getElementById('tableInfo');
const pagination = document.getElementById('pagination');
const addUserBtn = document.getElementById('addUserBtn');

const userModal = document.getElementById('userModal');
const closeUserModal = document.getElementById('closeUserModal');
const cancelUserModal = document.getElementById('cancelUserModal');
const userForm = document.getElementById('userForm');
const userModalTitle = document.getElementById('userModalTitle');
const passwordHint = document.getElementById('passwordHint');

const sendMsgBtn = document.getElementById('sendMsgBtn');
const messageModal = document.getElementById('messageModal');
const messageForm = document.getElementById('messageForm');
const msgToUser = document.getElementById('msgToUser');
const closeMessageModal = document.getElementById('closeMessageModal');
const cancelMessageModal = document.getElementById('cancelMessageModal');

function formatNumber(num) {
  return new Intl.NumberFormat('fa-IR').format(num || 0);
}
function roleLabel(role) {
  return role === 'admin' ? 'ادمین' : 'کارمند';
}
function statusLabel(status) {
  return status === 'active' ? 'فعال' : 'غیرفعال';
}

function updateStats() {
  document.getElementById('statTotal').textContent = formatNumber(users.length);
  document.getElementById('statAdmin').textContent = formatNumber(users.filter(u => u.role === 'admin').length);
  document.getElementById('statStaff').textContent = formatNumber(users.filter(u => u.role === 'staff').length);
  document.getElementById('statActive').textContent = formatNumber(users.filter(u => u.status === 'active').length);
}

function renderTable() {
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageData = filteredUsers.slice(start, end);
  usersBody.innerHTML = '';

  if (!pageData.length) {
    usersBody.innerHTML = `
      <tr><td colspan="7">
        <div class="table-empty"><i class="bi bi-person-x"></i><p>کاربری یافت نشد</p></div>
      </td></tr>`;
  } else {
    pageData.forEach((user, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${formatNumber(start + index + 1)}</td>
        <td><strong>${user.name}</strong></td>
        <td>${user.phone}</td>
        <td><span class="role-badge ${user.role}">${roleLabel(user.role)}</span></td>
        <td><span class="status-badge ${user.status}">${statusLabel(user.status)}</span></td>
        <td>${user.createdAt || '—'}</td>
        <td>
          <div class="table-actions">
            <button class="btn-icon edit" title="ویرایش" onclick="editUser(${user.id})"><i class="bi bi-pencil"></i></button>
            <button class="btn-icon" title="ارسال پیام" onclick="messageUser(${user.id})"><i class="bi bi-envelope"></i></button>
            <button class="btn-icon" title="${user.status === 'active' ? 'غیرفعال' : 'فعال'}" onclick="toggleStatus(${user.id})">
              <i class="bi bi-${user.status === 'active' ? 'pause-circle' : 'play-circle'}"></i>
            </button>
            <button class="btn-icon delete" title="حذف" onclick="deleteUser(${user.id})"><i class="bi bi-trash"></i></button>
          </div>
        </td>
      `;
      usersBody.appendChild(row);
    });
  }

  const total = filteredUsers.length;
  const showingStart = total === 0 ? 0 : start + 1;
  const showingEnd = Math.min(end, total);
  tableInfo.textContent = `نمایش ${formatNumber(showingStart)} تا ${formatNumber(showingEnd)} از ${formatNumber(total)} کاربر`;
  renderPagination();
}

function renderPagination() {
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage) || 1;
  pagination.innerHTML = '';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'page-btn';
  prevBtn.innerHTML = '<i class="bi bi-chevron-right"></i>';
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => { if (currentPage > 1) { currentPage--; renderTable(); } };
  pagination.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
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

function applyFilters() {
  const search = (searchUser?.value || '').trim().toLowerCase();
  const role = filterRole?.value || '';
  const status = filterStatus?.value || '';

  filteredUsers = users.filter(u => {
    const matchSearch = !search || u.name.toLowerCase().includes(search) || u.phone.includes(search);
    const matchRole = !role || u.role === role;
    const matchStatus = !status || u.status === status;
    return matchSearch && matchRole && matchStatus;
  });
  currentPage = 1;
  renderTable();
}

function openUserModal(editData = null) {
  if (!userModal) return;
  if (editData) {
    editingId = editData.id;
    userModalTitle.innerHTML = '<i class="bi bi-pencil-square"></i> ویرایش کاربر';
    document.getElementById('userName').value = editData.name || '';
    document.getElementById('userPhone').value = editData.phone || '';
    document.getElementById('userPassword').value = '';
    document.getElementById('userPassword').required = false;
    document.getElementById('userRole').value = editData.role || 'staff';
    document.getElementById('userStatus').value = editData.status || 'active';
    if (passwordHint) passwordHint.style.display = 'block';
  } else {
    editingId = null;
    userModalTitle.innerHTML = '<i class="bi bi-plus-circle"></i> افزودن کاربر جدید';
    userForm.reset();
    document.getElementById('userRole').value = 'staff';
    document.getElementById('userStatus').value = 'active';
    document.getElementById('userPassword').required = true;
    if (passwordHint) passwordHint.style.display = 'none';
  }
  userModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeUserModalFunc() {
  if (!userModal) return;
  userModal.classList.remove('show');
  document.body.style.overflow = '';
  userForm.reset();
  editingId = null;
}

function editUser(id) {
  const item = users.find(u => u.id === id);
  if (item) openUserModal(item);
}

function toggleStatus(id) {
  const item = users.find(u => u.id === id);
  if (!item) return;
  item.status = item.status === 'active' ? 'inactive' : 'active';
  applyFilters();
  updateStats();
}

function deleteUser(id) {
  if (!confirm('آیا از حذف این کاربر مطمئن هستید؟')) return;
  users = users.filter(u => u.id !== id);
  applyFilters();
  updateStats();
}

function fillMessageRecipients(selectedId) {
  if (!msgToUser) return;
  msgToUser.innerHTML = '<option value="">انتخاب کاربر...</option>';
  users.filter(u => u.status === 'active').forEach(u => {
    const opt = document.createElement('option');
    opt.value = u.id;
    opt.textContent = u.name + ' (' + roleLabel(u.role) + ')';
    if (selectedId && selectedId === u.id) opt.selected = true;
    msgToUser.appendChild(opt);
  });
}

function openMessageModal(preselectId) {
  if (!messageModal) return;
  fillMessageRecipients(preselectId);
  if (messageForm) messageForm.reset();
  if (preselectId && msgToUser) msgToUser.value = String(preselectId);
  messageModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeMessageModalFunc() {
  if (!messageModal) return;
  messageModal.classList.remove('show');
  document.body.style.overflow = '';
}

function messageUser(id) {
  openMessageModal(id);
}

if (searchUser) searchUser.addEventListener('input', applyFilters);
if (filterRole) filterRole.addEventListener('change', applyFilters);
if (filterStatus) filterStatus.addEventListener('change', applyFilters);
if (addUserBtn) addUserBtn.addEventListener('click', () => openUserModal());
if (closeUserModal) closeUserModal.addEventListener('click', closeUserModalFunc);
if (cancelUserModal) cancelUserModal.addEventListener('click', closeUserModalFunc);
if (userModal) {
  userModal.addEventListener('click', (e) => {
    if (e.target === userModal) closeUserModalFunc();
  });
}

if (sendMsgBtn) sendMsgBtn.addEventListener('click', () => openMessageModal());
if (closeMessageModal) closeMessageModal.addEventListener('click', closeMessageModalFunc);
if (cancelMessageModal) cancelMessageModal.addEventListener('click', closeMessageModalFunc);
if (messageModal) {
  messageModal.addEventListener('click', (e) => {
    if (e.target === messageModal) closeMessageModalFunc();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (userModal?.classList.contains('show')) closeUserModalFunc();
    if (messageModal?.classList.contains('show')) closeMessageModalFunc();
  }
});

if (userForm) {
  userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('userName').value.trim();
    const phone = document.getElementById('userPhone').value.trim();
    const password = document.getElementById('userPassword').value;
    const role = document.getElementById('userRole').value;
    const status = document.getElementById('userStatus').value;

    if (editingId) {
      const index = users.findIndex(u => u.id === editingId);
      if (index > -1) {
        users[index] = {
          ...users[index],
          name, phone, role, status,
          password: password ? password : users[index].password
        };
      }
      alert('کاربر با موفقیت ویرایش شد');
    } else {
      if (!password || password.length < 6) {
        alert('رمز عبور باید حداقل ۶ کاراکتر باشد');
        return;
      }
      users.unshift({
        id: Date.now(),
        name, phone, password, role, status,
        createdAt: new Date().toLocaleDateString('fa-IR')
      });
      alert('کاربر با موفقیت ثبت شد');
    }
    applyFilters();
    updateStats();
    closeUserModalFunc();
  });
}

if (messageForm) {
  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const toId = Number(msgToUser.value);
    const title = document.getElementById('msgTitle').value.trim();
    const body = document.getElementById('msgBody').value.trim();
    const user = users.find(u => u.id === toId);

    if (!user || !title || !body) {
      alert('گیرنده، عنوان و متن را کامل کنید');
      return;
    }
    if (typeof sendNotification !== 'function') {
      alert('فایل notifications.js لود نشده است');
      return;
    }

    sendNotification({ toUserId: user.id, toName: user.name, title, body });
    alert('پیام برای «' + user.name + '» ارسال شد');
    closeMessageModalFunc();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateStats();
  renderTable();
});