class Enum {
  constructor(values) {
    this.values = values;
    for(let value of values ) {
      this[`${value}`.toUpperCase()] = value;
    }
  }
  getValues() {
    return this.values;
  }
}

export const GENDER = new Enum(["MALE", "FEMALE", "OTHERS"]);
