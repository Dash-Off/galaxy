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
export const DASHOFFTYPE = new Enum(["SELF", "CHALLENGE"])
export const LEVEL = new Enum(["BASIC", "CHARBUILD", "TARGET", "GENRE"])
export const EXTRA_TYPE = new Enum(["CHALLENGE_IMAGE"])
export const CORRECTION_TYPE = new Enum(["SENTI", "READ", "GRAMMAR"])
export const CORRECTION_SUB_TYPE = new Enum(["INS", "UPDATE"])
export const DASHOFF_STATUS = new Enum(["ACTIVE", "COMPLETED", "EVALUATED", "EXPIRED"])
