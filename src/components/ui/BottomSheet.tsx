import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-zinc-900 border-t border-zinc-800 rounded-t-3xl z-[101] flex flex-col max-h-[90vh] pb-safe shadow-[0_-10px_40px_rgba(0,255,204,0.1)]"
          >
            <div className="p-4 flex justify-between items-center shrink-0 border-b border-zinc-800/50">
              <h3 className="font-black text-lg text-white">{title}</h3>
              <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full text-white hover:bg-zinc-700 transition-colors">
                <X className="w-5 h-5"/>
              </button>
            </div>
            <div className="p-5 overflow-y-auto w-full scrollbar-hide">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
