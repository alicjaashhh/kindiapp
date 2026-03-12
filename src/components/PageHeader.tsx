import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const PageHeader = ({ title, showBack = true }: { title: string; showBack?: boolean }) => {
  const navigate = useNavigate();
  return (
    <div className="px-5 pt-5 pb-3 flex items-center gap-3">
      {showBack && (
        <button onClick={() => navigate(-1)} className="text-foreground">
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      <h1 className="font-bold text-xl text-foreground">{title}</h1>
    </div>
  );
};

export default PageHeader;
