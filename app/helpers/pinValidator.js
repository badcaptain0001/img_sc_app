export function pinValidator(pin) {
    const re = /^[0-9]{4}$/;
    if (!pin || pin.length <= 0) return "PIN can't be empty.";
    if (!re.test(pin)) return "PIN must be 4 digits.";
    return '';
  }