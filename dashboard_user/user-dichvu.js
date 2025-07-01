document.addEventListener("DOMContentLoaded", () => {
  const registerButtons = document.querySelectorAll(".register-btn");
  const sections = document.querySelectorAll(".section-title + .service-grid");
  const registeredContainer = sections[0]; // phần 'Đã đăng ký'
  const unregisteredContainer = sections[1]; // phần 'Chưa đăng ký'

  // Xử lý nút Đăng ký
  registerButtons.forEach(button => {
    button.addEventListener("click", () => {
      const confirmed = confirm("Xác nhận đăng ký dịch vụ?");
      if (!confirmed) return;

      const card = button.closest(".service-card").cloneNode(true);
      card.classList.add("registered");
      card.querySelector(".register-btn").remove();

      // Thêm nút Xem hoá đơn
      const viewBtn = document.createElement("button");
      viewBtn.textContent = "Xem hóa đơn";
      viewBtn.className = "view-btn";
      viewBtn.onclick = () => {
        window.location.href = "user-hoadon&thanhtoan.html";
      };

      // Thêm nút Huỷ (dấu X)
      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = "❌";
      cancelBtn.className = "cancel-btn";
      cancelBtn.title = "Huỷ đăng ký";
      cancelBtn.onclick = () => {
        const confirmCancel = confirm("Bạn muốn huỷ đăng ký dịch vụ này?");
        if (!confirmCancel) return;

        const cloneBack = card.cloneNode(true);
        cloneBack.classList.remove("registered");

        cloneBack.querySelector(".view-btn")?.remove();
        cloneBack.querySelector(".cancel-btn")?.remove();

        // Thêm lại nút Đăng ký
        const reRegisterBtn = document.createElement("button");
        reRegisterBtn.textContent = "Đăng ký ngay";
        reRegisterBtn.className = "register-btn";
        reRegisterBtn.onclick = () => button.click(); // Gọi lại chức năng đăng ký

        cloneBack.appendChild(reRegisterBtn);
        unregisteredContainer.appendChild(cloneBack);

        // Xoá thẻ khỏi phần đã đăng ký
        card.remove();
      };

      card.appendChild(viewBtn);
      card.appendChild(cancelBtn);
      registeredContainer.appendChild(card);

      // Xoá khỏi phần chưa đăng ký
      button.closest(".service-card").remove();
    });
  });
});
