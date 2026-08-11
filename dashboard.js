
function dashboard(){
 const sales=getSales(), products=getProducts(); const units=sales.reduce((a,s)=>a+s.items.reduce((b,i)=>b+i.quantity,0),0);
 const sold250=sales.reduce((a,s)=>a+s.items.filter(i=>i.productId==="honey-250").reduce((b,i)=>b+i.quantity,0),0);
 const sold470=sales.reduce((a,s)=>a+s.items.filter(i=>i.productId==="honey-470").reduce((b,i)=>b+i.quantity,0),0);
 const revenue=sales.reduce((a,s)=>a+s.grandTotal,0),paid=sales.reduce((a,s)=>a+s.paidAmount,0),rem=sales.reduce((a,s)=>a+s.remainingAmount,0);
 const rows=sales.slice().sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,8).map(s=>`<tr><td>${esc(s.invoiceNo)}</td><td>${dateStr(s.date)}</td><td>${esc(s.customer.name)}</td><td>${money(s.grandTotal)}</td><td>${statusBadge(s.paymentStatus)}</td><td><button class="btn secondary" onclick="openInvoice('${s.id}')">View</button></td></tr>`).join("");
 shell("Dashboard","dashboard",`${expiryAlerts()}<div class="grid stats">
 <div class="stat"><div class="label">Total Units Sold</div><div class="value">${units}</div><div class="sub">All products</div></div>
 <div class="stat"><div class="label">250g Sold</div><div class="value">${sold250}</div><div class="sub">Honey 250g</div></div>
 <div class="stat"><div class="label">470g Sold</div><div class="value">${sold470}</div><div class="sub">Honey 470g</div></div>
 <div class="stat"><div class="label">Total Revenue</div><div class="value">${money(revenue)}</div><div class="sub">Grand totals</div></div>
 <div class="stat"><div class="label">Paid</div><div class="value">${money(paid)}</div><div class="sub">Collected</div></div>
 <div class="stat"><div class="label">Remaining</div><div class="value">${money(rem)}</div><div class="sub">Outstanding</div></div>
 </div>
 <div class="grid two" style="margin-top:16px">
 <div class="card"><h2>Product Overview</h2><div class="table-wrap"><table class="table"><thead><tr><th>Product</th><th>Price</th><th>Stock</th><th>Sold</th><th>Revenue</th></tr></thead><tbody>${products.map(p=>{const sold=sales.reduce((a,s)=>a+s.items.filter(i=>i.productId===p.id).reduce((b,i)=>b+i.quantity,0),0);const rev=sales.reduce((a,s)=>a+s.items.filter(i=>i.productId===p.id).reduce((b,i)=>b+i.total,0),0);return `<tr><td>Honey ${p.variant}</td><td>${money(p.price)}</td><td>${p.stock}</td><td>${sold}</td><td>${money(rev)}</td></tr>`}).join("")}</tbody></table></div></div>
 <div class="card"><h2>Quick Actions</h2><div class="actions"><a class="btn primary" href="sales.html#new">+ New Sale</a><a class="btn secondary" href="products.html">Manage Products</a><a class="btn secondary" href="invoices.html">View Invoices</a></div></div></div>
 <div class="card" style="margin-top:16px"><h2>Recent Sales</h2>${rows?`<div class="table-wrap"><table class="table"><thead><tr><th>Invoice</th><th>Date</th><th>Customer</th><th>Total</th><th>Status</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`:`<div class="empty">No sales records found. Create your first sale.</div>`}</div>`);
}
dashboard();
