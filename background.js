// Background script = background.js
// Handles messages sent from content.js and output the audio
// By: Sean Miller
// 2018-06-09

/**************************************************************************/

class SwahiliParser {
  /**
   * Verifies that a char is not a vowel
   * @param {string} letter A swahili letter
   * @return {boolean} A boolean of whether the char is not a variable
   */
  static isNotVowel(letter) {
    const vowels = ["a", "e", "i", "o", "u"];
    return !vowels.includes(letter);
  }

  /**
   * Parses a Swahili word into an array of its syllables
   * @param {string} word A swahili word
   * @return {Array<string>} An array of the syllables of the original word
   */
  static parseWordIntoSyllables(word) {
    const syllablesOfWord = [];
    let currentSyllable = "";
    let vowelIndex = 0;

    // make sure that the string is only in lower case
    word = word.toLowerCase();

    // check for the special n or m at the beginning of the word, which can get
    // its own syllable
    if (
      word.charAt(0) === "n" &&
      word.charAt(1) !== "" &&
      this.isNotVowel(word.charAt(1)) &&
      word.charAt(1) !== "g"
    ) {
      syllablesOfWord.push("n");
      word = word.slice(1);
    } else if (word.charAt(0) === "m" && this.isNotVowel(word.charAt(1))) {
      syllablesOfWord.push("m");
      word = word.slice(1);
    }

    while (word !== "") {
      // reset the vowel index to the beginning of the words
      vowelIndex = 0;

      // the vast majority of syllables in Swahili are open syllables
      // (i.e. end in a vowel), so check until a vowel is found
      while (this.isNotVowel(word.charAt(vowelIndex))) {
        vowelIndex++;
        // check if word ends with a consonant
        // in Swahili, this does not happen often if ever
        if (vowelIndex === word.length) {
          // if somehow the last letter is not a vowel,
          // append the word to the syllables
          // since the word will only be one syllable
          syllablesOfWord.push(word);
          return syllablesOfWord;
        }
      }

      // vowel has been found, current syllable is substring from
      // beginning to current vowel UNLESS the next letter is an m,
      // 0R an n that DOES NOT have a g or a y after it
      if (
        word.charAt(vowelIndex + 1) === "n" &&
        word.charAt(vowelIndex + 2) !== "" &&
        word.charAt(vowelIndex + 2) !== "g" &&
        word.charAt(vowelIndex + 2) !== "y" &&
        this.isNotVowel(word.charAt(vowelIndex + 2))
      ) {
        currentSyllable = word.slice(0, vowelIndex + 2);
        word = word.slice(vowelIndex + 2);
      }
      // check for syllable ending in m
      else if (
        word.charAt(vowelIndex + 1) === "m" &&
        word.charAt(vowelIndex + 2) !== "" &&
        this.isNotVowel(word.charAt(vowelIndex + 2))
      ) {
        currentSyllable = word.slice(0, vowelIndex + 2);
        word = word.slice(vowelIndex + 2);
      }
      // check for the one closed syllable case, where an
      // arabic loan word causes an '(C)al' sound
      else if (
        word.charAt(vowelIndex) === "a" &&
        word.charAt(vowelIndex + 1) !== "" &&
        word.charAt(vowelIndex + 1) === "l" &&
        word.charAt(vowelIndex + 2) !== "" &&
        this.isNotVowel(word.charAt(vowelIndex + 2))
      ) {
        currentSyllable = word.slice(0, vowelIndex + 2);
        word = word.slice(vowelIndex + 2);
      }
      // the most general case of a syllable being CCV or CV or
      // even CCCV - in all cases, an open syllable
      else {
        currentSyllable = word.slice(0, vowelIndex + 1);
        // now, cut the word into the string of the rest of the syllables
        word = word.slice(vowelIndex + 1);
      }
      syllablesOfWord.push(currentSyllable);
    }
    return syllablesOfWord;
  }

  /**
   * Indonesian-ifies Swahili syllables so that
   * they can be pronounced properly by the Chrome TTS
   * @param {string} syllables A string of swahili syllables
   * @return {string} A Swahili syllable chain that is altered so that the
   * Indonesian TTS can be tricked into pronouncing it properly
   */
  static indonesianify(syllables) {
    syllables = " " + syllables;
    // 'ng' sound
    syllables = syllables.replace(/ ngw/gi, "ng gu");
    syllables = syllables.replace(/ nga/gi, "ng ga");
    syllables = syllables.replace(/ nge/gi, "ng ge");
    syllables = syllables.replace(/ ngi/gi, "ng gi");
    syllables = syllables.replace(/ ngo/gi, "ng goh");
    syllables = syllables.replace(/ ngu/gi, "ng gu");

    // vowels being pronounced improperly
    syllables = syllables.replace(/o /gi, "oh ");
    syllables = syllables.replace(/e /gi, "eh ");

    // various consonant sounds
    syllables = syllables.replace(/we /gi, "weh ");
    syllables = syllables.replace(/ke /gi, "keh ");
    syllables = syllables.replace(/ki /gi, "kih ");
    syllables = syllables.replace(/ hi/gi, "hih");
    syllables = syllables.replace(/ m /gi, " mh ");
    syllables = syllables.replace(/ n /gi, " nh ");
    syllables = syllables.replace(/ chw/gi, " cw");
    syllables = syllables.replace(/ pw/gi, " pu");
    syllables = syllables.replace(/ ks/gi, " cksi");

    // consonant clusters
    syllables = syllables.replace(/sh/gi, "sj");
    syllables = syllables.replace(/be/gi, "beh");
    syllables = syllables.replace(/swa/gi, "sua");
    syllables = syllables.replace(/mche /gi, "mceh");

    // rare sounds involving onset of 'm'
    syllables = syllables.replace(/mcha/gi, "m cah");
    syllables = syllables.replace(/mcho/gi, "m choh");
    syllables = syllables.replace(/mw/gi, "mu");

    // 'sh' sound fixing
    syllables = syllables.replace(/a sji/gi, "ah syi");
    syllables = syllables.replace(/e sji/gi, "eh syi");
    syllables = syllables.replace(/i sji/gi, "ih syi");
    syllables = syllables.replace(/o sji/gi, "oh syi");
    syllables = syllables.replace(/u sji/gi, "uh syi");
    
    syllables = syllables.replace(/ sja/gi, " sya");
    syllables = syllables.replace(/ sjo/gi, " syo");

    syllables = syllables.replace(/a sje/gi, "ah sye");
    syllables = syllables.replace(/e sje/gi, "eh sye");
    syllables = syllables.replace(/i sje/gi, "ih sye");
    syllables = syllables.replace(/o sje/gi, "oh sye");
    syllables = syllables.replace(/u sje/gi, "uh sye");

    // fixing previous alterations of o sound
    syllables = syllables.replace(/ oh /gi, " o ");

    // rare occurence of m, n at end of word
    syllables = syllables.replace(/a m /gi, "am ");
    syllables = syllables.replace(/a n /gi, "an ");

    // Swahili sounds which have no real equivalent
    // in Indonesian
    syllables = syllables.replace(/ gh/gi, " hr");
    syllables = syllables.replace(/ dh/gi, " th");
    return syllables;
  }

  /**
   * Parses a phrase of swahili words into a long string of
   * its syllables
   * @param {string} sentence A swahili phrase
   * @return {string} A string of the syllables of the phrase seperated by a delimeter
   * (i.e. "ni-na-pen-da__ki-swa-hi-li_")
   */
  static parseSentenceIntoSyllables(sentence) {
    sentence = sentence.toLowerCase();

    let syllablesOfSentence = "";
    const delimeter = " ";
    let syllablesOfWord = [];
    const words = sentence.split(" ");
    syllablesOfSentence += delimeter;

    for (let word of words) {
      syllablesOfWord = this.parseWordIntoSyllables(word);

      syllablesOfWord.forEach(syllable => {
        syllablesOfSentence += syllable;
        syllablesOfSentence += delimeter;
      });

      // push an empty syllable to signify a pause between words
      syllablesOfSentence += delimeter;
    }

    // turn the syllables into their Indonesian equivalent
    syllablesOfSentence = this.indonesianify(syllablesOfSentence);
    return syllablesOfSentence;
  }
}

/************************************************************************/
// Checking to see if the user has Indonesian TTS enabled on their browser.
// If they do not, do not allow any TTS since it will default to English (which is awful)

const timeout = waitInMilSecs =>
  new Promise(resolve => setTimeout(resolve, waitInMilSecs));

  async function loadGetVoices() {
    const voices = speechSynthesis.getVoices();
    speechSynthesis.getVoices();
    await timeout(3000);
  }

  let indonesianIsSupported = false;
  let supportedIndonesianVersion = false;

   loadGetVoices().then(() => {
    voices = speechSynthesis.getVoices();
     for (let voice of voices) {
      if (voice.lang === "id" || voice.lang === "id-ID") {
        indonesianIsSupported = true;
        supportedIndonesianVersion = voice.lang;
      }
    }
  });

/************************************************************************/
// Listen for Swahili text and then output it as a SpeechSynthesis utterance

let oldSentence = "The first sentence of all time!!1!";

// listen for a message sent from content, and then output the desired text
chrome.runtime.onMessage.addListener(function(request) {
  if (
    indonesianIsSupported &&
    (oldSentence === "" || oldSentence !== request.toSay)
  ) {
    oldSentence = request.toSay;

    // if the user scrolls over a new word, cut all
    // audio for the previous word(s)
    if (oldSentence !== "") {
      speechSynthesis.cancel();
    }

    const msg = new SpeechSynthesisUtterance();
    msg.text = SwahiliParser.parseSentenceIntoSyllables(request.toSay);
    msg.lang = supportedIndonesianVersion;
    msg.rate = "0.80";
    speechSynthesis.speak(msg);
  }
});
