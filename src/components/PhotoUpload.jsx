import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiX, FiImage } from 'react-icons/fi';

export default function PhotoUpload({ onFile }) {
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback((accepted) => {
    const file = accepted[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    onFile(file);
  }, [onFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': [] }, maxFiles: 1, maxSize: 10 * 1024 * 1024,
  });

  const clear = (e) => {
    e.stopPropagation();
    setPreview(null);
    onFile(null);
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={`drop-zone border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-civic-400 bg-civic-500/10 active'
            : 'border-slate-600 hover:border-civic-500/60 hover:bg-civic-500/5'
        }`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Preview" className="w-full h-52 object-cover rounded-2xl" />
            <button
              onClick={clear}
              className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-1.5 transition-colors"
            >
              <FiX size={14} />
            </button>
            <div className="absolute bottom-2 left-2 glass text-xs text-white px-2 py-1 rounded-lg flex items-center gap-1">
              <FiImage size={12} /> Photo attached
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center px-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all ${
              isDragActive ? 'bg-civic-500/30 scale-110' : 'bg-slate-800'
            }`}>
              <FiUploadCloud size={28} className={isDragActive ? 'text-civic-400' : 'text-slate-500'} />
            </div>
            <p className="text-slate-300 font-medium mb-1">
              {isDragActive ? 'Drop it here!' : 'Drag & drop a photo'}
            </p>
            <p className="text-slate-500 text-sm">or <span className="text-civic-400 underline">click to browse</span></p>
            <p className="text-slate-600 text-xs mt-2">PNG, JPG, HEIC up to 10MB</p>
          </div>
        )}
      </div>
    </div>
  );
}
