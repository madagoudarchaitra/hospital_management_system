import React from 'react';

export default function AddForm({ title, isOpen, onClose, onSubmit, children }){
  if(!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e)=>e.stopPropagation()}>
        <div className="modal-header">
          <div style={{flex:1}}>
            <h3 style={{marginBottom:4}}>{title}</h3>
            <div style={{height:2, width:40, background:'linear-gradient(90deg, var(--accent), var(--accent-2))', borderRadius:2}}></div>
          </div>
          <button className="modal-close" onClick={onClose} title="Close">✕</button>
        </div>
        <form onSubmit={onSubmit} className="modal-form">
          {children}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{fontWeight:600}}>Cancel</button>
            <button type="submit" className="btn" style={{fontWeight:600, boxShadow:'0 4px 12px rgba(14,165,233,0.4)'}}>✓ Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
