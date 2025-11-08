export const creditsToAED = (credits) => {
  if (!credits || credits === 'unknown' || credits === 'n/a') {
    return '—';
  }

  const numericCredits = typeof credits === 'string'
    ? parseFloat(credits.replace(/,/g, ''))
    : credits;

  if (isNaN(numericCredits)) {
    return '—';
  }

  const aed = numericCredits / 10000;
  return aed;
};

export const formatAED = (aed) => {
  if (aed === '—' || typeof aed !== 'number') {
    return '—';
  }
  return `${aed.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED`;
};
