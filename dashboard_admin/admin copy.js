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
const formDien = document.getElementById("form-dien");
const formNuoc = document.getElementById("form-nuoc");
const chonPhongLapHD = document.getElementById("chonPhongLapHD");
const hoaDonForm = document.getElementById("hoaDonForm");

let khachThue = JSON.parse(localStorage.getItem("khachThue")) || [];
let taiKhoanKhach = JSON.parse(localStorage.getItem("taiKhoanKhach")) || [];
let danhSachPhong = JSON.parse(localStorage.getItem("danhSachPhong")) || [];
let danhSachDichVu = JSON.parse(localStorage.getItem("danhSachDichVu")) || [];
let danhSachDien = JSON.parse(localStorage.getItem("danhSachDien")) || [];
let danhSachNuoc = JSON.parse(localStorage.getItem("danhSachNuoc")) || [];
let danhSachHoaDon = JSON.parse(localStorage.getItem("danhSachHoaDon")) || [];

let editIndexPhong = -1;
let editIndexKhach = -1;
let editIndexDichVu = -1;

function saveDanhSachPhong() {
  localStorage.setItem("danhSachPhong", JSON.stringify(danhSachPhong));
}
function saveKhach() {
  localStorage.setItem("khachThue", JSON.stringify(khachThue));
}
function saveTaiKhoan() {
  localStorage.setItem("taiKhoanKhach", JSON.stringify(taiKhoanKhach));
}
function saveDichVu() {
  localStorage.setItem("danhSachDichVu", JSON.stringify(danhSachDichVu));
}
function saveDien() {
  localStorage.setItem("danhSachDien", JSON.stringify(danhSachDien));
}
function saveNuoc() {
  localStorage.setItem("danhSachNuoc", JSON.stringify(danhSachNuoc));
}

function loadMaPhong() {
  // Lấy lại dữ liệu mới nhất từ localStorage
  danhSachPhong = JSON.parse(localStorage.getItem("danhSachPhong")) || [];
  const phongDien = document.getElementById("phongDien");
  const phongNuoc = document.getElementById("phongNuoc");
  if (phongDien && phongNuoc) {
    phongDien.innerHTML = "";
    phongNuoc.innerHTML = "";
    danhSachPhong.forEach(p => {
      phongDien.add(new Option(p.soPhong, p.soPhong));
      phongNuoc.add(new Option(p.soPhong, p.soPhong));
    });
  }
  if (chonPhongLapHD) {
    chonPhongLapHD.innerHTML = "";
    danhSachPhong.forEach(p => {
      chonPhongLapHD.add(new Option(p.soPhong, p.soPhong));
    });
  }
}

// Submit điện
if (formDien) {
  formDien.addEventListener("submit", e => {
    e.preventDefault();
    const phongDien = document.getElementById("phongDien").value;
    const chiSo = parseFloat(document.getElementById("chiSoDien").value);
    const gia = parseFloat(document.getElementById("giaDien").value);
    const ngay = document.getElementById("ngayDien").value;
    if (!phongDien || isNaN(chiSo) || isNaN(gia) || !ngay) return;
    danhSachDien.push({ soPhong: phongDien, chiSo, gia, ngay });
    saveDien();
    renderDien();
    formDien.reset();
  });
}

// Submit nước
if (formNuoc) {
  formNuoc.addEventListener("submit", e => {
    e.preventDefault();
    const phongNuoc = document.getElementById("phongNuoc").value;
    const chiSo = parseFloat(document.getElementById("chiSoNuoc").value);
    const gia = parseFloat(document.getElementById("giaNuoc").value);
    const ngay = document.getElementById("ngayNuoc").value;
    if (!phongNuoc || isNaN(chiSo) || isNaN(gia) || !ngay) return;
    danhSachNuoc.push({ soPhong: phongNuoc, chiSo, gia, ngay });
    saveNuoc();
    renderNuoc();
    formNuoc.reset();
  });
}

// Submit hóa đơn
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

window.xacNhanThanhToan = function(index) {
  if (confirm("Xác nhận đã thanh toán?")) {
    danhSachHoaDon[index].trangThai = "Đã thanh toán";
    localStorage.setItem("danhSachHoaDon", JSON.stringify(danhSachHoaDon));
    renderDoanhThu();
  }
}

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
