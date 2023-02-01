const form = document.forms.mainForm;
const resultArea = document.querySelector("#result");
const copyIcon = document.querySelector("#copy");
const tooltip = document.querySelector("#tooltip");

// calculates the Lohn digit, see https://en.wikipedia.org/wiki/Luhn_algorithm
function calculateCheckDigit(digitsAsString) {
  //const digits = ('' + dob + gender + sequence + citizenship + eight).split('').map(d => Number(d))
  const digits = digitsAsString
    .replace(/\D/g, "")
    .split("")
    .map((d) => Number(d));
  const checkSum = digits
    .reverse()
    .map((d, ix) => {
      if (ix % 2 === 0) {
        d *= 2;
        if (d > 9) {
          d -= 9;
        }
      }
      return d;
    })
    .reduce((memo, d) => (memo += d), 0);
  return (checkSum * 9) % 10;
}

// show a valid ID number generated using the values in the form
function showIdNumber() {
  const values = [
    { value: form.year.value.substring(2, 4) },
    form.month,
    form.day,
    form.gender,
    { value: form.sequence.value || "896" /* sequence */ },
    { value: form.cship.value || "0" /* citizenship */ },
    { value: "8" /* a */ },
  ];

  withoutCheckDigit = values.map((e) => e.value).join("");
  const idNumber = withoutCheckDigit + calculateCheckDigit(withoutCheckDigit);

  resultArea.innerHTML = `${idNumber}`;
  copyIcon.classList.remove("hidden");
  copyIcon.classList.add("block");
}

// Generates a random integer between a min and a max
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
}

function generateRandomIdNumber() {
  const values = [
    { value: getRndInteger(50, 99) /* year */ },
    { value: ("00" + getRndInteger(1, 12)).slice(-2) /* month */ },
    { value: ("00" + getRndInteger(1, 31)).slice(-2) /* day */ },
    { value: getRndInteger(4, 5) /* gender */ },
    { value: ("000" + getRndInteger(0, 999)).slice(-3) /* sequence */ },
    { value: getRndInteger(0, 1) /* citizenship */ },
    { value: "8" /* a */ },
  ];

  withoutCheckDigit = values.map((e) => e.value).join("");
  const idNumber = withoutCheckDigit + calculateCheckDigit(withoutCheckDigit);

  resultArea.innerHTML = `${idNumber}`;
  copyIcon.classList.remove("hidden");
  copyIcon.classList.add("block");
}

// add 'option' elements to the 'select' elements (for year, month, day)
function addOptions(id, from, to, toLabel, toValue, defaultValue) {
  const selectElement = document.getElementById(id);
  const values = [];
  for (let i = 0; i <= to - from; i++) values[i] = i + from;
  const options = values
    .map((v) => (v < 10 ? "0" : "") + v)
    .map((v) => {
      const value = toValue ? toValue(v) : v;
      const isDefault = defaultValue && defaultValue === value;
      const label = toLabel ? toLabel(v) : v;
      return `<option value=${value} ${
        isDefault ? 'selected="selected"' : ""
      }>${label}</option>`;
    });

  selectElement.innerHTML = options.join();
}

const year = new Date().getUTCFullYear();
const optionYear = year - 18;

const pad = function (n) {
  const str = "" + n;
  const pad = "000";
  return pad.substring(0, pad.length - str.length) + str;
};

addOptions(
  "year",
  1950,
  optionYear,
  (v) => `${v} (${year - Number(v)} years old)`
);
addOptions("month", 1, 12);
addOptions("day", 1, 31);
addOptions("sequence", 0, 999, (v) => pad(v), pad, "800");

function copyToClipboard() {
  // Copy the text
  navigator.clipboard.writeText(resultArea.innerHTML);
  tooltip.innerHTML = "Copied to clipboard!";
  setTimeout(() => {
    tooltip.innerHTML = "Click to copy";
  }, 3000);
}

// Popper
const popperInstance = Popper.createPopper(copyIcon, tooltip, {
  placement: "top",
});

function show() {
  tooltip.setAttribute("data-show", "");

  // We need to tell Popper to update the tooltip position
  // after we show the tooltip, otherwise it will be incorrect
  popperInstance.update();
}

function hide() {
  tooltip.removeAttribute("data-show");
}

const showEvents = ["mouseenter", "focus"];
const hideEvents = ["mouseleave", "blur"];

showEvents.forEach((event) => {
  copyIcon.addEventListener(event, show);
});

hideEvents.forEach((event) => {
  copy.addEventListener(event, hide);
});
