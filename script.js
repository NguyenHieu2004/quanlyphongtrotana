// Chức năng cơ bản sẽ thêm sau nếu cần
console.log("TANA dashboard loaded");

const carousel = document.getElementById("carousel");
let index = 0;

// Biến lưu trữ dữ liệu gốc
let originalRooms = [];

// Lưu dữ liệu gốc khi trang tải
document.addEventListener('DOMContentLoaded', function() {
    originalRooms = Array.from(document.querySelectorAll('#page-1 .phong-item')).map(item => item.cloneNode(true));
});

setInterval(() => {
    index = (index + 1) % 3;
    carousel.style.transform = `translateX(-${index * 100}%)`;
}, 4000);

// Hiện nút khi scroll xuống
const backToTopBtn = document.getElementById("backToTopBtn");

window.onscroll = function () {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
};

backToTopBtn.onclick = function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

// ===== Xử lý Chi tiết / Thu gọn phòng =====
document.querySelectorAll(".room-card").forEach(card => {
    const btns = card.querySelectorAll(".toggle-detail");
    const detail = card.querySelector(".room-details");

    btns[0].addEventListener("click", () => {
        detail.classList.remove("hidden");
        btns[0].classList.add("hidden");
        btns[1].classList.remove("hidden");
    });

    btns[1].addEventListener("click", () => {
        detail.classList.add("hidden");
        btns[0].classList.remove("hidden");
        btns[1].classList.add("hidden");
    });
});

// ===== Xử lý chuyển trang =====
function changePage(pageNum) {
    const totalPages = 3;
    for (let i = 1; i <= totalPages; i++) {
        const page = document.getElementById('page-' + i);
        page.style.display = (i === pageNum) ? 'block' : 'none';
    }
}

// Xử lý bộ lọc
document.getElementById("filter-button").addEventListener("click", function () {
    var district = document.getElementById("filter-district").value;
    var size = document.getElementById("filter-size").value;
    var price = document.getElementById("filter-price").value;

    // Hiển thị lại trang 1
    document.getElementById("page-1").style.display = "block";
    document.getElementById("page-2").style.display = "none";
    document.getElementById("page-3").style.display = "none";
    
    var container = document.getElementById("page-1");
    container.innerHTML = "";

    // Lấy dữ liệu từ originalRooms
    var allRooms = originalRooms.map(item => item.cloneNode(true));

    var filtered = allRooms.filter(function (item) {
        var diaChi = item.querySelector("p:nth-of-type(1) strong").textContent.trim();
        var dienTich = item.querySelector("p:nth-of-type(2) strong").textContent.trim();
        var giaPhong = item.querySelector(".gia").textContent.trim();

        var matchDistrict = district === "--Tất cả--" || district === "Quận/huyện" || diaChi.includes(district);
        var matchSize = size === "--Tất cả--" || size === "Diện tích" || dienTich.includes(size);
        var matchPrice = price === "--Tất cả--" || price === "Giá phòng" || giaPhong.includes(price.split(" ")[0]);

        return matchDistrict && matchSize && matchPrice;
    });

    if (filtered.length === 0) {
        container.innerHTML = "<p style='padding: 20px; text-align: center;'>Không tìm thấy phòng phù hợp với tiêu chí đã chọn.</p>";
    } else {
        filtered.forEach(function (item) {
            container.appendChild(item);
        });
    }

    document.querySelector(".phan-trang").style.display = "none";
});

// Xử lý reset bộ lọc
document.getElementById("reset-filter").addEventListener("click", function () {
    // Reset các select box
    document.getElementById("filter-district").value = "Quận/huyện";
    document.getElementById("filter-size").value = "Diện tích";
    document.getElementById("filter-price").value = "Giá phòng";

    // Hiển thị lại trang 1
    document.getElementById("page-1").style.display = "block";
    document.getElementById("page-2").style.display = "none";
    document.getElementById("page-3").style.display = "none";
    
    // Khôi phục nội dung gốc
    var container = document.getElementById("page-1");
    container.innerHTML = "";
    
    // Kiểm tra nếu originalRooms chưa được khởi tạo
    if (originalRooms.length === 0) {
        originalRooms = Array.from(document.querySelectorAll('#page-1 .phong-item')).map(item => item.cloneNode(true));
    }
    
    // Thêm lại các phòng gốc
    originalRooms.forEach(room => {
        container.appendChild(room.cloneNode(true));
    });

    document.querySelector(".phan-trang").style.display = "block";
});