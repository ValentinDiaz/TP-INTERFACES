document.getElementById('loginBtn').addEventListener('click', function(e) {
    var container = document.querySelector('.login-container');
    var body = document.body;
    var spinner = document.getElementById('spinner');
    
    container.classList.add('login-animating');
    body.classList.add('body-animating');
    spinner.classList.add('show');
    
    setTimeout(function() {
        window.location.href = 'index.html';
    }, 2000)});