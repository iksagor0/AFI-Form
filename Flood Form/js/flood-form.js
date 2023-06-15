// DATA
// const floodFormData = {
//   eligibilityStatus: "",
// };

// const successRedirection = "https://afi.org/";
// const successRedirection = "../--Model/thank-you.html";

// Forms
const floodFormSteps = [
  "policyholder_form",
  "property_quoted_form",
  "property_overview_form",
  "property_details_form",
];

let floodStep = 0;
let floodMaxStep = formList.length;

// *********************************************
//       FORM SUBMISSION AND STEP HANDLING
// *********************************************
const nextBtn = document.querySelector("#next_btn");
const backBtn = document.querySelector("#back_btn");

// ***** NEXT FUNCTIONALITY *****
nextBtn?.addEventListener("click", () => {
  if (floodStep === 0) {
    const isSelectEligibility = eligibilityValidation(floodFormSteps);
    if (!Boolean(isSelectEligibility)) return false;
    floodMaxStep = formList.length - 1;
  }

  //  HANDLE ALL FORM SUBMISSIONS AND STEP VALIDATION
  if (!handleFloodForms(floodStep)) return false;

  // Step Increment
  floodStep >= floodMaxStep ? floodStep : floodStep++;

  // Show Form
  showActiveForm(floodStep, formList);
});

// Back
backBtn?.addEventListener("click", () => {
  // Step Decrement
  floodStep <= 0 ? floodStep : floodStep--;

  showActiveForm(floodStep, formList);
});

// =*********************************************
//       HANDLING MULTI-STEP FORMS
// =*********************************************
function handleFloodForms(step) {
  // =*********************************************************
  if (step === formList.indexOf("military_information")) {
    if (!floodMilitaryValidation()) return false;
  }

  if (step === formList.indexOf("parent_information")) {
    if (!validateForm("parent_information")) return false;
  }

  if (step === formList.indexOf("child_information")) {
    if (!validateForm("child_information")) return false;
  }

  if (step === formList.indexOf("policyholder_form")) {
    if (!floodPolicyholderValidation(step)) return false;
    floodPropertyQuotedFormFunc();
  }
  if (step === formList.indexOf("spouse_information")) {
    if (!validateForm("spouse_information")) return false;
  }

  if (step === formList.indexOf("property_quoted_form")) {
    if (!floodPropertyQuotedValidation()) return false;
    floodOverviewFunc();
  }

  if (step === formList.indexOf("property_overview_form")) {
    if (!floodOverviewValidation()) return false;
    floodDetailsFunc();
  }

  //
  if (step === formList.indexOf("coverage__history_form")) {
    if (!coverageHistoryValidation()) return false;

    alert("Done");

    // document.querySelector("#currentInsuranceCompany").value = "";
    // Go to Thank You Page
    // window.location.href = successRedirection;
  }

  return true;
}

// *********************************************
//              FORM VALIDATION
// *********************************************

// / ********** Military Information ***********
function floodMilitaryValidation() {
  const isValidate = validateForm("military_information");

  // Set Name in Multi-step form field
  const fnameValue = document.querySelector("#militaryFirstName").name;
  const lnameValue = document.querySelector("#militaryLastName").name;

  document.querySelector("#policyHolderFirstName").value = formData[fnameValue];
  document.querySelector("#policyHolderLastName").value = formData[lnameValue];

  return true;
  return isValidate;
}

// *********************************************
//             STEP-1 VALIDATION
// *********************************************
function floodPolicyholderValidation(step) {
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
      console.log("aaaaaaaaaaaa spouse_information");
    }
  }

  return true;
  return isValidate;
}

// *********************************************
// STEP-2 "Property to be Quoted" FUNCTIONALITY & VALIDATION
// *********************************************
const isFloodSameAddressEl = document.getElementById(
  "propertyAddressSameAsMailing--true"
);

function floodPropertyQuotedFormFunc() {
  isFloodSameAddressEl?.addEventListener("change", () => {
    const floodQuotedMatchEl = document.querySelectorAll(
      ".property_quoted_form .field__input"
    );

    if (isFloodSameAddressEl.checked) {
      const floodHolderMatchEl = document.querySelectorAll(
        ".policyholder_form .field__input"
      );

      floodHolderMatchEl.forEach((element) => {
        const elementMatch = element.getAttribute("data-match");

        floodQuotedMatchEl.forEach((el) => {
          const elMatch = el.getAttribute("data-match");

          if (elMatch === elementMatch) el.value = element.value;
          el.disabled = true;
          isFloodSameAddressEl.disabled = false;
        });
      });

      //
    } else {
      floodQuotedMatchEl.forEach((el, i) => {
        el.value = "";
        el.disabled = false;

        if (i === 1) el.focus();
      });
    }
  });
}

function floodPropertyQuotedValidation() {
  if (isFloodSameAddressEl.checked) {
    formData[isFloodSameAddressEl.name] = true;
    return true;
  } else {
    const isValidate = validateForm("property_quoted_form");
    return isValidate;
  }
}

// *********************************************
// STEP-2 "Property Overview" FUNCTIONALITY & VALIDATION
// *********************************************

function floodOverviewFunc() {
  const awareOfFloodLossesOnProperty = document.querySelector(
    ".field__input[name=awareOfFloodLossesOnProperty]:checked"
  );

  const howManyLossesHaveOccurred = document.getElementById(
    "howManyLossesHaveOccurred"
  );

  document
    .querySelectorAll(".field__input[name=awareOfFloodLossesOnProperty]")
    .forEach((field) => {
      field.addEventListener("change", () => {
        if (field.checked && field?.value === "Yes") {
          howManyLossesHaveOccurred.disabled = false;
          howManyLossesHaveOccurred?.classList.add("required");
        } else {
          howManyLossesHaveOccurred.disabled = true;
          howManyLossesHaveOccurred?.classList.remove("required");
        }
      });
    });
}

function floodOverviewValidation() {
  const isValidate = validateForm("property_overview_form");

  //
  const awareOfFloodLossesOnProperty = document.querySelector(
    ".field__input[name=awareOfFloodLossesOnProperty]:checked"
  );
  if (!awareOfFloodLossesOnProperty) {
    const awareOfFloodError = document.querySelector(".awareOfFloodError");
    awareOfFloodError.style.display = "block";

    document
      .querySelectorAll(".field__input[name=awareOfFloodLossesOnProperty]")
      .forEach((el) =>
        el.addEventListener(
          "change",
          () => (awareOfFloodError.style.display = "none")
        )
      );
  }

  return true;
  return isValidate && awareOfFloodLossesOnProperty;
}

// *********************************************
// STEP-3 "Property Details" FUNCTIONALITY & VALIDATION
// *********************************************
function floodDetailsFunc() {
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

// =*********************************************
//            OTHERS FUNCTIONALITIES
// =*********************************************
// KeyPress only remove field Error Message
function clearFieldErrorMsg() {
  document
    .querySelectorAll(".form_container .field")
    ?.forEach((fieldWrapper) => {
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
}
clearFieldErrorMsg();

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
