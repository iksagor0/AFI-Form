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
    if (!Boolean(isSelectEligibility)) return false;
    condoMaxStep = formList.length - 1;

    militaryFormFunc();
  }

  //  HANDLE ALL FORM SUBMISSIONS AND STEP VALIDATION
  if (!handleCondoForms(condoStep)) return false;

  // Step Increment
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
    if (!condoPropertyQuotedValidation()) return false;
    condoInformationFunc();
  }

  if (step === formList.indexOf("property_information_form")) {
    if (!validateForm("property_information_form")) return false;
    // condoDetailsFunc();
  }
  if (step === formList.indexOf("property_claims_form")) {
    alert("property_claims_form");
    // if (!condoInformationValidation()) return false;
    // condoDetailsFunc();
  }

  //
  if (step === formList.indexOf("discount_form")) {
    // if (!condoDetailsValidation()) return false;

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
// STEP-2 "Property Information" FUNCTIONALITY & VALIDATION
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
    debugger;
  });
}

// function condoInformationValidation() {
//   const isValidate = validateForm("property_overview_form");

//   //
//   const awareOfCondoLossesOnProperty = document.querySelector(
//     ".field__input[name=awareOfCondoLossesOnProperty]:checked"
//   );
//   if (!awareOfCondoLossesOnProperty) {
//     const awareOfCondoError = document.querySelector(".awareOfCondoError");
//     awareOfCondoError.style.display = "block";

//     document
//       .querySelectorAll(".field__input[name=awareOfCondoLossesOnProperty]")
//       .forEach((el) =>
//         el.addEventListener(
//           "change",
//           () => (awareOfCondoError.style.display = "none")
//         )
//       );
//   }

//   return isValidate && Boolean(awareOfCondoLossesOnProperty);
// }

// *********************************************
// STEP-3 "Property Details" FUNCTIONALITY & VALIDATION
// *********************************************
function condoDetailsFunc() {
  const isStructureACondominium = document.querySelector(
    ".field__input[name=isStructureACondominium]:checked"
  );

  const whatFloorIsYourCondominiumOn = document.getElementById(
    "whatFloorIsYourCondominiumOn"
  );

  document
    .querySelectorAll(".field__input[name=isStructureACondominium]")
    .forEach((field) => {
      field.addEventListener("change", () => {
        if (field.checked && field?.value === "Yes") {
          whatFloorIsYourCondominiumOn.disabled = false;
          whatFloorIsYourCondominiumOn?.classList.add("required");
        } else {
          whatFloorIsYourCondominiumOn.disabled = true;
          whatFloorIsYourCondominiumOn?.classList.remove("required");
        }
      });
    });

  //
  const garageType = document.getElementById("garageType");
  const garageValue = document.getElementById("garageValue");

  garageType.addEventListener("change", (e) => {
    if (e.target.value === "Detached") {
      garageValue.disabled = false;
      garageValue?.classList.add("required");
    } else {
      garageValue.disabled = true;
      garageValue?.classList.remove("required");
    }
  });
}

function condoDetailsValidation() {
  const isValidate = validateForm("property_details_form");

  //
  const isStructureACondominium = document.querySelector(
    ".field__input[name=isStructureACondominium]:checked"
  );
  if (!isStructureACondominium) {
    const structureACondomError = document.querySelector(
      ".structureACondomError"
    );
    structureACondomError.style.display = "block";

    document
      .querySelectorAll(".field__input[name=isStructureACondominium]")
      .forEach((el) =>
        el.addEventListener(
          "change",
          () => (structureACondomError.style.display = "none")
        )
      );
  }

  return isValidate && Boolean(isStructureACondominium);
}
