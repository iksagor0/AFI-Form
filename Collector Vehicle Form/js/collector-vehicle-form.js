// DATA
const formData = {
  eligibilityStatus: "",
  policyHolderMaritalStatus: null,
  mainVehicleInfo: {
    year: "2023",
    make: "HP",
    model: "Proton Saga",
    type: "Stock",
    estimateValue: "3000",
    vehicleStorage: "Private Garage",
    howVehicleDrive: "lol",
    NumberOfLicensedDrivers: "2",
    NumberOfDailyUseVehicle: "2",
  },

  moreVehiclesInfo: [
    {
      year: "33",
      make: "33",
      model: "33",
      type: "Stock",
      estimateValue: "33",
      vehicleStorage: "Private Garage",
      howVehicleDrive: "33",
    },
  ],
  householdViolations: [],
};

const successRedirection = "https://afi.org/";

// Forms
const multiStepForm = [
  "policyholder__form",
  // "add_vehicle__form",
  "summary__form",
  "violations__form",
  "coverage_limits_form",
  "physical_damage_form",
  "coverage__history_form",
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
    summaryValidation();
  }
  if (step === formList.indexOf("add_more_vehicle_form")) {
    if (!addMoreVehicleValidation()) return false;
    summaryValidation();
  }
  if (
    step === formList.indexOf("summary__form") ||
    step === formList.indexOf("summary__form") - 1
  ) {
    summaryValidation();
  }
  if (step === formList.indexOf("violations__form")) {
    if (!violationsValidation()) return false;
  }

  if (step === formList.indexOf("coverage_limits_form")) {
    if (!coverageLimitsValidation()) return false;
    functionalityForEachDamageForm();
  }
  if (step === formList.indexOf("physical_damage_form")) {
    if (!physicalHistoryValidation()) return false;
  }
  if (step === formList.indexOf("coverage__history_form")) {
    if (!coverageHistoryValidation()) return false;
  }

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
    formData.policyHolderFirstName = militaryFirstName?.value;
    formData.policyHolderLastName = militaryLastName?.value;
    formData.branchOfService = branchOfService?.value;
    formData.militaryStatus = militaryStatus?.value;
    formData.militaryRank = militaryRank?.value;

    // Set Name in Multi-step form field
    document.querySelector("#policyHolderFirstName").value =
      formData?.policyHolderFirstName;

    document.querySelector("#policyHolderLastName").value =
      formData?.policyHolderLastName;
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
// / ********** Parent's Information ***********
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
    formData.parentFirstName = parentFirstName?.value;
    formData.parentLastName = parentLastName?.value;
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
    formData.childFirstName = childFirstName?.value;
    formData.childLastName = childLastName?.value;
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

  // if (isValidate) {
  formData.policyHolderFirstName = policyHolderFirstName?.value;
  formData.policyHolderLastName = policyHolderLastName?.value;
  formData.policyHolderSuffix = policyHolderSuffix?.value;
  formData.policyHolderMailingAddress = policyHolderMailingAddress?.value;
  formData.policyHolderCity = policyHolderCity?.value;
  formData.policyHolderState = policyHolderState?.value;
  formData.policyHolderZip = policyHolderZip?.value;
  formData.policyHolderSsn = policyHolderSsn?.value.replace(/\D/g, "");
  formData.policyHolderDob = policyHolderDob?.value;
  formData.policyHolderGender = policyHolderGender?.value;
  formData.policyHolderMaritalStatus = policyHolderMaritalStatus?.value;
  formData.policyHolderEmail = policyHolderEmail?.value;
  formData.policyHolderPhoneType = policyHolderPhoneType?.value;
  formData.policyHolderPhoneNumber = policyHolderPhoneNumber?.value.replace(
    /\D/g,
    ""
  );
  formData.policyHolderResidenceStatus = policyHolderResidenceStatus?.value;

  // SHOW SPOUSE INFORMATION FORM, IF HAVE
  const spouseValues = [
    "Married",
    "Cohabitant",
    "Civil Union Or Domestic Partner",
  ];

  if (spouseValues.includes(formData?.policyHolderMaritalStatus)) {
    if (!formList.includes("spouse_information")) {
      formList.splice(step + 1, 0, "spouse_information");
    }
  }
  if (!spouseValues.includes(formData?.policyHolderMaritalStatus)) {
    formList = formList.filter((form) => form != "spouse_information");
    console.log("aaaaaaaaaaaa spouse_information");
  }
  // }

  // return isValidate;
  return true;
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
    isValueEmpty(cohabitantDob),
    isValueEmpty(cohabitantGender),
  ];

  const isValidate = validationFields.every((result) => result === true);

  if (isValidate) {
    formData.cohabitantFirstName = cohabitantFirstName?.value;
    formData.cohabitantLastName = cohabitantLastName?.value;
    formData.cohabitantSuffix = cohabitantSuffix?.value;
    formData.cohabitantSsn = cohabitantSsn?.value.replace(/\D/g, "");
    formData.cohabitantDob = cohabitantDob?.value;
    formData.cohabitantGender = cohabitantGender?.value;
  }

  return isValidate;
  // return true;
}

// *********************************************
//              STEP-2 FUNCTIONALITY
// *********************************************
const summaryFormIndex = formList.indexOf("summary__form");
let editVehicleIndex = -1;

// ********** "+ Add Vehicle" BUTTON FUNCTIONALITY  ***********
const addVehicle = document.getElementById("addVehicle");

addVehicle.addEventListener("click", () => {
  const fields = document.querySelectorAll(
    ".add_more_vehicle_form .field__input"
  );
  fields.forEach((field) => (field.value = ""));

  if (!formList.includes("add_more_vehicle_form")) {
    formList.splice(summaryFormIndex, 0, "add_more_vehicle_form");
  }
  showActiveForm(stepCount);
});

// ********** FUNCTIONALITY OF VEHICLE FORM : Edit ***********
const mainVehicleEditBtn = document.getElementById("mainVehicleEditBtn");
mainVehicleEditBtn.addEventListener("click", () => {
  if (!formList.includes("add_vehicle__form")) {
    formList.splice(summaryFormIndex, 0, "add_vehicle__form");
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
        formList.splice(summaryFormIndex, 0, "add_more_vehicle_form");

        showActiveForm(stepCount);

        // Assign the values
        function editFormWithValue(id, value) {
          document.getElementById(id).value =
            formData.moreVehiclesInfo[itemIndex][value];
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
      formData.moreVehiclesInfo.splice(itemIndex, 1);
      item.classList.add("__hide");
      // item.remove();
    });
  });
}

// *********************************************
//              STEP-2 VALIDATION
// *********************************************
function summaryValidation() {
  // Check Main Vehicle data OKK or Not
  const mainVehicleValues = [];
  for (const key in formData.mainVehicleInfo) {
    mainVehicleValues.push(formData.mainVehicleInfo[key]);
  }
  const haveAllMainVehicleValues = mainVehicleValues.every(
    (v) => Boolean(v) === true
  );

  // If Main Vehicle Data OKK then direct show SUMMARY neither show add_vehicle__form
  if (!haveAllMainVehicleValues) {
    if (!formList.includes("add_vehicle__form")) {
      formList.splice(summaryFormIndex, 0, "add_vehicle__form");
    }

    showActiveForm(stepCount);
  } else {
    formList = formList.filter((form) => form != "add_vehicle__form");
    // show data in Summary
    const { year, make, model } = formData.mainVehicleInfo;
    document.querySelector(
      ".quote_request__summary_main_item_info"
    ).innerText = `${year} ${make} ${model}`;
  }

  // Add all data to moreVehicles sections
  const moreVehicles = formData.moreVehiclesInfo;
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
    formData.mainVehicleInfo.year = Year?.value;
    formData.mainVehicleInfo.make = Make?.value;
    formData.mainVehicleInfo.model = Model?.value;
    formData.mainVehicleInfo.type = Type?.value;
    formData.mainVehicleInfo.estimateValue = EstimatedValue?.value;
    formData.mainVehicleInfo.vehicleStorage = Storage?.value;
    formData.mainVehicleInfo.howVehicleDrive = DriveDescription?.value;
    formData.mainVehicleInfo.NumberOfLicensedDrivers =
      LicensedDriverCount?.value;
    formData.mainVehicleInfo.NumberOfDailyUseVehicle = NumberOfDailyUse?.value;

    // REDUCE stepCount cz add_vehicle__form will remove from the formList
    stepCount = summaryFormIndex - 1;
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
      estimateValue: EstimatedValue?.value,
      vehicleStorage: Storage?.value,
      howVehicleDrive: DriveDescription?.value,
    };

    // UPDATE or CREATE Vehicle Data
    if (editVehicleIndex >= 0) {
      formData.moreVehiclesInfo[editVehicleIndex] = vehicle;
      editVehicleIndex = -1;
    } else {
      formData.moreVehiclesInfo.push(vehicle);
    }

    // REDUCE stepCount and REMOVE add_more_vehicle_form from the formList
    stepCount = summaryFormIndex - 1;
    formList = formList.filter((item) => item != "add_more_vehicle_form");
  }

  return isValidate;
  // return true;
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
  violationWrapper.appendChild(newFields);

  // Data Validator added
  document
    .querySelectorAll(".householdViolationsDate")
    .forEach((vDate) => dateValidation(vDate, thisYear));
});

const hasViolationsFields = document.getElementsByName(
  "householdViolationsPreviousClaims"
);

let isDisabledViolation = true;

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
  });
});

// ********* FUNCTIONALITY physical_damage_form *********
function functionalityForEachDamageForm() {
  const damageForm = document.querySelector(".damage__form.__hide");
  const DamageFormWrapper = document.getElementById(
    "physical_damage_form_wrapper"
  );
  const vehicleList = [formData.mainVehicleInfo, ...formData.moreVehiclesInfo];

  // Clear DamageFormWrapper Children
  DamageFormWrapper.innerHTML = "";

  // Add Vehicle data to DamageFormWrapper with other fields
  vehicleList.forEach((vehicleData, index) => {
    const clonedItem = damageForm.cloneNode(true);

    clonedItem.classList.remove("__hide");
    clonedItem.querySelector(
      ".vehicle_name"
    ).innerHTML = `${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`;

    // ------------------------------------------
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
        disabledFields.forEach((field) => (field.disabled = false));
      } else {
        disabledFields.forEach((field) => (field.disabled = true));
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
    return true;
  } else {
    const fieldsWrapper = document.querySelectorAll(".violation_info_fields");

    //
    return false;
  }
}

function coverageLimitsValidation() {
  // Form Validation here

  return true;
}

function physicalDamageValidation() {
  // Form Validation here

  return true;
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

  formData.currentInsuranceCompany = currentInsuranceCompany?.value;
  formData.insuranceCompany = insuranceCompany?.value;
  formData.policyRenewalDate = policyRenewalDate?.value;

  let validationFields = false;

  if (currentInsuranceCompany?.value === "Other") {
    // if currentInsuranceCompany = "Other" then Insurance Company value id required
    validationFields = !isValueEmpty(insuranceCompany);
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
