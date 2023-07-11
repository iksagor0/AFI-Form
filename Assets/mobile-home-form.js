// const mobileSuccessRedirection = "https://afi.org/";
// const mobileSuccessRedirection = "../--Model/thank-you.html";

// Forms
const mobileFormSteps = [
  "policyholder_form",
  "property_quoted_form",
  "home_information_form",
  "property_claims_form",
  "coverage_history_form",
];

let mobileStep = 0;
let mobileMaxStep = formList.length - 1;

const mobileNextBtn = document.querySelector("#mobileNextBtn");
const mobileBackBtn = document.querySelector("#mobileBackBtn");

// *********************************************
//       FORM SUBMISSION AND STEP HANDLING
// *********************************************

// ***** NEXT FUNCTIONALITY *****
pressEnterToSubmit(mobileNextBtn);
mobileNextBtn?.addEventListener("click", async () => {
  if (mobileStep === 0) {
    const isSelectEligibility = eligibilityValidation(mobileFormSteps);
    if (!Boolean(isSelectEligibility)) return false;

    militaryFormFunc();
  }

  //  HANDLE ALL FORM SUBMISSIONS AND STEP VALIDATION
  const submitResult = await handleMobileForms(mobileStep);
  if (!submitResult) return false;

  // Step Increment
  mobileMaxStep = formList.length - 1;
  mobileStep >= mobileMaxStep ? mobileStep : mobileStep++;

  // Show Form
  showActiveForm(mobileStep, mobileBackBtn);
});

// Back
mobileBackBtn?.addEventListener("click", () => {
  // Step Decrement
  mobileStep <= 0 ? mobileStep : mobileStep--;

  showActiveForm(mobileStep, mobileBackBtn);
});

// =*********************************************
//       HANDLING MULTI-STEP FORMS
// =*********************************************
function handleMobileForms(step) {
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
    mobilePropertyQuotedFormFunc();
  }
  if (step === formList.indexOf("spouse_information")) {
    if (!validateForm("spouse_information")) return false;
  }

  if (step === formList.indexOf("property_quoted_form")) {
    // if (!mobilePropertyQuotedValidation()) return false;
    // mobileInformationFunc();
  }

  if (step === formList.indexOf("property_information_form")) {
    // if (!validateForm("property_information_form")) return false;
  }
  if (step === formList.indexOf("property_claims_form")) {
    if (!validateForm("property_claims_form")) return false;
    coverageHistoryFunc();
  }

  if (step === formList.indexOf("discount_form")) {
    if (!validateForm("coverage_history_form")) return false;

    alert("Done");
    console.log(formData);

    // Go to Thank You Page
    // window.location.href = mobileSuccessRedirection;
  }

  return true;
}

// *********************************************
//             STEP-1 VALIDATION
// *********************************************

// Policy Holder validation from formCommon.js (policyholderValidation)

// Spouse validate by default validateForm in handleMobileForms function

// *********************************************
// STEP-2 "Property to be Quoted" FUNCTIONALITY & VALIDATION
// *********************************************
const isMobileSameAddressEl = document.getElementById(
  "propertyAddressSameAsMailing--true"
);

function mobilePropertyQuotedFormFunc() {
  //
  const mobileQuotedMatchEl = document.querySelectorAll(
    ".property_quoted_form .field__input"
  );

  function setMatchedData(disability) {
    const mobileHolderMatchEl = document.querySelectorAll(
      ".policyholder_form .field__input"
    );

    mobileHolderMatchEl.forEach((element) => {
      const elementMatch = element.getAttribute("data-match");

      mobileQuotedMatchEl.forEach((el) => {
        const elMatch = el.getAttribute("data-match");

        if (elMatch === elementMatch) el.value = element.value;
        el.disabled = disability;
        isMobileSameAddressEl.disabled = false;
      });
    });
  }

  setMatchedData(false);
  document.getElementById("propertyAddress").value = "";

  // Same Mailing CheckBox Functionality
  isMobileSameAddressEl?.addEventListener("change", () => {
    if (isMobileSameAddressEl.checked) {
      setMatchedData(true);
    } else {
      mobileQuotedMatchEl.forEach((el, i) => {
        el.value = "";
        el.disabled = false;

        if (i === 1) el.focus();
      });
    }
  });
}

function mobilePropertyQuotedValidation() {
  if (isMobileSameAddressEl.checked) {
    formData[isMobileSameAddressEl.name] = true;
    return true;
  } else {
    formData[isMobileSameAddressEl.name] = false;

    const isValidate = validateForm("property_quoted_form");
    return isValidate;
  }
}

// *********************************************
// STEP-2 "Property Information & CLAIMS" FUNCTIONALITY & VALIDATION
// *********************************************

function mobileInformationFunc() {
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

// PROPERTY INFORMATION VALIDATE in handleMobileForms function

// PROPERTY CLAIMS VALIDATE in handleMobileForms function

// *********************************************
// STEP-3 "Discount Form" FUNCTIONALITY & VALIDATION
// *********************************************
function mobileDiscountFormFunc() {
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

function mobileDiscountValidation(formClass) {
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
