document.getElementById('loginBtn').addEventListener('click', function(e) {
    var container = document.querySelector('.login-container');
    var body = document.body;
    var spinner = document.getElementById('spinner');
    var progressBarContainer = document.getElementById('progressBarContainer');
    var progressBar = document.getElementById('progressBar');
    var progressPercent = document.getElementById('progressPercent');

    container.classList.add('login-animating');
    body.classList.add('body-animating');
    spinner.classList.add('show');
    progressBarContainer.style.display = 'block';

    let percent = 0;
    progressBar.style.width = '0%';
    progressPercent.textContent = '0%';
    let interval = setInterval(function() {
        if (percent < 100) {
            percent += 2;
            progressBar.style.width = percent + '%';
            progressPercent.textContent = percent + '%';
        } else {
            clearInterval(interval);
        }
    }, 50); // ~5s total

    setTimeout(function() {
        window.location.href = 'index.html';
    }, 5000);
});