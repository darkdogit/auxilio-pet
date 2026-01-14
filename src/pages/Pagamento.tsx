import { useState } from 'react';
import { Heart, Copy, Check, QrCode } from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';

function Pagamento() {
  const [copied, setCopied] = useState(false);
  const valorPagamento = 59.00;
  const { trackButtonClick } = useAnalytics('pagamento');

  const pixCode = '00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-4266141740005204000053039865802BR5925AUXILIO PET SOLIDARIO6009SAO PAULO62070503***63041D3D';

  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      trackButtonClick('copiar_pix', { valor: valorPagamento });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/4587998/pexels-photo-4587998.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-10"></div>

      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-900/50 via-green-900/30 to-transparent"></div>
      </div>

      <nav className="relative z-20 container mx-auto px-3 sm:px-6 lg:px-8">
        <div className="glass-effect rounded-xl sm:rounded-2xl mt-3 sm:mt-6 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-gradient-to-br from-white to-green-50 rounded-lg sm:rounded-xl p-2 sm:p-2.5 shadow-lg shadow-green-500/20">
              <Heart className="text-green-600" size={24} fill="currentColor" />
            </div>
            <span className="text-white text-lg sm:text-xl md:text-2xl font-bold tracking-tight">AUXILIO PET</span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="max-w-2xl mx-auto">
          <div className="glass-effect rounded-2xl sm:rounded-3xl p-6 sm:p-8 animate-fadeIn">

            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-2xl shadow-green-500/50">
                  <QrCode className="text-white" size={36} strokeWidth={2} />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Pagamento via PIX</h2>
              <p className="text-white/80 text-sm sm:text-base">Contribuição Solidária</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 sm:p-6 mb-6">
              <div className="text-center mb-4">
                <p className="text-white/80 text-sm sm:text-base mb-2">Valor a pagar</p>
                <p className="text-4xl sm:text-5xl font-bold text-white">
                  R$ {valorPagamento.toFixed(2).replace('.', ',')}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 mb-6">
              <h3 className="text-white font-bold text-lg mb-4 text-center">Escaneie o QR Code</h3>

              <div className="bg-white rounded-2xl p-4 sm:p-6 mb-4 flex justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixCode)}`}
                  alt="QR Code PIX"
                  className="w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72"
                />
              </div>

              <div className="text-center mb-6">
                <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                  Abra o app do seu banco, escolha pagar via PIX e escaneie o código acima
                </p>
              </div>

              <div className="border-t border-white/20 pt-6">
                <h4 className="text-white font-semibold text-base mb-3 text-center">Ou copie o código PIX</h4>

                <div className="bg-white/10 border border-white/20 rounded-xl p-4 mb-4">
                  <p className="text-white/70 text-xs sm:text-sm break-all font-mono leading-relaxed">
                    {pixCode}
                  </p>
                </div>

                <button
                  onClick={handleCopyPix}
                  className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 active:from-green-700 active:to-emerald-800 text-white font-bold text-base sm:text-lg rounded-xl shadow-xl shadow-green-500/30 transition-all duration-300 active:scale-95 sm:hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/40 flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check size={20} />
                      Código Copiado!
                    </>
                  ) : (
                    <>
                      <Copy size={20} />
                      Copiar Código PIX
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-400/30 rounded-xl p-4 mb-6">
              <p className="text-amber-200 text-sm sm:text-base text-center leading-relaxed">
                Após realizar o pagamento, a confirmação será processada em até 5 minutos e você receberá a liberação do auxílio.
              </p>
            </div>

            <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-4">
              <p className="text-green-200 text-xs sm:text-sm text-center leading-relaxed">
                Esta contribuição será destinada às ONGs e organizações sociais que trabalham no resgate e proteção de animais
              </p>
            </div>

          </div>
        </div>
      </main>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default Pagamento;
