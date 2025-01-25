import { PlusCircle, Check } from 'lucide-react';
import { useState } from 'react';

interface PlusIconButtonProps {
  className?: string;
}

const PlusIconButton: React.FC<PlusIconButtonProps> = ({ className = '' }) => {
  const [clicked, setClicked] = useState(false);

  return (
    <div
      role="button"
      className={`cursor-pointer ${className}`}
      onClick={() => setClicked(!clicked)}
    >
      {clicked ? (
        <Check className="transition-all duration-300 ease-in-out text-green-500" />
      ) : (
        <PlusCircle className="transition-all duration-300 ease-in-out hover:scale-125" />
      )}
    </div>
  );
};

export default PlusIconButton;
