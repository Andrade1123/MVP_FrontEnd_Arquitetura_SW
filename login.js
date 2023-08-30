const loginForm = document.getElementById('login');

loginForm.addEventListener('submit', function(event){
  event.preventDefault();
  const form = new FormData(loginForm);
  const username = form.get('username');
  const password = form.get('password');

  fetch('https://fakestoreapi.com/auth/login',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        username,
        password
    })
  })
  .then(res => res.json())
  .then(json => {
    const token = json.token;
    sessionStorage.setItem('token', token);
    window.location.href = '/index.html'
  });
});