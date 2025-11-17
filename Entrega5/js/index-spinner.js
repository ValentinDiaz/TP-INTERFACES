document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const progressBar = document.querySelector(".progress-bar");
  const progressPercent = document.querySelector(".progress-percent");
  const content = document.getElementById("content");

 

  let percent = 0;
  progressBar.style.width = "0%";
  progressPercent.textContent = "0%";

  const interval = setInterval(() => {
    if (percent < 100) {
      percent += 2;
      progressBar.style.width = percent + "%";
      progressPercent.textContent = percent + "%";
    } else {
      clearInterval(interval);
    }
  }, 100); // 5s total (100ms * 50 steps)

  setTimeout(() => {
    loader.style.opacity = "0";
    setTimeout(() => {
      loader.style.display = "none";
    }, 500);
  }, 5000);
});
