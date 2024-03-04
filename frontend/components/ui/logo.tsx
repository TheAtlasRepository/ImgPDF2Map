const Logo = () => {
  let logoText = 'Image'; // Default text

  // Array of domains that will make the logo show "PDF"
  const pdfDomains = ['https://url1.com', 'https://url2.com'];

  // If the current origin is in the array, change the text
  if (typeof window !== 'undefined' && pdfDomains.includes(window.location.origin)) {
    logoText = 'PDF';
  }

  return (
    <div className={`flex justify-center items-center text-l text-white`}>
      <span><b>{logoText}</b> To Map</span>
    </div>
  );
};

export default Logo;