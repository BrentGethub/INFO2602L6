async function login(event) {
  // Prevent default action ie page direction
  event.preventDefault();

  // Get form data
  const form = event.target;

  let fields = form.elements;

  // OAuth2PasswordRequestForm expects form-encoded data (username and password)
  let formData = new URLSearchParams();
    formData.append('username', fields['username'].value);
    formData.append('password', fields['password'].value);

  try {
    let response = await fetch(`${server}/token`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded' 
      },
      body: formData
    });

    if (response.status === 404) {
      response = await fetch(`${server}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      });
    }

    let result = {};
    try {
      result = await response.json();
    } catch {
      result = {};
    }

    let token = result.access_token;
  
    if ("error" in result || !response.ok || !token) {
      toast("Login Failed: " + (result.detail || "Unknown error"));
    } else {
      toast("Logged Successful");
      window.localStorage.setItem('access_token', token);
      form.reset();
      window.location.href = 'app.html';
    }
  } catch (error) {
      toast("Login Failed: " + error.message);
    }

}
document.getElementById('loginForm').addEventListener('submit', login);
// document.querySelector('#loginForm').onSubmit(login);