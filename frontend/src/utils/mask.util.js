const getMask = (fieldType) => {
  switch(fieldType) {
    // case "cardNumber": return "0000-0000-0000-0000"; break;
    case "expiryMonth": return "00"; break;
    case "expiryYear": return "00"; break;
    case "cardHolderDOB": return "00.00.00"; break;
    case "expiryDate": return "00/00"; break;
    default: return "";
  }
};

const getPlaceholder = (fieldType) => {
  switch(fieldType) {
    case "cardNumber": return "1234-5678-9012-3456"; break;
    case "expiryMonth": return ("0" + (new Date().getMonth() + 1)).slice(-2); break;
    case "expiryYear": return new Date().getFullYear().toString().substr(-2); break;
    case "expiryDate": return ("0" + (new Date().getMonth() + 1)).slice(-2) + '/' + new Date().getFullYear().toString().slice(-2); break;
    case "cardHolderDOB": return "01.01.20"; break;
    case "wallet": return "0x89a23413ef2672efevc269365438f0aedfe225eu" ; break;
    case "email": return "example@gmail.com" ; break;
    case "cardHolder": return "John Doe" ; break;
    case "cardHolderCountry": return "UA" ; break;
    case "cardHolderCity": return "Kiev" ; break;
    case "contacts": return "+38 (098) 111 1111 / viber / whatsapp / telegram" ; break;
    default: return "";
  }
};

export { getMask, getPlaceholder };