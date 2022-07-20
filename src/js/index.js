document.addEventListener("DOMContentLoaded", () => {
  let btn = document.querySelector(".passform__generate"),
    passInput = document.querySelector(".passform__input"),
    range = document.querySelector(".passform__input__range"),
    checksWrap = document.querySelector(".passform__chboxes__wrapper"),
    lettersCheck = document.querySelector(".passform__input__includeLetters"),
    upperCheck = document.querySelector(".passform__input__includeUpperCase"),
    specialCheck = document.querySelector(
      ".passform__input__includeSpecialSym"
    ),
    copyBtn = document.querySelector(".passform__copy"),
    lengthInput = document.querySelector(".passform__length");

  function generatePassword() {
    let password,
      length = range.value,
      includeLetters = lettersCheck.checked,
      isUpperCase = upperCheck.checked,
      isSpecialSym = specialCheck.checked,
      checks = [
        {
          check: isSpecialSym,
          func: passWithSpecials,
        },
        {
          check: isUpperCase,
          func: passWithUpperLettrsAndNums,
        },
        {
          check: includeLetters,
          func: passWithLettersAndNums,
        },
      ];
    for (let el of checks) {
      if (el.check) {
        el.func();
        break;
      } else passWithNums();
    }
    function passWithUpperLettrsAndNums() {
      password = self.crypto
        .getRandomValues(new BigUint64Array(4))
        .reduce(
          (prev, curr, index) =>
            (!index ? prev : prev.toString(36)) +
            (index % 2 ? curr.toString(36).toUpperCase() : curr.toString(36))
        )
        .split("")
        .sort(
          () =>
            window.crypto.getRandomValues(new Uint8Array(1))[0] / 2 -
            window.crypto.getRandomValues(new Uint8Array(1))[0]
        )
        .join("");
    }
    function passWithLettersAndNums() {
      if (includeLetters && !isUpperCase) {
        password = self.crypto
          .getRandomValues(new BigUint64Array(2))
          .reduce(
            (prev, curr, index) =>
              (!index ? prev : prev.toString(36)) +
              (index % 2 && curr.toString(36))
          );
      }
    }
    function passWithNums() {
      if (!includeLetters && !isUpperCase) {
        password = self.crypto
          .getRandomValues(new BigUint64Array(2))
          .reduce((prev, cur) => prev.toString(10) + cur.toString(10));
      }
    }
    function passWithSpecials() {
      let specials = "~`!@#$%^&*()_-+={[}]|:;\"'<,>.?/";
      password =
        self.crypto
          .getRandomValues(new BigUint64Array(4))
          .reduce(
            (prev, curr, index) =>
              (!index ? prev : prev.toString(36)) +
              (index % 2 ? curr.toString(36).toUpperCase() : curr.toString(36))
          ) + specials;
      password = password
        .split("")
        .sort(
          () =>
            self.crypto.getRandomValues(new Uint8Array(1))[0] -
            self.crypto.getRandomValues(new Uint8Array(1))[0]
        )
        .join("");
      console.log(password);
    }

    passInput.value = password.substring(0, length);
  }
  lengthInput.value = range.value;
  btn.addEventListener("click", generatePassword);
  lettersCheck.addEventListener("click", (e) => {
    e.stopPropagation();
    e.target.checked
      ? upperCheck.removeAttribute("disabled")
      : upperCheck.setAttribute("disabled", "");
    upperCheck.checked = false;
  });
  specialCheck.addEventListener("click", (e) => {
    if (e.currentTarget.checked) {
      lettersCheck.checked = true;
      upperCheck.checked = true;
      upperCheck.removeAttribute("disabled");
    }
  });
  checksWrap.addEventListener("click", (e) => {
    let chbox;
    if (e.target.classList.contains("passform__chboxes__container")) {
      chbox = e.target.querySelector("input[type=checkbox]");
    } else if (e.target.closest(".passform__chboxes__container")) {
      chbox = e.target.parentElement.querySelector("input[type=checkbox]");
    }
    chbox.checked ? (chbox.checked = false) : (chbox.checked = true);
    if (lettersCheck.checked || specialCheck.checked) {
      upperCheck.removeAttribute("disabled");
    } else {
      upperCheck.setAttribute("disabled", "");
      upperCheck.checked = false;
    }
    if (specialCheck.checked) {
      checksWrap
        .querySelectorAll("[type=checkbox]")
        .forEach((el) => (el.checked = true));
    }
  });
  copyBtn.addEventListener("click", () => {
    passInput.select();
    passInput.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    navigator.clipboard.writeText(passInput.value);
    passInput.select();
    passInput.setSelectionRange(0, 0);
  });
  range.addEventListener("change", () => (lengthInput.value = range.value));
  lengthInput.addEventListener(
    "input",
    () => (range.value = lengthInput.value)
  );
});
