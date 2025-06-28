// Chức năng cơ bản sẽ thêm sau nếu cần
console.log("TANA dashboard loaded");

const carousel = document.getElementById("carousel");
let index = 0;

setInterval(() => {
    index = (index + 1) % 3;
    carousel.style.transform = `translateX(-${index * 100}%)`;
}, 4000); // đổi slide mỗi 4 giây

// Hiện nút khi scroll xuống
const backToTopBtn = document.getElementById("backToTopBtn");

window.onscroll = function () {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    backToTopBtn.style.display = "block";
    } else {
    backToTopBtn.style.display = "none";
    }
};

// Cuộn về đầu trang khi click
backToTopBtn.onclick = function () {
    window.scrollTo({
    top: 0,
    behavior: 'smooth'
    });
};
