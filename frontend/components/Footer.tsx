export default function Footer() {
  return (
    <footer className="w-full text-center pt-10 pb-8 mt-auto">
      <div className="w-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center">
        <div 
          className="w-full max-w-md h-px bg-linear-to-r from-transparent via-indigo-500/30 to-transparent mb-5" 
        />

        <p 
          className="text-sm md:text-base font-bold tracking-wide footer-text-gradient inline-flex items-center gap-2"
        >
          <span>Stay focused. Stay consistent. Get things done.</span>
          <span className="text-base">🚀</span>
        </p>
      </div>
    </footer>
  );
}