/* =========================================================
   سامانه مدیریت ناوگان خودرو — داشبورد
   script.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  // مرجع نمودارها؛ زودتر از هر کدی که ممکنه بهشون دسترسی پیدا کنه تعریف می‌شود
  let dispatchChart, costChart;

  /* ---------------- تاریخ و ساعت زنده ---------------- */
  const clockEl = document.getElementById("clock");
  const dateEl = document.getElementById("dateLine");

  function updateClock() {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString("fa-IR", {
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
    dateEl.textContent = now.toLocaleDateString("fa-IR", {
      weekday: "long", day: "numeric", month: "long"
    });
  }
  updateClock();
  setInterval(updateClock, 1000);

  /* ---------------- منوی موبایل ---------------- */
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const menuToggle = document.getElementById("menuToggle");

  function openSidebar() {
    sidebar.classList.add("open");
    overlay.classList.add("show");
  }
  function closeSidebar() {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
  }
  menuToggle.addEventListener("click", () => {
    sidebar.classList.contains("open") ? closeSidebar() : openSidebar();
  });
  overlay.addEventListener("click", closeSidebar);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeSidebar(); });

  /* ---------------- شمارنده انیمیشنی کارت‌ها ---------------- */
  document.querySelectorAll("[data-count]").forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 900;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = value.toLocaleString("fa-IR");
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });

  /* ---------------- نوارهای پیشرفت ---------------- */
  setTimeout(() => {
    document.querySelectorAll(".progress-fill").forEach(bar => {
      bar.style.width = bar.dataset.w;
    });
  }, 300);

  /* =====================================================
     تم روشن / تاریک
     ===================================================== */
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const body = document.body;

  function applyTheme(theme) {
    body.setAttribute("data-theme", theme);
    themeIcon.className = theme === "dark" ? "fa-solid fa-moon" : "fa-solid fa-sun";
    localStorage.setItem("fleet-theme", theme);
    updateChartsTheme();
  }

  const savedTheme = localStorage.getItem("fleet-theme")
    || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  applyTheme(savedTheme);

  themeToggle.addEventListener("click", () => {
    const next = body.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
  });

  /* =====================================================
     نمودارها (Chart.js)
     ===================================================== */
  function cssVar(name) {
    return getComputedStyle(document.body).getPropertyValue(name).trim();
  }

  const months = ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];
  const dispatchThisYear = [42, 48, 55, 60, 58, 66, 70, 65, 72, 78, 74, 80];
  const dispatchLastYear = [30, 34, 40, 44, 42, 50, 52, 49, 55, 58, 56, 60];

  const costLabels = ["سوخت", "تعمیرات", "بیمه", "اقساط وام", "حقوق رانندگان"];
  const costData = [145, 84, 46, 92, 118];
  const costColors = ["#c31432", "#7c0b20", "#24345a", "#b9791a", "#131d33"];

  function buildCharts() {
    const gridColor = cssVar("--border");
    const textColor = cssVar("--text-muted");
    const fontFamily = "Vazirmatn";

    Chart.defaults.font.family = fontFamily;
    Chart.defaults.color = textColor;

    /* ---- نمودار پخش ماهانه ---- */
    const ctx1 = document.getElementById("dispatchChart");
    dispatchChart = new Chart(ctx1, {
      type: "line",
      data: {
        labels: months,
        datasets: [
          {
            label: "سال جاری",
            data: dispatchThisYear,
            borderColor: cssVar("--red-500"),
            backgroundColor: hexToRgba(cssVar("--red-500"), 0.12),
            borderWidth: 2.5,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointBackgroundColor: cssVar("--red-500"),
          },
          {
            label: "سال قبل",
            data: dispatchLastYear,
            borderColor: cssVar("--navy-700"),
            backgroundColor: "transparent",
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            position: "top",
            align: "end",
            labels: { usePointStyle: true, boxWidth: 7, boxHeight: 7, padding: 16, font: { size: 11 } }
          },
          tooltip: {
            rtl: true,
            titleFont: { family: fontFamily },
            bodyFont: { family: fontFamily },
            backgroundColor: cssVar("--surface-2"),
            titleColor: cssVar("--text"),
            bodyColor: cssVar("--text-muted"),
            borderColor: gridColor,
            borderWidth: 1,
            padding: 10,
            cornerRadius: 8,
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 10.5 } } },
          y: { grid: { color: gridColor }, ticks: { font: { size: 10.5 }, callback: v => v.toLocaleString("fa-IR") }, beginAtZero: true }
        }
      }
    });

    /* ---- نمودار سهم هزینه‌ها ---- */
    const ctx2 = document.getElementById("costChart");
    costChart = new Chart(ctx2, {
      type: "doughnut",
      data: {
        labels: costLabels,
        datasets: [{
          data: costData,
          backgroundColor: costColors,
          borderColor: cssVar("--surface"),
          borderWidth: 3,
          hoverOffset: 6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "68%",
        plugins: {
          legend: { display: false },
          tooltip: {
            rtl: true,
            titleFont: { family: fontFamily },
            bodyFont: { family: fontFamily },
            backgroundColor: cssVar("--surface-2"),
            titleColor: cssVar("--text"),
            bodyColor: cssVar("--text-muted"),
            borderColor: gridColor,
            borderWidth: 1,
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: ctx => ` ${ctx.label}: ${ctx.parsed.toLocaleString("fa-IR")} میلیون تومان`
            }
          }
        }
      }
    });

    buildCostLegend();
  }

  function buildCostLegend() {
    const wrap = document.getElementById("costLegend");
    wrap.innerHTML = "";
    const total = costData.reduce((a, b) => a + b, 0);
    costLabels.forEach((label, i) => {
      const pct = Math.round((costData[i] / total) * 100);
      const item = document.createElement("div");
      item.className = "legend-item";
      item.innerHTML = `<span class="legend-dot" style="background:${costColors[i]}"></span>${label} · ${pct.toLocaleString("fa-IR")}٪`;
      wrap.appendChild(item);
    });
  }

  function hexToRgba(hex, alpha) {
    hex = hex.replace("#", "");
    if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function updateChartsTheme() {
    if (!dispatchChart || !costChart) return;
    const gridColor = cssVar("--border");
    const textColor = cssVar("--text-muted");

    Chart.defaults.color = textColor;

    dispatchChart.data.datasets[0].borderColor = cssVar("--red-500");
    dispatchChart.data.datasets[0].backgroundColor = hexToRgba(cssVar("--red-500"), 0.12);
    dispatchChart.data.datasets[0].pointBackgroundColor = cssVar("--red-500");
    dispatchChart.data.datasets[1].borderColor = cssVar("--navy-700");
    dispatchChart.options.scales.x.grid.color = "transparent";
    dispatchChart.options.scales.y.grid.color = gridColor;
    dispatchChart.options.plugins.tooltip.backgroundColor = cssVar("--surface-2");
    dispatchChart.options.plugins.tooltip.titleColor = cssVar("--text");
    dispatchChart.options.plugins.tooltip.bodyColor = cssVar("--text-muted");
    dispatchChart.options.plugins.tooltip.borderColor = gridColor;
    dispatchChart.update();

    costChart.data.datasets[0].borderColor = cssVar("--surface");
    costChart.options.plugins.tooltip.backgroundColor = cssVar("--surface-2");
    costChart.options.plugins.tooltip.titleColor = cssVar("--text");
    costChart.options.plugins.tooltip.bodyColor = cssVar("--text-muted");
    costChart.options.plugins.tooltip.borderColor = gridColor;
    costChart.update();
  }

  buildCharts();
});