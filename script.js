document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    const closeButton = document.getElementById("closeSidebar");

    function openSidebar() {
        sidebar.classList.add("active");
        document.body.classList.add("no-scroll");
    }

    function closeSidebar() {
        sidebar.classList.remove("active");
        document.body.classList.remove("no-scroll");
    }

    menuButton.addEventListener("click", () => {
        sidebar.classList.contains("active") ? closeSidebar() : openSidebar();
    });

    closeButton.addEventListener("click", closeSidebar);
});
