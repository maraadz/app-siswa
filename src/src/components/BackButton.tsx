import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
interface BackButtonProps {
  to?: string;
  label?: string;
}
export default function BackButton({ to, label = 'Kembali' }: BackButtonProps) {
  const navigate = useNavigate();
  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };
  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 text-gray-700 hover:text-[#979DA5] transition-colors mb-4">

      <ArrowLeftIcon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>);

}