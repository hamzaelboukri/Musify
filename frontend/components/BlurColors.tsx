'use client';

/**
 * Ambient blur color orbs and gradient lines for Musify.
 * Creates a soft, immersive background with teal, purple, and pink blurs.
 */
export function BlurColors() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Base dark with subtle gradient so blur glows through */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #0d0d0d 0%, #121212 40%, #0f0f0f 100%)',
        }}
      />

      {/* Large blur orbs - teal, purple, pink */}
      <div
        className="absolute -top-40 -right-40 w-[550px] h-[550px] rounded-full opacity-35 blur-[130px]"
        style={{ background: 'radial-gradient(circle, #06b6d4 0%, #06b6d440 40%, transparent 70%)' }}
      />
      <div
        className="absolute top-1/3 -left-40 w-[450px] h-[450px] rounded-full opacity-30 blur-[110px]"
        style={{ background: 'radial-gradient(circle, #8b5cf6 0%, #8b5cf640 40%, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] rounded-full opacity-25 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #ec4899 0%, #ec489940 40%, transparent 70%)' }}
      />
      <div
        className="absolute top-2/3 left-1/4 w-[380px] h-[380px] rounded-full opacity-20 blur-[100px]"
        style={{ background: 'radial-gradient(circle, #22d3ee 0%, transparent 70%)' }}
      />

      {/* Gradient lines / color streaks */}
      <div
        className="absolute top-0 left-0 w-full h-80 opacity-25"
        style={{
          background: 'linear-gradient(180deg, rgba(6,182,212,0.5) 0%, rgba(139,92,246,0.2) 40%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-72 opacity-20"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(139,92,246,0.6) 60%, rgba(236,72,153,0.4) 100%)',
          filter: 'blur(70px)',
        }}
      />
      <div
        className="absolute top-1/2 -left-20 w-96 h-48 opacity-18"
        style={{
          background: 'linear-gradient(90deg, rgba(139,92,246,0.5) 0%, rgba(6,182,212,0.2) 60%, transparent 100%)',
          filter: 'blur(55px)',
        }}
      />
    </div>
  );
}
