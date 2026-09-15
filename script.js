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
const usersKey="emv_users",currentKey="emv_current_user",requestsKey="emv_visit_requests";
let selectedDestination=null;
const authPage=$("authPage"),site=$("site"),loginBox=$("loginBox"),registerBox=$("registerBox"),loginTab=$("loginTab"),registerTab=$("registerTab");

function readJSON(key,fallback){try{const value=JSON.parse(localStorage.getItem(key));return value??fallback}catch{return fallback}}
function getUsers(){return readJSON(usersKey,[])}
function getCurrentUser(){return readJSON(currentKey,null)}
function setCurrentUser(user){localStorage.setItem(currentKey,JSON.stringify(user))}
function removeCurrentUser(){localStorage.removeItem(currentKey)}
function showMessage(id,msg){$(id).textContent=msg}
function toast(msg){const el=$("toast");el.textContent=msg;el.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove("show"),3000)}

async function hashPassword(password){const data=new TextEncoder().encode(password);const hash=await crypto.subtle.digest("SHA-256",data);return [...new Uint8Array(hash)].map(byte=>byte.toString(16).padStart(2,"0")).join("")}
function validEmail(email){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}

function switchAuth(mode){const login=mode==="login";loginBox.classList.toggle("hidden",!login);registerBox.classList.toggle("hidden",login);loginTab.classList.toggle("active",login);registerTab.classList.toggle("active",!login);showMessage("loginMessage","");showMessage("registerMessage","")}
loginTab.addEventListener("click",()=>switchAuth("login"));registerTab.addEventListener("click",()=>switchAuth("register"));$("goRegister").addEventListener("click",()=>switchAuth("register"));$("goLogin").addEventListener("click",()=>switchAuth("login"));

document.querySelectorAll(".show-pass").forEach(button=>button.addEventListener("click",()=>{const input=$(button.dataset.target);input.type=input.type==="password"?"text":"password";button.textContent=input.type==="password"?"Show":"Hide"}));

$("registerForm").addEventListener("submit",async event=>{
 event.preventDefault();showMessage("registerMessage","");
 const name=$("registerName").value.trim(),email=$("registerEmail").value.trim().toLowerCase(),password=$("registerPassword").value,confirm=$("registerConfirm").value;
 if(name.length<2)return showMessage("registerMessage","Please enter your full name.");
 if(!validEmail(email))return showMessage("registerMessage","Please enter a valid email address.");
 if(password.length<8)return showMessage("registerMessage","Password must contain at least 8 characters.");
 if(!/[A-Za-z]/.test(password)||!/[0-9]/.test(password))return showMessage("registerMessage","Use at least one letter and one number in your password.");
 if(password!==confirm)return showMessage("registerMessage","Passwords do not match.");
 const list=getUsers();if(list.some(user=>user.email===email))return showMessage("registerMessage","An account with this email already exists.");
 const passwordHash=await hashPassword(password);list.push({name,email,passwordHash});localStorage.setItem(usersKey,JSON.stringify(list));const session={name,email};setCurrentUser(session);event.target.reset();openSite(session);toast(`Welcome, ${name}!`);
});

$("loginForm").addEventListener("submit",async event=>{
 event.preventDefault();showMessage("loginMessage","");
 const email=$("loginEmail").value.trim().toLowerCase(),password=$("loginPassword").value;
 if(!validEmail(email))return showMessage("loginMessage","Please enter a valid email address.");
 const user=getUsers().find(item=>item.email===email);if(!user)return showMessage("loginMessage","Invalid email or password.");
 const passwordHash=await hashPassword(password);if(user.passwordHash!==passwordHash)return showMessage("loginMessage","Invalid email or password.");
 const session={name:user.name,email:user.email};setCurrentUser(session);event.target.reset();openSite(session);toast(`Welcome back, ${user.name}!`);
});

function updateProfile(user){const name=user?.name||"Visitor";$("profileName").textContent=name;$("avatar").textContent=name.charAt(0).toUpperCase();$("visitorName").value=name}
function openSite(user){authPage.classList.add("hidden");site.classList.remove("hidden");updateProfile(user);renderDestinations(destinations);window.scrollTo({top:0,behavior:"instant"})}
$("logoutBtn").addEventListener("click",()=>{removeCurrentUser();site.classList.add("hidden");authPage.classList.remove("hidden");switchAuth("login");toast("You have been logged out. You can now sign in with another account.");window.scrollTo({top:0,behavior:"instant"})});

function categoryName(category){return({beach:"Beach",hill:"Hill Station",heritage:"Heritage",culture:"Culture",nature:"Nature"}[category]||category)}
function regionName(region){return({maharashtra:"Maharashtra",kerala:"Kerala",karnataka:"Karnataka",goa:"Goa",'uttar-pradesh':"Uttar Pradesh"}[region]||region)}

function createDestinationCard(destination){
 const card=document.createElement("article");card.className="destination-card";
 const imageWrap=document.createElement("div");imageWrap.className="destination-img";
 const image=document.createElement("img");image.src=destination.image;image.alt=destination.name;image.loading="lazy";image.decoding="async";
 const tag=document.createElement("span");tag.className="tag";tag.textContent=categoryName(destination.category);imageWrap.append(image,tag);
 const body=document.createElement("div");body.className="destination-body";
 const title=document.createElement("h3");title.textContent=destination.name;
 const location=document.createElement("div");location.className="location";location.textContent=`📍 ${destination.location}`;
 const description=document.createElement("p");description.textContent=destination.description;
 const chips=document.createElement("div");chips.className="chips";destination.tags.forEach(text=>{const chip=document.createElement("span");chip.className="chip";chip.textContent=text;chips.appendChild(chip)});
 const actions=document.createElement("div");actions.className="card-actions";
 const view=document.createElement("button");view.className="btn btn-primary view-btn";view.type="button";view.dataset.id=String(destination.id);view.textContent="Explore";
 const plan=document.createElement("button");plan.className="btn btn-outline plan-btn";plan.type="button";plan.dataset.id=String(destination.id);plan.textContent="Plan Visit";actions.append(view,plan);
 body.append(title,location,description,chips,actions);card.append(imageWrap,body);return card;
}

function renderDestinations(list){const grid=$("destinationGrid");const fragment=document.createDocumentFragment();if(!list.length){const empty=document.createElement("div");empty.className="empty";empty.textContent="No destinations found. Try another search or filter.";fragment.appendChild(empty)}else list.forEach(destination=>fragment.appendChild(createDestinationCard(destination)));grid.replaceChildren(fragment)}

function applyFilters(){const query=$("searchInput").value.trim().toLowerCase(),category=$("categoryFilter").value,region=$("regionFilter").value;const filtered=destinations.filter(destination=>{const text=[destination.name,destination.location,destination.description,destination.food,destination.craft,destination.culture,...destination.tags].join(" ").toLowerCase();return text.includes(query)&&(category==="all"||destination.category===category)&&(region==="all"||destination.region===region)});renderDestinations(filtered)}
$("searchInput").addEventListener("input",applyFilters);$("categoryFilter").addEventListener("change",applyFilters);$("regionFilter").addEventListener("change",applyFilters);

$("destinationGrid").addEventListener("click",event=>{const button=event.target.closest("button[data-id]");if(!button)return;selectedDestination=destinations.find(destination=>destination.id===Number(button.dataset.id));if(!selectedDestination)return;if(button.classList.contains("plan-btn"))openVisit();else openDestination()});
function openDestination(){if(!selectedDestination)return;$("modalImage").src=selectedDestination.image;$("modalImage").alt=selectedDestination.name;$("modalCategory").textContent=categoryName(selectedDestination.category);$("modalTitle").textContent=selectedDestination.name;$("modalDescription").textContent=selectedDestination.description;$("modalLocation").textContent=selectedDestination.location;$("modalFood").textContent=selectedDestination.food;$("modalCraft").textContent=selectedDestination.craft;$("modalCulture").textContent=selectedDestination.culture;$("destinationModal").classList.remove("hidden");document.body.style.overflow="hidden"}
function closeModal(id){$(id).classList.add("hidden");if($("destinationModal").classList.contains("hidden")&&$("visitModal").classList.contains("hidden"))document.body.style.overflow=""}
$("modalClose").addEventListener("click",()=>closeModal("destinationModal"));$("modalClose2").addEventListener("click",()=>closeModal("destinationModal"));$("modalOverlay").addEventListener("click",()=>closeModal("destinationModal"));
$("visitBtn").addEventListener("click",()=>{closeModal("destinationModal");openVisit()});
function openVisit(){if(!selectedDestination)return;$("visitTitle").textContent=`Plan a visit to ${selectedDestination.name}`;const user=getCurrentUser();if(user)$("visitorName").value=user.name;const date=$("visitDate");const today=new Date();today.setHours(0,0,0,0);date.min=today.toISOString().slice(0,10);$("visitModal").classList.remove("hidden");document.body.style.overflow="hidden"}
$("visitClose").addEventListener("click",()=>closeModal("visitModal"));$("visitOverlay").addEventListener("click",()=>closeModal("visitModal"));

$("visitForm").addEventListener("submit",event=>{event.preventDefault();if(!selectedDestination)return;const name=$("visitorName").value.trim(),date=$("visitDate").value,message=$("visitorMessage").value.trim();if(name.length<2||!date||!message)return;const requests=readJSON(requestsKey,[]);requests.push({id:crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random()}`,destinationId:selectedDestination.id,destination:selectedDestination.name,name,date,message,status:"PENDING",createdAt:new Date().toISOString()});localStorage.setItem(requestsKey,JSON.stringify(requests));closeModal("visitModal");event.target.reset();const user=getCurrentUser();if(user)$("visitorName").value=user.name;toast(`Visit request saved as PENDING for ${selectedDestination.name}. No payment was processed or falsely confirmed.`)});

document.addEventListener("keydown",event=>{if(event.key==="Escape"){closeModal("destinationModal");closeModal("visitModal")}});
$("mobileMenu").addEventListener("click",()=>{const open=$("navLinks").classList.toggle("mobile-open");$("mobileMenu").setAttribute("aria-expanded",String(open))});
$("navLinks").addEventListener("click",event=>{if(event.target.matches("a")){ $("navLinks").classList.remove("mobile-open");$("mobileMenu").setAttribute("aria-expanded","false") }});
$("year").textContent=String(new Date().getFullYear());

document.addEventListener("DOMContentLoaded",()=>{const user=getCurrentUser();if(user)openSite(user);else switchAuth("login")});