export function phoneValidator(phone) {
    const re = /^[0-9]{10}$/;
    if (!phone || phone.length <= 0) return "Phone number can't be empty.";
    if (!re.test(phone)) return "Ooops! We need a valid phone number.";
    return '';
  }