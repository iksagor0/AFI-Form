// DATA
const formData = {
  eligibilityStatus: "",
};

// const successRedirection = "https://afi.org/";
const successRedirection = "../--Model/thank-you.html";

// Forms
const multiStepForm = [
  "multi__step_1",
  "multi__step_2",
  "multi__step_3",
  "multi__step_4",
];
const defaultForms = ["radio_select", ...multiStepForm];
let formList = defaultForms;

// *********************************************
//       FORM SUBMISSION AND STEP HANDLING
// *********************************************
const nextBtn = document.querySelector("#next_btn");
const backBtn = document.querySelector("#back_btn");

let stepCount = 0;
let maxStep = formList.length - 1;

// ***** NEXT FUNCTIONALITY *****
nextBtn.addEventListener("click", () => {
  const isSelectEligibility = eligibilityValidation();

  if (stepCount === 0) {
    if (!Boolean(isSelectEligibility)) return false;
  }

  //   If additional form has in arrayList
  if (stepCount === formList.indexOf("military_information")) {
    if (!militaryFormValidation()) return false;
  }

  if (stepCount === formList.indexOf("parent_information")) {
    if (!parentFormValidation()) return false;
  }

  if (stepCount === formList.indexOf("child_information")) {
    if (!childFormValidation()) return false;
  }

  if (stepCount === formList.indexOf("multi__step_1")) {
    if (!multiStep1Validation()) return false;
    debugger;
    saveData("https://afi.org/sc-api/forms/save-business", formData);
  }
  if (stepCount === formList.indexOf("multi__step_2")) {
    if (!multiStep2Validation()) return false;
  }
  if (stepCount === formList.indexOf("multi__step_3")) {
    if (!multiStep3Validation()) return false;
  }

  if (stepCount === formList.indexOf("multi__step_4")) {
    const isAllFine = multiStep4Validation();

    if (isAllFine) {
      document.querySelector("#currentInsuranceCompany").value = "";
      // Go to Thank You Page
      window.location.href = successRedirection;
    }
  }

  console.log(formData);

  // Step Increment
  stepCount >= maxStep ? stepCount : stepCount++;

  // Show Form
  showActiveForm(stepCount);
});

// Back
backBtn.addEventListener("click", () => {
  // Step Decrement
  stepCount <= 0 ? stepCount : stepCount--;

  showActiveForm(stepCount);
});

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
const dateField = document.querySelector("#policyRenewalDate");
dateField.addEventListener("input", (e) => {
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
  const thisYear = new Date().getFullYear();
  const maxYear = String(thisYear + 2);

  if (Number(YYYY) <= 1) value[3] = "";
  else if (YYYY.length === 1 && Number(YYYY) > 2) value[3] = "";
  else if (YYYY.length === 2 && Number(YYYY) > 20) value[3] = YYYY[0];
  else if (YYYY.length === 2 && Number(YYYY) < 20) value[3] = YYYY[0];
  else if (YYYY.length === 3 && Number(YYYY) > Number(maxYear.slice(0, 3)))
    value[3] = YYYY.slice(0, 2);
  else if (YYYY.length === 3 && Number(YYYY) > Number(maxYear.slice(0, 3)))
    value[3] = YYYY.slice(0, 2);
  else if (YYYY.length === 4 && Number(YYYY) > Number(maxYear))
    value[3] = YYYY.slice(0, 3);

  // Result
  e.target.value = !value[2]
    ? value[1]
    : value[1] + "/" + value[2] + (value[3] ? "/" + value[3] : "");
});

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
      formList = ["radio_select", "child_information", ...multiStepForm];
    } else if (eligibilityStatus === "parent") {
      formList = ["radio_select", "parent_information", ...multiStepForm];
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

// ********** Military Information ***********
function militaryFormValidation() {
  const militaryFirstName = document.querySelector("#eligibilityFirstName");
  const militaryLastName = document.querySelector("#eligibilityLastName");
  const branchOfService = document.querySelector("#branchOfService");
  const militaryStatus = document.querySelector("#militaryStatus");
  const militaryRank = document.querySelector("#militaryRank");

  const validationFields = [
    alphabeticOnly(militaryFirstName),
    isValueEmpty(militaryFirstName),
    alphabeticOnly(militaryLastName),
    isValueEmpty(militaryLastName),
    isValueEmpty(branchOfService),
    isValueEmpty(militaryStatus),
    isValueEmpty(militaryRank),
  ];

  const isValidate = validationFields.every((result) => result === true);

  if (isValidate) {
    formData.policyHolderFirstName = militaryFirstName?.value;
    formData.policyHolderLastName = militaryLastName?.value;
    formData.branchOfService = branchOfService?.value;
    formData.militaryStatus = militaryStatus?.value;
    formData.militaryRank = militaryRank?.value;

    // Set Name in Multi-step form field
    document.querySelector("#policyHolderFirstName").value =
      formData.policyHolderFirstName;

    document.querySelector("#policyHolderLastName").value =
      formData.policyHolderLastName;
  }

  return isValidate;
}

// ********** Parent's Information ***********
function parentFormValidation() {
  const parentFirstName = document.querySelector("#eligibilityChildFirstName");
  const parentLastName = document.querySelector("#eligibilityChildLastName");

  const validationFields = [
    alphabeticOnly(parentFirstName),
    alphabeticOnly(parentLastName),
    isValueEmpty(parentFirstName),
    isValueEmpty(parentLastName),
  ];

  const isValidate = validationFields.every((result) => result === true);

  if (isValidate) {
    formData.parentFirstName = parentFirstName?.value;
    formData.parentLastName = parentLastName?.value;
  }

  return isValidate;
}

// ********** Child's Information ***********
function childFormValidation() {
  const childFirstName = document.querySelector("#eligibilityParentFirstName");
  const childLastName = document.querySelector("#eligibilityParentLastName");

  const validationFields = [
    alphabeticOnly(childFirstName),
    alphabeticOnly(childLastName),
    isValueEmpty(childFirstName),
    isValueEmpty(childLastName),
  ];

  const isValidate = validationFields.every((result) => result === true);

  if (isValidate) {
    formData.childFirstName = childFirstName?.value;
    formData.childLastName = childLastName?.value;
  }

  return isValidate;
}

// ********** MULTI-STEP 1 Validation ***********
function multiStep1Validation() {
  const policyHolderFirstName = document.querySelector(
    "#policyHolderFirstName"
  );
  const policyHolderLastName = document.querySelector("#policyHolderLastName");
  const policyHolderEmail = document.querySelector("#policyHolderEmail");
  const policyHolderPhoneType = document.querySelector(
    "#policyHolderPhoneType"
  );
  const policyHolderPhoneNumber = document.querySelector(
    "#policyHolderPhoneNumber"
  );

  const validationFields = [
    alphabeticOnly(policyHolderFirstName),
    alphabeticOnly(policyHolderLastName),
    isValueEmpty(policyHolderFirstName),
    emailValidation(policyHolderEmail),
    isValueEmpty(policyHolderEmail),
    isValueEmpty(policyHolderPhoneType),
    phoneValidation(policyHolderPhoneNumber),
    isValueEmpty(policyHolderPhoneNumber),
  ];

  const isValidate = validationFields.every((result) => result === true);

  if (isValidate) {
    formData.policyHolderFirstName = policyHolderFirstName?.value;
    formData.policyHolderLastName = policyHolderLastName?.value;
    formData.policyHolderEmail = policyHolderEmail?.value;
    formData.policyHolderPhoneType = policyHolderPhoneType?.value;
    formData.policyHolderPhoneNumber = policyHolderPhoneNumber?.value.replace(
      /\D/g,
      ""
    );
  }

  return isValidate;
}

// ********** MULTI-STEP 2 Validation ***********
function multiStep2Validation() {
  const businessName = document.querySelector("#businessName");
  const businessWebsite = document.querySelector("#businessWebsite");
  const businessType = document.querySelector("#businessType");
  const businessTaxId = document.querySelector("#businessTaxId");
  const businessPhysicalAddress = document.querySelector(
    "#businessPhysicalAddress"
  );
  const city = document.querySelector("#city");
  const state = document.querySelector("#state");
  const zip = document.querySelector("#zip");

  const validationFields = [
    isValueEmpty(businessName),
    isValueEmpty(businessType),
    isValueEmpty(businessPhysicalAddress),
    isValueEmpty(city),
    isValueEmpty(state),
    minValue(zip, 5, "Please enter a valid Zip code"),
    isValueEmpty(zip),
  ];

  const isValidate = validationFields.every((result) => result === true);

  if (isValidate) {
    formData.businessName = businessName?.value;
    formData.businessWebsite = businessWebsite?.value;
    formData.businessType = businessType?.value;
    formData.businessTaxId = businessTaxId?.value;
    formData.city = city?.value;
    formData.state = state?.value;
    formData.zip = zip?.value;
  }

  return isValidate;
}

// ********** MULTI-STEP 3 Validation ***********
function multiStep3Validation() {
  const typeOfInsurance = document.getElementsByName("typeOfInsurance");

  formData.policyCoverage = [];

  typeOfInsurance.forEach((item) => {
    if (item?.checked) {
      formData.policyCoverage.push(item?.value);
    }
  });

  const isValidate = formData.policyCoverage.length > 0;

  if (!isValidate) {
    // Error Message if value = null
    eligibilityErrorMessage(false, ".multi__step_3 .field_message");
  }

  return isValidate;
}

// ********** MULTI-STEP 4 Validation ***********
function multiStep4Validation() {
  const currentInsuranceCompany = document.querySelector(
    "#currentInsuranceCompany"
  );
  const insuranceCompany = document.querySelector("#insuranceCompany");
  const policyRenewalDate = document.querySelector("#policyRenewalDate");

  formData.currentInsuranceCompany = currentInsuranceCompany?.value;
  formData.insuranceCompany = insuranceCompany?.value;
  formData.policyRenewalDate = policyRenewalDate?.value;

  let validationFields = true;

  // if currentInsuranceCompany = "Other" then Insurance Company value id required
  if (currentInsuranceCompany?.value === "Other") {
    validationFields = isValueEmpty(insuranceCompany);
  }

  return validationFields;
}

// *********************************************
//            OTHERS FUNCTIONALITIES
// *********************************************
// if currentInsuranceCompany = "Other" then Insurance Company field will show
const currentInsuranceCompanyEl = document.querySelector(
  "#currentInsuranceCompany"
);

currentInsuranceCompanyEl.addEventListener("change", () => {
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
    const errorField = fieldWrapper.querySelector(".field_message");
    errorField?.classList.remove("error");
  };

  fieldWrapper
    .querySelectorAll(".field__input")
    .forEach((inputField) =>
      inputField.addEventListener("input", removeFieldError)
    );
});

// Press Enter Submit Form
document.querySelectorAll(".field__input")?.forEach((input) => {
  input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      // Trigger the button element with a click
      document.getElementById("next_btn").click();
    }
  });
});

// Military Rank should be disabled if branchOfService value none
const branchOfServiceEl = document.getElementById("branchOfService");
branchOfServiceEl.addEventListener("change", () => {
  const militaryRank = document.getElementById("militaryRank");
  if (Boolean(branchOfService?.value)) {
    militaryRank.disabled = false;
  } else {
    militaryRank.disabled = true;
  }
});

// ******************* API CALLING *******************
async function saveData(url, data) {
  const saveData = {
    action: "send",
    recaptchaToken: "",
    values: data,
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(saveData),
  });

  console.log("res", res);
}
