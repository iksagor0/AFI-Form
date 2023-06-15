// DATA
const floodFormData = {
  eligibilityStatus: "",
};

// const successRedirection = "https://afi.org/";
// const successRedirection = "../--Model/thank-you.html";

// Forms
const multiStepForm = [
  "policyholder__form",
  "summary__form",
  "property_quoted_form",
  "property_overview_form",
  "property_details_form",
];

let formList = ["radio_select", ...multiStepForm];

// *********************************************
//       FORM SUBMISSION AND STEP HANDLING
// *********************************************
const nextBtn = document.querySelector("#next_btn");
const backBtn = document.querySelector("#back_btn");

let stepCount = 0;
let maxStep = formList.length - 1;

// ***** NEXT FUNCTIONALITY *****
nextBtn.addEventListener("click", () => {
  if (stepCount === 0) {
    const isSelectEligibility = eligibilityValidation();
    if (!Boolean(isSelectEligibility)) return false;
  }

  //  HANDLE ALL FORM SUBMISSIONS AND STEP VALIDATION
  if (!handleMultiStepForm(stepCount)) return false;

  // Step Increment
  stepCount >= maxStep ? stepCount : stepCount++;

  // Show Form
  showActiveForm(stepCount);
});

// Back
backBtn.addEventListener("click", () => {
  // Step Decrement
  stepCount <= 0 ? stepCount : stepCount--;

  // 2 side back for add_more_vehicle_form
  if (stepCount + 1 === formList.indexOf("add_more_vehicle_form")) {
    formList = formList.filter((item) => item != "add_more_vehicle_form");
    stepCount = formList.indexOf("summary__form");
  }
  showActiveForm(stepCount);
});

// =*********************************************
//       HANDLING MULTI-STEP FORMS
// =*********************************************
function handleMultiStepForm(step) {
  // =*********************************************************
  if (step === formList.indexOf("military_information")) {
    if (!militaryFormValidation()) return false;
  }
  if (step === formList.indexOf("parent_information")) {
    if (!parentFormValidation()) return false;
  }
  if (step === formList.indexOf("child_information")) {
    if (!childFormValidation()) return false;
  }
  if (step === formList.indexOf("policyholder__form")) {
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

  // Run after every submission
  runVehicleItemsFunctionality();

  return true;
}

// =*********************************************
//           SHOW FORM BY CONDITION
// =*********************************************
function showActiveForm(step) {
  maxStep = formList.length - 1;

  // remove active_form class from everywhere
  document.querySelector(".active_form")?.classList.remove("active_form");

  // set active_form class
  document.querySelector(`.${formList[step]}`)?.classList.add("active_form");

  console.log({ stepCount });
  console.log(formData);

  // Conditionally Hide Back Btn
  stepCount <= 0
    ? backBtn.classList.add("hide")
    : backBtn.classList.remove("hide");
}

// =*********************************************
//              ERROR HANDLING
// =*********************************************
// Error Message if value user makes any mistake
function eligibilityErrorMessage(data, selector) {
  const errorDiv = document.querySelector(selector);

  if (!data) {
    errorDiv?.classList.add("error");
  } else {
    errorDiv?.classList.remove("error");
  }
}

function inputErrorMessage(selector, msg, removeError) {
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

  if (removeError === true) {
    hasErrorField?.remove();
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

// Alphabetic only Validation after Submit
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

dollarField.addEventListener("input", (e) => {
  if (e.target.value) {
    let modifiedValue = e.target.value.match(/.{1,3}/g).join(",");
    e.target.value = `$${modifiedValue}`;
  }
});

// Date Validation
function dateValidation(field, getMaxYear) {
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
const policyRenewalDate = document.querySelector("#policyRenewalDate");
const DOB = document.querySelector("#policyHolderDob");
const violationsDates = document.querySelectorAll(".householdViolationsDate");
const spouseDOB = document.querySelector("#cohabitantDob");

const thisYear = new Date().getFullYear();
dateValidation(policyRenewalDate, thisYear + 2);
dateValidation(DOB, thisYear - 17);
dateValidation(spouseDOB, thisYear - 17);
violationsDates.forEach((vDate) => dateValidation(vDate, thisYear));

// *********************************************
//              FORM VALIDATION
// *********************************************
// / ********** Eligibility Validation ***********
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
      formList = ["radio_select", ...multiStepForm];
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
  subStepCount = 0;
  return eligibilityStatus;
}

// / ********** Military Information ***********
function militaryFormValidation() {
  const militaryFirstName = document.querySelector("#militaryFirstName");
  const militaryLastName = document.querySelector("#militaryLastName");
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
      if (!formList.includes("spouse_information")) {
        formList.splice(step + 1, 0, "spouse_information");
      }
    }
    if (!spouseValues.includes(formData.policyHolder?.maritalStatus)) {
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
let editVehicleIndex = -1;

// ********** "+ Add Vehicle" BUTTON FUNCTIONALITY  ***********
const addVehicle = document.getElementById("addVehicle");

addVehicle.addEventListener("click", () => {
  const fields = document.querySelectorAll(
    ".add_more_vehicle_form .field__input"
  );
  fields.forEach((field) => (field.value = ""));

  if (!formList.includes("add_more_vehicle_form")) {
    const summaryIndex = formList.indexOf("summary__form");
    formList.splice(summaryIndex, 0, "add_more_vehicle_form");
  }
  showActiveForm(stepCount);
});

// ********** FUNCTIONALITY OF VEHICLE FORM : Edit ***********
const mainVehicleEditBtn = document.getElementById("mainVehicleEditBtn");
mainVehicleEditBtn.addEventListener("click", () => {
  const summaryIndex = formList.indexOf("summary__form");

  if (!formList.includes("add_vehicle__form")) {
    formList.splice(summaryIndex, 0, "add_vehicle__form");
  }

  showActiveForm(stepCount);
});

// ********** FUNCTIONALITY OF MORE VEHICLE FORMS : Edit, Delete ***********
function runVehicleItemsFunctionality() {
  const moreVehicles = document.getElementById("moreVehicles");
  const moreVehicleItems = moreVehicles.querySelectorAll(
    ".quote_request__summary_item"
  );

  moreVehicleItems.forEach((item, itemIndex) => {
    const editBtn = item.querySelector("#editBtn");
    const deleteBtn = item.querySelector("#deleteBtn");
    const deleteYes = item.querySelector("#deleteYes");
    const deleteNo = item.querySelector("#deleteNo");

    editBtn?.addEventListener("click", () => {
      editVehicleIndex = itemIndex;

      if (!formList.includes("add_more_vehicle_form")) {
        const summaryIndex = formList.indexOf("summary__form");
        formList.splice(summaryIndex, 0, "add_more_vehicle_form");

        showActiveForm(stepCount);

        // Assign the values
        function editFormWithValue(id, value) {
          document.getElementById(id).value =
            formData.vehicleInfo.vehicles[itemIndex + 1][value];
        }

        editFormWithValue("moreVehicleYear", "year");
        editFormWithValue("moreVehicleMake", "make");
        editFormWithValue("moreVehicleModel", "model");
        editFormWithValue("moreVehicleType", "type");
        editFormWithValue("moreVehicleEstimatedValue", "estimateValue");
        editFormWithValue("moreVehicleStorage", "vehicleStorage");
        editFormWithValue("moreVehicleDriveDescription", "howVehicleDrive");
      }
    });

    deleteBtn.addEventListener("click", () => {
      item.querySelector(".yes_no")?.classList.remove("__hide");
      item.querySelector(".delete_edit")?.classList.add("__hide");
    });

    deleteNo.addEventListener("click", () => {
      item.querySelector(".yes_no")?.classList.add("__hide");
      item.querySelector(".delete_edit")?.classList.remove("__hide");
    });

    deleteYes.addEventListener("click", () => {
      formData.vehicleInfo.vehicles[itemIndex + 1] = "deleted";
      item.classList.add("__hide");
      // item.remove(); // delete elements
      console.log(formData.vehicleInfo.vehicles);
    });
  });
}

// *********************************************
//              STEP-2 VALIDATION
// *********************************************
function summaryFunctionality() {
  // Check Main Vehicle data OKK or Not
  const mainVehicleFields = document.querySelectorAll(
    ".add_vehicle__form .field__input"
  );

  const mainVehicleValues = [];
  mainVehicleFields.forEach((field) => mainVehicleValues.push(field.value));

  const haveAllMainVehicleValues = mainVehicleValues.every(
    (v) => Boolean(v) === true
  );

  // If Main Vehicle Data OKK then direct show SUMMARY neither show add_vehicle__form
  if (!haveAllMainVehicleValues) {
    if (!formList.includes("add_vehicle__form")) {
      const summaryIndex = formList.indexOf("summary__form");

      formList.splice(summaryIndex, 0, "add_vehicle__form");
    }

    showActiveForm(stepCount);
  } else {
    formList = formList.filter((form) => form != "add_vehicle__form");
    // show data in Summary
    if (formData.vehicleInfo.vehicles.length > 0) {
      const { year, make, model } = formData.vehicleInfo.vehicles[0];
      document.querySelector(
        ".quote_request__summary_main_item_info"
      ).innerText = `${year} ${make} ${model}`;
    }
  }

  // Add all data to moreVehicles sections
  formData.vehicleInfo.vehicles = formData.vehicleInfo.vehicles.filter(
    (item) => item !== "deleted"
  );

  const moreVehicles = formData.vehicleInfo.vehicles.filter(
    (item, index) => index > 0
  );

  const addedSummary = document.querySelector("#moreVehicles");
  const totalAdded = addedSummary.children?.length;

  // if all data not appended then Append Data to #moreVehicles
  if (moreVehicles.length > 0) {
    addedSummary.innerHTML = "";
    const demoItem = document.querySelector(
      ".quote_request__summary_item.demoItem"
    );
    // Clone the demo, create and append
    moreVehicles.forEach((info) => {
      const clonedItem = demoItem.cloneNode(true);
      clonedItem.classList.remove("__hide", "demoItem");
      clonedItem.querySelector(
        ".quote_request__summary_item_info"
      ).innerHTML = `${info?.year} ${info?.make} ${info?.model}`;

      // append clone element in Summary
      addedSummary.appendChild(clonedItem);
    });
  }
}

function addVehicleValidation() {
  const Year = document.querySelector("#mainVehicleYear");
  const Make = document.querySelector("#mainVehicleMake");
  const Model = document.querySelector("#mainVehicleModel");
  const Type = document.querySelector("#mainVehicleType");
  const EstimatedValue = document.querySelector("#mainVehicleEstimatedValue");
  const Storage = document.querySelector("#mainVehicleStorage");
  const DriveDescription = document.querySelector(
    "#mainVehicleDriveDescription"
  );
  const LicensedDriverCount = document.querySelector(
    "#mainVehicleLicensedDriverCount"
  );
  const NumberOfDailyUse = document.querySelector(
    "#mainVehicleNumberOfDailyUse"
  );

  const validationFields = [
    isValueEmpty(Year),
    isValueEmpty(Make),
    isValueEmpty(Model),
    isValueEmpty(Type),
    isValueEmpty(EstimatedValue),
    isValueEmpty(Storage),
    isValueEmpty(DriveDescription),
    isValueEmpty(LicensedDriverCount),
    isValueEmpty(NumberOfDailyUse),
  ];

  const isValidate = validationFields.every((result) => result === true);

  if (isValidate) {
    const vehicle = (formData.vehicleInfo.vehicles[0] = {});

    vehicle.year = Year?.value;
    vehicle.make = Make?.value;
    vehicle.model = Model?.value;
    vehicle.type = Type?.value;
    vehicle.estimateValue = EstimatedValue?.value.replace(/\D/g, "");
    vehicle.vehicleStorage = Storage?.value;
    vehicle.howVehicleDrive = DriveDescription?.value;
    formData.vehicleInfo.numberOfLicensedDrivers = LicensedDriverCount?.value;
    formData.vehicleInfo.numberOfDailyUseVehicle = NumberOfDailyUse?.value;

    // REDUCE stepCount cz add_vehicle__form will remove from the formList
    const summaryIndex = formList.indexOf("summary__form");
    stepCount = summaryIndex - 2;
  }

  return isValidate;
}

function addMoreVehicleValidation() {
  const Year = document.querySelector("#moreVehicleYear");
  const Make = document.querySelector("#moreVehicleMake");
  const Model = document.querySelector("#moreVehicleModel");
  const Type = document.querySelector("#moreVehicleType");
  const EstimatedValue = document.querySelector("#moreVehicleEstimatedValue");
  const Storage = document.querySelector("#moreVehicleStorage");
  const DriveDescription = document.querySelector(
    "#moreVehicleDriveDescription"
  );

  const validationFields = [
    isValueEmpty(Year),
    isValueEmpty(Make),
    isValueEmpty(Model),
    isValueEmpty(Type),
    isValueEmpty(EstimatedValue),
    isValueEmpty(Storage),
    isValueEmpty(DriveDescription),
  ];

  const isValidate = validationFields.every((result) => result === true);

  if (isValidate) {
    const vehicle = {
      year: Year?.value,
      make: Make?.value,
      model: Model?.value,
      type: Type?.value,
      estimateValue: EstimatedValue?.value.replace(/\D/g, ""),
      vehicleStorage: Storage?.value,
      howVehicleDrive: DriveDescription?.value,
    };

    // UPDATE or CREATE Vehicle Data
    if (editVehicleIndex >= 0) {
      formData.vehicleInfo.vehicles[editVehicleIndex + 1] = vehicle;
      editVehicleIndex = -1;
    } else {
      formData.vehicleInfo.vehicles.push(vehicle);
    }

    // REDUCE stepCount and REMOVE add_more_vehicle_form from the formList
    const summaryIndex = formList.indexOf("summary__form");
    stepCount = summaryIndex - 2;
    formList = formList.filter((item) => item != "add_more_vehicle_form");
  }

  return isValidate;
}

// *********************************************
//              STEP-3 FUNCTIONALITY
// *********************************************
const addViolationBtn = document.getElementById("add_violation_btn");
const violationsFields = document.querySelector(".violation_info_fields");
const violationWrapper = document.getElementById(
  "violation_info_fields_wrapper"
);

// ******************* Violation Form Functionality *******************
// ADD MORE VIOLATIONS FIELDS
addViolationBtn.addEventListener("click", () => {
  const newFields = violationsFields.cloneNode(true);
  newFields
    .querySelectorAll(".field__input")
    .forEach((field) => (field.value = ""));
  violationWrapper.appendChild(newFields);

  // Data Validator added
  document
    .querySelectorAll(".householdViolationsDate")
    .forEach((vDate) => dateValidation(vDate, thisYear));

  // for new fields
  clearFieldErrorMsg();
});

const hasViolationsFields = document.getElementsByName(
  "householdViolationsPreviousClaims"
);

// IF householdViolationsPreviousClaims value not== Yes, then disable all
function disableViolationInputs(disable = true) {
  const violationInputs = violationWrapper.querySelectorAll(".field__input");
  violationInputs.forEach((input) => (input.disabled = disable));
  addViolationBtn.disabled = disable;
}
disableViolationInputs(true);

const getViolationsValue = () => {
  let value = "";
  hasViolationsFields?.forEach((field) => {
    if (field?.checked) value = field.value;
  });

  return value;
};

// Get every violation Radio field's value
hasViolationsFields.forEach((fields) => {
  fields.addEventListener("change", () => {
    let getValue = getViolationsValue();

    if (getValue === "Yes") {
      disableViolationInputs(false);
    } else {
      disableViolationInputs(true);
    }

    const fieldContainer = document.querySelector(".violations__form");
    const errors = fieldContainer.querySelectorAll(".field_message.error");
    errors.forEach((error) => error.remove());
  });
});

// **** coverageLimitsValidation 'qrf-accordion' Functionality ****
const accordionButtons = document.querySelectorAll(".qrf-accordion__trigger");

accordionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const accordion = button.closest(".qrf-accordion");
    accordion.classList.toggle("qrf-accordion--active");
  });
});

// ********* FUNCTIONALITY physical_damage_form *********
function functionalityForEachDamageForm() {
  const damageForm = document.querySelector(".damage__form.__hide");
  const DamageFormWrapper = document.getElementById(
    "physical_damage_form_wrapper"
  );
  const vehicleList = formData.vehicleInfo.vehicles;

  // Clear DamageFormWrapper Children
  DamageFormWrapper.innerHTML = "";

  // Add Vehicle data to DamageFormWrapper with other fields
  vehicleList.forEach((vehicleData, index) => {
    const clonedItem = damageForm.cloneNode(true);

    clonedItem.classList.remove("__hide");
    clonedItem.querySelector(
      ".vehicle_name"
    ).innerHTML = `${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`;

    // liability radio fields functionality
    const liabilityYes = clonedItem.querySelector("#liability--Yes");
    const liabilityNo = clonedItem.querySelector("#liability--No");

    liabilityYes.name = liabilityNo.name = `liability_${index}`;

    liabilityNo?.addEventListener("change", toggleDisability);
    liabilityYes?.addEventListener("change", toggleDisability);

    function toggleDisability() {
      const disabledFields = clonedItem.querySelectorAll(
        ".field__input.damage"
      );
      if (liabilityNo.checked) {
        disabledFields.forEach((field) => {
          field.disabled = false;
        });
      } else {
        disabledFields.forEach((field) => {
          inputErrorMessage(field, "", true);
          field.disabled = true;
        });
      }
    }

    DamageFormWrapper.appendChild(clonedItem);
  });
}

// *********************************************
//              STEP-3 VALIDATION
// *********************************************
function violationsValidation() {
  if (getViolationsValue() === "No") {
    formData.householdViolations = "No violations in last 5 years";
    return true;
  } else if (getViolationsValue() === "Yes") {
    const fieldsWrapper = document.querySelectorAll(".violation_info_fields");

    const violations = [];

    fieldsWrapper.forEach((field) => {
      const driverField = field.querySelector("#householdViolationsDriver");
      const typeField = field.querySelector("#householdViolationsType");
      const dateField = field.querySelector("#householdViolationsDate");

      const validationFields = [
        alphabeticOnly(driverField),
        isValueEmpty(driverField),
        isValueEmpty(typeField),
        minValue(dateField, 10, "Please enter a valid Date"),
        isValueEmpty(dateField),
      ];

      const isValidate = validationFields.every((result) => result === true);

      if (isValidate) {
        const violationData = {
          driver: driverField.value,
          type: typeField.value,
          date: dateField.value,
        };
        violations.push(violationData);
      }
    });

    const checkedYes = document.getElementById(
      "householdViolationsPreviousClaims--Yes"
    ).checked;

    // if (checkedYes) {
    formData.householdViolations = violations;
    return fieldsWrapper.length === violations.length;
  } else {
    const fieldContainer = document.querySelector(
      ".has_violation_inputs_container"
    );
    isValueEmpty(fieldContainer);

    return false;
  }
}

function coverageLimitsValidation() {
  const bodilyInjuryLiability = document.querySelector(
    "#bodilyInjuryLiability"
  );
  const propertyDamageLiability = document.querySelector(
    "#propertyDamageLiability"
  );
  const medicalPayment = document.querySelector("#medicalPayment");
  const uninsuredMotoristBodilyInjury = document.querySelector(
    "#uninsuredMotoristBodilyInjury"
  );

  const validationFields = [
    isValueEmpty(bodilyInjuryLiability),
    isValueEmpty(propertyDamageLiability),
    isValueEmpty(medicalPayment),
    isValueEmpty(uninsuredMotoristBodilyInjury),
  ];

  const isValidate = validationFields.every((result) => result === true);

  if (isValidate) {
    const data = formData.policyCoverageLimits;
    data.bodilyInjuryLiability = bodilyInjuryLiability?.value;
    data.propertyDamageLiability = propertyDamageLiability?.value;
    data.medicalPayment = medicalPayment?.value;
    data.uninsuredMotoristBodilyInjury = uninsuredMotoristBodilyInjury?.value;
  }

  return isValidate;
}

function physicalDamageValidation() {
  const liabilityData = [];

  const wrapper = document.getElementById("physical_damage_form_wrapper");
  const damageFieldSections = wrapper.querySelectorAll(".damage__form");

  // VALIDATE EVERY FIELD SECTION
  damageFieldSections.forEach((section) => {
    const getFields = () => {
      return section.querySelectorAll(".field__input.damage");
    };

    let sectionData = {
      liabilityOnlyCoverage: "Yes",
    };
    const validationFields = [true];

    getFields().forEach((field) => {
      if (field.disabled) {
        // If field is disabled then Remove error msg element
        inputErrorMessage(field, "", true);
        inputErrorMessage(field, "", true);
      } else {
        clearFieldErrorMsg();

        // If field is enabled then check validation and get data
        const isFieldValid = isValueEmpty(field);
        validationFields.push(isFieldValid);
        if (isFieldValid) {
          sectionData.liabilityOnlyCoverage = "No";
          sectionData = {
            ...sectionData,
            [field.name]: field.value,
          };
        }
      }
    });

    // If this section is Valid then set date
    const isValidate = validationFields.every((result) => result === true);
    if (isValidate) {
      liabilityData.push(sectionData);
    }
  });

  // If all sections are field and data is valid then set date to formData Vehicle
  const isAllDataValid = liabilityData.length === damageFieldSections.length;
  if (isAllDataValid) {
    liabilityData.forEach((data, i) => {
      formData.vehicleInfo.vehicles[i].liabilityData = liabilityData[i];
    });
  }

  return isAllDataValid;
}

// *********************************************
//              STEP-4 VALIDATION
// *********************************************
function coverageHistoryValidation() {
  const currentInsuranceCompany = document.querySelector(
    "#currentInsuranceCompany"
  );
  const insuranceCompany = document.querySelector("#insuranceCompany");
  const policyRenewalDate = document.querySelector("#policyRenewalDate");

  //   const isValidate = validationFields.every((result) => result === true);
  const history = formData.coverageHistory;

  history.currentInsuranceCompany = currentInsuranceCompany?.value;
  history.insuranceCompany = insuranceCompany?.value;
  history.policyRenewalDate = policyRenewalDate?.value;

  let validationFields = true;

  if (currentInsuranceCompany?.value === "Other") {
    // if currentInsuranceCompany = "Other" then Insurance Company value id required
    const isValid = isValueEmpty(insuranceCompany);
    if (!isValid) validationFields = false;
  }

  if (policyRenewalDate?.value.length > 0) {
    // User Inputted Data then check the value Valid or not
    const isValid = minValue(
      policyRenewalDate,
      10,
      "Please enter a valid Date"
    );

    if (!isValid) validationFields = false;
  }

  return validationFields;
}

// if currentInsuranceCompany = "Other" then Insurance Company field will show
const currentInsuranceCompany = document.querySelector(
  "#currentInsuranceCompany"
);
currentInsuranceCompany.addEventListener("change", () => {
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
