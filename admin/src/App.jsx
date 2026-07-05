import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { Settings, Users, MessageSquare, Activity, ShieldAlert, Power } from 'lucide-react'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchSettings()
    fetchUsers()
  }, [])

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('is_active')
        .eq('id', 1)
        .single()
      
      if (error) throw error
      if (data) setIsActive(data.is_active)
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users_leads')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      if (data) setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const [campaignMessage, setCampaignMessage] = useState('')
  const [campaignAudience, setCampaignAudience] = useState('all')
  const [sendingCampaign, setSendingCampaign] = useState(false)

  const toggleSiteStatus = async () => {
    const newStatus = !isActive
    setIsActive(newStatus)
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ is_active: newStatus, updated_at: new Date().toISOString() })
        .eq('id', 1)
      
      if (error) {
        setIsActive(!newStatus)
        throw error
      }
    } catch (error) {
      console.error('Error updating site status:', error)
      alert('Error al actualizar el estado del sitio')
    }
  }

  const sendCampaign = async () => {
    if (!campaignMessage.trim()) return alert('Escribe un mensaje');
    setSendingCampaign(true);
    
    try {
      // Registrar campaña en Supabase
      const { data: campaignData, error: dbError } = await supabase
        .from('campaigns')
        .insert([{ message: campaignMessage, target_audience: campaignAudience }])
        .select()
        .single();
        
      if (dbError) throw dbError;

      // Llamar al Bot local
      const response = await fetch('http://localhost:3031/api/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: campaignData.id,
          message: campaignMessage,
          audience: campaignAudience,
          users: users // Pasamos la lista de usuarios al bot
        })
      });

      if (!response.ok) throw new Error('El bot no respondió correctamente');
      
      alert('Transmisión iniciada correctamente');
      setCampaignMessage('');
    } catch (err) {
      console.error(err);
      alert('Error enviando la campaña. Revisa que el bot esté encendido.');
    } finally {
      setSendingCampaign(false);
    }
  }

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginEmail === 'admin@fiestadedisfracesfdz.com.ar' && loginPassword === 'password123') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Credenciales incorrectas. Acceso denegado.');
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen bg-background items-center justify-center font-sans">
        <div className="bg-surface p-10 rounded-xl shadow-lg border border-border w-[400px]">
          <div className="text-center mb-8">
            <ShieldAlert className="text-primary mx-auto mb-4" size={48} />
            <h1 className="text-2xl font-bold text-textMain font-[Cinzel_Decorative]">Hawkins Admin</h1>
            <p className="text-sm text-textMuted mt-2 uppercase tracking-widest font-[Special_Elite]">Portal de Seguridad</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-textMain mb-2">Usuario (Email)</label>
              <input 
                type="email" 
                className="w-full bg-background border border-border rounded-lg p-3 text-textMain focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-textMain mb-2">Contraseña</label>
              <input 
                type="password" 
                className="w-full bg-background border border-border rounded-lg p-3 text-textMain focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>
            {loginError && <p className="text-primary text-sm font-semibold">{loginError}</p>}
            <button 
              type="submit" 
              className="w-full bg-primary hover:bg-primaryNeon text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all uppercase tracking-widest text-sm"
            >
              Ingresar al Sistema
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-textMain font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-surface border-r border-border shadow-sm flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold text-textMain flex items-center gap-2 font-[Cinzel_Decorative]">
            <ShieldAlert className="text-primary" />
            Hawkins Admin
          </h1>
          <p className="text-xs text-primary mt-1 tracking-widest font-[Special_Elite] uppercase">Nivel 5 Clasificado</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${activeTab === 'dashboard' ? 'bg-primary/10 text-primary font-semibold border border-primary/20' : 'hover:bg-textHover text-textMuted'}`}
          >
            <Activity size={18} /> Panel de Control
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${activeTab === 'users' ? 'bg-primary/10 text-primary font-semibold border border-primary/20' : 'hover:bg-textHover text-textMuted'}`}
          >
            <Users size={18} /> Agentes Registrados
          </button>
          <button 
            onClick={() => setActiveTab('campaigns')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${activeTab === 'campaigns' ? 'bg-primary/10 text-primary font-semibold border border-primary/20' : 'hover:bg-textHover text-textMuted'}`}
          >
            <MessageSquare size={18} /> Campañas WhatsApp
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        {loading ? (
          <div className="flex items-center justify-center h-full">Cargando sistemas...</div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-textMain">Panel de Control General</h2>
                
                {/* Master Switch */}
                <div className="p-8 border border-border bg-surface rounded-lg shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-textMain mb-2">Estado del Portal (Web Pública)</h3>
                    <p className="text-textMuted text-sm">Controla si el público puede acceder a la web o si ven la pantalla de mantenimiento.</p>
                  </div>
                  <button 
                    onClick={toggleSiteStatus}
                    className={`flex items-center gap-2 px-6 py-4 rounded-lg font-bold transition-all ${isActive ? 'bg-success/10 text-success border border-success/30 hover:bg-success/20' : 'bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20'}`}
                  >
                    <Power /> {isActive ? 'PORTAL ABIERTO' : 'PORTAL CERRADO'}
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mt-6">
                  <div className="p-6 border border-border bg-surface shadow-sm rounded-lg">
                    <p className="text-textMuted text-sm uppercase tracking-wider mb-2">Agentes Registrados</p>
                    <p className="text-4xl font-bold text-textMain">{users.length}</p>
                  </div>
                  <div className="p-6 border border-border bg-surface shadow-sm rounded-lg">
                    <p className="text-textMuted text-sm uppercase tracking-wider mb-2">Interacciones Bot</p>
                    <p className="text-4xl font-bold text-accent">--</p>
                  </div>
                  <div className="p-6 border border-border bg-surface shadow-sm rounded-lg">
                    <p className="text-textMuted text-sm uppercase tracking-wider mb-2">Mensajes Masivos</p>
                    <p className="text-4xl font-bold text-primary">--</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-textMain mb-6">Agentes Registrados</h2>
                <div className="border border-border bg-surface shadow-sm rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-background border-b border-border text-primary uppercase text-xs tracking-wider">
                      <tr>
                        <th className="p-4 font-semibold">Nombre</th>
                        <th className="p-4 font-semibold">Email</th>
                        <th className="p-4 font-semibold">Teléfono</th>
                        <th className="p-4 font-semibold">Categoría</th>
                        <th className="p-4 font-semibold">Fecha Registro</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="p-8 text-center text-textMuted">No hay agentes registrados aún.</td>
                        </tr>
                      ) : (
                        users.map(user => (
                          <tr key={user.id} className="hover:bg-textHover transition-colors">
                            <td className="p-4 text-textMain font-medium">{user.name}</td>
                            <td className="p-4 text-textMuted">{user.email}</td>
                            <td className="p-4 text-textMuted">{user.phone || '-'}</td>
                            <td className="p-4 text-accent font-medium">{user.category || '-'}</td>
                            <td className="p-4 text-textMuted text-sm">{new Date(user.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'campaigns' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-textMain mb-6">Campañas Masivas de WhatsApp</h2>
                <div className="p-8 border border-border bg-surface shadow-sm rounded-lg">
                  <h3 className="text-xl font-semibold text-textMain mb-4">Nueva Campaña</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-primary uppercase tracking-widest mb-2 font-medium">Mensaje</label>
                      <textarea 
                        className="w-full bg-background border border-border rounded-lg p-4 text-textMain focus:border-primary focus:ring-1 focus:ring-primary outline-none h-32 resize-none transition-all"
                        placeholder="Escribe el mensaje que enviará el bot..."
                        value={campaignMessage}
                        onChange={(e) => setCampaignMessage(e.target.value)}
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm text-primary uppercase tracking-widest mb-2 font-medium">Audiencia</label>
                      <select 
                        className="w-full bg-background border border-border rounded-lg p-4 text-textMain focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        value={campaignAudience}
                        onChange={(e) => setCampaignAudience(e.target.value)}
                      >
                        <option value="all">Todos los agentes registrados</option>
                        <option value="vip">Agentes VIP</option>
                        <option value="valid_phone">Sólo teléfonos válidos (+54)</option>
                      </select>
                    </div>
                    <button 
                      onClick={sendCampaign}
                      disabled={sendingCampaign}
                      className="bg-primary hover:bg-primaryNeon text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all uppercase tracking-widest text-sm disabled:opacity-50"
                    >
                      {sendingCampaign ? 'Enviando...' : 'Iniciar Transmisión 🚀'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default App
