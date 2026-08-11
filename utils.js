
function money(n){const s=getSettings();return `${s.currency||"PKR"} ${Number(n||0).toLocaleString("en-PK",{minimumFractionDigits:2,maximumFractionDigits:2})}`}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function dateStr(v){const d=new Date(v);return isNaN(d)?v:d.toLocaleDateString("en-GB")}
function toast(msg){let t=document.querySelector(".toast");if(!t){t=document.createElement("div");t.className="toast";document.body.appendChild(t)}t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
function statusBadge(s){return `<span class="badge ${s.toLowerCase()}">${esc(s)}</span>`}
function nav(active){
 return `<aside class="sidebar"><div class="logo">🍯 Honey Manager<small>Sales & Billing System</small></div>
 <nav class="nav">
 <a class="${active==="dashboard"?"active":""}" href="dashboard.html">🏠 Dashboard</a>
 <a class="${active==="products"?"active":""}" href="products.html">📦 Products</a>
 <a class="${active==="sales"?"active":""}" href="sales.html">🛒 New Sale / Sales</a>
 <a class="${active==="customers"?"active":""}" href="customers.html">👥 Customers</a>
 <a class="${active==="invoices"?"active":""}" href="invoices.html">🧾 Invoices</a>
 <a class="${active==="reports"?"active":""}" href="reports.html">📊 Reports</a>
 <a class="${active==="settings"?"active":""}" href="settings.html">⚙ Settings</a>
 <button onclick="logout()">🚪 Logout</button></nav></aside>`;
}
function shell(title,active,body){document.getElementById("app").innerHTML=`<div class="shell">${nav(active)}<main class="main"><div class="topbar"><div><h1>${title}</h1><div class="muted">${getSettings().companyName||"Honey Company"}</div></div></div>${body}</main></div>`}
function recomputeCustomers(){
 const sales=getSales(); const map={};
 sales.forEach(s=>{const key=s.customer.phone||s.customer.name.toLowerCase(); if(!map[key])map[key]={name:s.customer.name,phone:s.customer.phone,email:s.customer.email||"",address:s.customer.address||"",totalPurchases:0,totalAmount:0,paid:0,remaining:0,lastPurchase:s.date}; map[key].totalPurchases+=s.items.reduce((a,i)=>a+i.quantity,0);map[key].totalAmount+=s.grandTotal;map[key].paid+=s.paidAmount;map[key].remaining+=s.remainingAmount;if(new Date(s.date)>new Date(map[key].lastPurchase))map[key].lastPurchase=s.date});
 const arr=Object.values(map);saveCustomers(arr);return arr;
}
function rebuildInventory(){
 const products=getProducts(); const sales=getSales();
 products.forEach(p=>p._sold=0);
 sales.forEach(s=>s.items.forEach(i=>{const p=products.find(x=>x.id===i.productId);if(p)p._sold+=Number(i.quantity)}));
 saveProducts(products); return products;
}
function invoiceHTML(s){
 const set=getSettings();
 return `<div class="invoice"><div class="invoice-head"><div><div class="invoice-title">INVOICE</div><strong>${esc(set.companyName)}</strong><div class="muted">${esc(set.companyAddress)}</div><div class="muted">${esc(set.companyPhone)} ${set.companyEmail?"• "+esc(set.companyEmail):""}</div></div><div><strong>${esc(s.invoiceNo)}</strong><div class="muted">Date: ${dateStr(s.date)}</div><div style="margin-top:8px">${statusBadge(s.paymentStatus)}</div></div></div>
 <div style="margin-top:22px"><strong>Bill To</strong><div>${esc(s.customer.name)}</div><div>${esc(s.customer.phone)}</div><div>${esc(s.customer.email||"")}</div><div>${esc(s.customer.address||"")}</div></div>
 <table><thead><tr><th>Product</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead><tbody>${s.items.map(i=>`<tr><td>Honey ${esc(i.variant)}</td><td>${i.quantity}</td><td>${money(i.unitPrice)}</td><td>${money(i.total)}</td></tr>`).join("")}</tbody></table>
 <div class="totals"><div><span>Subtotal</span><strong>${money(s.subtotal)}</strong></div><div><span>Discount</span><strong>${money(s.discount)}</strong></div><div class="grand"><span>Grand Total</span><strong>${money(s.grandTotal)}</strong></div><div><span>Paid</span><strong>${money(s.paidAmount)}</strong></div><div><span>Remaining</span><strong>${money(s.remainingAmount)}</strong></div></div>
 <div style="margin-top:30px;text-align:center;color:#766f64;font-size:12px">Thank you for your business.</div></div>`;
}
function openInvoice(id){
 const s=getSales().find(x=>x.id===id);if(!s)return;
 const back=document.createElement("div");back.className="modal-backdrop";back.innerHTML=`<div class="modal"><div class="modal-head"><h2>${esc(s.invoiceNo)}</h2><button class="close">✕</button></div>${invoiceHTML(s)}<div class="invoice-actions"><button class="btn primary" onclick="window.print()">🖨 Print / Save PDF</button></div></div>`;
 back.querySelector(".close").onclick=()=>back.remove();document.body.appendChild(back);
}
function downloadJSON(filename,data){const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename;a.click();URL.revokeObjectURL(a.href)}

function daysToExpiry(date){if(!date)return null;const d=new Date(date+"T23:59:59");return Math.ceil((d-new Date())/86400000)}
function expiryState(date){const d=daysToExpiry(date);if(d===null)return "none";if(d<0)return "expired";if(d<=3)return "critical";return "ok"}
function expiryLabel(date){const d=daysToExpiry(date);if(d===null)return "No expiry date";if(d<0)return `Expired ${Math.abs(d)} day(s) ago`;if(d===0)return "Expires today";return `Expires in ${d} day(s)`}
function themeInit(){const dark=localStorage.getItem("honey_theme")==="dark";document.body.classList.toggle("dark",dark);let b=document.querySelector(".theme-toggle");if(b)b.textContent=dark?"☀️ Light Mode":"🌙 Dark Mode"}
function toggleTheme(){const dark=!document.body.classList.contains("dark");document.body.classList.toggle("dark",dark);localStorage.setItem("honey_theme",dark?"dark":"light");themeInit()}
document.addEventListener("DOMContentLoaded",()=>{themeInit();if(!document.querySelector(".theme-toggle")){const b=document.createElement("button");b.className="theme-toggle";b.onclick=toggleTheme;b.setAttribute("aria-label","Toggle dark mode");document.body.appendChild(b);themeInit()}})
function expiryAlerts(){
 const ps=getProducts(), critical=ps.filter(p=>{const d=daysToExpiry(p.expiryDate);return d!==null&&d>=0&&d<=3}), expired=ps.filter(p=>daysToExpiry(p.expiryDate)!==null&&daysToExpiry(p.expiryDate)<0);
 if(!critical.length&&!expired.length)return "";
 return `<div class="alert ${expired.length?"danger-alert":""}"><strong>⚠️ Expiry Alert</strong>${critical.length?critical.map(p=>`Honey ${esc(p.variant)}: ${esc(expiryLabel(p.expiryDate))}`).join(" • "):""}${expired.length?`${critical.length?"<br>":""}${expired.map(p=>`Honey ${esc(p.variant)}: ${esc(expiryLabel(p.expiryDate))}`).join(" • ")}`:""}</div>`;
}
