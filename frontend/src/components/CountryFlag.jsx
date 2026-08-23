import React from 'react';

// Country name / Emoji to ISO-2 country code mapping
const COUNTRY_TO_CODE = {
  'uk': 'gb',
  'united kingdom': 'gb',
  'great britain': 'gb',
  'england': 'gb',
  'usa': 'us',
  'united states': 'us',
  'us': 'us',
  'canada': 'ca',
  'australia': 'au',
  'brazil': 'br',
  'austria': 'at',
  'india': 'in',
  'poland': 'pl',
  'thailand': 'th',
  'germany': 'de',
  'france': 'fr',
  'japan': 'jp',
  'china': 'cn',
  'spain': 'es',
  'italy': 'it',
  'netherlands': 'nl',
  'switzerland': 'ch',
  'sweden': 'se',
  'norway': 'no',
  'denmark': 'dk',
  'finland': 'fi',
  'ireland': 'ie',
  'mexico': 'mx',
  'argentina': 'ar',
  'colombia': 'co',
  'south korea': 'kr',
  'korea': 'kr',
  'singapore': 'sg',
  'united arab emirates': 'ae',
  'uae': 'ae',
  'saudi arabia': 'sa',
  'south africa': 'za',
  'new zealand': 'nz',
  'philippines': 'ph',
  'vietnam': 'vn',
  'indonesia': 'id',
  'malaysia': 'my',
  'turkey': 'tr',
  'greece': 'gr',
  'portugal': 'pt',
  'belgium': 'be',
  'ukraine': 'ua',
  'czech republic': 'cz',
  'hungary': 'hu',
  'romania': 'ro'
};

// Convert emoji flag string (e.g. 🇺🇸 or 🇬🇧) to 2-letter ISO country code
const emojiToCountryCode = (flagEmoji) => {
  if (!flagEmoji || typeof flagEmoji !== 'string') return null;
  const chars = [...flagEmoji];
  if (chars.length === 2) {
    const code = chars.map(c => String.fromCharCode(c.codePointAt(0) - 127397)).join('').toLowerCase();
    if (/^[a-z]{2}$/.test(code)) return code;
  }
  return null;
};

export const CountryFlag = ({ country, flag, code, className = "w-4 h-3 inline-block rounded-xs shadow-xs object-cover flex-shrink-0" }) => {
  let countryCode = null;

  if (code && typeof code === 'string') {
    countryCode = code.toLowerCase().trim();
  }

  if (!countryCode && flag) {
    countryCode = emojiToCountryCode(flag);
  }

  if (!countryCode && country && typeof country === 'string') {
    const cleanCountry = country.trim().toLowerCase();
    countryCode = COUNTRY_TO_CODE[cleanCountry] || (cleanCountry.length === 2 ? cleanCountry : null);
  }

  if (!countryCode) {
    countryCode = 'us';
  }

  return (
    <img
      src={`https://flagcdn.com/w40/${countryCode}.png`}
      srcSet={`https://flagcdn.com/w80/${countryCode}.png 2x`}
      alt={country || countryCode.toUpperCase()}
      title={country || countryCode.toUpperCase()}
      className={className}
      loading="lazy"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = 'https://flagcdn.com/w40/us.png';
      }}
    />
  );
};

export default CountryFlag;
