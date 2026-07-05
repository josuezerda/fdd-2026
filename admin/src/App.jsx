import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { Settings, Users, MessageSquare, Activity, ShieldAlert, Power, Image as ImageIcon, Trash2, UploadCloud } from 'lucide-react'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [users, setUsers] = useState([])

  const [galleryImages, setGalleryImages] = useState([])
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    fetchSettings()
    fetchUsers()
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('id', { ascending: true })
      
      if (error) throw error
      if (data) setGalleryImages(data)
    } catch (error) {
      console.error('Error fetching gallery:', error)
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `public/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);
        
      const { error: dbError } = await supabase
        .from('gallery_images')
        .insert([{ url: urlData.publicUrl }]);
        
      if (dbError) throw dbError;
      
      fetchGallery();
      alert("Imagen subida con éxito");
    } catch (error) {
      console.error(error);
      alert("Error al subir la imagen");
    } finally {
      setUploadingImage(false);
      event.target.value = null;
    }
  };

  const handleDeleteImage = async (id, url) => {
    if (!confirm('¿Seguro que deseas eliminar esta imagen de la galería pública?')) return;
    try {
      const { error } = await supabase.from('gallery_images').delete().eq('id', id);
      if (error) throw error;
      fetchGallery();
    } catch (e) {
      console.error(e);
      alert("Error al eliminar");
    }
  };

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
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'campaigns' ? 'bg-red-500/10 text-red-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <MessageSquare size={20} />
            Campañas
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'gallery' ? 'bg-red-500/10 text-red-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <ImageIcon size={20} />
            Galería Web
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

          {/* Pestaña Campañas */}
          {activeTab === 'campaigns' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MessageSquare className="text-red-600" />
                Transmisión Masiva
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje Oficial</label>
                  <textarea
                    value={campaignMessage}
                    onChange={(e) => setCampaignMessage(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 h-32 focus:ring-2 focus:ring-red-500 outline-none"
                    placeholder="Escribe el comunicado para los sujetos de prueba..."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Destinatarios</label>
                  <select
                    value={campaignAudience}
                    onChange={(e) => setCampaignAudience(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-red-500 outline-none"
                  >
                    <option value="all">Todos los Registrados ({users.length})</option>
                    <option value="test">Solo de Prueba (Admin)</option>
                  </select>
                </div>
                <button
                  onClick={sendCampaign}
                  disabled={sendingCampaign}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {sendingCampaign ? <Activity className="animate-spin" /> : <MessageSquare />}
                  {sendingCampaign ? 'Enviando Comunicado...' : 'Ejecutar Transmisión'}
                </button>
              </div>
            </div>
          )}

          {/* Pestaña Galería */}
          {activeTab === 'gallery' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <ImageIcon className="text-red-600" />
                  Gestión de Galería (Home)
                </h2>
                <div className="relative">
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={uploadingImage} />
                  <button className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    {uploadingImage ? <Activity size={18} className="animate-spin" /> : <UploadCloud size={18} />}
                    {uploadingImage ? 'Subiendo...' : 'Subir Foto'}
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {galleryImages.map(img => (
                  <div key={img.id} className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50 aspect-square">
                    <img src={img.url} alt="Gallery" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    <button onClick={() => handleDeleteImage(img.id, img.url)} className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-md">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {galleryImages.length === 0 && (
                  <div className="col-span-full py-10 text-center text-gray-500">
                    No hay imágenes en la galería. Sube la primera foto.
                  </div>
                )}
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
