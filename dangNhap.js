// tạo sẵn tk,mk khi nhập trùng sẽ đăng nhập được
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");

  loginBtn.addEventListener("click", () => {
    const phone = document.getElementById("login-phonenumber").value.trim();
    const password = document.getElementById("login-password").value.trim();

    // Kiểm tra đơn giản
    if (phone === "user1" && password === "123") {
      // Lưu thông tin đăng nhập nếu cần
      localStorage.setItem("loggedInUser", phone);

      // Chuyển hướng sang trang user
      window.location.href = "dashboard_user/user.html";
    } else {
      alert("Sai tài khoản hoặc mật khẩu! Vui lòng thử lại.");
    }
  });
});
