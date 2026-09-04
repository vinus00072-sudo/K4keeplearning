const SUPABASE_URL="https://vowlzxhgjyzwzlhdgrnz.supabase.co";
const SUPABASE_ANON_KEY="sb_publishable_3ZjKK7CFwuE9kPUyiQNxlg_TMdUh3qY";
const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
const icons=["💻","📊","🎨","📣","📱","🐍","☁️","📈","📚","🎓"];
let cachedCourses=[];

async function loadCourses(){
 const grid=document.getElementById("courseGrid");
 const {data,error}=await sb.from("courses").select("*").eq("is_published",true).order("created_at",{ascending:false});
 if(error){console.error(error);grid.innerHTML='<div class="loading">Unable to load courses right now.</div>';return}
 cachedCourses=data||[];renderCourses(cachedCourses);
}
function renderCourses(list){
 const grid=document.getElementById("courseGrid");
 if(!list.length){grid.innerHTML='<div class="loading">No published courses yet. Admin can add the first course.</div>';return}
 grid.innerHTML=list.map((c,i)=>`<article class="course">
 <div class="course-img">${c.thumbnail_url?`<img src="${esc(c.thumbnail_url)}" alt="">`:icons[i%icons.length]}</div>
 <div class="course-body"><h3>${esc(c.title)}</h3><p>${esc(c.description||"Online course")}</p>
 <div class="rating">★★★★★ <span>${c.rating||"5.0"}</span></div>
 <div class="price">${c.original_price && Number(c.original_price)>Number(c.price)?`<s>₹${Number(c.original_price).toLocaleString("en-IN")}</s> <strong>₹${Number(c.price).toLocaleString("en-IN")}</strong> <small>/course</small><b class="discount-badge">${Math.round((1-Number(c.price)/Number(c.original_price))*100)}% OFF</b>`:`<strong>₹${Number(c.price).toLocaleString("en-IN")}</strong> <small>/course</small>`}</div>
 <a class="btn btn-primary course-btn" href="course.html?id=${encodeURIComponent(c.id)}">View Course</a>
 </div></article>`).join("");
}
document.getElementById("search").addEventListener("input",e=>{
 const q=e.target.value.toLowerCase().trim();
 renderCourses(!q?cachedCourses:cachedCourses.filter(c=>(c.title+" "+(c.description||"")).toLowerCase().includes(q)));
});
function showAuth(type,msg=""){
 let content="";
 if(type==="login") content=`<h2>Welcome Back 👋</h2>${msg?`<p>${esc(msg)}</p>`:""}<input id="authEmail" type="email" placeholder="Email address"><input id="authPassword" type="password" placeholder="Password"><button class="btn btn-primary" onclick="login()">Login</button><p class="small">New here? <a href="#" onclick="showAuth('signup');return false">Create account</a></p>`;
 if(type==="signup") content=`<h2>Create your account</h2><input id="authName" placeholder="Full name"><input id="authEmail" type="email" placeholder="Email address"><input id="authPassword" type="password" placeholder="Password"><button class="btn btn-primary" onclick="signup()">Create Account</button>`;
 if(type==="contact") content=`<h2>Contact KeepLearning</h2><input placeholder="Your name"><input type="email" placeholder="Email address"><input placeholder="Message"><button class="btn btn-primary" onclick="alert('Thanks! We will contact you.');closeModal()">Send Message</button>`;
 document.getElementById("modalContent").innerHTML=content;document.getElementById("modal").classList.add("show");
}
async function login(){
 const email=document.getElementById("authEmail").value.trim(),password=document.getElementById("authPassword").value;
 const {error}=await sb.auth.signInWithPassword({email,password});
 if(error){alert(error.message);return} closeModal(); alert("Login successful!");
}
async function signup(){
 const name=document.getElementById("authName").value.trim(),email=document.getElementById("authEmail").value.trim(),password=document.getElementById("authPassword").value;
 const {error}=await sb.auth.signUp({email,password,options:{data:{full_name:name}}});
 if(error){alert(error.message);return} closeModal(); alert("Account created. Check your email if confirmation is enabled.");
}
function closeModal(){document.getElementById("modal").classList.remove("show")}
document.getElementById("modal").addEventListener("click",e=>{if(e.target.id==="modal")closeModal()});
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
loadCourses();

/* Lamp-based Sign In / Sign Up */
let lampDragging=false, lampStartY=0, lampPull=0, lampAuthType='login', lampLatched=false;
const authCord=document.getElementById('authCord');
const lampWelcome=document.getElementById('lampWelcome');
const lampAuthContent=document.getElementById('lampAuthContent');

function lampAuthMarkup(type){
 const login=type==='login';
 lampAuthContent.innerHTML=`
   <h2>Welcome</h2>
   <p>Login to continue your learning journey</p>
   <div class="lamp-tabs">
     <button class="${login?'active':''}" onclick="setLampAuthType('login')">Sign In</button>
     <button class="${!login?'active':''}" onclick="setLampAuthType('signup')">Sign Up</button>
   </div>
   ${login ? `
     <input id="lampEmail" type="email" placeholder="Enter email" autocomplete="email">
     <input id="lampPassword" type="password" placeholder="Enter password" autocomplete="current-password">
     <button class="btn lamp-auth-btn" onclick="lampLogin()">Sign In</button>
     <p class="lamp-small">New here? <a href="#" onclick="setLampAuthType('signup');return false">Create account</a></p>` : `
     <input id="lampName" type="text" placeholder="Full name" autocomplete="name">
     <input id="lampEmail" type="email" placeholder="Enter email" autocomplete="email">
     <input id="lampPassword" type="password" placeholder="Create password" autocomplete="new-password">
     <button class="btn lamp-auth-btn" onclick="lampSignup()">Create Account</button>
     <p class="lamp-small">Already have an account? <a href="#" onclick="setLampAuthType('login');return false">Sign in</a></p>`}`;
}
function setLampAuthType(type){lampAuthType=type;lampAuthMarkup(type);lampWelcome.classList.add('show')}
function openLampAuth(type='login'){lampAuthType=type;lampAuthMarkup(type);document.getElementById('modal').classList.add('show');lampWelcome.classList.remove('show');lampDragging=false;lampLatched=false;lampPull=0;authCord.style.transform='translateY(0)'}
function closeLampAuth(){document.getElementById('modal').classList.remove('show');lampDragging=false;lampLatched=false;lampPull=0;authCord.style.transform='translateY(0)';lampWelcome.classList.remove('show')}
function showAuth(type,msg=''){ if(type==='contact'){showAuthLegacy(type,msg)} else openLampAuth(type); }
function showAuthLegacy(type,msg=''){ let content=''; if(type==='contact') content=`<h2>Contact KeepLearning</h2><input placeholder="Your name"><input type="email" placeholder="Email address"><input placeholder="Message"><button class="btn btn-primary" onclick="alert('Thanks! We will contact you.');closeModal()">Send Message</button>`; document.getElementById('modalContent').innerHTML=content; document.getElementById('modal').classList.add('show'); }

async function lampLogin(){
 const email=document.getElementById('lampEmail').value.trim(), password=document.getElementById('lampPassword').value;
 if(!email||!password){alert('Please enter email and password.');return}
 const {error}=await sb.auth.signInWithPassword({email,password});
 if(error){alert(error.message);return} closeLampAuth(); alert('Login successful!');
}
async function lampSignup(){
 const name=document.getElementById('lampName').value.trim(), email=document.getElementById('lampEmail').value.trim(), password=document.getElementById('lampPassword').value;
 if(!name||!email||!password){alert('Please complete all fields.');return}
 const {error}=await sb.auth.signUp({email,password,options:{data:{full_name:name}}});
 if(error){alert(error.message);return} closeLampAuth(); alert('Account created. Check your email if confirmation is enabled.');
}

if(authCord){
 const TRIGGER_PULL=38;
 const MAX_PULL=82;
 authCord.addEventListener('pointerdown',e=>{
   if(lampLatched)return;
   lampDragging=true;
   lampStartY=e.clientY;
   authCord.setPointerCapture(e.pointerId);
   e.preventDefault();
 });
 authCord.addEventListener('pointermove',e=>{
   if(!lampDragging || lampLatched)return;
   let pull=Math.max(0,Math.min(MAX_PULL,e.clientY-lampStartY));
   lampPull=pull;
   authCord.style.transform=`translateY(${pull}px)`;
   if(pull>=TRIGGER_PULL)lampWelcome.classList.add('show');
   else lampWelcome.classList.remove('show');
 });
 const release=()=>{
   if(!lampDragging)return;
   lampDragging=false;
   // Once the cord is pulled far enough, latch it down.
   // Releasing the mouse/finger no longer makes the cord jump back up.
   if(lampPull>=TRIGGER_PULL){
     lampLatched=true;
     lampPull=MAX_PULL;
     authCord.style.transform=`translateY(${MAX_PULL}px)`;
     lampWelcome.classList.add('show');
   }else{
     lampPull=0;
     authCord.style.transform='translateY(0)';
     lampWelcome.classList.remove('show');
   }
 };
 authCord.addEventListener('pointerup',release);
 authCord.addEventListener('pointercancel',release);
}
