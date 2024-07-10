// 检查用户首选模式
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
let isDarkMode = localStorage.getItem("darkMode") === "true" || prefersDarkScheme;
const toggleButton = document.getElementById("toggleButton");

// 根据当前模式设置初始按钮图标
toggleButton.src = isDarkMode ? "images/mode-icon-dark.svg" : "images/mode-icon.svg";

// 应用初始样式
if (isDarkMode) {
    document.body.classList.add("dark-mode");
}

// 切换模式功能
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    // themeToggleIcon = document.querySelector('.theme-toggle img');

    if (isDarkMode) {
        document.body.classList.add("dark-mode");
        toggleButton.src = "images/mode-icon-dark.svg";
        localStorage.setItem("darkMode", "true");
        
    } else {
        document.body.classList.remove("dark-mode");
        toggleButton.src = "images/mode-icon.svg";
        localStorage.setItem("darkMode", "false");
    }
}

//dark-mode
// document.addEventListener('DOMContentLoaded', () => {
//     const themeToggle = document.querySelector('.theme-toggle');
//     const contactIcons = document.querySelectorAll('.contact-icon img');
//     const themeToggleIcon = document.querySelector('.theme-toggle img');

//     themeToggle.addEventListener('click', () => {
//         document.body.classList.toggle('dark-mode');

//         if (document.body.classList.contains('dark-mode')) {
//             contactIcons.forEach(icon => {
//                 icon.src = icon.src.replace('.svg', '-dark.svg');
//             });
//             themeToggleIcon.src = themeToggleIcon.src.replace('dark-mode-icon.svg', 'light-mode-icon.svg');
//             localStorage.setItem("darkMode", "true");
//         } else {
//             contactIcons.forEach(icon => {
//                 icon.src = icon.src.replace('-dark.svg', '.svg');
//             });
//             themeToggleIcon.src = themeToggleIcon.src.replace('light-mode-icon.svg', 'dark-mode-icon.svg');
//             localStorage.setItem("darkMode", "false");
//         }
//     });
// });