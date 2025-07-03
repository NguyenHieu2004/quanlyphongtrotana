// Lấy tên file đang mở
const currentPage = window.location.pathname.split("/").pop();

// Duyệt tất cả các link trong sidebar
document.querySelectorAll(".menu li a").forEach(link => {
  const linkHref = link.getAttribute("href");
  if (linkHref && currentPage === linkHref) {
    link.classList.add("active");
  }
});

// Dữ liệu toàn cục
const roomForm = document.getElementById("room-form");
const roomListEl = document.getElementById("room-list");
const formDien = document.getElementById("form-dien");
const formNuoc = document.getElementById("form-nuoc");
const chonPhongLapHD = document.getElementById("chonPhongLapHD");
const hoaDonForm = document.getElementById("hoaDonForm");
const serviceForm = document.getElementById("service-form");
const serviceListEl = document.getElementById("service-list");
const listDien = document.getElementById("list-dien");
const listNuoc = document.getElementById("list-nuoc");
const dsHoaDon = document.getElementById("dsHoaDon");
const tongDoanhThuEl = document.getElementById("tongDoanhThu");
const tongThangEl = document.getElementById("tongThang");

// admin-khach.html liên quan
const formKhach = document.getElementById("khach-form");
const formTK = document.getElementById("taikhoan-form");
const selectPhong = document.getElementById("maPhong");
const listKhach = document.getElementById("khach-list");

let danhSachPhong = JSON.parse(localStorage.getItem("danhSachPhong")) || [];
let danhSachDichVu = JSON.parse(localStorage.getItem("danhSachDichVu")) || [];
let danhSachDien = JSON.parse(localStorage.getItem("danhSachDien")) || [];
let danhSachNuoc = JSON.parse(localStorage.getItem("danhSachNuoc")) || [];
let danhSachHoaDon = JSON.parse(localStorage.getItem("danhSachHoaDon")) || [];
let khachThue = JSON.parse(localStorage.getItem("khachThue")) || [];
let taiKhoanKhach = JSON.parse(localStorage.getItem("taiKhoanKhach")) || [];

let editIndexKhach = -1;

function saveKhach() {
  localStorage.setItem("khachThue", JSON.stringify(khachThue));
}
function saveTaiKhoan() {
  localStorage.setItem("taiKhoanKhach", JSON.stringify(taiKhoanKhach));
}

function renderKhach() {
  if (!listKhach) return;
  listKhach.innerHTML = "";
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
    listKhach.appendChild(div);
  });
}

if (formKhach && selectPhong) {
  selectPhong.innerHTML = '<option value="">-- Chọn phòng --</option>';
  danhSachPhong.forEach(p => {
    selectPhong.innerHTML += `<option value="${p.soPhong}">${p.soPhong}</option>`;
  });

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
      editIndexKhach = -1;
    }

    saveKhach();
    renderKhach();
    formKhach.reset();
  });
}

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

window.editKhach = function(index) {
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
};

window.deleteKhach = function(index) {
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
};

if (currentPage === "admin-khach.html") {
  renderKhach();
}


let editIndexPhong = -1;

function saveDanhSachPhong() {
  localStorage.setItem("danhSachPhong", JSON.stringify(danhSachPhong));
}

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
        <button class="edit" onclick="editPhong(${index})">Sửa</button>
        <button class="delete" onclick="deletePhong(${index})">Xoá</button>
      </div>
    `;
    roomListEl.appendChild(div);
  });
}

window.editPhong = function(index) {
  const room = danhSachPhong[index];
  document.getElementById("room-number").value = room.soPhong;
  document.getElementById("room-area").value = room.dienTich;
  document.getElementById("room-price").value = room.giaPhong;
  editIndexPhong = index;
};

window.deletePhong = function(index) {
  const phong = danhSachPhong[index];
  const hasKhach = khachThue.some(k => k.maPhong === phong.soPhong);
  if (hasKhach) {
    alert("Không thể xoá phòng đang có khách thuê!");
    return;
  }

  if (confirm("Bạn có chắc muốn xoá phòng này?")) {
    danhSachPhong.splice(index, 1);
    saveDanhSachPhong();
    renderDanhSachPhong();
  }
};

if (roomForm) {
  roomForm.addEventListener("submit", e => {
    e.preventDefault();
    const soPhong = document.getElementById("room-number").value.trim();
    const dienTich = document.getElementById("room-area").value.trim();
    const giaPhong = document.getElementById("room-price").value.trim();
    if (!soPhong || !dienTich || !giaPhong) return;

    const data = { soPhong, dienTich, giaPhong };
    if (editIndexPhong === -1) {
      danhSachPhong.push(data);
    } else {
      danhSachPhong[editIndexPhong] = data;
      editIndexPhong = -1;
    }

    saveDanhSachPhong();
    renderDanhSachPhong();
    roomForm.reset();
  });
}

// Tự động hiển thị khi vào trang admin-phong.html
if (window.location.pathname.includes("admin-phong.html")) {
  renderDanhSachPhong();
}


// Quản lý dịch vụ
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
    const giaDichVu = parseFloat(document.getElementById("service-price").value);
    const moTaDichVu = document.getElementById("service-description").value.trim();

    if (!tenDichVu || isNaN(giaDichVu) || !moTaDichVu) {
      alert("Vui lòng điền đầy đủ thông tin dịch vụ.");
      return;
    }

    const dv = { tenDichVu, giaDichVu, moTaDichVu };

    if (editIndexDichVu === -1) {
      danhSachDichVu.push(dv);
    } else {
      danhSachDichVu[editIndexDichVu] = dv;
      editIndexDichVu = -1;
    }

    saveDichVu();
    renderDichVu();
    serviceForm.reset();
  });
}

window.editDichVu = function(index) {
  const dv = danhSachDichVu[index];
  document.getElementById("service-name").value = dv.tenDichVu;
  document.getElementById("service-price").value = dv.giaDichVu;
  document.getElementById("service-description").value = dv.moTaDichVu;
  editIndexDichVu = index;
};

window.deleteDichVu = function(index) {
  if (confirm("Bạn có chắc muốn xoá dịch vụ này?")) {
    danhSachDichVu.splice(index, 1);
    saveDichVu();
    renderDichVu();
  }
};

// Khởi tạo nếu đang ở trang dịch vụ
if (window.location.pathname.includes("admin-dichvu.html")) {
  renderDichVu();
}

// Quản lý điện nước

// const phongDienSelect = document.getElementById("phongDien");
// const phongNuocSelect = document.getElementById("phongNuoc");




// function saveDien() {
//   localStorage.setItem("danhSachDien", JSON.stringify(danhSachDien));
// }

// function saveNuoc() {
//   localStorage.setItem("danhSachNuoc", JSON.stringify(danhSachNuoc));
// }

// function loadMaPhong() {
//   danhSachPhong = JSON.parse(localStorage.getItem("danhSachPhong")) || [];
//   if (phongDienSelect) {
//     phongDienSelect.innerHTML = `<option value="">-- Chọn mã phòng --</option>`;
//     danhSachPhong.forEach(p => {
//       phongDienSelect.innerHTML += `<option value="${p.soPhong}">${p.soPhong}</option>`;
//     });
//   }
//   if (phongNuocSelect) {
//     phongNuocSelect.innerHTML = `<option value="">-- Chọn mã phòng --</option>`;
//     danhSachPhong.forEach(p => {
//       phongNuocSelect.innerHTML += `<option value="${p.soPhong}">${p.soPhong}</option>`;
//     });
//   }
// }

// function renderDien() {
//   if (!listDien) return;
//   listDien.innerHTML = "";
//   danhSachDien.forEach(d => {
//     const div = document.createElement("div");
//     div.className = "diennuoc-card";
//     div.innerHTML = `<strong>Phòng:</strong> ${d.soPhong} | ${d.ngay}<br>Chỉ số: ${d.chiSo} kWh | Giá: ${d.gia} VND`;
//     listDien.appendChild(div);
//   });
// }

// function renderNuoc() {
//   if (!listNuoc) return;
//   listNuoc.innerHTML = "";
//   danhSachNuoc.forEach(n => {
//     const div = document.createElement("div");
//     div.className = "diennuoc-card";
//     div.innerHTML = `<strong>Phòng:</strong> ${n.soPhong} | ${n.ngay}<br>Chỉ số: ${n.chiSo} m³ | Giá: ${n.gia} VND`;
//     listNuoc.appendChild(div);
//   });
// }

// if (formDien) {
//   formDien.addEventListener("submit", e => {
//     e.preventDefault();
//     const soPhong = phongDienSelect.value;
//     const chiSo = parseFloat(document.getElementById("chiSoDien").value);
//     const gia = parseFloat(document.getElementById("giaDien").value);
//     const ngay = document.getElementById("ngayDien").value;

//     if (!soPhong || isNaN(chiSo) || isNaN(gia) || !ngay) {
//       alert("Vui lòng điền đầy đủ thông tin điện.");
//       return;
//     }

//     danhSachDien.push({ soPhong, chiSo, gia, ngay });
//     saveDien();
//     renderDien();
//     formDien.reset();
//   });
// }

// if (formNuoc) {
//   formNuoc.addEventListener("submit", e => {
//     e.preventDefault();
//     const soPhong = phongNuocSelect.value;
//     const chiSo = parseFloat(document.getElementById("chiSoNuoc").value);
//     const gia = parseFloat(document.getElementById("giaNuoc").value);
//     const ngay = document.getElementById("ngayNuoc").value;

//     if (!soPhong || isNaN(chiSo) || isNaN(gia) || !ngay) {
//       alert("Vui lòng điền đầy đủ thông tin nước.");
//       return;
//     }

//     danhSachNuoc.push({ soPhong, chiSo, gia, ngay });
//     saveNuoc();
//     renderNuoc();
//     formNuoc.reset();
//   });
// }

// // Khởi tạo nếu ở trang nhập điện nước
// if (window.location.pathname.includes("admin-nhapdiennuoc.html")) {
//   loadMaPhong();
//   renderDien();
//   renderNuoc();
// }



// // Quản lý hoá đơn
// =============================
// === DOANH THU + ĐIỆN/NƯỚC ===
// =============================

const thangHoaDon = document.getElementById("thangHoaDon");
const giaDienEl = document.getElementById("giaDienHD");
const soDienEl = document.getElementById("soDienHD");
const giaNuocEl = document.getElementById("giaNuocHD");
const soNuocEl = document.getElementById("soNuocHD");

let editIndexHoaDon = -1;

function loadMaPhong(selectEl) {
  if (!selectEl) return;
  selectEl.innerHTML = `<option value="">-- Chọn mã phòng --</option>`;
  danhSachPhong.forEach(p => {
    selectEl.innerHTML += `<option value="${p.soPhong}">${p.soPhong}</option>`;
  });
}

function renderDoanhThu() {
  if (!dsHoaDon) return;
  dsHoaDon.innerHTML = "";
  tongDoanhThuEl.textContent = "0";
  tongThangEl.textContent = "";

  const thang = thangHoaDon?.value;
  let tong = 0;
  danhSachHoaDon.forEach((hd, index) => {
    const div = document.createElement("div");
    div.className = "hoa-don-card";
    div.innerHTML = `
      <h4>Phòng: ${hd.soPhong}</h4>
      <p>Tháng: ${hd.thang}</p>
      <p>Tiền phòng: ${Number(hd.giaPhong).toLocaleString('vi-VN')} VND</p>
      <p>Điện: ${hd.dien} x ${Number(hd.giaDien).toLocaleString('vi-VN')} = ${Number(hd.dien * hd.giaDien).toLocaleString('vi-VN')} VND</p>
      <p>Nước: ${hd.nuoc} x ${Number(hd.giaNuoc).toLocaleString('vi-VN')} = ${Number(hd.nuoc * hd.giaNuoc).toLocaleString('vi-VN')} VND</p>
      <p>Dịch vụ: ${hd.dichVu}</p>
      <p><strong>Tổng: ${Number(hd.tongTien).toLocaleString('vi-VN')} VND</strong></p>
      <div class="actions">
        <button class="edit" onclick="editHoaDon(${index})">Sửa</button>
        <button class="delete" onclick="deleteHoaDon(${index})">Xoá</button>
        ${hd.trangThai === "Chưa thanh toán" ? `<button onclick="xacNhanThanhToan(${index})">Thanh toán</button>` : ""}
      </div>
    `;
    dsHoaDon.appendChild(div);

    if (thang && hd.trangThai === "Đã thanh toán" && hd.thang === thang) {
      tong += Number(hd.tongTien);
    }
  });

  if (thang) {
    tongDoanhThuEl.textContent = tong.toLocaleString('vi-VN');
    tongThangEl.textContent = thang;
  }
}

if (hoaDonForm && chonPhongLapHD) {
  hoaDonForm.addEventListener("submit", e => {
    e.preventDefault();
    const soPhong = chonPhongLapHD.value;
    const thang = thangHoaDon.value;
    const phong = danhSachPhong.find(p => p.soPhong === soPhong);

    if (!phong) {
      alert("Không tìm thấy thông tin phòng!");
      return;
    }

    // Chuyển đổi tất cả giá trị sang số
    const dien = parseFloat(soDienEl.value) || 0;
    const giaDien = parseFloat(giaDienEl.value) || 0;
    const nuoc = parseFloat(soNuocEl.value) || 0;
    const giaNuoc = parseFloat(giaNuocEl.value) || 0;
    
    // Tính toán tổng tiền (đảm bảo là phép cộng số)
    const tongTien = parseFloat(phong.giaPhong) + (dien * giaDien) + (nuoc * giaNuoc);

    const hoaDon = {
      soPhong,
      thang,
      giaPhong: parseFloat(phong.giaPhong),
      dien,
      giaDien,
      nuoc,
      giaNuoc,
      dichVu: "Internet, Giữ xe",
      tongTien, // Đã là số
      trangThai: "Chưa thanh toán"
    };

    if (editIndexHoaDon === -1) {
      danhSachHoaDon.push(hoaDon);
      alert("Lập hoá đơn thành công!");
    } else {
      danhSachHoaDon[editIndexHoaDon] = hoaDon;
      alert("Cập nhật hoá đơn thành công!");
      editIndexHoaDon = -1;
    }

    localStorage.setItem("danhSachHoaDon", JSON.stringify(danhSachHoaDon));
    hoaDonForm.reset();
    renderDoanhThu();
  });

  window.editHoaDon = function(index) {
    const hd = danhSachHoaDon[index];
    chonPhongLapHD.value = hd.soPhong;
    thangHoaDon.value = hd.thang;
    giaDienEl.value = hd.giaDien;
    soDienEl.value = hd.dien;
    giaNuocEl.value = hd.giaNuoc;
    soNuocEl.value = hd.nuoc;
    editIndexHoaDon = index;
  };

  window.deleteHoaDon = function(index) {
    if (confirm("Xoá hoá đơn này?")) {
      danhSachHoaDon.splice(index, 1);
      localStorage.setItem("danhSachHoaDon", JSON.stringify(danhSachHoaDon));
      renderDoanhThu();
    }
  };

  window.xacNhanThanhToan = function(index) {
    danhSachHoaDon[index].trangThai = "Đã thanh toán";
    localStorage.setItem("danhSachHoaDon", JSON.stringify(danhSachHoaDon));
    renderDoanhThu();
  };
}

// =========================
// === KHOI TAO THEO PAGE ===
// =========================

document.addEventListener("DOMContentLoaded", () => {
  if (currentPage === "admin-doanhthu.html") {
    loadMaPhong(chonPhongLapHD);
    renderDoanhThu();
  }
});
