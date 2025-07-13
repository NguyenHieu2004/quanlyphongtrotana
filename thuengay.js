// hàm gọi các bộ sưu tập ảnh và xử lý sự kiện
let currentImageIndex = 0;
const images = [
    'img/KD2-phongchinh.jpg',
    'img/KD2-bedroom.jpg',
    'img/KD2-bep.jpg',
    'img/KD2-bep2.jpg',
    'img/KD2-phongchinh2.jpg',
    'img/KD2-phongchinh3.jpg',
];

function showImage(index) {
    currentImageIndex = index;
    document.getElementById('main-img').src = images[index];
    document.querySelector('.image-counter').textContent = `${index + 1}/${images.length}`;
    
    // cập nhât các hình thu nhỏ khi nhấp vào sẽ tạo khung xanh
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

// lắng nghe sự kiện click trên các hình thu nhỏ
function changeImage(direction) {
    currentImageIndex += direction;
    if (currentImageIndex < 0) currentImageIndex = images.length - 1;
    if (currentImageIndex >= images.length) currentImageIndex = 0;
    showImage(currentImageIndex);
}

// Khởi tạo bộ sưu tập ảnh
function initializeGallery() {
    // load ảnh 0 vào trc
    showImage(0);
}

function initializeForm() {
    const form = document.getElementById("form-thue");
    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            alert("Thông tin đã gửi. Chủ trọ sẽ gọi đến bạn sớm nhất!");
            this.reset();
        });
    }
}

// Khởi tạo mọi thứ khi DOM được tải
document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
    initializeForm();
});

// Khởi tạo sao lưu cho các trình duyệt cũ hơn
window.addEventListener('load', function() {
    if (!document.getElementById('main-img').src || document.getElementById('main-img').src.endsWith('/')) {
        initializeGallery();
    }
});