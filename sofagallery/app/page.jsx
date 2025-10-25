'use client';

import { useEffect, useMemo, useState } from 'react';

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [theme, setTheme] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/artworks');
        const data = await res.json();
        setItems(data.items || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    return items.filter(x => {
      const text = (x.title + ' ' + (x.artist||'') + ' ' + (x.theme||'') + ' ' + (x.audio_text||'') ).toLowerCase();
      const okQ = q ? text.includes(q.toLowerCase()) : true;
      const okTheme = theme ? (x.theme||'').toLowerCase() === theme.toLowerCase() : true;
      return okQ && okTheme;
    });
  }, [items, q, theme]);

  const themes = useMemo(() => {
    return Array.from(new Set(items.map(x => (x.theme||'').trim()).filter(Boolean))).sort();
  }, [items]);

  return (
    <div className="container">
      <div className="header">
        <div className="brand">🛋️ SofaGallery</div>
        <div className="row" style={{width:'100%', justifyContent:'flex-end'}}>
          <input className="input" placeholder="Zoek titel, kunstenaar of tekst..." value={q} onChange={e=>setQ(e.target.value)} style={{maxWidth: 360}} />
          <select className="input" value={theme} onChange={e=>setTheme(e.target.value)} style={{maxWidth: 220}}>
            <option value="">Alle thema's</option>
            {themes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {loading ? <p>Bezig met laden…</p> : (
        <div className="cardgrid">
          {filtered.map(item => <Card key={item.id} item={item} />)}
          {!filtered.length && <p>Geen resultaten.</p>}
        </div>
      )}

      <div className="footer small">
        Tip: klik een kaart om de voorlees-tekst te zien. De voorlees-tekst wordt als eerste getoond (geen algemene beschrijving).
      </div>
    </div>
  );
}

function Card({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card" onClick={()=>setOpen(o=>!o)} style={{cursor:'pointer'}}>
      <img src={item.image_url || '/placeholder.png'} alt={item.title || 'Afbeelding'} />
      <div className="row" style={{marginTop: 10, justifyContent:'space-between'}}>
        <div>
          <div style={{fontWeight:700}}>{item.title || 'Zonder titel'}</div>
          <div className="small">{item.artist || 'Onbekende kunstenaar'}{item.year ? ` • ${item.year}` : ''}</div>
        </div>
        {item.theme && <span className="badge">{item.theme}</span>}
      </div>

      {open && (
        <div className="viewer">
          <div>
            <h4 style={{margin:'16px 0 8px'}}>🎧 Voorlees-tekst</h4>
            <div className="audio">
              <p style={{whiteSpace:'pre-wrap'}}>
                {item.audio_text || '—'}
              </p>
            </div>
          </div>
          <div>
            <h4 style={{margin:'16px 0 8px'}}>📝 Details</h4>
            <div className="small mono">
              <div><b>Titel:</b> {item.title || '-'}</div>
              <div><b>Kunstenaar:</b> {item.artist || '-'}</div>
              <div><b>Jaar:</b> {item.year || '-'}</div>
              <div><b>Thema:</b> {item.theme || '-'}</div>
              <div><b>Bron:</b> {item.source || '-'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
