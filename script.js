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
 <div class="price">₹${Number(c.price).toLocaleString("en-IN")} <small>/course</small></div>
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