// No filepath (place in a suitable component file, e.g. src/components/StreamChat.tsx)
import {useState, useRef} from 'react';
import {config} from "../config/config";

export function StreamChat() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(true);
  const threadIdRef = useRef<string | null>(null);
  const apiUrl = config["apiUrl"];

  const getUserUuid = (): string | null => {
    const direct = localStorage.getItem("user_uuid");
    if (direct && direct.trim()) return direct;
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;
      const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
      const uuid = payload?.uuid || payload?.user_id || null;
      if (uuid) {
        localStorage.setItem("user_uuid", uuid);
      }
      return uuid;
    } catch {
      return null;
    }
  };

  const send = () => {
    setOutput("");
    setLoading(true);
    setError(null);
    const userUuid = getUserUuid();
    if (!userUuid) {
      setLoading(false);
      setError("Utilisateur non authentifié: identifiant utilisateur introuvable. Connectez-vous d'abord.");
      return;
    }
    const params = new URLSearchParams({
      text: input,
      user_uuid: userUuid,
      clientTime: new Date().toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      discussion_id: crypto.randomUUID(),
    });
    if (threadIdRef.current) params.append("thread_id", threadIdRef.current);

    const es = new EventSource(`${apiUrl}/agent/stream?${params.toString()}`);

    es.onmessage = (e) => {
      if (e.data === "[DONE]") {
        es.close();
        setLoading(false);
        return;
      }
      try {
        const obj = JSON.parse(e.data);
        if (obj.thread_id) threadIdRef.current = obj.thread_id;
        if (typeof obj.full === 'string') {
          setOutput(obj.full);
        }
      } catch {}
    };

    es.onerror = () => {
      es.close();
      setLoading(false);
      setError("Erreur de connexion au flux (SSE). Vérifiez l'URL backend ou votre réseau.");
    };
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        width: 420,
        maxWidth: '90vw',
        zIndex: 1000,
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        padding: 12,
        color: '#111827'
      }}
    >
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8}}>
        <strong>Streaming (beta)</strong>
        <button onClick={() => setOpen(false)} aria-label="Close" style={{border:'none', background:'transparent', cursor:'pointer'}}>✕</button>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Écrivez ici pour streamer la réponse"
        style={{
          width:'100%',
          minHeight:72,
          padding:8,
          border:'1px solid #d1d5db',
          borderRadius:6,
          resize:'vertical',
          background:'#ffffff',
          color:'#111827',
          fontSize:14,
          lineHeight:1.5
        }}
      />
      <div style={{display:'flex', gap:8, alignItems:'center', marginTop:8}}>
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          style={{
            padding:'6px 12px',
            background: (loading || !input.trim()) ? '#e5e7eb' : '#111827',
            color: (loading || !input.trim()) ? '#6b7280' : '#ffffff',
            border:'none',
            borderRadius:6,
            cursor:(loading || !input.trim()) ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Envoi…' : 'Envoyer'}
        </button>
        <small style={{color:'#6b7280'}}>API: {apiUrl}</small>
      </div>
      {error && (
        <div style={{
          marginTop:8,
          padding:'8px 10px',
          background:'#FEF2F2',
          border:'1px solid #FCA5A5',
          color:'#991B1B',
          borderRadius:6,
          fontSize:12
        }}>
          {error}
        </div>
      )}
      <div style={{
        whiteSpace:'pre-wrap',
        border:'1px solid #eee',
        padding:8,
        minHeight:120,
        marginTop:8,
        borderRadius:6,
        background:'#fafafa',
        color:'#111827',
        fontSize:14,
        lineHeight:1.5
      }}>
        {loading && output === "" ? "Thinking..." : output}
        {loading && output !== "" && <span className="blink">|</span>}
      </div>
    </div>
  );
}