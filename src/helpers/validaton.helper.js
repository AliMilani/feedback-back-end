// fastest-validator email patterns
const EMAIL_PRECISE_PATTERN =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const EMAIL_BASIC_PATTERN = /^\S+@\S+\.\S+$/;

module.exports = {
    EMAIL_PRECISE_PATTERN,
    EMAIL_BASIC_PATTERN,
};
