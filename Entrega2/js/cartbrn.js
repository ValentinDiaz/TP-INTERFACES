document.querySelectorAll(".cart-icon").forEach(cartIcon => {
    const Btn = cartIcon.querySelector(".addCart");
    const Btnadded = cartIcon.querySelector(".addedCart");

    Btn.addEventListener("click", () => {
        Btn.classList.toggle("hidden");       
        Btnadded.classList.toggle("hidden");  
    });

    Btnadded.addEventListener("click", () => {
        Btnadded.classList.toggle("hidden");   
        Btn.classList.toggle("hidden");        
    });
});




