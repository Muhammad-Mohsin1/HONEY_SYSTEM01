
function isLoggedIn(){return localStorage.getItem(KEYS.auth)==="true"}
function requireAuth(){if(!isLoggedIn())location.href="login.html"}
function logout(){localStorage.removeItem(KEYS.auth);location.href="login.html"}
if(location.pathname.endsWith("dashboard.html")||/\/(products|sales|customers|invoices|reports|settings)\.html$/.test(location.pathname)) requireAuth();
if(document.getElementById("loginForm")){
 document.getElementById("loginForm").addEventListener("submit",e=>{e.preventDefault();const a=getAdmin();const u=document.getElementById("username").value.trim(),p=document.getElementById("password").value;
 if(u===a.username&&p===a.password){localStorage.setItem(KEYS.auth,"true");location.href="dashboard.html"}else document.getElementById("loginError").textContent="Invalid username or password."});
}
