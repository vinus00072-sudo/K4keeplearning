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
    const safe=esc(getNameOnly(name));
    host.innerHTML=`
      <div class="account-user" aria-label="Logged in user">
        <span class="account-avatar" aria-label="KeepLearning account">
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <circle cx="16" cy="16" r="15" fill="currentColor" opacity=".12"/>
          <circle cx="16" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="2"/>
          <path d="M7.5 25c1.9-4.1 5-6.2 8.5-6.2s6.6 2.1 8.5 6.2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M22.5 7.5l1.3 2.1 2.4.5-1.7 1.7.3 2.4-2.3-1-2.2 1 .3-2.4-1.7-1.7 2.4-.5z" fill="currentColor"/>
        </svg>
      </span>
        <span class="account-text"><b>${safe}</b></span>
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