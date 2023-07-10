// const condoSuccessRedirection = "https://afi.org/";
// const condoSuccessRedirection = "../--Model/thank-you.html";

// Forms
const condoFormSteps = [
  "policyholder_form",
  "property_quoted_form",
  "property_information_form",
  "property_claims_form",
  "discount_form",
];

let condoStep = 0;
let condoMaxStep = formList.length - 1;

const condoNextBtn = document.querySelector("#condoNextBtn");
const condoBackBtn = document.querySelector("#condoBackBtn");

// *********************************************
//       FORM SUBMISSION AND STEP HANDLING
// *********************************************

// ***** NEXT FUNCTIONALITY *****
pressEnterToSubmit(condoNextBtn);
condoNextBtn?.addEventListener("click", () => {
  if (condoStep === 0) {
    const isSelectEligibility = eligibilityValidation(condoFormSteps);
    if (!Boolean(isSelectEligibility)) return false

    militaryFormFunc();
  }

  //  HANDLE ALL FORM SUBMISSIONS AND STEP VALIDATION
  if (!handleCondoForms(condoStep)) return false;

  // Step Increment
  condoMaxStep = formList.length - 1;
  condoStep >= condoMaxStep ? condoStep : condoStep++;

  // Show Form
  showActiveForm(condoStep, condoBackBtn);
});

// Back
condoBackBtn?.addEventListener("click", () => {
  // Step Decrement
  condoStep <= 0 ? condoStep : condoStep--;

  showActiveForm(condoStep, condoBackBtn);
});

// =*********************************************
//       HANDLING MULTI-STEP FORMS
// =*********************************************
function handleCondoForms(step) {
  // =*********************************************************
  if (step === formList.indexOf("military_information")) {
    if (!militaryValidation()) return false;
  }

  if (step === formList.indexOf("parent_information")) {
    if (!validateForm("parent_information")) return false;
  }

  if (step === formList.indexOf("child_information")) {
    if (!validateForm("child_information")) return false;
  }

  if (step === formList.indexOf("policyholder_form")) {
    // if (!policyholderValidation(step)) return false;
    condoPropertyQuotedFormFunc();
  }
  if (step === formList.indexOf("spouse_information")) {
    if (!validateForm("spouse_information")) return false;
  }

  if (step === formList.indexOf("property_quoted_form")) {
    // if (!condoPropertyQuotedValidation()) return false;
    condoInformationFunc();
  }

  if (step === formList.indexOf("property_information_form")) {
    // if (!validateForm("property_information_form")) return false;
  }
  if (step === formList.indexOf("property_claims_form")) {
    if (!validateForm("property_claims_form")) return false;
    condoDiscountFormFunc();
  }

  //
  if (step === formList.indexOf("discount_form")) {
    if (!condoDiscountValidation("discount_form")) return false;

    alert("Done");

    // Go to Thank You Page
    // window.location.href = condoSuccessRedirection;
  }

  return true;
}

// *********************************************
//             STEP-1 VALIDATION
// *********************************************

// Policy Holder validation from formCommon.js (policyholderValidation)

// Spouse validate by default validateForm in handleCondoForms function

// *********************************************
// STEP-2 "Property to be Quoted" FUNCTIONALITY & VALIDATION
// *********************************************
const isCondoSameAddressEl = document.getElementById(
  "propertyAddressSameAsMailing--true"
);

function condoPropertyQuotedFormFunc() {
  //
  const condoQuotedMatchEl = document.querySelectorAll(
    ".property_quoted_form .field__input"
  );

  function setMatchedData(disability) {
    const condoHolderMatchEl = document.querySelectorAll(
      ".policyholder_form .field__input"
    );

    condoHolderMatchEl.forEach((element) => {
      const elementMatch = element.getAttribute("data-match");

      condoQuotedMatchEl.forEach((el) => {
        const elMatch = el.getAttribute("data-match");

        if (elMatch === elementMatch) el.value = element.value;
        el.disabled = disability;
        isCondoSameAddressEl.disabled = false;
      });
    });
  }

  setMatchedData(false);
  document.getElementById("propertyAddress").value = "";

  // Same Mailing CheckBox Functionality
  isCondoSameAddressEl?.addEventListener("change", () => {
    if (isCondoSameAddressEl.checked) {
      setMatchedData(true);
    } else {
      condoQuotedMatchEl.forEach((el, i) => {
        el.value = "";
        el.disabled = false;

        if (i === 1) el.focus();
      });
    }
  });
}

function condoPropertyQuotedValidation() {
  if (isCondoSameAddressEl.checked) {
    formData[isCondoSameAddressEl.name] = true;
    return true;
  } else {
    formData[isCondoSameAddressEl.name] = false;

    const isValidate = validateForm("property_quoted_form");
    return isValidate;
  }
}

// *********************************************
// STEP-2 "Property Information & CLAIMS" FUNCTIONALITY & VALIDATION
// *********************************************

function condoInformationFunc() {
  const residenceOccupancy = document.querySelector(".residenceOccupancy");
  const occupancyDependent = document.querySelectorAll(".occupancyDependent");

  residenceOccupancy.addEventListener("change", (e) => {
    const occupancyVal = e.target.value;

    if (occupancyVal === "Rental or Non Owner Occupied") {
      occupancyDependent.forEach((field) => {
        field.disabled = false;
        field.classList.add("required");
      });
    } else {
      occupancyDependent.forEach((field) => {
        field.disabled = true;
        field.classList.remove("required");
      });
    }
  });
}

// PROPERTY INFORMATION VALIDATE in handleCondoForms function

// PROPERTY CLAIMS VALIDATE in handleCondoForms function

// *********************************************
// STEP-3 "Discount Form" FUNCTIONALITY & VALIDATION
// *********************************************
function condoDiscountFormFunc() {
  const newPurchaseDiscount = document.querySelector(".newPurchaseDiscount");
  const newPurchaseDiscountDate = document.querySelector(
    ".newPurchaseDiscountDate"
  );

  const future2Years = new Date().getFullYear() + 2;
  dateValidation(newPurchaseDiscountDate, future2Years);

  newPurchaseDiscount.addEventListener("change", (e) => {
    if (newPurchaseDiscount.checked) {
      newPurchaseDiscountDate.disabled = false;
      newPurchaseDiscountDate.classList.add("required", "date");
    } else {
      newPurchaseDiscountDate.disabled = true;
      newPurchaseDiscountDate.classList.remove("required", "date");
    }
  });
}

function condoDiscountValidation(formClass) {
  const isValidate = validateForm(formClass, false);
  const discFields = document.querySelectorAll(`.${formClass} .field__input`);

  if (isValidate) {
    discFields.forEach((field) => {
      if (field.type === "radio") formData[field?.name] = field.checked;
      else formData[field?.name] = field.value;
    });
  }

  return isValidate;
}
