const LOGIN_PAGE = `
<!DOCTYPE html>
<html>
<head>
  <title> Login - Proxy App</title>
  <link rel="icon" href="https://cdn-icons-png.flaticon.com/512/732/732228.png" />
  <style>
    body { font-family: Arial, sans-serif; background:#f4f6f9; text-align:center; margin:0; padding:0; }
    header { background:#343a40; color:#fff; padding:15px; font-size:20px; font-weight:bold; }
    .box { background:#fff; max-width:400px; margin:60px auto; padding:30px; border-radius:8px;
           box-shadow:0 2px 6px rgba(0,0,0,0.2); }
    input { width:90%; padding:10px; margin:8px 0; border:1px solid #ccc; border-radius:5px; }
    button { background:#007bff; color:#fff; padding:10px 20px; border:none; border-radius:5px; cursor:pointer; }
    button:hover { background:#0056b3; }
    .footer { margin-top:20px; font-size:13px; color:#555; }
  </style>
</head>
<body>
  <header> Demo Branded Proxy</header>
  <div class="box">
    <img src="https://cdn-icons-png.flaticon.com/512/732/732228.png" width="50" alt="logo" />
    <h2>Login</h2>
    <p>Please enter your credentials</p>
    <form method="POST" action="/login">
      <input type="text" name="username" placeholder="Username" required /><br/>
      <input type="password" name="password" placeholder="Password" required /><br/>
      <button type="submit">Login</button>
    </form>
  </div>
  <div class="footer">Demo App • Powered by Cloudflare Workers</div>
</body>
</html>
`;

const USERNAME = "demo";      // Demo credentials
const PASSWORD = "demo123";
const SESSION_COOKIE = "proxy_session";

// backend for demo
async function fakeUpstream(request) {
  return new Response(JSON.stringify({
    message: "You are logged in and accessing the upstream app!",
    path: new URL(request.url).pathname,
    user: "demo-user",
    time: new Date().toISOString()
  }, null, 2), {
    headers: { "Content-Type": "application/json" }
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    //Handle login
    if (url.pathname === "/login" && request.method === "POST") {
      const formData = await request.formData();
      const username = formData.get("username");
      const password = formData.get("password");

      if (username === USERNAME && password === PASSWORD) {
        return new Response("Redirecting...", {
          status: 302,
          headers: {
            "Set-Cookie": `${SESSION_COOKIE}=1; Path=/; HttpOnly; Secure; SameSite=Lax`,
            "Location": "/"
          }
        });
      } else {
        return new Response(" Invalid credentials", { status: 401 });
      }
    }

    //Handle logout
    if (url.pathname === "/logout") {
      return new Response("✅ You have been logged out", {
        headers: {
          "Set-Cookie": `${SESSION_COOKIE}=deleted; Path=/; Max-Age=0`
        }
      });
    }

    //Check session
    const cookie = request.headers.get("Cookie") || "";
    if (!cookie.includes(`${SESSION_COOKIE}=1`)) {
      return new Response(LOGIN_PAGE, { headers: { "Content-Type": "text/html" } });
    }

    //Authenticated → Call fake upstream
    return fakeUpstream(request);
  }
};
