// tạo sẵn tk,mk khi nhập trùng sẽ đăng nhập được
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");

  loginBtn.addEventListener("click", () => {
    const phone = document.getElementById("login-phonenumber").value.trim();
    const password = document.getElementById("login-password").value.trim();

    // Kiểm tra đơn giản
    if (phone === "admin" && password === "admin") {
      // Lưu thông tin đăng nhập nếu cần
      localStorage.setItem("loggedInAdmin", phone);
      alert("Chào mừng quản trị viên quay lại!");
      // Chuyển hướng sang trang user
      window.location.href = "dashboard_admin/admin.html";
    } else if (phone === "0912345678" && password === "123") {
      localStorage.setItem("loggedInUser", phone);
      
      window.location.href = "dashboard_user/user.html";
    } else {
      alert("Sai tài khoản hoặc mật khẩu! Vui lòng thử lại.");
    }
  });
});
