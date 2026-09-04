const SUPABASE_URL = "https://vowlzxhgjyzwzlhdgrnz.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_3ZjKK7CFwuE9kPUyiQNxlg_TMdUh3qY";
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const icons=["💻","📊","🎨","📣","📱","🐍","☁️","📈","📚","🎓"];
let cachedCourses=[];

async function loadCourses(){
 const grid=document.getElementById("courseGrid");
 if(SUPABASE_ANON_KEY.startsWith("REPLACE_")){
   grid.innerHTML='<div class="loading">Supabase key is not configured yet.</div>'; return;
 }
 const {data,error}=await sb.from("courses").select("*").eq("is_published",true).order("created_at",{ascending:false});
 if(error){console.error(error);grid.innerHTML='<div class="loading">Unable to load courses right now.</div>';return}
 cachedCourses=data||[];
 renderCourses(cachedCourses);
}
function renderCourses(list){
 const grid=document.getElementById("courseGrid");
 if(!list.length){grid.innerHTML='<div class="loading">No published courses yet. Admin can add the first course.</div>';return}
 grid.innerHTML=list.map((c,i)=>`<article class="course">
 <div class="course-img">${icons[i%icons.length]}</div><div class="course-body">
 <h3>${esc(c.title)}</h3><p>${esc(c.description||"Online course")}</p>
 <div class="rating">★★★★★ <span>${c.rating||"5.0"}</span></div>
 <div class="price">₹${Number(c.price).toLocaleString("en-IN")} <small>/course</small></div>
 <button class="btn btn-primary" style="width:100%;margin-top:10px" onclick="enroll('${c.id}')">Enroll Now</button>
 </div></article>`).join("");
}
document.getElementById("search").addEventListener("input",e=>{
 const q=e.target.value.toLowerCase().trim();
 renderCourses(!q?cachedCourses:cachedCourses.filter(c=>(c.title+" "+(c.description||"")).toLowerCase().includes(q)));
});
async function enroll(courseId){
 const {data:{user}}=await sb.auth.getUser();
 if(!user){showAuth("login","Please login first to enroll in a course.");return}
 const c=cachedCourses.find(x=>x.id===courseId);
 if(!c)return;
 showPayment(c);
}
function showPayment(c){
 document.getElementById("modalContent").innerHTML=`<h2>Enroll in ${esc(c.title)}</h2>
 <p>Course fee: <b>₹${Number(c.price).toLocaleString("en-IN")}</b></p>
 <button class="btn btn-primary" onclick="createPayment('${c.id}')">Continue to Payment</button>
 <p style="font-size:11px;color:#687386">Razorpay will be connected after its keys are configured in Vercel.</p>`;
 document.getElementById("modal").classList.add("show");
}
async function createPayment(courseId){
 const c=cachedCourses.find(x=>x.id===courseId);
 alert(`Payment setup is ready for ₹${Number(c.price).toLocaleString("en-IN")}. Add Razorpay keys/server verification before accepting live payments.`);
}
function showAuth(type,msg=""){
 let content="";
 if(type==="login") content=`<h2>Welcome Back 👋</h2>${msg?`<p>${esc(msg)}</p>`:""}<input id="authEmail" type="email" placeholder="Email address"><input id="authPassword" type="password" placeholder="Password"><button class="btn btn-primary" onclick="login()">Login</button><p style="font-size:11px">New here? <a href="#" onclick="showAuth('signup');return false">Create account</a></p>`;
 if(type==="signup") content=`<h2>Create your account</h2><input id="authName" placeholder="Full name"><input id="authEmail" type="email" placeholder="Email address"><input id="authPassword" type="password" placeholder="Password"><button class="btn btn-primary" onclick="signup()">Create Account</button>`;
 if(type==="contact") content=`<h2>Contact KeepLearning</h2><input placeholder="Your name"><input type="email" placeholder="Email address"><input placeholder="Message"><button class="btn btn-primary" onclick="alert('Thanks! We will contact you.');closeModal()">Send Message</button>`;
 document.getElementById("modalContent").innerHTML=content;document.getElementById("modal").classList.add("show");
}
async function login(){
 const email=document.getElementById("authEmail").value,password=document.getElementById("authPassword").value;
 const {error}=await sb.auth.signInWithPassword({email,password});
 if(error){alert(error.message);return} closeModal(); alert("Login successful!");
}
async function signup(){
 const name=document.getElementById("authName").value,email=document.getElementById("authEmail").value,password=document.getElementById("authPassword").value;
 const {error}=await sb.auth.signUp({email,password,options:{data:{full_name:name}}});
 if(error){alert(error.message);return} closeModal(); alert("Account created. Check your email if confirmation is enabled.");
}
function closeModal(){document.getElementById("modal").classList.remove("show")}
document.getElementById("modal").addEventListener("click",e=>{if(e.target.id==="modal")closeModal()});
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
loadCourses();
