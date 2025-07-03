// Lấy tên file đang mở
const currentPage = window.location.pathname.split("/").pop();

document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname; // tìm tới đường dẫn và tô trắng
  const menuLinks = document.querySelectorAll(".menu li a");

  menuLinks.forEach(link => {
    if (link.getAttribute("href") && currentPath.includes(link.getAttribute("href"))) {
      link.classList.add("active");
    }
  });
});

