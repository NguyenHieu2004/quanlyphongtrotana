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

let khachThue = JSON.parse(localStorage.getItem("khachThue")) || [];
let taiKhoanKhach = JSON.parse(localStorage.getItem("taiKhoanKhach")) || [];
let danhSachPhong = JSON.parse(localStorage.getItem("danhSachPhong")) || []; // ✅ THÊM DÒNG NÀY


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
    loadMaPhong(); // Cập nhật lại select phòng
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
    loadMaPhong(); // Cập nhật lại select phòng
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



// QUẢN LÝ DỊCH VỤ ===
const serviceForm = document.getElementById("service-form");
const serviceListEl = document.getElementById("service-list");
let danhSachDichVu = JSON.parse(localStorage.getItem("danhSachDichVu")) || [];
let editIndexDichVu = -1;

function saveDichVu() {
  localStorage.setItem("danhSachDichVu", JSON.stringify(danhSachDichVu));
}

function renderDichVu() {
  if (!serviceListEl) return;
  serviceListEl.innerHTML = "";
  danhSachDichVu.forEach((dv, index) => {
    const div = document.createElement("div");
    div.className = "service-card";
    div.innerHTML = `
      <h4>${dv.tenDichVu}</h4>
      <p>Giá: ${dv.giaDichVu} VNĐ</p>
      <p>Mô tả: ${dv.moTaDichVu}</p>
      <div class="actions">
        <button class="edit" onclick="editDichVu(${index})">Sửa</button>
        <button class="delete" onclick="deleteDichVu(${index})">Xoá</button>
      </div>
    `;
    serviceListEl.appendChild(div);
  });
}

if (serviceForm) {
  serviceForm.addEventListener("submit", e => {
    e.preventDefault();
    const tenDichVu = document.getElementById("service-name").value.trim();
    const giaDichVu = document.getElementById("service-price").value.trim();
    const moTaDichVu = document.getElementById("service-description").value.trim();
    if (!tenDichVu || !giaDichVu || !moTaDichVu) return;

    const data = { tenDichVu, giaDichVu, moTaDichVu };

    if (editIndexDichVu === -1) {
      danhSachDichVu.push(data);
    } else {
      danhSachDichVu[editIndexDichVu] = data;
      editIndexDichVu = -1;
    }

    saveDichVu();
    renderDichVu();
    serviceForm.reset();
  });
}

function editDichVu(index) {
  const dv = danhSachDichVu[index];
  document.getElementById("service-name").value = dv.tenDichVu;
  document.getElementById("service-price").value = dv.giaDichVu;
  document.getElementById("service-description").value = dv.moTaDichVu;
  editIndexDichVu = index;
}

function deleteDichVu(index) {
  if (!confirm("Bạn có chắc muốn xoá dịch vụ này?")) return;
  danhSachDichVu.splice(index, 1);
  saveDichVu();
  renderDichVu();
}
// Khởi tạo danh sách dịch vụ nếu đang ở trang dịch vụ
if (serviceListEl) renderDichVu();



// Quản lý Nhập điện/nước
  const phongDien = document.getElementById("phongDien");
  const phongNuoc = document.getElementById("phongNuoc");
  const listDien = document.getElementById("list-dien");
  const listNuoc = document.getElementById("list-nuoc");

  const formDien = document.getElementById("form-dien");
  const formNuoc = document.getElementById("form-nuoc");

  let danhSachDien = JSON.parse(localStorage.getItem("danhSachDien")) || [];
  let danhSachNuoc = JSON.parse(localStorage.getItem("danhSachNuoc")) || [];

  // Load mã phòng vào select
  function loadMaPhong() {
    console.log("Loading room numbers...");
  if (phongDien && phongNuoc) {
    // Xóa hết option cũ trước khi thêm mới
    phongDien.innerHTML = "";
    phongNuoc.innerHTML = "";
    danhSachPhong.forEach(p => {
      const option1 = new Option(p.soPhong, p.soPhong);
      const option2 = new Option(p.soPhong, p.soPhong);
      phongDien.add(option1);
      phongNuoc.add(option2);
    });
  }
  if (chonPhongLapHD) {
    chonPhongLapHD.innerHTML = "";
    danhSachPhong.forEach(p => {
      chonPhongLapHD.add(new Option(p.soPhong, p.soPhong));
    });
  }
}

  // Hiển thị danh sách điện
if(formDien){
  function renderDien() {
    listDien.innerHTML = "";
    danhSachDien.forEach(d => {
      const div = document.createElement("div");
      div.className = "diennuoc-card";
      div.innerHTML = `<strong>Phòng:</strong> ${d.soPhong} | ${d.ngay}<br>
        Chỉ số: ${d.chiSo} kWh | Giá: ${d.gia} VND`;
      listDien.appendChild(div);
    });
  }
}
  // Hiển thị danh sách nước
if(formNuoc){
  function renderNuoc() {
    listNuoc.innerHTML = "";
    danhSachNuoc.forEach(n => {
      const div = document.createElement("div");
      div.className = "diennuoc-card";
      div.innerHTML = `<strong>Phòng:</strong> ${n.soPhong} | ${n.ngay}<br>
        Chỉ số: ${n.chiSo} m³ | Giá: ${n.gia} VND`;
      listNuoc.appendChild(div);
    });
  }
}

  // Lưu localStorage
  function saveDien() {
    localStorage.setItem("danhSachDien", JSON.stringify(danhSachDien));
  }

  function saveNuoc() {
    localStorage.setItem("danhSachNuoc", JSON.stringify(danhSachNuoc));
  }

  // Submit điện
  formDien.addEventListener("submit", e => {
    e.preventDefault();
    const soPhong = phongDien.value;
    const chiSo = parseFloat(document.getElementById("chiSoDien").value);
    const gia = parseFloat(document.getElementById("giaDien").value);
    const ngay = document.getElementById("ngayDien").value;

    if (!soPhong || isNaN(chiSo) || isNaN(gia) || !ngay) return;

    danhSachDien.push({ soPhong, chiSo, gia, ngay });
    saveDien();
    renderDien();
    formDien.reset();
  });

  // Submit nước
  formNuoc.addEventListener("submit", e => {
    e.preventDefault();
    const soPhong = phongNuoc.value;
    const chiSo = parseFloat(document.getElementById("chiSoNuoc").value);
    const gia = parseFloat(document.getElementById("giaNuoc").value);
    const ngay = document.getElementById("ngayNuoc").value;

    if (!soPhong || isNaN(chiSo) || isNaN(gia) || !ngay) return;

    danhSachNuoc.push({ soPhong, chiSo, gia, ngay });
    saveNuoc();
    renderNuoc();
    formNuoc.reset();
  });

  

// QUẢN LÝ HÓA ĐƠN
let danhSachHoaDon = JSON.parse(localStorage.getItem("danhSachHoaDon")) || [];

const chonPhongLapHD = document.getElementById("chonPhongLapHD");
const hoaDonForm = document.getElementById("hoaDonForm");
const chiTietHoaDon = document.getElementById("chiTietHoaDon");
const dsHoaDon = document.getElementById("dsHoaDon");
const tongDoanhThuEl = document.getElementById("tongDoanhThu");
const tongThangEl = document.getElementById("tongThang");

// Load phòng
danhSachPhong.forEach(p => {
  const opt = new Option(p.soPhong, p.soPhong);
  chonPhongLapHD.add(opt);
});

// Hiển thị tổng doanh thu
function renderDoanhThu() {
  const thangChon = document.getElementById("thangHoaDon")?.value || "";
  let tong = 0;
  dsHoaDon.innerHTML = "";

  danhSachHoaDon.forEach((hd, index) => {
    if (hd.trangThai === "Đã thanh toán" && hd.thang === thangChon) {
      tong += hd.tongTien;
    }

    const div = document.createElement("div");
    div.className = "hoa-don-card";
    div.innerHTML = `
      <strong>Phòng:</strong> ${hd.soPhong}<br>
      <strong>Tháng:</strong> ${hd.thang}<br>
      Tiền phòng: ${hd.giaPhong} VND<br>
      Điện: ${hd.dien} kWh (${hd.giaDien} VND)<br>
      Nước: ${hd.nuoc} m³ (${hd.giaNuoc} VND)<br>
      Dịch vụ: ${hd.dichVu}<br>
      <strong>Tổng: ${hd.tongTien} VND</strong><br>
      Trạng thái: ${hd.trangThai}
      ${hd.trangThai === "Chưa thanh toán" ? `<br><button onclick="xacNhanThanhToan(${index})">Xác nhận thanh toán</button>` : ""}
    `;
    dsHoaDon.appendChild(div);
  });

  tongDoanhThuEl.textContent = tong.toLocaleString();
  tongThangEl.textContent = thangChon;
}

// Lập hóa đơn
if (hoaDonForm) {
  hoaDonForm.addEventListener("submit", e => {
    e.preventDefault();
    const soPhong = chonPhongLapHD.value;
    const thang = document.getElementById("thangHoaDon").value;
    const phong = danhSachPhong.find(p => p.soPhong === soPhong);
    const dien = danhSachDien.find(d => d.soPhong === soPhong && d.ngay.startsWith(thang));
    const nuoc = danhSachNuoc.find(n => n.soPhong === soPhong && n.ngay.startsWith(thang));
    if (!phong || !dien || !nuoc) return alert("Thiếu dữ liệu phòng/điện/nước!");
    const tongTien = +phong.giaPhong + (dien.chiSo * dien.gia) + (nuoc.chiSo * nuoc.gia);
    const hoaDon = {
      soPhong,
      thang,
      giaPhong: +phong.giaPhong,
      dien: dien.chiSo,
      giaDien: dien.gia,
      nuoc: nuoc.chiSo,
      giaNuoc: nuoc.gia,
      dichVu: "Internet, Giữ xe",
      tongTien: Math.round(tongTien),
      trangThai: "Chưa thanh toán"
    };
    danhSachHoaDon.push(hoaDon);
    localStorage.setItem("danhSachHoaDon", JSON.stringify(danhSachHoaDon));
    renderDoanhThu();
    hoaDonForm.reset();
  });
}

// Xác nhận thanh toán
window.xacNhanThanhToan = function(index) {
  if (confirm("Xác nhận đã thanh toán?")) {
    danhSachHoaDon[index].trangThai = "Đã thanh toán";
    localStorage.setItem("danhSachHoaDon", JSON.stringify(danhSachHoaDon));
    renderDoanhThu();
  }
}

// Init
// Khởi tạo

// Init theo từng trang

document.addEventListener("DOMContentLoaded", () => {
  if (currentPage === "admin-phong.html") {
    renderDanhSachPhong();
  }
  if (currentPage === "admin-khach.html") {
    renderKhach();
  }
  if (currentPage === "admin-dichvu.html") {
    renderDichVu();
  }
  if (currentPage === "admin-nhapdiennuoc.html") {
    loadMaPhong();
    renderDien();
    renderNuoc();
  }
  if (currentPage === "admin-doanhthu.html") {
    loadMaPhong();
    renderDoanhThu();
  }
});





