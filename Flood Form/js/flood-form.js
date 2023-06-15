// DATA
const floodFormData = {
  eligibilityStatus: "",
};

// const successRedirection = "https://afi.org/";
// const successRedirection = "../--Model/thank-you.html";

// Forms
const floodFormSteps = [
  "policyholder_form",
  "property_quoted_form",
  "property_overview_form",
  "property_details_form",
];

let floodFormList = ["radio_select", ...floodFormSteps];

let floodStep = 0;
let floodMaxStep = floodFormList.length - 1;

// *********************************************
//       FORM SUBMISSION AND STEP HANDLING
// *********************************************
const nextBtn = document.querySelector("#next_btn");
const backBtn = document.querySelector("#back_btn");

// ***** NEXT FUNCTIONALITY *****
nextBtn?.addEventListener("click", () => {
  if (floodStep === 0) {
    const isSelectEligibility = eligibilityValidation();
    if (!Boolean(isSelectEligibility)) return false;
  }

  //  HANDLE ALL FORM SUBMISSIONS AND STEP VALIDATION
  console.log(handleFloodForms(floodStep));
  if (!handleFloodForms(floodStep)) return false;

  // Step Increment
  floodStep >= floodMaxStep ? floodStep : floodStep++;

  // Show Form
  showActiveForm(floodStep, floodFormList);
});

// Back
backBtn?.addEventListener("click", () => {
  // Step Decrement
  floodStep <= 0 ? floodStep : floodStep--;

  // 2 side back for add_more_vehicle_form
  if (floodStep + 1 === floodFormList.indexOf("add_more_vehicle_form")) {
    floodFormList = floodFormList.filter(
      (item) => item != "add_more_vehicle_form"
    );
    floodStep = floodFormList.indexOf("summary__form");
  }
  showActiveForm(floodStep);
});

// =*********************************************
//       HANDLING MULTI-STEP FORMS
// =*********************************************
function handleFloodForms(step) {
  // =*********************************************************
  if (step === floodFormList.indexOf("military_information")) {
    if (!militaryFormValidation()) return false;
  }
  if (step === floodFormList.indexOf("parent_information")) {
    if (!parentFormValidation()) return false;
  }
  if (step === floodFormList.indexOf("child_information")) {
    if (!childFormValidation()) return false;
  }
  if (step === floodFormList.indexOf("policyholder__form")) {
    if (!policyholderValidation(step)) return false;
  }
  if (step === floodFormList.indexOf("spouse_information")) {
    if (!spouseValidation()) return false;
  }
  if (step === floodFormList.indexOf("add_vehicle__form")) {
    if (!addVehicleValidation()) return false;
    summaryFunctionality();
  }
  if (step === floodFormList.indexOf("add_more_vehicle_form")) {
    if (!addMoreVehicleValidation()) return false;
    summaryFunctionality();
  }
  if (
    step === floodFormList.indexOf("summary__form") ||
    step === floodFormList.indexOf("summary__form") - 1
  ) {
    summaryFunctionality();
  }
  if (step === floodFormList.indexOf("violations__form")) {
    if (!violationsValidation()) return false;
  }

  if (step === floodFormList.indexOf("coverage_limits_form")) {
    if (!coverageLimitsValidation()) return false;
    functionalityForEachDamageForm();
  }
  if (step === floodFormList.indexOf("physical_damage_form")) {
    if (!physicalDamageValidation()) return false;
  }
  if (step === floodFormList.indexOf("coverage__history_form")) {
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
//   floodMaxStep = floodFormList.length - 1;

//   // remove active_form class from everywhere
//   document.querySelector(".active_form")?.classList.remove("active_form");

//   // set active_form class
//   document.querySelector(`.${floodFormList[step]}`)?.classList.add("active_form");

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
// eligibilityValidation(floodFormSteps);
// console.log(floodFormList);

// / ********** Military Information ***********
function militaryFormValidation() {
  const militaryFirstName = document.querySelector("#militaryFirstName");
  const militaryLastName = document.querySelector("#militaryLastName");
  const branchOfServiceEl = document.querySelector("#branchOfService");
  const militaryStatus = document.querySelector("#militaryStatus");
  const militaryRank = document.querySelector("#militaryRank");

  const validationFields = [
    alphabeticOnly(militaryFirstName),
    isValueEmpty(militaryFirstName),
    alphabeticOnly(militaryLastName),
    isValueEmpty(militaryLastName),
    isValueEmpty(branchOfServiceEl),
    isValueEmpty(militaryStatus),
    isValueEmpty(militaryRank),
  ];

  const isValidate = validationFields.every((result) => result === true);

  if (isValidate) {
    const military = (formData.militaryInfo = {});

    military.firstName = militaryFirstName?.value;
    military.lastName = militaryLastName?.value;
    military.branchOfService = branchOfService?.value;
    military.status = militaryStatus?.value;
    military.rank = militaryRank?.value;

    // Set Name in Multi-step form field
    document.querySelector("#policyHolderFirstName").value = military.firstName;
    document.querySelector("#policyHolderLastName").value = military.lastName;
  }

  return isValidate;
}

// / ********** Child's Information ***********
function childFormValidation() {
  const childFirstName = document.querySelector("#childFirstName");
  const childLastName = document.querySelector("#childLastName");

  const validationFields = [
    alphabeticOnly(childFirstName),
    alphabeticOnly(childLastName),
    isValueEmpty(childFirstName),
    isValueEmpty(childLastName),
  ];

  const isValidate = validationFields.every((result) => result === true);

  if (isValidate) {
    const child = (formData.childInfo = {});

    child.firstName = childFirstName?.value;
    child.lLastName = childLastName?.value;
  }

  return isValidate;
}

// / ********** Child's Information ***********
function parentFormValidation() {
  const parentFirstName = document.querySelector("#parentFirstName");
  const parentLastName = document.querySelector("#parentLastName");

  const validationFields = [
    alphabeticOnly(parentFirstName),
    alphabeticOnly(parentLastName),
    isValueEmpty(parentFirstName),
    isValueEmpty(parentLastName),
  ];

  const isValidate = validationFields.every((result) => result === true);

  if (isValidate) {
    const parent = (formData.parentInfo = {});

    parent.firstName = parentFirstName?.value;
    parent.lastName = parentLastName?.value;
  }

  return isValidate;
}

// *********************************************
//             STEP-1 VALIDATION
// *********************************************
function policyholderValidation(step) {
  const policyHolderFirstName = document.querySelector(
    "#policyHolderFirstName"
  );
  const policyHolderLastName = document.querySelector("#policyHolderLastName");
  const policyHolderSuffix = document.querySelector("#policyHolderSuffix");
  const policyHolderMailingAddress = document.querySelector(
    "#policyHolderMailingAddress"
  );
  const policyHolderCity = document.querySelector("#policyHolderCity");
  const policyHolderState = document.querySelector("#policyHolderState");
  const policyHolderZip = document.querySelector("#policyHolderZip");
  const policyHolderSsn = document.querySelector("#policyHolderSsn");
  const policyHolderDob = document.querySelector("#policyHolderDob");
  const policyHolderGender = document.querySelector("#policyHolderGender");
  const policyHolderMaritalStatus = document.querySelector(
    "#policyHolderMaritalStatus"
  );
  const policyHolderEmail = document.querySelector("#policyHolderEmail");
  const policyHolderPhoneType = document.querySelector(
    "#policyHolderPhoneType"
  );
  const policyHolderPhoneNumber = document.querySelector(
    "#policyHolderPhoneNumber"
  );
  const policyHolderResidenceStatus = document.querySelector(
    "#policyHolderResidenceStatus"
  );

  const validationFields = [
    alphabeticOnly(policyHolderFirstName),
    alphabeticOnly(policyHolderLastName),
    isValueEmpty(policyHolderFirstName),
    isValueEmpty(policyHolderLastName),
    isValueEmpty(policyHolderMailingAddress),
    isValueEmpty(policyHolderCity),
    isValueEmpty(policyHolderState),
    minValue(policyHolderZip, 5, "Please enter a valid Zip code"),
    isValueEmpty(policyHolderZip),
    minValue(policyHolderDob, 10, "Please enter a valid Date"),
    isValueEmpty(policyHolderDob),
    isValueEmpty(policyHolderGender),
    isValueEmpty(policyHolderMaritalStatus),
    isValueEmpty(policyHolderEmail),
    emailValidation(policyHolderEmail),
    isValueEmpty(policyHolderEmail),
    isValueEmpty(policyHolderPhoneType),
    phoneValidation(policyHolderPhoneNumber),
    isValueEmpty(policyHolderResidenceStatus),
  ];

  const isValidate = validationFields.every((result) => result === true);

  if (isValidate) {
    const policyHolder = formData.policyHolder;

    policyHolder.firstName = policyHolderFirstName?.value;
    policyHolder.lastName = policyHolderLastName?.value;
    policyHolder.suffix = policyHolderSuffix?.value;
    policyHolder.mailingAddress = policyHolderMailingAddress?.value;
    policyHolder.city = policyHolderCity?.value;
    policyHolder.state = policyHolderState?.value;
    policyHolder.zip = policyHolderZip?.value;
    policyHolder.ssn = policyHolderSsn?.value.replace(/\D/g, "");
    policyHolder.dob = policyHolderDob?.value;
    policyHolder.gender = policyHolderGender?.value;
    policyHolder.maritalStatus = policyHolderMaritalStatus?.value;
    policyHolder.email = policyHolderEmail?.value;
    policyHolder.phoneType = policyHolderPhoneType?.value;
    policyHolder.phoneNumber = policyHolderPhoneNumber?.value.replace(
      /\D/g,
      ""
    );
    policyHolder.residenceStatus = policyHolderResidenceStatus?.value;

    // SHOW SPOUSE INFORMATION FORM, IF HAVE
    const spouseValues = [
      "Married",
      "Cohabitant",
      "Civil Union Or Domestic Partner",
    ];

    if (spouseValues.includes(formData.policyHolder?.maritalStatus)) {
      if (!floodFormList.includes("spouse_information")) {
        floodFormList.splice(step + 1, 0, "spouse_information");
      }
    }
    if (!spouseValues.includes(formData.policyHolder?.maritalStatus)) {
      floodFormList = floodFormList.filter(
        (form) => form != "spouse_information"
      );
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
