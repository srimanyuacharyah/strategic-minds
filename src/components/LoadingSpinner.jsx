export default function LoadingSpinner({ text = 'Processing...', size = 'md' }) {
  const s = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-16 h-16' : 'w-10 h-10';
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div className={`${s} relative`}>
        <div className={`${s} rounded-full border-2 border-slate-700`} />
        <div className={`${s} rounded-full border-2 border-transparent border-t-civic-500 border-r-sky-400 absolute top-0 left-0 animate-spin`} />
      </div>
      {text && <p className="text-slate-400 text-sm animate-pulse">{text}</p>}
    </div>
  );
}
