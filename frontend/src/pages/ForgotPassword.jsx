import React, { useState } from 'react';

export default function ForgotPassword(){
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  function submit(e){ e.preventDefault(); setSent(true); }

  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'70vh'}}>
      <div className="card" style={{maxWidth:420,width:'100%',padding:20}}>
        <h2 style={{marginTop:0}}>Reset password</h2>
        {sent ? <div style={{color:'var(--muted)'}}>If the email exists, a reset link has been sent.</div> : (
          <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:8}}>
            <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
            <button className="btn" type="submit">Send reset link</button>
          </form>
        )}
      </div>
    </div>
  );
}
