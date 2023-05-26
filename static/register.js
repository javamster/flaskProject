function validateForm() {
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirm-password").value;
    if (password != confirmPassword) {
        alert("The two password inputs are inconsistent.");
        return false;
    }
    return true;
}
