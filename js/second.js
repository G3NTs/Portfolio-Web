const windowMinusButtons = document.querySelectorAll('.minus');
const windowRestoreButtons = document.querySelectorAll('.restore');
const windowCloseButtons = document.querySelectorAll('.close');

windowMinusButtons.forEach(minus => {
    minus.addEventListener("click", () => {
        const box = minus.closest('.box');
        box.classList.add("minature");
        console.log("clicked minus");
    });
});

windowRestoreButtons.forEach(restore => {
    restore.addEventListener("click", () => {
        const box = restore.closest('.box');
        box.classList.remove("minature");
        console.log("clicked restore");
    });
});

windowCloseButtons.forEach(close => {
    close.addEventListener("click", () => {
        const box = close.closest('.box');
        box.classList.add("transparent");
        console.log("clicked close");
    });
});