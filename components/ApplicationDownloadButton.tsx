import { FiDownload } from 'react-icons/fi';

interface ApplicationDownloadButtonProps {
  className?: string;
}

export default function ApplicationDownloadButton({
  className = '',
}: ApplicationDownloadButtonProps) {
  return (
    <a
      href="/application.pdf"
      download="High-Noon-Sponsorship-Request.pdf"
      className={`inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-semibold py-3 px-6 transition-colors ${className}`}
    >
      <FiDownload className="text-lg" />
      Download Form
    </a>
  );
}
