
const KEYS={auth:"honey_auth",products:"honey_products",sales:"honey_sales",customers:"honey_customers",settings:"honey_settings",counter:"honey_invoice_counter",admin:"honey_admin"};
function read(key,fallback){try{const v=localStorage.getItem(key);return v===null?fallback:JSON.parse(v)}catch(e){return fallback}}
function write(key,val){localStorage.setItem(key,JSON.stringify(val))}
function initStore(){
  if(!localStorage.getItem(KEYS.products)) write(KEYS.products, APP_CONFIG.products);
  if(!localStorage.getItem(KEYS.sales)) write(KEYS.sales,[]);
  if(!localStorage.getItem(KEYS.customers)) write(KEYS.customers,[]);
  if(!localStorage.getItem(KEYS.settings)) write(KEYS.settings,{...APP_CONFIG});
  if(!localStorage.getItem(KEYS.counter)) localStorage.setItem(KEYS.counter,"0");
  if(!localStorage.getItem(KEYS.admin)) write(KEYS.admin,APP_CONFIG.defaultAdmin);
}
initStore();
function getProducts(){return read(KEYS.products,[])} function saveProducts(v){write(KEYS.products,v)}
function getSales(){return read(KEYS.sales,[])} function saveSales(v){write(KEYS.sales,v)}
function getCustomers(){return read(KEYS.customers,[])} function saveCustomers(v){write(KEYS.customers,v)}
function getSettings(){return read(KEYS.settings,{...APP_CONFIG})} function saveSettings(v){write(KEYS.settings,v)}
function getAdmin(){return read(KEYS.admin,APP_CONFIG.defaultAdmin)} function saveAdmin(v){write(KEYS.admin,v)}
function nextInvoice(){let n=parseInt(localStorage.getItem(KEYS.counter)||"0",10)+1;localStorage.setItem(KEYS.counter,String(n));return "INV-"+String(n).padStart(5,"0")}
function resetAll(){[KEYS.products,KEYS.sales,KEYS.customers,KEYS.settings,KEYS.counter].forEach(k=>localStorage.removeItem(k));initStore()}
