const formData = {};

let formList = ["radio_select"];
// *********************************************
//           SHOW FORM BY CONDITION
// *********************************************
function showActiveForm(step, backBtn) {
  console.log({ step });
  console.log(formData);

  // remove active_section class from everywhere
  document.querySelector(".active_section")?.classList.remove("active_section");

  // set active_section class
  document.querySelector(`.${formList[step]}`)?.classList.add("active_section");

  // Conditionally Hide Back Btn
  step <= 0 ? backBtn.classList.add("hide") : backBtn?.classList.remove("hide");
}

// *********************************************
//    VALIDATION & ERROR HANDLING LIBRARY
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

// Input Alphabet Only
document.querySelectorAll(".field__input.alphabeticOnly")?.forEach((input) => {
  input.addEventListener("input", (e) => {
    e.target.value = e.target?.value.replace(/[^a-zA-z]/g, "");
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
function phoneNumberPattern(selector) {
  if (!selector) {
    selector = document.getElementById("policyHolderPhoneNumber");
  }

  selector?.addEventListener("input", (e) => {
    var x = e.target.value
      .replace(/\D/g, "")
      .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    e.target.value = !x[2]
      ? x[1]
      : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : "");
  });
}
phoneNumberPattern();

// Social Security Number Pattern
document.querySelectorAll(".SSN").forEach((field) => {
  field.addEventListener("input", (e) => {
    var x = e.target.value
      .replace(/\D/g, "")
      .match(/(\d{0,3})(\d{0,2})(\d{0,4})/);
    e.target.value = !x[2]
      ? x[1]
      : x[1] + "-" + x[2] + (x[3] ? "-" + x[3] : "");
  });
});

// Dollar Field Pattern
const dollarField = document.querySelector(".field__input.dollar_field");

dollarField?.addEventListener("input", (e) => {
  if (e.target.value) {
    let modifiedValue = e.target.value.match(/.{1,3}/g).join(",");
    e.target.value = `$${modifiedValue}`;
  }
});

// Date Validation
const thisYear = new Date().getFullYear();
function dateValidation(field, getMaxYear = thisYear) {
  field?.addEventListener("input", (e) => {
    let value = e.target.value
      .replace(/\D/g, "")
      .match(/(\d{0,2})(\d{0,2})(\d{0,4})/);

    let [fullData, MM, DD, YYYY] = value;

    // Month Validation
    if (MM.length === 1 && Number(MM) > 1) value[1] = 0 + MM[0];
    else if (MM.length === 2 && Number(MM) <= 0) value[1] = MM[0];
    else if (MM.length === 2 && Number(MM) > 12) value[1] = MM[0];

    // Date Validation
    if (DD.length === 1 && Number(DD) > 3) value[2] = 0 + DD[0];
    else if (DD.length === 2 && Number(DD) <= 0) value[2] = DD[0];
    else if (DD.length === 2 && Number(DD) > 31) value[2] = DD[0];
    else if (DD.length === 2 && Number(MM) == 2 && Number(DD) > 29)
      value[2] = DD[0];
    else if ([4, 6, 9, 11].includes(Number(MM)) && Number(DD) > 30)
      value[2] = DD[0];

    // Year validation
    const maxYear = String(getMaxYear);
    // const maxYear = String(new Date().getFullYear() + 2);

    if (Number(YYYY) <= 0) value[3] = "";
    else if (YYYY.length === 1 && Number(YYYY) > 2) value[3] = "";
    else if (YYYY.length === 2 && Number(YYYY) > 20) value[3] = YYYY[0];
    else if (YYYY.length === 2 && Number(YYYY) < 19) value[3] = YYYY[0];
    else if (YYYY.length === 3 && Number(YYYY) > Number(maxYear.slice(0, 3)))
      value[3] = YYYY.slice(0, 2);
    else if (YYYY.length === 4 && Number(YYYY) > Number(maxYear))
      value[3] = YYYY.slice(0, 3);

    // Result
    e.target.value = !value[2]
      ? value[1]
      : value[1] + "/" + value[2] + (value[3] ? "/" + value[3] : "");
  });
}
document.querySelectorAll(".DOB").forEach((el) => dateValidation(el));

// *********************************************
//             Eligibility Validation
// *********************************************
function eligibilityValidation(forms = []) {
  const eligibilityStatus = document.querySelector(
    'input[name="eligibilityStatus"]:checked'
  )?.value;

  // Select Formlist as user eligibilityStatus
  if (Boolean(eligibilityStatus)) {
    if (eligibilityStatus === "military") {
      formList = ["radio_select", "military_information", ...forms];
    } else if (eligibilityStatus === "child") {
      formList = ["radio_select", "parent_information", ...forms];
    } else if (eligibilityStatus === "parent") {
      formList = ["radio_select", "child_information", ...forms];
    } else {
      formList = ["radio_select", ...forms];
    }
    // maxStep = formList.length - 1;

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

// *********************************************
//              FORM VALIDATION
// *********************************************
function validateForm(formClassName) {
  const allFields = document.querySelectorAll(
    `.${formClassName} .field__input`
  );

  const dateValidator = (field) =>
    minValue(field, 10, "Please enter a valid date");

  const zipValidator = (field) =>
    minValue(field, 5, "Please enter a valid Zip code");

  const classAndValidator = [
    {
      class: "date",
      validator: dateValidator,
    },
    { class: "zip", validator: zipValidator },
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
    });
  });

  const isValidate = checkValidation.every((result) => result === true);

  if (isValidate) {
    allFields.forEach((field) => {
      formData[field?.name] = field.value;
    });
  }

  return isValidate;
}

// MILITARY INFO FROM VALIDATION
function militaryValidation() {
  const isValidate = validateForm("military_information");

  // Set Name in Multi-step form field
  const fnameValue = document.querySelector("#militaryFirstName").name;
  const lnameValue = document.querySelector("#militaryLastName").name;

  document.querySelector("#policyHolderFirstName").value = formData[fnameValue];
  document.querySelector("#policyHolderLastName").value = formData[lnameValue];
  debugger;
  return isValidate;
}

// POLICY HOLDER FORM VALIDATION
function policyholderValidation(step) {
  const isValidate = validateForm("policyholder_form");

  if (isValidate) {
    // SHOW SPOUSE INFORMATION FORM, IF HAVE
    const spouseValues = [
      "Married",
      "Cohabitant",
      "Civil Union Or Domestic Partner",
    ];

    if (spouseValues.includes(formData.policyHolderMaritalStatus)) {
      if (!formList.includes("spouse_information")) {
        formList.splice(step + 1, 0, "spouse_information");
      }
    }
    if (!spouseValues.includes(formData.policyHolderMaritalStatus)) {
      formList = formList.filter((form) => form != "spouse_information");

      const spouseField = document.querySelectorAll(
        ".spouse_information .field__input"
      );

      spouseField.forEach((field) => {
        delete formData[field.name];
      });
    }
  }

  debugger;
  return isValidate;
}
// *********************************************
//            COMMON FUNCTIONALITIES
// *********************************************
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

function militaryFormFunc() {
  // Military Rank should be disabled if branchOfService value none
  const branchOfService = document.getElementById("branchOfService");

  if (branchOfService) {
    branchOfService.addEventListener("change", () => {
      const militaryRank = document.getElementById("militaryRank");
      if (Boolean(branchOfService?.value)) {
        militaryRank.disabled = false;
      } else {
        militaryRank.disabled = true;
      }
    });
  }
}

// *********************************************
//            COMMON STEP 4 FUNCTIONALITIES
// *********************************************
function coverageHistoryFunc() {
  // if currentInsuranceCompany = "Other" then Insurance Company field will show
  const currentInsuranceCompany = document.querySelector(
    "#currentInsuranceCompany"
  );

  currentInsuranceCompany?.addEventListener("change", () => {
    const insuranceCompany = document.getElementById("insuranceCompany");
    const insComWrapper = document.querySelector(
      ".multi__step_4 .insuranceCompany"
    );

    if (currentInsuranceCompany?.value === "Other") {
      insComWrapper?.classList.remove("conditionally_hidden_field");
      insuranceCompany?.classList.add("required");
    } else {
      insComWrapper?.classList.add("conditionally_hidden_field");
      insuranceCompany?.classList.remove("required");
    }
  });

  // STEP 4 - Policy Renewal Data Validation
  const policyRenewalDate = document.querySelector("#policyRenewalDate");
  if (policyRenewalDate) dateValidation(policyRenewalDate, thisYear + 2);
}
