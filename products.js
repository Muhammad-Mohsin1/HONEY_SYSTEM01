
let productEditId=null;
function productsPage(){
 const ps=getProducts();
 shell("Products","products",`${expiryAlerts()}<div class="grid two">
 <div class="card"><h2>${productEditId?"Edit Product":"Add Product"}</h2>
 <form id="productForm"><div class="form-grid"><label>Product Name<input id="pName" value="${productEditId?esc(ps.find(p=>p.id===productEditId)?.name||""):"Honey"}" required></label>
 <label>Variant / Weight<input id="pVariant" value="${productEditId?esc(ps.find(p=>p.id===productEditId)?.variant||""):""}" placeholder="e.g. 250g" required></label>
 <label>Selling Price<input id="pPrice" type="number" min="0" value="${productEditId?(ps.find(p=>p.id===productEditId)?.price||0):0}" required></label>
 <label>Available Stock<input id="pStock" type="number" min="0" value="${productEditId?(ps.find(p=>p.id===productEditId)?.stock||0):0}" required></label>
 <label>Expiry Date<input id="pExpiry" type="date" value="${productEditId?(ps.find(p=>p.id===productEditId)?.expiryDate||""):""}"></label></div>
 <div class="form-actions"><button type="button" class="btn secondary" onclick="cancelProduct()">Clear</button><button class="btn primary">${productEditId?"Update Product":"Add Product"}</button></div></form></div>
 <div class="card"><h2>Inventory Summary</h2><div class="kpi-list">${ps.map(p=>`<div class="kpi"><span>Honey ${esc(p.variant)}</span><strong>${p.stock} units</strong></div>`).join("")}</div></div></div>
 <div class="card" style="margin-top:16px"><h2>Product & Inventory</h2><div class="table-wrap"><table class="table"><thead><tr><th>Product</th><th>Price</th><th>Stock</th><th>Expiry</th><th>Status</th><th>Actions</th></tr></thead><tbody>${ps.map(p=>{const st=expiryState(p.expiryDate);return `<tr><td><strong>${esc(p.name)} ${esc(p.variant)}</strong></td><td>${money(p.price)}</td><td>${p.stock}</td><td>${p.expiryDate?dateStr(p.expiryDate):"—"}</td><td>${st==="critical"?'<span class="badge partial">≤ 3 DAYS</span>':st==="expired"?'<span class="badge remaining">EXPIRED</span>':'<span class="badge paid">OK</span>'}</td><td class="actions"><button class="btn secondary" onclick="editProduct('${p.id}')">Edit</button><button class="btn danger" onclick="deleteProduct('${p.id}')">Delete</button></td></tr>`}).join("")}</tbody></table></div></div>`);
 document.getElementById("productForm").onsubmit=saveProductForm;
}
function saveProductForm(e){e.preventDefault();const ps=getProducts(),name=document.getElementById("pName").value.trim(),variant=document.getElementById("pVariant").value.trim(),price=Number(document.getElementById("pPrice").value),stock=Number(document.getElementById("pStock").value),expiryDate=document.getElementById("pExpiry").value;
 if(productEditId){const p=ps.find(x=>x.id===productEditId);Object.assign(p,{name,variant,price,stock,expiryDate})}else ps.push({id:"p-"+crypto.randomUUID(),name,variant,price,stock,expiryDate});
 saveProducts(ps);productEditId=null;toast("Product saved successfully.");productsPage();
}
function editProduct(id){productEditId=id;productsPage();scrollTo({top:0,behavior:"smooth"})}
function cancelProduct(){productEditId=null;productsPage()}
function deleteProduct(id){if(getSales().some(s=>s.items.some(i=>i.productId===id))){alert("This product is already used in sales and cannot be deleted. You can edit it instead.");return}if(!confirm("Delete this product?"))return;saveProducts(getProducts().filter(p=>p.id!==id));toast("Product deleted.");productsPage()}
productsPage();
