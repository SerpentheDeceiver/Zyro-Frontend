import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <main className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-white p-4">
      {/* 404 Text with Glitch Animation */}
      <div className="relative mb-8 text-center">
        <h1 className="text-[140px] font-black leading-none text-primary animate-glitch">
          404
        </h1>
        {/* Glitch layers for effect */}
        <div className="absolute inset-0 text-[140px] font-black leading-none text-blue-400 animate-glitch-1 opacity-75">
          404
        </div>
        <div className="absolute inset-0 text-[140px] font-black leading-none text-red-400 animate-glitch-2 opacity-75">
          404
        </div>
      </div>

      {/* Subtitle */}
      <h2 className="mb-4 text-2xl font-bold text-ink">This page doesn't exist on Zyro.</h2>
      <p className="mb-8 max-w-md text-center text-slate-600">
        The page you're looking for has moved or never existed. Let's get you back on track.
      </p>

      {/* CTA Button */}
      <Link
        to="/home"
        className="mb-12 flex items-center gap-2 rounded-pill bg-primary px-8 py-3 font-semibold text-white transition hover:bg-primary-dark"
      >
        Go to Marketplace <ArrowLeft className="h-5 w-5 rotate-180" />
      </Link>

      {/* Zyro Wordmark Footer */}
      <div className="fixed bottom-8 text-center">
        <p className="text-xs font-semibold text-slate-400">ZYRO</p>
      </div>

      {/* CSS Glitch Animations */}
      <style>{`
        @keyframes glitch {
          0%, 100% {
            clip-path: inset(0);
            color: rgb(59, 130, 246);
          }
          25% {
            clip-path: inset(0 0 50% 0);
          }
          50% {
            clip-path: inset(50% 0 0 0);
          }
          75% {
            clip-path: inset(0 0 0 50%);
          }
        }

        @keyframes glitch-1 {
          0%, 100% {
            clip-path: inset(0);
            transform: translateX(2px);
          }
          25% {
            clip-path: inset(0 0 50% 0);
            transform: translateX(-2px);
          }
          50% {
            clip-path: inset(50% 0 0 0);
            transform: translateX(2px);
          }
          75% {
            clip-path: inset(0 0 0 50%);
            transform: translateX(-2px);
          }
        }

        @keyframes glitch-2 {
          0%, 100% {
            clip-path: inset(0);
            transform: translateX(-2px);
          }
          25% {
            clip-path: inset(50% 0 0 0);
            transform: translateX(2px);
          }
          50% {
            clip-path: inset(0 0 50% 0);
            transform: translateX(-2px);
          }
          75% {
            clip-path: inset(0 0 0 50%);
            transform: translateX(2px);
          }
        }

        .animate-glitch {
          animation: glitch 2s infinite;
        }

        .animate-glitch-1 {
          animation: glitch-1 2s infinite;
        }

        .animate-glitch-2 {
          animation: glitch-2 2s infinite;
        }
      `}</style>
    </main>
  );
}
