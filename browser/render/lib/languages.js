const languages = [
  { name: "English", code: "en" },
  { name: "Tiếng Việt", code: "vi" },
  // thanks @zbahadir for Turkish translation
  { name: "Turkish", code: "tr" },
  // thanks nickyg.pf for Italian translation
  { name: "Italian", code: "it" }
];

module.exports = {
  getLanguageCodes() {
    return languages.reduce(function(codes, lang) {
      codes.push(lang.code);
      return codes;
    }, []);
  },
  getLanguages() {
    return languages;
  }
};
