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

  // 2 side back for add_more_vehicle_form
  if (floodStep + 1 === formList.indexOf("add_more_vehicle_form")) {
    formList = formList.filter((item) => item != "add_more_vehicle_form");
    floodStep = formList.indexOf("summary__form");
  }
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
    if (!policyholderValidation(step)) return false;
  }
  if (step === formList.indexOf("spouse_information")) {
    if (!spouseValidation()) return false;
  }
  if (step === formList.indexOf("add_vehicle__form")) {
    if (!addVehicleValidation()) return false;
    summaryFunctionality();
  }
  if (step === formList.indexOf("add_more_vehicle_form")) {
    if (!addMoreVehicleValidation()) return false;
    summaryFunctionality();
  }
  if (
    step === formList.indexOf("summary__form") ||
    step === formList.indexOf("summary__form") - 1
  ) {
    summaryFunctionality();
  }
  if (step === formList.indexOf("violations__form")) {
    if (!violationsValidation()) return false;
  }

  if (step === formList.indexOf("coverage_limits_form")) {
    if (!coverageLimitsValidation()) return false;
    functionalityForEachDamageForm();
  }
  if (step === formList.indexOf("physical_damage_form")) {
    if (!physicalDamageValidation()) return false;
  }
  if (step === formList.indexOf("coverage__history_form")) {
    if (!coverageHistoryValidation()) return false;

    alert("Done");

    // document.querySelector("#currentInsuranceCompany").value = "";
    // Go to Thank You Page
    // window.location.href = successRedirection;
  }

  return true;
}

// =*********************************************
//           SHOW FORM BY CONDITION
// =*********************************************
// function showActiveForm(step) {
//   floodMaxStep = formList.length - 1;

//   // remove active_form class from everywhere
//   document.querySelector(".active_form")?.classList.remove("active_form");

//   // set active_form class
//   document.querySelector(`.${formList[step]}`)?.classList.add("active_form");

//   console.log({ floodStep });
//   console.log(formData);

//   // Conditionally Hide Back Btn
//   floodStep <= 0
//     ? backBtn.classList.add("hide")
//     : backBtn.classList.remove("hide");
// }

// *********************************************
//              FORM VALIDATION
// *********************************************
// / ********** Eligibility Validation ***********

// / ********** Military Information ***********
function floodMilitaryValidation() {
  const isValidate = validateForm("military_information");

  // Set Name in Multi-step form field
  const fnameValue = document.querySelector("#militaryFirstName").name;
  const lnameValue = document.querySelector("#militaryLastName").name;

  document.querySelector("#policyHolderFirstName").value = formData[fnameValue];
  document.querySelector("#policyHolderLastName").value = formData[lnameValue];

  return isValidate;
}

// *********************************************
//             STEP-1 VALIDATION
// *********************************************
function policyholderValidation(step) {
  // const policyHolderFirstName = document.querySelector(
  //   "#policyHolderFirstName"
  // );
  // const policyHolderLastName = document.querySelector("#policyHolderLastName");
  // const policyHolderSuffix = document.querySelector("#policyHolderSuffix");
  // const policyHolderMailingAddress = document.querySelector(
  //   "#policyHolderMailingAddress"
  // );
  // const policyHolderCity = document.querySelector("#policyHolderCity");
  // const policyHolderState = document.querySelector("#policyHolderState");
  // const policyHolderZip = document.querySelector("#policyHolderZip");
  // const policyHolderSsn = document.querySelector("#policyHolderSsn");
  // const policyHolderDob = document.querySelector("#policyHolderDob");
  // const policyHolderGender = document.querySelector("#policyHolderGender");
  // const policyHolderMaritalStatus = document.querySelector(
  //   "#policyHolderMaritalStatus"
  // );
  // const policyHolderEmail = document.querySelector("#policyHolderEmail");
  // const policyHolderPhoneType = document.querySelector(
  //   "#policyHolderPhoneType"
  // );
  // const policyHolderPhoneNumber = document.querySelector(
  //   "#policyHolderPhoneNumber"
  // );
  // const policyHolderResidenceStatus = document.querySelector(
  //   "#policyHolderResidenceStatus"
  // );

  // const validationFields = [
  //   alphabeticOnly(policyHolderFirstName),
  //   alphabeticOnly(policyHolderLastName),
  //   isValueEmpty(policyHolderFirstName),
  //   isValueEmpty(policyHolderLastName),
  //   isValueEmpty(policyHolderMailingAddress),
  //   isValueEmpty(policyHolderCity),
  //   isValueEmpty(policyHolderState),
  //   minValue(policyHolderZip, 5, "Please enter a valid Zip code"),
  //   isValueEmpty(policyHolderZip),
  //   minValue(policyHolderDob, 10, "Please enter a valid Date"),
  //   isValueEmpty(policyHolderDob),
  //   isValueEmpty(policyHolderGender),
  //   isValueEmpty(policyHolderMaritalStatus),
  //   isValueEmpty(policyHolderEmail),
  //   emailValidation(policyHolderEmail),
  //   isValueEmpty(policyHolderEmail),
  //   isValueEmpty(policyHolderPhoneType),
  //   phoneValidation(policyHolderPhoneNumber),
  //   isValueEmpty(policyHolderResidenceStatus),
  // ];

  // const isValidate = validationFields.every((result) => result === true);

  // if (isValidate) {
  //   const policyHolder = formData.policyHolder;

  //   policyHolder.firstName = policyHolderFirstName?.value;
  //   policyHolder.lastName = policyHolderLastName?.value;
  //   policyHolder.suffix = policyHolderSuffix?.value;
  //   policyHolder.mailingAddress = policyHolderMailingAddress?.value;
  //   policyHolder.city = policyHolderCity?.value;
  //   policyHolder.state = policyHolderState?.value;
  //   policyHolder.zip = policyHolderZip?.value;
  //   policyHolder.ssn = policyHolderSsn?.value.replace(/\D/g, "");
  //   policyHolder.dob = policyHolderDob?.value;
  //   policyHolder.gender = policyHolderGender?.value;
  //   policyHolder.maritalStatus = policyHolderMaritalStatus?.value;
  //   policyHolder.email = policyHolderEmail?.value;
  //   policyHolder.phoneType = policyHolderPhoneType?.value;
  //   policyHolder.phoneNumber = policyHolderPhoneNumber?.value.replace(
  //     /\D/g,
  //     ""
  //   );
  //   policyHolder.residenceStatus = policyHolderResidenceStatus?.value;
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

  return isValidate;
}

function spouseValidation() {
  const cohabitantFirstName = document.querySelector("#cohabitantFirstName");
  const cohabitantLastName = document.querySelector("#cohabitantLastName");
  const cohabitantSuffix = document.querySelector("#cohabitantSuffix");
  const cohabitantSsn = document.querySelector("#cohabitantSsn");
  const cohabitantDob = document.querySelector("#cohabitantDob");
  const cohabitantGender = document.querySelector("#cohabitantGender");

  const validationFields = [
    alphabeticOnly(cohabitantFirstName),
    alphabeticOnly(cohabitantLastName),
    isValueEmpty(cohabitantFirstName),
    isValueEmpty(cohabitantLastName),
    minValue(cohabitantDob, 10, "Please enter a valid Date"),
    isValueEmpty(cohabitantDob),
    isValueEmpty(cohabitantGender),
  ];

  const isValidate = validationFields.every((result) => result === true);

  if (isValidate) {
    const cohabitant = (formData.cohabitantInfo = {});

    cohabitant.firstName = cohabitantFirstName?.value;
    cohabitant.lastName = cohabitantLastName?.value;
    cohabitant.suffix = cohabitantSuffix?.value;
    cohabitant.ssn = cohabitantSsn?.value.replace(/\D/g, "");
    cohabitant.dob = cohabitantDob?.value;
    cohabitant.gender = cohabitantGender?.value;
  }

  return isValidate;
}

// *********************************************
//              STEP-2 FUNCTIONALITY
// *********************************************

// *********************************************
//              STEP-2 VALIDATION
// *********************************************

// *********************************************
//              STEP-3 FUNCTIONALITY
// *********************************************

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
