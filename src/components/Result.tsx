import type { AnswerRecord } from '../types'; // <-- Tambahkan kata 'type'

interface ResultProps {
  records: AnswerRecord[];
  onRestart: () => void;
}

export const Result = ({ records, onRestart }: ResultProps) => {
  const correctCount = records.filter((r) => r.isCorrect).length;
  const wrongCount = records.length - correctCount;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-6 md:p-8 rounded-2xl shadow-2xl max-w-lg w-full border border-gray-700 flex flex-col max-h-[85vh]">
        <h2 className="text-2xl font-bold text-center text-indigo-400 mb-2">Hasil Latihan 📊</h2>
        <p className="text-gray-400 text-center text-sm mb-6">
          Total {records.length} soal telah dijawab.
        </p>

        {/* Statistik Benar & Salah */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-xl text-center">
            <p className="text-emerald-400 text-xs font-semibold uppercase">Benar</p>
            <p className="text-3xl font-bold text-emerald-300 mt-1">{correctCount}</p>
          </div>
          <div className="bg-rose-950/40 border border-rose-500/30 p-4 rounded-xl text-center">
            <p className="text-rose-400 text-xs font-semibold uppercase">Salah</p>
            <p className="text-3xl font-bold text-rose-300 mt-1">{wrongCount}</p>
          </div>
        </div>

        {/* Rincian Soal (Scrollable) */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 mb-6">
          {records.length === 0 ? (
            <p className="text-center text-gray-500 my-8 text-sm">Belum ada soal yang dijawab.</p>
          ) : (
            records.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3.5 rounded-xl border ${
                  item.isCorrect
                    ? 'bg-emerald-900/10 border-emerald-500/20'
                    : 'bg-rose-900/10 border-rose-500/20'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-gray-500 font-mono w-5">#{index + 1}</span>
                  <span className="text-2xl font-bold font-japanese">{item.question.character}</span>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold">
                    Jawabanmu: <span className={item.isCorrect ? 'text-emerald-400' : 'text-rose-400'}>{item.userAnswer || '-'}</span>
                  </p>
                  {!item.isCorrect && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      Kunci: <span className="text-gray-200 font-mono">{item.question.romaji.join(' / ')}</span>
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <button
          onClick={onRestart}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 font-semibold rounded-xl transition shadow-lg cursor-pointer"
        >
          Coba Lagi 🔄
        </button>
      </div>
    </div>
  );
};
