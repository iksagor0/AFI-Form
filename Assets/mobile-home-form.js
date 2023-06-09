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
    if (!policyholderValidation(step)) return false;
    mobilePropertyQuotedFormFunc();
  }
  if (step === formList.indexOf("spouse_information")) {
    if (!validateForm("spouse_information")) return false;
  }

  if (step === formList.indexOf("property_quoted_form")) {
    if (!mobilePropertyQuotedValidation()) return false;
    mobileInformationFunc();
  }

  if (step === formList.indexOf("home_information_form")) {
    if (!validateForm("home_information_form")) return false;
  }
  if (step === formList.indexOf("property_claims_form")) {
    if (!validateForm("property_claims_form")) return false;
    coverageHistoryFunc();
  }

  if (step === formList.indexOf("coverage_history_form")) {
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
const isMobileSameAddressEl = document.getElementById("propertyAddressSameAsMailing--true");

function mobilePropertyQuotedFormFunc() {
  isMobileSameAddressEl.checked = false;
  //
  const mobileQuotedMatchEl = document.querySelectorAll(".property_quoted_form .field__input");

  function setMatchedData(disability) {
    const mobileHolderMatchEl = document.querySelectorAll(".policyholder_form .field__input");

    mobileHolderMatchEl.forEach((element) => {
      const elementMatch = element.getAttribute("data-match");

      mobileQuotedMatchEl.forEach((el) => {
        const elMatch = el.getAttribute("data-match");

        if (elementMatch && elMatch === elementMatch) el.value = element.value;
        el.disabled = disability;
        isMobileSameAddressEl.disabled = false;
      });
    });
  }

  setMatchedData(false);
  document.getElementById("addressToBeQuotedAddress").value = "";

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
  const residenceCityLimits = document.querySelector(".residenceCityLimits");
  const residenceCityLimitsDep = document.querySelectorAll(".residenceCityLimitsDep");

  residenceCityLimits.addEventListener("change", (e) => {
    const resLimitVal = e.target.value;

    if (resLimitVal === "No") {
      residenceCityLimitsDep.forEach((field) => {
        field.disabled = false;
        field.classList.add("required");
      });
    } else {
      residenceCityLimitsDep.forEach((field) => {
        field.disabled = true;
        field.classList.remove("required");
      });
    }
  });
}

// MOBILE INFORMATION VALIDATE in handleMobileForms function

// MOBILE CLAIMS VALIDATE in handleMobileForms function

// *********************************************
// STEP-3 "coverage_history_form" FUNCTIONALITY & VALIDATION handle in handleMobileForms function and declare in formCommon.js file
