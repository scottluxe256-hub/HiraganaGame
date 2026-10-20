interface HomeProps {
  onStart: () => void;
}

export const Home = ({ onStart }: HomeProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-700">
        <h1 className="text-3xl font-bold mb-3 text-indigo-400">Tebak Hiragana 🎌</h1>
        <p className="text-gray-300 mb-6 text-sm">
          Selamat belajar! Asah pemahaman huruf Hiragana kamu (Dasar, Kutip, Bulat, & Gabungan) secara santai tanpa batas waktu.
        </p>
        <button
          onClick={onStart}
          className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-500 font-semibold rounded-xl transition duration-200 shadow-lg cursor-pointer"
        >
          Mulai Belajar 🚀
        </button>
      </div>
    </div>
  );
};
