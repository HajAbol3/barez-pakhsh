const NOTIF_KEY = 'barez_notifications';
const CURRENT_USER_KEY = 'barez_currentUser';

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY)) || {
      id: 1,
      name: 'مدیر سیستم',
      role: 'admin'
    };
  } catch {
    return { id: 1, name: 'مدیر سیستم', role: 'admin' };
  }
}

function setCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

function getAllNotifications() {
  try {
    return JSON.parse(localStorage.getItem(NOTIF_KEY)) || [];
  } catch {
    return [];
  }
}

function saveAllNotifications(list) {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(list));
}

function getMyNotifications() {
  const me = getCurrentUser();
  return getAllNotifications()
    .filter(n => n.toUserId === me.id || n.toUserId === 'all')
    .sort((a, b) => b.createdAt - a.createdAt);
}

function formatNotifTime(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'همین الان';
  if (mins < 60) return mins + ' دقیقه پیش';
  const hours = Math.floor(mins / 60);
  if (hours < 24) return hours + ' ساعت پیش';
  const days = Math.floor(hours / 24);
  return days === 1 ? 'دیروز' : days + ' روز پیش';
}

function renderNotifications() {
  const listEl = document.getElementById('notificationList');
  const badge = document.getElementById('notificationBadge');
  if (!listEl) return;

  const items = getMyNotifications();
  const unread = items.filter(n => !n.read).length;

  if (badge) {
    if (unread > 0) {
      badge.style.display = 'flex';
      badge.textContent = unread > 99 ? '۹۹+' : new Intl.NumberFormat('fa-IR').format(unread);
    } else {
      badge.style.display = 'none';
      badge.textContent = '0';
    }
  }

  listEl.innerHTML = items.length
    ? items.map(n => `
      <div class="notification-item ${n.read ? '' : 'unread'}" data-id="${n.id}">
        <div class="notif-icon msg"><i class="bi bi-envelope"></i></div>
        <div class="notif-content">
          <p class="notif-title">${escapeHtml(n.title)}</p>
          <p class="notif-desc">${escapeHtml(n.body)}</p>
          <span class="notif-time">${formatNotifTime(n.createdAt)} · از ${escapeHtml(n.fromName || 'ادمین')}</span>
        </div>
      </div>
    `).join('')
    : '';
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function markAllNotificationsRead() {
  const me = getCurrentUser();
  const all = getAllNotifications().map(n => {
    if (n.toUserId === me.id || n.toUserId === 'all') return { ...n, read: true };
    return n;
  });
  saveAllNotifications(all);
  renderNotifications();
}

function sendNotification({ toUserId, toName, title, body }) {
  const me = getCurrentUser();
  const list = getAllNotifications();
  list.unshift({
    id: Date.now(),
    toUserId,
    toName: toName || '',
    title,
    body,
    fromName: me.name || 'ادمین',
    fromId: me.id,
    createdAt: Date.now(),
    read: false
  });
  saveAllNotifications(list);
  renderNotifications();
}

document.addEventListener('DOMContentLoaded', () => {
  renderNotifications();

  const notificationBtn = document.getElementById('notificationBtn');
  const notificationDropdown = document.getElementById('notificationDropdown');
  const markAllRead = document.getElementById('markAllRead');

  if (notificationBtn && notificationDropdown) {
    notificationBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notificationDropdown.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.notification-box')) {
        notificationDropdown.classList.remove('active');
      }
    });
  }

  if (markAllRead) {
    markAllRead.addEventListener('click', markAllNotificationsRead);
  }

  // پروفایل (اگر در صفحه باشد)
  const userProfileBtn = document.getElementById('userProfileBtn');
  const userModalOverlay = document.getElementById('userModalOverlay');
  const closeProfileModal = document.getElementById('closeProfileModal');
  const editProfileBtn = document.getElementById('editProfileBtn');
  const profileView = document.getElementById('profileView');
  const profileEdit = document.getElementById('profileEdit');
  const cancelEditBtn = document.getElementById('cancelEditBtn');
  const saveProfileBtn = document.getElementById('saveProfileBtn');

  function closeProfile() {
    if (!userModalOverlay) return;
    userModalOverlay.classList.remove('active');
    if (profileView) profileView.style.display = 'block';
    if (profileEdit) profileEdit.style.display = 'none';
  }

  if (userProfileBtn && userModalOverlay) {
    userProfileBtn.addEventListener('click', () => userModalOverlay.classList.add('active'));
    if (closeProfileModal) closeProfileModal.addEventListener('click', closeProfile);
    userModalOverlay.addEventListener('click', (e) => {
      if (e.target === userModalOverlay) closeProfile();
    });
  }

  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', () => {
      profileView.style.display = 'none';
      profileEdit.style.display = 'block';
    });
  }
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', () => {
      profileView.style.display = 'block';
      profileEdit.style.display = 'none';
    });
  }
  if (saveProfileBtn) {
    saveProfileBtn.addEventListener('click', () => {
      const name = document.getElementById('editName').value;
      const role = document.getElementById('editRole').value;
      const email = document.getElementById('editEmail').value;
      const phone = document.getElementById('editPhone').value;
      document.getElementById('viewName').textContent = name;
      document.getElementById('viewRole').textContent = role;
      document.getElementById('viewEmail').textContent = email;
      document.getElementById('viewPhone').textContent = phone;
      const sideName = document.querySelector('.sidebar-footer .user-info .name');
      const sideRole = document.querySelector('.sidebar-footer .user-info .role');
      if (sideName) sideName.textContent = name;
      if (sideRole) sideRole.textContent = role;
      profileView.style.display = 'block';
      profileEdit.style.display = 'none';
      alert('اطلاعات با موفقیت ذخیره شد');
    });
  }
});