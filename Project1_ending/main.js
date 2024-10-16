// 메인에서 버튼 눌러서 홈페이지 들어가는 코드

// document.addEventListener("DOMContentLoaded", function() {
//     // 버튼6 클릭 시 gesipan.html 파일을 새 창에서 열기
//     const button6 = document.getElementById("hum6");
//     button6.addEventListener("click", function() {
//         window.open("gesipan.html", "_blank");
//     });
// });

document.addEventListener("DOMContentLoaded", function() {
    // 버튼6 클릭 시 gesipan.html 파일을 기존 창에서 열기
    const button6 = document.getElementById("hum6");
    button6.addEventListener("click", function() {
        window.location.href = "gesipan.html";
    });
});