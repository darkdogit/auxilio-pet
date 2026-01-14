import { Heart, Shield, Award, Clock, DollarSign, Coins, Banknote, Stethoscope, Syringe, AlertCircle, Pill, ActivitySquare, Brain, ShoppingBag, HeartPulse, Star, CheckCircle, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { useState, useEffect } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';

function Home() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const { trackButtonClick } = useAnalytics('home');

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setIsScrolled(currentScrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navScale = 1 - Math.min(scrollY / 2000, 0.08);
  const buttonScale = 1 + Math.min(scrollY / 1500, 0.05);
  const buttonGlow = Math.min(scrollY / 500, 1);

  return (
    <>
      <SEO
        title="AUXILIO PET - Programa de Auxílio para Famílias com Pets"
        description="AUXILIO PET oferece até R$ 450 mensais para famílias com múltiplos animais de estimação. Suporte financeiro para consultas, vacinas, medicamentos e emergências veterinárias. Cadastre-se agora!"
        keywords="auxilio pet, auxílio veterinário, auxílio para pets, ajuda para animais, programa pet, benefício pet, suporte veterinário, cuidados animais, assistência pet, auxílio animal"
      />
      <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://iili.io/fTG1rs1.png')] bg-cover bg-center opacity-20"></div>

      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-900/50 via-green-900/30 to-transparent"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="absolute top-40 left-20 text-green-500/20 animate-float" style={{ animationDelay: '0.5s' }}>
          <DollarSign size={48} />
        </div>
        <div className="absolute top-60 right-32 text-emerald-400/15 animate-float" style={{ animationDelay: '1.5s' }}>
          <Coins size={56} />
        </div>
        <div className="absolute bottom-40 right-20 text-green-400/20 animate-float" style={{ animationDelay: '2.5s' }}>
          <Banknote size={52} />
        </div>
        <div className="absolute top-1/3 left-1/4 text-green-300/10 animate-float" style={{ animationDelay: '3s' }}>
          <DollarSign size={64} />
        </div>
        <div className="absolute bottom-1/3 right-1/3 text-emerald-500/15 animate-float" style={{ animationDelay: '1s' }}>
          <Coins size={44} />
        </div>
      </div>

      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{ transform: `scale(${navScale})`, transformOrigin: 'top center' }}
      >
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div
            className={`rounded-xl sm:rounded-2xl mt-3 sm:mt-6 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between transition-all duration-300 ${
              isScrolled
                ? 'backdrop-blur-xl bg-emerald-950/80 shadow-2xl shadow-black/30'
                : 'backdrop-blur-md bg-emerald-950/60 shadow-lg shadow-black/10'
            }`}
          >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-gradient-to-br from-white to-green-50 rounded-lg sm:rounded-xl p-2 sm:p-2.5 shadow-lg shadow-green-500/20">
              <Heart className="text-green-600" size={24} fill="currentColor" />
            </div>
            <span className="text-white text-lg sm:text-2xl font-bold tracking-tight">AUXILIO PET</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-8">
            <a
              href="#sobre"
              className="text-white/90 hover:text-white transition-all duration-300 hidden lg:block font-medium relative group"
            >
              Sobre o Projeto
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#contato"
              className="text-white/90 hover:text-white transition-all duration-300 hidden lg:block font-medium relative group"
            >
              Contato
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <button
              onClick={() => {
                trackButtonClick('nav_cadastrar', { location: 'navbar' });
                navigate('/cadastro');
              }}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-semibold text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg shadow-green-500/30 hover:shadow-green-400/40 active:scale-95 sm:hover:scale-105"
            >
              Cadastrar
            </button>
          </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-12 mt-16 sm:mt-20">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 items-center">
          <div className="text-white space-y-4 sm:space-y-6 md:space-y-8 animate-fadeInUp">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-shadow-soft">
              <span className="gradient-text">AUXILIO PET</span> - até{' '}
              <span className="gradient-text">R$ 450</span> mensais para famílias com múltiplos animais de estimação
            </h1>

            <p className="text-green-50/90 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed font-light">
              Cuide dos seus pets sem comprometer o orçamento da família. O AUXILIO PET oferece suporte
              financeiro para consultas, vacinas, medicamentos e todos os cuidados que seus animais precisam.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              {[
                { text: 'Consultas veterinárias', icon: Stethoscope, gradient: 'from-blue-500/80 to-cyan-500/80', hoverGradient: 'from-blue-400/90 to-cyan-400/90' },
                { text: 'Vacinas e tratamentos', icon: Syringe, gradient: 'from-purple-500/80 to-pink-500/80', hoverGradient: 'from-purple-400/90 to-pink-400/90' },
                { text: 'Atendimento em casos de urgência', icon: AlertCircle, gradient: 'from-red-500/80 to-orange-500/80', hoverGradient: 'from-red-400/90 to-orange-400/90' },
                { text: 'Medicamentos', icon: Pill, gradient: 'from-emerald-500/80 to-teal-500/80', hoverGradient: 'from-emerald-400/90 to-teal-400/90' },
                { text: 'Exames', icon: ActivitySquare, gradient: 'from-cyan-500/80 to-blue-500/80', hoverGradient: 'from-cyan-400/90 to-blue-400/90' },
                { text: 'Psicologia animal', icon: Brain, gradient: 'from-violet-500/80 to-purple-500/80', hoverGradient: 'from-violet-400/90 to-purple-400/90' }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.text}
                    className="group relative animate-fadeInUp"
                    style={{ animationDelay: `${300 + index * 50}ms` }}
                  >
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${item.gradient} rounded-lg sm:rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-500`}></div>
                    <div className="relative flex items-center gap-2 sm:gap-4 backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 px-3 py-2.5 sm:px-5 sm:py-4 rounded-lg sm:rounded-xl hover:from-white/20 hover:to-white/10 transition-all duration-300 border border-white/20 group-hover:border-white/40 active:scale-95 sm:hover:scale-[1.02] shadow-lg">
                      <div className={`relative flex-shrink-0`}>
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-md sm:rounded-lg blur-sm sm:blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300`}></div>
                        <div className={`relative bg-gradient-to-br ${item.hoverGradient} p-1.5 sm:p-3 rounded-md sm:rounded-lg shadow-lg sm:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                          <Icon className="text-white" size={18} strokeWidth={2.5} />
                        </div>
                      </div>
                      <span className="text-white font-bold text-xs sm:text-base tracking-tight group-hover:tracking-wide transition-all">{item.text}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4 animate-fadeInUp delay-500">
              <div className="relative group/btn">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-emerald-400 to-green-400 rounded-xl sm:rounded-2xl blur-xl opacity-75 group-hover/btn:opacity-100 animate-pulse"></div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-300 via-emerald-300 to-green-300 rounded-xl sm:rounded-2xl blur-md opacity-60 group-hover/btn:opacity-90 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <button
                  onClick={() => {
                    trackButtonClick('quero_participar_agora', { location: 'hero_section', scroll_position: scrollY });
                    navigate('/cadastro');
                  }}
                  className="relative group bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 hover:from-green-400 hover:via-emerald-400 hover:to-green-400 active:from-green-600 active:via-emerald-600 active:to-green-600 text-white font-extrabold text-sm sm:text-base md:text-lg px-6 sm:px-10 md:px-12 py-3.5 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl transition-all duration-500 active:scale-95 sm:hover:scale-[1.05] overflow-hidden w-full shadow-2xl shadow-green-500/50"
                  style={{
                    transform: `scale(${buttonScale})`,
                    boxShadow: `0 25px 50px -12px rgba(34, 197, 94, ${0.7 + buttonGlow * 0.3}), 0 0 ${50 + buttonGlow * 60}px rgba(34, 197, 94, ${0.5 + buttonGlow * 0.5}), inset 0 2px 0 rgba(255,255,255,0.3)`
                  }}
                >
                  <span className="relative z-10 tracking-wide drop-shadow-lg">
                    QUERO PARTICIPAR AGORA
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                </button>
              </div>
            </div>
          </div>

          <div className="relative animate-scaleIn mt-8 lg:mt-0">
            <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-green-500/40 to-emerald-500/40 rounded-2xl sm:rounded-[2.5rem] blur-2xl sm:blur-3xl animate-float"></div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-green-400/30 to-emerald-600/30 rounded-xl sm:rounded-[2rem] blur-lg sm:blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative border-2 border-green-400/30 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://iili.io/fTG1rs1.png"
                  alt="Auxílio financeiro para pets"
                  className="w-full h-auto max-h-[400px] sm:max-h-[500px] lg:max-h-none object-cover sm:object-contain transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-28 md:h-36 bg-gradient-to-t from-emerald-900/90 via-emerald-900/40 to-transparent"></div>

                <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 md:bottom-6 md:left-6 md:right-6">
                  <div className="relative group/card">
                    <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-green-500/50 to-emerald-500/50 rounded-lg sm:rounded-xl blur-md opacity-75"></div>
                    <div className="relative glass-effect p-2 sm:p-3 md:p-4 lg:p-5 rounded-lg sm:rounded-xl border border-green-400/40 backdrop-blur-xl">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="relative flex-shrink-0">
                          <div className="absolute inset-0 bg-green-400 rounded-full blur-sm opacity-60"></div>
                          <div className="relative bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-1.5 sm:p-2 md:p-2.5 shadow-lg">
                            <Heart className="text-white" size={16} strokeWidth={2.5} fill="currentColor" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-bold text-xs sm:text-sm md:text-base lg:text-lg tracking-tight leading-tight">Mais de 15 mil pets</div>
                          <div className="text-green-100 text-[10px] sm:text-xs md:text-sm font-medium leading-tight mt-0.5">já receberam auxílio em 2024</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 max-w-5xl mx-auto animate-fadeInUp">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-green-500/40 to-emerald-500/40 rounded-xl sm:rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative glass-effect rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-green-400/30 hover:border-green-300/50 transition-all duration-500 active:scale-95 sm:hover:scale-105">
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500 rounded-lg sm:rounded-xl blur-md opacity-40"></div>
                    <div className="relative bg-gradient-to-br from-green-400 to-emerald-500 p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-lg">
                      <Shield className="text-white" size={32} strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
                <div className="text-4xl sm:text-5xl font-bold gradient-text mb-2">100%</div>
                <div className="text-green-100 text-base sm:text-lg font-semibold tracking-wide">Seguro</div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500/40 to-green-500/40 rounded-xl sm:rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative glass-effect rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-emerald-400/30 hover:border-emerald-300/50 transition-all duration-500 active:scale-95 sm:hover:scale-105">
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500 rounded-lg sm:rounded-xl blur-md opacity-40"></div>
                    <div className="relative bg-gradient-to-br from-emerald-400 to-green-500 p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-lg">
                      <Clock className="text-white" size={32} strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
                <div className="text-4xl sm:text-5xl font-bold gradient-text mb-2">24h</div>
                <div className="text-green-100 text-base sm:text-lg font-semibold tracking-wide">Resposta</div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-green-500/40 to-emerald-600/40 rounded-xl sm:rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative glass-effect rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-green-400/30 hover:border-green-300/50 transition-all duration-500 active:scale-95 sm:hover:scale-105">
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-600 rounded-lg sm:rounded-xl blur-md opacity-40"></div>
                    <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-lg">
                      <Award className="text-white" size={32} strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
                <div className="text-4xl sm:text-5xl font-bold gradient-text mb-2">+15k</div>
                <div className="text-green-100 text-base sm:text-lg font-semibold tracking-wide">Famílias</div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-24">
          <div className="text-center mb-8 sm:mb-12 md:mb-16 animate-fadeInUp">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
              Seu pet merece o melhor
            </h2>
            <p className="text-green-100/80 text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
              Com até R$450 por mês, você garante tudo que seu animal precisa
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            <div className="group relative animate-fadeInUp">
              <div className="absolute -inset-1 bg-gradient-to-br from-amber-500/40 to-orange-500/40 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative glass-effect rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-amber-400/30 hover:border-amber-300/50 transition-all duration-500 active:scale-95 sm:hover:scale-[1.02]">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-amber-500 rounded-2xl blur-lg opacity-40"></div>
                    <div className="relative bg-gradient-to-br from-amber-400 to-orange-500 p-4 sm:p-5 rounded-2xl shadow-2xl">
                      <ShoppingBag className="text-white" size={40} strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4">
                  Alimentação Premium
                </h3>
                <p className="text-green-100/90 text-center text-base sm:text-lg">
                  Ração de qualidade todo mês
                </p>
              </div>
            </div>

            <div className="group relative animate-fadeInUp" style={{ animationDelay: '100ms' }}>
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/40 to-cyan-500/40 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative glass-effect rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-blue-400/30 hover:border-blue-300/50 transition-all duration-500 active:scale-95 sm:hover:scale-[1.02]">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-lg opacity-40"></div>
                    <div className="relative bg-gradient-to-br from-blue-400 to-cyan-500 p-4 sm:p-5 rounded-2xl shadow-2xl">
                      <HeartPulse className="text-white" size={40} strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4">
                  Cuidados Veterinários
                </h3>
                <p className="text-green-100/90 text-center text-base sm:text-lg">
                  Consultas e tratamentos cobertos
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-24">
          <div className="text-center mb-8 sm:mb-12 md:mb-16 animate-fadeInUp">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
              O que dizem nossos beneficiários
            </h2>
            <p className="text-green-100/80 text-base sm:text-lg md:text-xl max-w-3xl mx-auto">
              Milhares de famílias já mudaram a vida de seus pets com o AUXILIO PET
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <div className="group relative animate-fadeInUp">
              <div className="absolute -inset-1 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative glass-effect rounded-2xl p-6 sm:p-8 border border-green-400/30 hover:border-green-300/50 transition-all duration-500 h-full flex flex-col">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-yellow-400" size={20} />
                  ))}
                </div>

                <p className="text-green-100/90 text-base sm:text-lg mb-6 flex-grow leading-relaxed">
                  "Graças ao AUXILIO PET consegui dar vacinas e alimentação de qualidade para meus 3 cachorros. Mudou nossa vida!"
                </p>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-400 rounded-full blur-sm opacity-40"></div>
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg sm:text-xl">MS</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-white font-bold text-base sm:text-lg">Maria Silva</div>
                    <div className="text-green-100/70 text-sm sm:text-base">São Paulo - SP</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative animate-fadeInUp" style={{ animationDelay: '100ms' }}>
              <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500/30 to-green-500/30 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative glass-effect rounded-2xl p-6 sm:p-8 border border-emerald-400/30 hover:border-emerald-300/50 transition-all duration-500 h-full flex flex-col">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-yellow-400" size={20} />
                  ))}
                </div>

                <p className="text-green-100/90 text-base sm:text-lg mb-6 flex-grow leading-relaxed">
                  "Estava sem condições de castrar meus pets. Com o auxílio consegui fazer todos os procedimentos necessários."
                </p>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-400 rounded-full blur-sm opacity-40"></div>
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg sm:text-xl">JS</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-white font-bold text-base sm:text-lg">João Santos</div>
                    <div className="text-green-100/70 text-sm sm:text-base">Rio de Janeiro - RJ</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative animate-fadeInUp" style={{ animationDelay: '200ms' }}>
              <div className="absolute -inset-1 bg-gradient-to-br from-green-600/30 to-emerald-600/30 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative glass-effect rounded-2xl p-6 sm:p-8 border border-green-500/30 hover:border-green-400/50 transition-all duration-500 h-full flex flex-col">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-yellow-400" size={20} />
                  ))}
                </div>

                <p className="text-green-100/90 text-base sm:text-lg mb-6 flex-grow leading-relaxed">
                  "Recebi o dinheiro em menos de 24h após a aprovação! Super rápido e sem burocracia. Recomendo muito!"
                </p>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500 rounded-full blur-sm opacity-40"></div>
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg sm:text-xl">AC</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-white font-bold text-base sm:text-lg">Ana Costa</div>
                    <div className="text-green-100/70 text-sm sm:text-base">Belo Horizonte - MG</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-24">
          <div className="max-w-5xl mx-auto">
            <div className="group relative animate-fadeInUp">
              <div className="absolute -inset-1 bg-gradient-to-br from-green-500/40 to-emerald-500/40 rounded-2xl sm:rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative glass-effect rounded-2xl sm:rounded-3xl p-8 sm:p-12 border border-green-400/30 hover:border-green-300/50 transition-all duration-500">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="text-center md:text-left">
                    <div className="flex justify-center md:justify-start mb-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-green-400 rounded-2xl blur-lg opacity-50"></div>
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl">
                          <Headphones className="text-white" size={44} strokeWidth={2.5} />
                        </div>
                      </div>
                    </div>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                      Nossa equipe está pronta para ajudar você!
                    </h3>
                    <p className="text-green-100/90 text-base sm:text-lg leading-relaxed">
                      Atendimento humanizado e especializado para garantir que você receba todo o suporte necessário para cuidar dos seus pets.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4 group/item">
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="absolute inset-0 bg-green-400 rounded-lg blur-sm opacity-40 group-hover/item:opacity-70 transition-opacity"></div>
                          <div className="relative bg-gradient-to-br from-green-400 to-emerald-500 p-3 rounded-lg shadow-lg">
                            <CheckCircle className="text-white" size={24} strokeWidth={2.5} />
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-lg mb-1">Atendimento 24/7</h4>
                        <p className="text-green-100/80 text-sm sm:text-base">Estamos sempre disponíveis quando você precisar</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group/item">
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="absolute inset-0 bg-emerald-400 rounded-lg blur-sm opacity-40 group-hover/item:opacity-70 transition-opacity"></div>
                          <div className="relative bg-gradient-to-br from-emerald-400 to-green-500 p-3 rounded-lg shadow-lg">
                            <Heart className="text-white" size={24} strokeWidth={2.5} fill="currentColor" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-lg mb-1">Equipe especializada em bem-estar animal</h4>
                        <p className="text-green-100/80 text-sm sm:text-base">Profissionais capacitados e apaixonados por pets</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group/item">
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="absolute inset-0 bg-green-500 rounded-lg blur-sm opacity-40 group-hover/item:opacity-70 transition-opacity"></div>
                          <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-lg shadow-lg">
                            <Shield className="text-white" size={24} strokeWidth={2.5} />
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-lg mb-1">Suporte durante todo o processo</h4>
                        <p className="text-green-100/80 text-sm sm:text-base">Do cadastro até o recebimento do auxílio</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group/item">
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="absolute inset-0 bg-emerald-500 rounded-lg blur-sm opacity-40 group-hover/item:opacity-70 transition-opacity"></div>
                          <div className="relative bg-gradient-to-br from-emerald-500 to-green-600 p-3 rounded-lg shadow-lg">
                            <Clock className="text-white" size={24} strokeWidth={2.5} />
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-lg mb-1">Resposta rápida e eficiente</h4>
                        <p className="text-green-100/80 text-sm sm:text-base">Análise e aprovação em até 24 horas</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      </div>
    </>
  );
}

export default Home;
