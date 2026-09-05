/* KeepLearning shared authentication UI */
(function(){
  "use strict";
  const SUPABASE_URL="https://vowlzxhgjyzwzlhdgrnz.supabase.co";
  const SUPABASE_KEY="sb_publishable_3ZjKK7CFwuE9kPUyiQNxlg_TMdUh3qY";
  const authClient=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
  window.KLAuth=authClient;

  function esc(v){
    return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
  }

  async function getDisplayName(user){
    if(!user) return "";
    try{
      const {data}=await authClient.from("profiles").select("full_name").eq("id",user.id).maybeSingle();
      if(data?.full_name?.trim()) return data.full_name.trim();
    }catch(e){ console.warn("Profile name lookup failed",e); }
    return user.user_metadata?.full_name?.trim() || user.email || "User";
  }

  async function refresh(){
    const host=document.getElementById("accountArea");
    if(!host) return;
    const {data:{user}}=await authClient.auth.getUser();
    if(!user){
      host.innerHTML=`
        <button class="btn btn-outline" onclick="openSiteLogin()">Login</button>
        <button class="btn btn-primary" onclick="openSiteSignup()">Sign Up</button>`;
      return;
    }
    const name=await getDisplayName(user);
    const safe=esc(name);
    const email=esc(user.email||"");
    host.innerHTML=`
      <div class="account-user" title="${email}">
        <span class="account-avatar" aria-label="Account">
          <svg viewBox="0 0 48 48" aria-hidden="true">
            <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" stroke-width="2.5"/>
            <path d="M15 35c2.5-5 6-7.5 9-7.5s6.5 2.5 9 7.5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="24" cy="18" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/>
            <path d="M35 10l1.5 3.5L40 15l-3.5 1.5L35 20l-1.5-3.5L30 15l3.5-1.5L35 10z" fill="currentColor" stroke="none"/>
          </svg>
        </span>
        <span class="account-text"><b>${safe}</b><small>${email}</small></span>
      </div>
      <button class="btn btn-outline account-logout" onclick="siteLogout()">Logout</button>`;
  }

  window.openSiteLogin=function(){
    if(typeof window.showAuth==="function") window.showAuth("login");
    else if(typeof window.showLogin==="function") window.showLogin();
  };
  window.openSiteSignup=function(){
    if(typeof window.showAuth==="function") window.showAuth("signup");
  };
  window.siteLogout=async function(){
    try{
      const {error}=await authClient.auth.signOut();
      if(error) throw error;
      await refresh();
      if(typeof window.onKeepLearningLogout==="function") window.onKeepLearningLogout();
    }catch(e){
      console.error(e);
      alert(e.message||"Logout failed. Please try again.");
    }
  };

  authClient.auth.onAuthStateChange(function(event){
    // Refresh after the current auth event finishes, so profile/session data is ready.
    setTimeout(refresh,0);
  });

  window.addEventListener("load",refresh);
  window.refreshKeepLearningAuth=refresh;
})();