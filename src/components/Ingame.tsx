import { useState, useEffect, useRef, type FormEvent } from 'react';
import type { HiraganaItem, AnswerRecord } from '../types';
import { hiraganaList, katakanaList } from '../data/hiraganaData';

interface IngameProps {
  onEndGame: (records: AnswerRecord[]) => void;
}

const pickUniqueCard = (
  questionNumber: number,
  currentUsedIds: string[]
): { card: HiraganaItem; updatedUsedIds: string[] } => {
  let pool: HiraganaItem[] = [];

  if (questionNumber >= 100) {
    // Level 100+: Katakana Lengkap
    pool = katakanaList;
  } else if (questionNumber <= 10) {
    // Level 1-10: Huruf Dasar
    pool = hiraganaList.filter((item) => item.type === 'basic');
  } else if (questionNumber <= 20) {
    // Level 11-20: Kutip & Bulat (Dakuten & Handakuten)
    pool = hiraganaList.filter(
      (item) => item.type === 'dakuten' || item.type === 'handakuten'
    );
  } else if (questionNumber <= 30) {
    // Level 21-30: Gabungan (Yōon: Kya, Kyo, dll)
    pool = hiraganaList.filter((item) => item.type === 'yoon');
  } else {
    // Level 31-99: Kata Panjang, Partikel & Campuran Hiragana
    const expertPool = hiraganaList.filter((item) => item.type === 'expert');
    pool = expertPool.length > 0 ? expertPool : hiraganaList;
  }

  if (pool.length === 0) pool = hiraganaList;

  // Pastikan ambil kartu yang BELUM pernah keluar
  let availablePool = pool.filter((item) => !currentUsedIds.includes(item.id));

  // Jika pool saat ini sudah habis, reset khusus pool tersebut
  if (availablePool.length === 0) {
    availablePool = pool;
    const poolIds = pool.map((p) => p.id);
    currentUsedIds = currentUsedIds.filter((id) => !poolIds.includes(id));
  }

  const randomIndex = Math.floor(Math.random() * availablePool.length);
  const selectedCard = availablePool[randomIndex];

  return {
    card: selectedCard,
    updatedUsedIds: [...currentUsedIds, selectedCard.id],
  };
};

export const Ingame = ({ onEndGame }: IngameProps) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [records, setRecords] = useState<AnswerRecord[]>([]);
  const [currentCard, setCurrentCard] = useState<HiraganaItem | null>(null);
  const [usedCardIds, setUsedCardIds] = useState<string[]>([]);

  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const questionNumber = records.length + 1;

  // Aturan Reverse Mode: Soal genap di atas level tertentu dijadikan pilihan ganda
  const isReverseMode = questionNumber >= 21 && questionNumber % 2 === 0;

  useEffect(() => {
    const { card, updatedUsedIds } = pickUniqueCard(1, []);
    setCurrentCard(card);
    setUsedCardIds(updatedUsedIds);
  }, []);

  // Generate 3 Pilihan Ganda untuk Mode Reverse
  useEffect(() => {
    if (currentCard && isReverseMode) {
      let sourcePool = hiraganaList;
      if (questionNumber >= 100) {
        sourcePool = katakanaList;
      }

      const otherCards = sourcePool.filter((item) => item.id !== currentCard.id);
      const shuffledOthers = [...otherCards].sort(() => Math.random() - 0.5);

      const wrongChoices = shuffledOthers.slice(0, 2).map((item) => item.character);
      const allChoices = [currentCard.character, ...wrongChoices].sort(
        () => Math.random() - 0.5
      );

      setOptions(allChoices);
    }
  }, [currentCard, isReverseMode, questionNumber]);

  useEffect(() => {
    if (!isLocked && !isReverseMode) {
      inputRef.current?.focus();
    }
  }, [currentCard, isLocked, isReverseMode]);

  const processAnswer = (answer: string) => {
    if (!answer.trim() || !currentCard || isLocked) return;

    const formattedInput = answer.trim().toLowerCase();

    const isCorrect = isReverseMode
      ? formattedInput === currentCard.character.toLowerCase()
      : currentCard.romaji.some((r) => r.toLowerCase() === formattedInput);

    const newRecord: AnswerRecord = {
      id: `${currentCard.id}-${Date.now()}`,
      question: currentCard,
      userAnswer: formattedInput,
      isCorrect,
    };

    const nextRecords = [...records, newRecord];
    setRecords(nextRecords);
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setIsLocked(true);

    setTimeout(() => {
      setUserAnswer('');
      setSelectedOption(null);
      setFeedback(null);
      setIsLocked(false);

      const nextQuestionNum = nextRecords.length + 1;
      const { card, updatedUsedIds } = pickUniqueCard(nextQuestionNum, usedCardIds);
      setCurrentCard(card);
      setUsedCardIds(updatedUsedIds);
    }, 800);
  };

  const handleSubmitForm = (e: FormEvent) => {
    e.preventDefault();
    processAnswer(userAnswer);
  };

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
    processAnswer(option);
  };

  if (!currentCard) return null;

  const getFontSize = (text: string) => {
    if (text.length >= 8) return 'text-2xl';
    if (text.length >= 5) return 'text-3xl';
    if (text.length >= 3) return 'text-5xl';
    return 'text-8xl';
  };

  const mainRomaji = currentCard.romaji[0];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div
        className={`bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center border transition-all duration-200 ${
          feedback === 'correct'
            ? 'border-emerald-500 bg-emerald-950/20'
            : feedback === 'incorrect'
            ? 'border-rose-500 bg-rose-950/20'
            : 'border-gray-700'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs font-medium text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full uppercase tracking-wider">
            Soal #{questionNumber}{' '}
            {questionNumber >= 100
              ? '🌟 KATAKANA'
              : questionNumber >= 31
              ? '📚 KATA & PARTIKEL'
              : questionNumber >= 21
              ? '🔥 YŌON (KYA/KYO)'
              : questionNumber >= 11
              ? '✨ DAKUTEN & HANDAKUTEN'
              : '🌱 BASIC'}{' '}
            {isReverseMode && '(Pilih Huruf)'}
          </span>
          <button
            onClick={() => onEndGame(records)}
            className="text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1.5 rounded-lg border border-red-500/30 font-semibold transition cursor-pointer"
          >
            End Game
          </button>
        </div>

        {/* Tampilan Soal */}
        <div className="my-6 min-h-[110px] flex items-center justify-center">
          {isReverseMode ? (
            <span className="text-3xl font-black tracking-wide text-indigo-400 drop-shadow-md select-none break-all">
              {mainRomaji}
            </span>
          ) : (
            <span
              className={`${getFontSize(
                currentCard.character
              )} font-black tracking-wide text-white drop-shadow-md select-none font-japanese transition-all`}
            >
              {currentCard.character}
            </span>
          )}
        </div>

        {/* Indikator Feedback */}
        <div className="h-6 mb-4 font-bold text-sm flex items-center justify-center">
          {feedback === 'correct' && (
            <span className="text-emerald-400">✓ Benar!</span>
          )}
          {feedback === 'incorrect' && (
            <span className="text-rose-400">
              ✗ Salah! ({isReverseMode ? currentCard.character : mainRomaji})
            </span>
          )}
        </div>

        {/* Input / Pilihan Ganda */}
        {isReverseMode ? (
          <div className="flex flex-col gap-2.5 my-2">
            {options.map((option, idx) => (
              <button
                key={idx}
                disabled={isLocked}
                onClick={() => handleSelectOption(option)}
                className={`py-3 px-4 text-xl font-bold rounded-xl border font-japanese transition cursor-pointer active:scale-95 disabled:opacity-50 ${
                  selectedOption === option
                    ? feedback === 'correct'
                      ? 'bg-emerald-600 border-emerald-400 text-white'
                      : 'bg-rose-600 border-rose-400 text-white'
                    : 'bg-gray-900 border-gray-700 hover:border-indigo-500 text-white'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmitForm} className="space-y-4">
            <input
              ref={inputRef}
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={isLocked}
              placeholder="Ketik romaji..."
              autoCapitalize="none"
              autoComplete="off"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-center text-lg font-medium text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={isLocked || !userAnswer.trim()}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition shadow-lg cursor-pointer disabled:opacity-50"
            >
              Jawab (Enter) ↵
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
