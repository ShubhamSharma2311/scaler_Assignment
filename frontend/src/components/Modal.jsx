export default function Modal({ isOpen, onClose, children, maxWidth = 'max-w-md' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-zinc-900 rounded-lg ${maxWidth} w-full border border-zinc-800 max-h-[90vh] overflow-y-auto`}>
        {children}
      </div>
    </div>
  );
}
