// *********************************************
//           SHOW FORM BY CONDITION
// *********************************************
function showActiveForm(stepCount) {
  // remove active_section class from everywhere
  document.querySelector(".active_section").classList.remove("active_section");

  // set active_section class
  document
    .querySelector(`.${formList[stepCount]}`)
    ?.classList.add("active_section");

  // Conditionally Hide Back Btn
  stepCount <= 0
    ? backBtn.classList.add("hide")
    : backBtn.classList.remove("hide");
}

// *********************************************
//              ERROR HANDLING
// *********************************************
// Error Message if value user makes any mistake
function eligibilityErrorMessage(data, selector) {
  const errorDiv = document.querySelector(selector);

  if (!data) {
    errorDiv?.classList.add("error");
  } else {
    errorDiv?.classList.remove("error");
  }
}

// Show error Message if value user makes any mistake
function inputErrorMessage(selector, msg) {
  const hasErrorField =
    selector?.parentElement?.querySelector(".field_message");

  if (!hasErrorField) {
    // create error message field
    const div = document.createElement("div");
    div.className = "field_message error";
    div.innerHTML = msg;
    selector?.parentElement.appendChild(div);
  } else {
    hasErrorField?.classList.add("error");
    hasErrorField.innerHTML = msg;
  }
}

// Check is input value is correct
function isValueEmpty(selector) {
  if (!selector?.value) {
    inputErrorMessage(selector, "This field is required");
    return false;
  } else {
    return true;
  }
}

// Input Number Only
document.querySelectorAll(".field__input.numberOnly")?.forEach((input) => {
  input.addEventListener("input", (e) => {
    e.target.value = e.target?.value.replace(/[^0-9]/g, "");
  });
});

// Alphabetic only
function alphabeticOnly(selector) {
  const letterRegEx = /^[A-Za-z]+$/;
  if (letterRegEx.test(selector?.value)) {
    return true;
  } else {
    inputErrorMessage(selector, "Please enter alphabetic characters only");
    return false;
  }
}

// Minimum value need
function minValue(selector, minValue = 5, msg) {
  if (selector?.value.length != minValue) {
    inputErrorMessage(selector, msg);
    return false;
  } else {
    return true;
  }
}

// Email validation
function emailValidation(selector) {
  const regEx =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (regEx.test(selector?.value)) {
    return true;
  } else {
    inputErrorMessage(selector, "Please enter a valid email address");
    return false;
  }
}

// Phone Number validation
function phoneValidation(selector) {
  const regEx = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  if (regEx.test(selector?.value)) {
    return true;
  } else {
    inputErrorMessage(selector, "Please enter a valid phone number");
    return false;
  }
}

// Phone Number Pattern
document
  .getElementById("policyHolderPhoneNumber")
  .addEventListener("input", (e) => {
    var x = e.target.value
      .replace(/\D/g, "")
      .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    e.target.value = !x[2]
      ? x[1]
      : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : "");
  });

// Date Validation

// *********************************************
//              FORM VALIDATION
// *********************************************
// ********** Eligibility Validation ***********
function eligibilityValidation() {
  const eligibilityStatus = document.querySelector(
    'input[name="eligibilityStatus"]:checked'
  )?.value;

  // Select Formlist as user eligibilityStatus
  if (Boolean(eligibilityStatus)) {
    if (eligibilityStatus === "military") {
      formList = ["radio_select", "military_information", ...multiStepForm];
    } else if (eligibilityStatus === "child") {
      formList = ["radio_select", "parent_information", ...multiStepForm];
    } else if (eligibilityStatus === "parent") {
      formList = ["radio_select", "child_information", ...multiStepForm];
    } else {
      formList = defaultForms;
    }
    maxStep = formList.length - 1;

    // set eligibilityStatus to formData
    formData.eligibilityStatus = eligibilityStatus;
  }

  // Error Message if value = null
  eligibilityErrorMessage(
    formData.eligibilityStatus,
    ".radio__form_section .field_message"
  );
  return eligibilityStatus;
}

function validateForm(formClassName) {
  const allFields = document.querySelectorAll(formClassName + " .field__input");

  const classAndValidator = [
    { class: "email", validator: emailValidation },
    { class: "phone", validator: phoneValidation },
    { class: "alphabeticOnly", validator: alphabeticOnly },
    { class: "required", validator: isValueEmpty },
  ];

  const checkValidation = [];

  allFields.forEach((field) => {
    classAndValidator.forEach((checker) => {
      if (field.classList.contains(checker.class)) {
        checkValidation.push(checker.validator(field));
      }

      if (field.classList.contains("zip")) {
        minValue(field, 5, "Please enter a valid Zip code");
      }
    });
  });

  const isValidate = checkValidation.every((result) => result === true);

  if (isValidate) {
    allFields.forEach((field) => {
      formData[field?.id] = field.value;
    });
  }

  return isValidate;
}

// *********************************************
//            COMMON FUNCTIONALITIES
// *********************************************
// if currentInsuranceCompany = "Other" then Insurance Company field will show
const currentInsuranceCompany = document.querySelector(
  "#currentInsuranceCompany"
);

currentInsuranceCompany?.addEventListener("change", () => {
  if (currentInsuranceCompany?.value === "Other") {
    document
      .querySelector(".multi__step_4 .insuranceCompany")
      ?.classList.remove("conditionally_hidden_field");
  } else {
    document
      .querySelector(".multi__step_4 .insuranceCompany")
      ?.classList.add("conditionally_hidden_field");
  }
});

// KeyPress only remove field Error Message
document.querySelectorAll(".form_container .field")?.forEach((fieldWrapper) => {
  const removeFieldError = () => {
    const errorField = fieldWrapper?.querySelector(".field_message");
    errorField?.classList.remove("error");
  };

  fieldWrapper
    ?.querySelectorAll(".field__input")
    .forEach((inputField) =>
      inputField?.addEventListener("input", removeFieldError)
    );
});

// Press Enter Submit Form
document.querySelectorAll(".field__input")?.forEach((input) => {
  input.addEventListener("keypress", (event) => {
    if (event?.key === "Enter") {
      event.preventDefault();

      // Trigger the button element with a click
      document.getElementById("next_btn").click();
    }
  });
});

// STEP 4 Form Functionality
// Military Rank should be disabled if branchOfService value none
const branchOfService = document.getElementById("branchOfService");
branchOfService.addEventListener("change", () => {
  const militaryRank = document.getElementById("militaryRank");
  if (Boolean(branchOfService?.value)) {
    militaryRank.disabled = false;
  } else {
    militaryRank.disabled = true;
  }
});
