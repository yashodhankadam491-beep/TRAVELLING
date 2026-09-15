"use strict";

const destinations=[
{id:1,name:"Tarkarli Beach",region:"maharashtra",category:"beach",location:"Sindhudurg, Maharashtra",image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=85",description:"A peaceful Konkan coast destination known for clear waters, seafood, village life and water experiences.",food:"Malvani seafood & Sol Kadhi",craft:"Coconut & local handicrafts",culture:"Malvani coastal culture",tags:["Beach","Seafood","Water Sports","Village Life"]},
{id:2,name:"Amboli",region:"maharashtra",category:"hill",location:"Sindhudurg, Maharashtra",image:"https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1000&q=85",description:"A lush Western Ghats destination famous for forests, waterfalls, biodiversity and peaceful rural landscapes.",food:"Traditional Maharashtrian food",craft:"Bamboo & handmade products",culture:"Western Ghats village culture",tags:["Hills","Waterfalls","Forest","Nature"]},
{id:3,name:"Sindhudurg Fort",region:"maharashtra",category:"heritage",location:"Malvan, Maharashtra",image:"https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1000&q=85",description:"A historic sea fort surrounded by the Arabian Sea and connected with the heritage of the Konkan coast.",food:"Malvani cuisine",craft:"Traditional Konkan crafts",culture:"Maratha maritime heritage",tags:["Heritage","Fort","History","Konkan"]},
{id:4,name:"Mahabaleshwar",region:"maharashtra",category:"hill",location:"Satara, Maharashtra",image:"https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=85",description:"A popular hill destination surrounded by forests, viewpoints, farms and local food experiences.",food:"Strawberries & local snacks",craft:"Handmade farm products",culture:"Western Maharashtra culture",tags:["Hills","Strawberries","Farms","Nature"]},
{id:5,name:"Ganpatipule",region:"maharashtra",category:"culture",location:"Ratnagiri, Maharashtra",image:"https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1000&q=85",description:"A coastal destination blending beaches, temples, village traditions and Konkan hospitality.",food:"Konkani cuisine",craft:"Coconut & wooden crafts",culture:"Konkan traditions",tags:["Temple","Beach","Culture","Konkan"]},
{id:6,name:"Ajanta & Ellora",region:"maharashtra",category:"heritage",location:"Maharashtra",image:"https://images.unsplash.com/photo-1600100397608-f010c9f6f4a9?auto=format&fit=crop&w=1000&q=85",description:"Remarkable rock-cut cave complexes showcasing ancient Indian art, architecture and cultural heritage.",food:"Maharashtrian cuisine",craft:"Local stone & handicrafts",culture:"Ancient Indian heritage",tags:["Heritage","Caves","Art","History"]},
{id:7,name:"Munnar",region:"kerala",category:"nature",location:"Kerala",image:"https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=85",description:"A scenic highland region known for tea plantations, forests, wildlife and beautiful rural communities.",food:"Kerala cuisine & tea",craft:"Tea products & handmade crafts",culture:"Kerala hill culture",tags:["Tea","Mountains","Nature","Village"]},
{id:8,name:"Hampi",region:"karnataka",category:"heritage",location:"Karnataka",image:"https://images.unsplash.com/photo-1600100397608-f010c9f6f4a9?auto=format&fit=crop&w=1000&q=85",description:"A historic landscape where ancient ruins, local communities, traditional crafts and culture meet.",food:"South Indian cuisine",craft:"Traditional stone & handicrafts",culture:"Vijayanagara heritage",tags:["Heritage","Ruins","Culture","History"]},
{id:9,name:"Goa Rural Villages",region:"goa",category:"culture",location:"Goa, India",image:"https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=85",description:"Experience Goa beyond beaches through village walks, local food, traditions and community experiences.",food:"Goan cuisine",craft:"Coconut & local handicrafts",culture:"Goan village traditions",tags:["Village","Food","Culture","Coast"]},
{id:10,name:"Agra Heritage",region:"uttar-pradesh",category:"heritage",location:"Agra, Uttar Pradesh",image:"https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1000&q=85",description:"Discover architectural heritage alongside traditional crafts, food and local community experiences.",food:"Mughlai & North Indian food",craft:"Marble inlay & handicrafts",culture:"Mughal heritage",tags:["Heritage","Architecture","Craft","Food"]}
];

const $=id=>document.getElementById(id);
const authPage=$("authPage"),site=$("site"),loginBox=$("loginBox"),registerBox=$("registerBox"),loginTab=$("loginTab"),registerTab=$("registerTab");
const usersKey="emv_users",currentKey="emv_current_user";
let selectedDestination=null;

function users(){try{return JSON.parse(localStorage.getItem(usersKey))||[]}catch{return[]}}
function currentUser(){try{return JSON.parse(localStorage.getItem(currentKey))||null}catch{return null}}
function showMessage(id,msg){$(id).textContent=msg}
function toast(msg){const el=$("toast");el.textContent=msg;el.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove("show"),3000)}
function escapeHTML(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]))}

function switchAuth(mode){
  const login=mode==="login";
  loginBox.classList.toggle("hidden",!login);registerBox.classList.toggle("hidden",login);
  loginTab.classList.toggle("active",login);registerTab.classList.toggle("active",!login);
  showMessage("loginMessage","");showMessage("registerMessage","");
}
loginTab.addEventListener("click",()=>switchAuth("login"));registerTab.addEventListener("click",()=>switchAuth("register"));$("goRegister").addEventListener("click",()=>switchAuth("register"));$("goLogin").addEventListener("click",()=>switchAuth("login"));

document.querySelectorAll(".show-pass").forEach(btn=>btn.addEventListener("click",()=>{const input=$(btn.dataset.target);input.type=input.type==="password"?"text":"password";btn.textContent=input.type==="password"?"Show":"Hide"}));

$("registerForm").addEventListener("submit",e=>{
 e.preventDefault();showMessage("registerMessage","");
 const name=$("registerName").value.trim(),email=$("registerEmail").value.trim().toLowerCase(),password=$("registerPassword").value,confirm=$("registerConfirm").value;
 if(name.length<2)return showMessage("registerMessage","Please enter your full name.");
 if(password.length<6)return showMessage("registerMessage","Password must contain at least 6 characters.");
 if(password!==confirm)return showMessage("registerMessage","Passwords do not match.");
 const list=users();if(list.some(u=>u.email===email))return showMessage("registerMessage","An account with this email already exists.");
 list.push({name,email,password});localStorage.setItem(usersKey,JSON.stringify(list));localStorage.setItem(currentKey,JSON.stringify({name,email}));$("registerForm").reset();openSite({name,email});toast(`Welcome, ${name}!`);
});

$("loginForm").addEventListener("submit",e=>{
 e.preventDefault();showMessage("loginMessage","");
 const email=$("loginEmail").value.trim().toLowerCase(),password=$("loginPassword").value;const user=users().find(u=>u.email===email&&u.password===password);
 if(!user)return showMessage("loginMessage","Invalid email or password.");
 localStorage.setItem(currentKey,JSON.stringify({name:user.name,email:user.email}));$("loginForm").reset();openSite(user);toast(`Welcome back, ${user.name}!`);
});

function updateProfile(user){$("profileName").textContent=user.name||"Visitor";$("avatar").textContent=(user.name||"V").charAt(0).toUpperCase();$("visitorName").value=user.name||""}
function openSite(user){authPage.classList.add("hidden");site.classList.remove("hidden");updateProfile(user);renderDestinations(destinations);window.scrollTo({top:0,behavior:"instant"})}
$("logoutBtn").addEventListener("click",()=>{localStorage.removeItem(currentKey);site.classList.add("hidden");authPage.classList.remove("hidden");switchAuth("login");toast("You have been logged out.");window.scrollTo({top:0,behavior:"instant"})});

function categoryName(c){return({beach:"Beach",hill:"Hill Station",heritage:"Heritage",culture:"Culture",nature:"Nature"}[c]||c)}
function regionName(r){return({maharashtra:"Maharashtra",kerala:"Kerala",karnataka:"Karnataka",goa:"Goa","uttar-pradesh":"Uttar Pradesh"}[r]||r)}
function renderDestinations(list){
 const grid=$("destinationGrid");grid.innerHTML="";
 if(!list.length){grid.innerHTML='<div class="empty">No destinations found. Try another search or filter.</div>';return}
 list.forEach(d=>{const card=document.createElement("article");card.className="destination-card";card.innerHTML=`<div class="destination-img"><img src="${d.image}" alt="${escapeHTML(d.name)}" loading="lazy"><span class="tag">${categoryName(d.category)}</span></div><div class="destination-body"><h3>${escapeHTML(d.name)}</h3><div class="location">📍 ${escapeHTML(d.location)}</div><p>${escapeHTML(d.description)}</p><div class="chips">${d.tags.map(t=>`<span class="chip">${escapeHTML(t)}</span>`).join("")}</div><div class="card-actions"><button class="btn btn-primary view-btn" data-id="${d.id}" type="button">Explore</button><button class="btn btn-outline plan-btn" data-id="${d.id}" type="button">Plan Visit</button></div></div>`;grid.appendChild(card)})
}
function applyFilters(){const q=$("searchInput").value.trim().toLowerCase(),cat=$("categoryFilter").value,reg=$("regionFilter").value;renderDestinations(destinations.filter(d=>{const text=[d.name,d.location,d.description,d.food,d.craft,d.culture,...d.tags].join(" ").toLowerCase();return text.includes(q)&&(cat==="all"||d.category===cat)&&(reg==="all"||d.region===reg)}))}
$("searchInput").addEventListener("input",applyFilters);$("categoryFilter").addEventListener("change",applyFilters);$("regionFilter").addEventListener("change",applyFilters);

$("destinationGrid").addEventListener("click",e=>{const view=e.target.closest(".view-btn"),plan=e.target.closest(".plan-btn");if(view||plan){selectedDestination=destinations.find(d=>d.id===Number((view||plan).dataset.id));if(plan)openVisit();else openDestination()}});
function openDestination(){if(!selectedDestination)return;$("modalImage").src=selectedDestination.image;$("modalImage").alt=selectedDestination.name;$("modalCategory").textContent=categoryName(selectedDestination.category);$("modalTitle").textContent=selectedDestination.name;$("modalDescription").textContent=selectedDestination.description;$("modalLocation").textContent=selectedDestination.location;$("modalFood").textContent=selectedDestination.food;$("modalCraft").textContent=selectedDestination.craft;$("modalCulture").textContent=selectedDestination.culture;$("destinationModal").classList.remove("hidden");document.body.style.overflow="hidden"}
function closeModal(id){$(id).classList.add("hidden");document.body.style.overflow=""}
$("modalClose").addEventListener("click",()=>closeModal("destinationModal"));$("modalClose2").addEventListener("click",()=>closeModal("destinationModal"));$("modalOverlay").addEventListener("click",()=>closeModal("destinationModal"));
$("visitBtn").addEventListener("click",()=>{closeModal("destinationModal");openVisit()});
function openVisit(){if(!selectedDestination)return;$("visitTitle").textContent=`Plan a visit to ${selectedDestination.name}`;const u=currentUser();if(u)$("visitorName").value=u.name;$("visitModal").classList.remove("hidden");document.body.style.overflow="hidden"}
$("visitClose").addEventListener("click",()=>closeModal("visitModal"));$("visitOverlay").addEventListener("click",()=>closeModal("visitModal"));
$("visitForm").addEventListener("submit",e=>{e.preventDefault();if(!selectedDestination)return;const date=$("visitDate").value;const name=$("visitorName").value.trim();if(!name||!date)return;closeModal("visitModal");e.target.reset();toast(`Visit request sent for ${selectedDestination.name}.`)});

document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeModal("destinationModal");closeModal("visitModal")}});
$("year").textContent=new Date().getFullYear();

$("mobileMenu").addEventListener("click",()=>{$("navLinks").classList.toggle("mobile-open")});

document.addEventListener("DOMContentLoaded",()=>{const u=currentUser();if(u)openSite(u);else switchAuth("login")});
