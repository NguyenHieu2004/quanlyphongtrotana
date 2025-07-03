// Lấy tên file đang mở
const currentPage = window.location.pathname.split("/").pop();

// Duyệt tất cả các link trong sidebar
document.querySelectorAll(".menu li a").forEach(link => {
  const linkHref = link.getAttribute("href");
  if (linkHref && currentPage === linkHref) {
    link.classList.add("active");
  }
});

// dữ liệu toàn cục
const roomForm = document.getElementById("room-form");
const roomListEl = document.getElementById("room-list");
const formKhach = document.getElementById("khach-form");
const formTK = document.getElementById("taikhoan-form");
const selectPhong = document.getElementById("maPhong");

let danhSachPhong = JSON.parse(localStorage.getItem("danhSachPhong")) || [];
let khachThue = JSON.parse(localStorage.getItem("khachThue")) || [];
let taiKhoanKhach = JSON.parse(localStorage.getItem("taiKhoanKhach")) || [];

let editIndexPhong = -1;
let editIndexKhach = -1;

// LƯU LOCALSTORAGE 
function saveDanhSachPhong() {
  localStorage.setItem("danhSachPhong", JSON.stringify(danhSachPhong));
}

function saveKhach() {
  localStorage.setItem("khachThue", JSON.stringify(khachThue));
}

function saveTaiKhoan() {
  localStorage.setItem("taiKhoanKhach", JSON.stringify(taiKhoanKhach));
}

// PHÒNG: HIỂN THỊ + TRẠNG THÁI 
function renderDanhSachPhong() {
  if (!roomListEl) return;
  roomListEl.innerHTML = "";
  danhSachPhong.forEach((p, index) => {
    const tenants = khachThue.filter(k => k.maPhong === p.soPhong);
    const tenantsHtml = tenants.length > 0
      ? `<ul style="margin: 8px 0 0 0; padding-left: 18px; font-size: 14px; color: #333;">
           ${tenants.map(t => `<li>${t.hoTen} (${t.maNguoiDung})</li>`).join("")}
         </ul>`
      : "";
    const div = document.createElement("div");
    div.className = "room-card";
    div.innerHTML = `
      <h4>Phòng ${p.soPhong}</h4>
      <p>Diện tích: ${p.dienTich} m²</p>
      <p>Giá: ${p.giaPhong} VNĐ</p>
      <span class="status ${tenants.length > 0 ? 'trangthai-dathue' : 'trangthai-trong'}">
        ${tenants.length > 0 ? 'Đã có khách thuê' : 'Phòng trống'}
      </span>
      ${tenantsHtml}
      <div class="actions">
        <button class="edit-phong" data-index="${index}">Sửa</button>
        <button class="delete-phong" data-index="${index}">Xoá</button>
      </div>
    `;
    roomListEl.appendChild(div);
  });
}

// thêm, sửa phòng
if (roomForm) {
  roomForm.addEventListener("submit", e => {
    e.preventDefault();
    const soPhong = document.getElementById("room-number").value.trim();
    const dienTich = document.getElementById("room-area").value.trim();
    const giaPhong = document.getElementById("room-price").value.trim();
    if (!soPhong || !dienTich || !giaPhong) return;

    const roomData = { soPhong, dienTich, giaPhong };
    if (editIndexPhong === -1) {
      danhSachPhong.push(roomData);
    } else {
      danhSachPhong[editIndexPhong] = roomData;
    }

    saveDanhSachPhong();
    renderDanhSachPhong();
    roomForm.reset();
    editIndexPhong = -1;
  });
}

// sửa, xoá phòng
roomListEl?.addEventListener("click", function (e) {
  const index = e.target.dataset.index;
  if (!index) return;

  if (e.target.classList.contains("edit-phong")) {
    const room = danhSachPhong[index];
    document.getElementById("room-number").value = room.soPhong;
    document.getElementById("room-area").value = room.dienTich;
    document.getElementById("room-price").value = room.giaPhong;
    editIndexPhong = parseInt(index);
  }

  if (e.target.classList.contains("delete-phong")) {
    if (!confirm("Bạn có chắc muốn xoá phòng này?")) return;

    const room = danhSachPhong[index];
    const hasKhach = khachThue.some(k => k.maPhong === room.soPhong);
    if (hasKhach) {
      alert("Không thể xoá phòng đang có khách thuê!");
      return;
    }

    danhSachPhong.splice(index, 1);
    saveDanhSachPhong();
    renderDanhSachPhong();
  }
});

// hiển thị khách thuê
function renderKhach() {
  const list = document.getElementById("khach-list");
  if (!list) return;
  list.innerHTML = "";
  khachThue.forEach((khach, index) => {
    const tk = taiKhoanKhach.find(t => t.maNguoiDung === khach.maNguoiDung);
    const div = document.createElement("div");
    div.className = "khach-card";
    div.innerHTML = `
      <h4>${khach.hoTen} (${khach.maNguoiDung})</h4>
      <p>Phòng: ${khach.maPhong}</p>
      <p>Ngày nhận: ${khach.ngayNhanPhong}</p>
      ${tk ? `<p><strong>Tài khoản:</strong> ${tk.username}</p><p><strong>Mật khẩu:</strong> ${tk.password}</p>` : "<p><em>Chưa có tài khoản</em></p>"}
      <button class="edit-btn" onclick="editKhach(${index})">Sửa</button>
      <button class="delete-btn" onclick="deleteKhach(${index})">Xoá</button>
    `;
    list.appendChild(div);
  });
}

// thêm, cập nhật khách thuê
if (formKhach) {
  if (selectPhong) {
    selectPhong.innerHTML = '<option value="">-- Chọn phòng --</option>';
    danhSachPhong.forEach(p => {
      selectPhong.innerHTML += `<option value="${p.soPhong}">${p.soPhong}</option>`;
    });
  }

  formKhach.addEventListener("submit", e => {
    e.preventDefault();
    const khach = {
      maNguoiDung: document.getElementById("maNguoiDung").value.trim(),
      hoTen: document.getElementById("hoTen").value.trim(),
      ngaySinh: document.getElementById("ngaySinh").value,
      gioiTinh: document.getElementById("gioiTinh").value.trim(),
      cccd: document.getElementById("cccd").value.trim(),
      dienThoai: document.getElementById("dienThoai").value.trim(),
      email: document.getElementById("email").value.trim(),
      maPhong: document.getElementById("maPhong").value,
      danToc: document.getElementById("danToc").value.trim(),
      tonGiao: document.getElementById("tonGiao").value.trim(),
      quanHuyen: document.getElementById("quanHuyen").value.trim(),
      tinhThanh: document.getElementById("tinhThanh").value.trim(),
      quocGia: document.getElementById("quocGia").value.trim(),
      ngayNhanPhong: document.getElementById("ngayNhanPhong").value
    };

    if (editIndexKhach === -1) {
      khachThue.push(khach);
    } else {
      khachThue[editIndexKhach] = khach;
    }

    saveKhach();
    renderKhach();
    renderDanhSachPhong();
    formKhach.reset();
    editIndexKhach = -1;
  });
}

// sửa khách thuê
function editKhach(index) {
  const k = khachThue[index];
  editIndexKhach = index;
  document.getElementById("maNguoiDung").value = k.maNguoiDung;
  document.getElementById("hoTen").value = k.hoTen;
  document.getElementById("ngaySinh").value = k.ngaySinh || "";
  document.getElementById("gioiTinh").value = k.gioiTinh || "";
  document.getElementById("cccd").value = k.cccd || "";
  document.getElementById("dienThoai").value = k.dienThoai || "";
  document.getElementById("email").value = k.email || "";
  document.getElementById("maPhong").value = k.maPhong;
  document.getElementById("danToc").value = k.danToc || "";
  document.getElementById("tonGiao").value = k.tonGiao || "";
  document.getElementById("quanHuyen").value = k.quanHuyen || "";
  document.getElementById("tinhThanh").value = k.tinhThanh || "";
  document.getElementById("quocGia").value = k.quocGia || "";
  document.getElementById("ngayNhanPhong").value = k.ngayNhanPhong;
}

// xoá khách thuê
function deleteKhach(index) {
  if (!confirm("Bạn có chắc muốn xoá khách này?")) return;
  const maNguoiDungBiXoa = khachThue[index].maNguoiDung;
  khachThue.splice(index, 1);

  const indexTK = taiKhoanKhach.findIndex(tk => tk.maNguoiDung === maNguoiDungBiXoa);
  if (indexTK !== -1) {
    taiKhoanKhach.splice(indexTK, 1);
    saveTaiKhoan();
  }

  saveKhach();
  renderKhach();
  renderDanhSachPhong();
}

// tạo tài khoản khách thuê
if (formTK) {
  formTK.addEventListener("submit", e => {
    e.preventDefault();
    const maNguoiDung = document.getElementById("tk-maNguoiDung").value.trim();
    const username = document.getElementById("tk-username").value.trim();
    const password = document.getElementById("tk-password").value;

    if (!khachThue.some(kh => kh.maNguoiDung === maNguoiDung)) {
      alert("Mã người dùng không tồn tại!");
      return;
    }

    if (taiKhoanKhach.find(tk => tk.username === username)) {
      alert("Tên tài khoản đã tồn tại!");
      return;
    }

    taiKhoanKhach.push({ maNguoiDung, username, password });
    saveTaiKhoan();
    alert("Tạo tài khoản thành công!");
    formTK.reset();
    renderKhach();
  });
}

// khởi tạo
renderDanhSachPhong();
renderKhach();
