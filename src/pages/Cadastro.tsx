import { useState, FormEvent, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, User, Mail, Phone, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { validateFormData, sanitizeInput, formatPhone } from '../utils/validation';
import { useAnalytics } from '../hooks/useAnalytics';

function Cadastro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    whatsapp: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { trackButtonClick, trackFormStart, trackFormSubmit } = useAnalytics('cadastro');
  const formStarted = useRef(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const validation = validateFormData(formData);

    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    setLoading(true);

    try {
      let clientIp = 'unknown';

      try {
        const ipResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-client-ip`,
          {
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
          }
        );

        if (ipResponse.ok) {
          const ipData = await ipResponse.json();
          clientIp = ipData.ip;
        }
      } catch (ipError) {
        console.warn('Could not fetch IP:', ipError);
      }

      const sanitizedData = {
        full_name: sanitizeInput(formData.nomeCompleto),
        email: sanitizeInput(formData.email).toLowerCase(),
        whatsapp: sanitizeInput(formData.whatsapp),
        ip_address: clientIp
      };

      const { data, error: insertError } = await supabase
        .from('registrations')
        .insert([sanitizedData])
        .select()
        .single();

      if (insertError) {
        if (insertError.code === '23505') {
          setError('Este email já está cadastrado.');
          trackFormSubmit('cadastro', false, 'email_duplicado');
        } else {
          console.error('Erro detalhado:', insertError);
          setError(`Erro ao cadastrar: ${insertError.message || 'Tente novamente mais tarde.'}`);
          trackFormSubmit('cadastro', false, insertError.message);
        }
        return;
      }

      if (data) {
        localStorage.setItem('registration_id', data.id);
      }

      trackFormSubmit('cadastro', true);
      setSuccess(true);
      setFormData({ nomeCompleto: '', email: '', whatsapp: '' });

      setTimeout(() => {
        trackButtonClick('continuar_questionario', { auto_redirect: true });
        navigate('/questionario');
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError('Erro ao enviar cadastro. Verifique sua conexão e tente novamente.');
      trackFormSubmit('cadastro', false, errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (!formStarted.current) {
      trackFormStart('cadastro');
      formStarted.current = true;
    }

    let newValue = value;

    if (name === 'whatsapp') {
      newValue = formatPhone(value);
    }

    setFormData({
      ...formData,
      [name]: newValue
    });

    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: ''
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/4587998/pexels-photo-4587998.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-10"></div>

      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-900/50 via-green-900/30 to-transparent"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <nav className="relative z-20 container mx-auto px-3 sm:px-6 lg:px-8">
        <div className="glass-effect rounded-xl sm:rounded-2xl mt-3 sm:mt-6 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-gradient-to-br from-white to-green-50 rounded-lg sm:rounded-xl p-2 sm:p-2.5 shadow-lg shadow-green-500/20">
              <Heart className="text-green-600" size={24} fill="currentColor" />
            </div>
            <span className="text-white text-lg sm:text-2xl font-bold tracking-tight">AUXILIO PET</span>
          </div>

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/90 hover:text-white active:text-white transition-all duration-300 font-medium active:scale-95"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Voltar</span>
          </button>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6 sm:mb-8 md:mb-10 animate-fadeInUp">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 text-shadow-soft">
              Cadastro <span className="gradient-text">AUXILIO PET</span>
            </h1>
            <p className="text-green-50/90 text-sm sm:text-base md:text-lg">
              Preencha os dados abaixo para participar do programa
            </p>
          </div>

          <div className="glass-effect rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 lg:p-10 animate-scaleIn">
            {success ? (
              <div className="text-center py-12 animate-fadeIn">
                <div className="flex justify-center mb-6">
                  <div className="bg-green-500/20 p-6 rounded-full">
                    <CheckCircle2 className="text-green-400" size={64} />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Cadastro Realizado!</h2>
                <p className="text-green-50/90 text-lg mb-2">
                  Agora vamos conhecer melhor o seu pet...
                </p>
                <p className="text-green-50/70">
                  Redirecionando para o questionário...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div className="space-y-2">
                  <label htmlFor="nomeCompleto" className="text-white text-sm sm:text-base font-medium flex items-center gap-2">
                    <User size={16} className="text-green-400" />
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id="nomeCompleto"
                    name="nomeCompleto"
                    value={formData.nomeCompleto}
                    onChange={handleChange}
                    required
                    placeholder="Digite seu nome completo"
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl bg-white/10 border ${
                      fieldErrors.nomeCompleto
                        ? 'border-red-400 focus:ring-red-400'
                        : 'border-white/20 focus:ring-green-400'
                    } text-white placeholder-green-200/50 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  />
                  {fieldErrors.nomeCompleto && (
                    <p className="text-red-300 text-sm mt-1">{fieldErrors.nomeCompleto}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-white text-sm sm:text-base font-medium flex items-center gap-2">
                    <Mail size={16} className="text-green-400" />
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="seu@email.com"
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl bg-white/10 border ${
                      fieldErrors.email
                        ? 'border-red-400 focus:ring-red-400'
                        : 'border-white/20 focus:ring-green-400'
                    } text-white placeholder-green-200/50 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  />
                  {fieldErrors.email && (
                    <p className="text-red-300 text-sm mt-1">{fieldErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="whatsapp" className="text-white text-sm sm:text-base font-medium flex items-center gap-2">
                    <Phone size={16} className="text-green-400" />
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    id="whatsapp"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    required
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl bg-white/10 border ${
                      fieldErrors.whatsapp
                        ? 'border-red-400 focus:ring-red-400'
                        : 'border-white/20 focus:ring-green-400'
                    } text-white placeholder-green-200/50 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  />
                  {fieldErrors.whatsapp && (
                    <p className="text-red-300 text-sm mt-1">{fieldErrors.whatsapp}</p>
                  )}
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full group relative bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 active:from-green-600 active:to-emerald-600 text-white font-bold text-base sm:text-lg px-8 sm:px-10 py-4 rounded-xl shadow-2xl shadow-green-500/40 transition-all duration-300 hover:shadow-green-400/60 active:scale-95 sm:hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100 overflow-hidden"
                >
                  {loading ? (
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Loader2 size={20} className="animate-spin" />
                      Enviando...
                    </span>
                  ) : (
                    <>
                      <span className="relative z-10">CADASTRAR AGORA</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    </>
                  )}
                </button>

                <p className="text-green-200/70 text-sm text-center">
                  Ao se cadastrar, você concorda em receber comunicações do programa AUXILIO PET
                </p>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Cadastro;
