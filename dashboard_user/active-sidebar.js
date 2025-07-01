// Lấy tên file đang mở
const currentPage = window.location.pathname.split("/").pop();

// Duyệt tất cả các link trong sidebar
document.querySelectorAll(".menu li a").forEach(link => {
  const linkHref = link.getAttribute("href");

  if (linkHref && currentPage === linkHref) {
    link.classList.add("active");
  }
});// Action tô màu trắng khi nhấp vào chức năng sidebar


document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname; // tìm tới đường dẫn và tô trắng
  const menuLinks = document.querySelectorAll(".menu li a");

  menuLinks.forEach(link => {
    if (link.getAttribute("href") && currentPath.includes(link.getAttribute("href"))) {
      link.classList.add("active");
    }
  });
});

