// const successRedirection = "https://afi.org/";
// const successRedirection = "../--Model/thank-you.html";

// Forms
const vehicleForms = [
  "policyholder_form",
  // "add_vehicle__form",
  "summary__form",
  "violations__form",
  "coverage_limits_form",
  "physical_damage_form",
  "coverage__history_form",
];

// *********************************************
//       FORM SUBMISSION AND STEP HANDLING
// *********************************************
const vehicleNextBtn = document.querySelector("#vehicleNextBtn");
const vehicleBackBtn = document.querySelector("#vehicleBackBtn");

let vehicleStep = 0;
let vehicleMaxStep = formList.length - 1;

// ***** NEXT FUNCTIONALITY *****
pressEnterToSubmit(vehicleNextBtn);
vehicleNextBtn.addEventListener("click", () => {
  if (vehicleStep === 0) {
    const isSelectEligibility = eligibilityValidation(vehicleForms);
    if (!Boolean(isSelectEligibility)) return false;
    vehicleMaxStep = formList.length - 1;
    militaryFormFunc();
  }
  //  HANDLE ALL FORM SUBMISSIONS AND STEP VALIDATION
  if (!handleVehicleStepForm(vehicleStep)) return false;

  // Step Increment
  vehicleStep >= vehicleMaxStep ? vehicleStep : vehicleStep++;

  // Show Form
  showActiveForm(vehicleStep, vehicleBackBtn);
});

// Back
vehicleBackBtn.addEventListener("click", () => {
  // Step Decrement
  vehicleStep <= 0 ? vehicleStep : vehicleStep--;

  // 2 side back for add_more_vehicle_form
  if (vehicleStep + 1 === formList.indexOf("add_more_vehicle_form")) {
    formList = formList.filter((item) => item != "add_more_vehicle_form");
    vehicleStep = formList.indexOf("summary__form");
  }
  showActiveForm(vehicleStep, vehicleBackBtn);
});

// =*********************************************
//       HANDLING MULTI-STEP FORMS
// =*********************************************
function handleVehicleStepForm(step) {
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
    //  floodPropertyQuotedFormFunc();
  }
  if (step === formList.indexOf("spouse_information")) {
    if (!validateForm("spouse_information")) return false;
  }

  //
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
    // summaryFunctionality();
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

// Date Validation
// const policyRenewalDate = document.querySelector("#policyRenewalDate");
// const DOB = document.querySelector("#policyHolderDob");
// const violationsDates = document.querySelectorAll(".householdViolationsDate");
// const spouseDOB = document.querySelector("#cohabitantDob");

// const thisYear = new Date().getFullYear();
// dateValidation(policyRenewalDate, thisYear + 2);
// dateValidation(DOB, thisYear - 17);
// dateValidation(spouseDOB, thisYear - 17);
// violationsDates.forEach((vDate) => dateValidation(vDate, thisYear));

// *********************************************
//              FORM VALIDATION
// *********************************************

// *********************************************
//             STEP-1 VALIDATION
// *********************************************
// function policyholderValidation(step) {
//   const policyHolderFirstName = document.querySelector(
//     "#policyHolderFirstName"
//   );
//   const policyHolderLastName = document.querySelector("#policyHolderLastName");
//   const policyHolderSuffix = document.querySelector("#policyHolderSuffix");
//   const policyHolderMailingAddress = document.querySelector(
//     "#policyHolderMailingAddress"
//   );
//   const policyHolderCity = document.querySelector("#policyHolderCity");
//   const policyHolderState = document.querySelector("#policyHolderState");
//   const policyHolderZip = document.querySelector("#policyHolderZip");
//   const policyHolderSsn = document.querySelector("#policyHolderSsn");
//   const policyHolderDob = document.querySelector("#policyHolderDob");
//   const policyHolderGender = document.querySelector("#policyHolderGender");
//   const policyHolderMaritalStatus = document.querySelector(
//     "#policyHolderMaritalStatus"
//   );
//   const policyHolderEmail = document.querySelector("#policyHolderEmail");
//   const policyHolderPhoneType = document.querySelector(
//     "#policyHolderPhoneType"
//   );
//   const policyHolderPhoneNumber = document.querySelector(
//     "#policyHolderPhoneNumber"
//   );
//   const policyHolderResidenceStatus = document.querySelector(
//     "#policyHolderResidenceStatus"
//   );

//   const validationFields = [
//     alphabeticOnly(policyHolderFirstName),
//     alphabeticOnly(policyHolderLastName),
//     isValueEmpty(policyHolderFirstName),
//     isValueEmpty(policyHolderLastName),
//     isValueEmpty(policyHolderMailingAddress),
//     isValueEmpty(policyHolderCity),
//     isValueEmpty(policyHolderState),
//     minValue(policyHolderZip, 5, "Please enter a valid Zip code"),
//     isValueEmpty(policyHolderZip),
//     minValue(policyHolderDob, 10, "Please enter a valid Date"),
//     isValueEmpty(policyHolderDob),
//     isValueEmpty(policyHolderGender),
//     isValueEmpty(policyHolderMaritalStatus),
//     isValueEmpty(policyHolderEmail),
//     emailValidation(policyHolderEmail),
//     isValueEmpty(policyHolderEmail),
//     isValueEmpty(policyHolderPhoneType),
//     phoneValidation(policyHolderPhoneNumber),
//     isValueEmpty(policyHolderResidenceStatus),
//   ];

//   const isValidate = validationFields.every((result) => result === true);

//   if (isValidate) {
//     const policyHolder = formData.policyHolder;

//     policyHolder.firstName = policyHolderFirstName?.value;
//     policyHolder.lastName = policyHolderLastName?.value;
//     policyHolder.suffix = policyHolderSuffix?.value;
//     policyHolder.mailingAddress = policyHolderMailingAddress?.value;
//     policyHolder.city = policyHolderCity?.value;
//     policyHolder.state = policyHolderState?.value;
//     policyHolder.zip = policyHolderZip?.value;
//     policyHolder.ssn = policyHolderSsn?.value.replace(/\D/g, "");
//     policyHolder.dob = policyHolderDob?.value;
//     policyHolder.gender = policyHolderGender?.value;
//     policyHolder.maritalStatus = policyHolderMaritalStatus?.value;
//     policyHolder.email = policyHolderEmail?.value;
//     policyHolder.phoneType = policyHolderPhoneType?.value;
//     policyHolder.phoneNumber = policyHolderPhoneNumber?.value.replace(
//       /\D/g,
//       ""
//     );
//     policyHolder.residenceStatus = policyHolderResidenceStatus?.value;

//     // SHOW SPOUSE INFORMATION FORM, IF HAVE
//     const spouseValues = [
//       "Married",
//       "Cohabitant",
//       "Civil Union Or Domestic Partner",
//     ];

//     if (spouseValues.includes(formData.policyHolder?.maritalStatus)) {
//       if (!formList.includes("spouse_information")) {
//         formList.splice(step + 1, 0, "spouse_information");
//       }
//     }
//     if (!spouseValues.includes(formData.policyHolder?.maritalStatus)) {
//       formList = formList.filter((form) => form != "spouse_information");
//       console.log("aaaaaaaaaaaa spouse_information");
//     }
//   }

//   return isValidate;
// }

// function spouseValidation() {
//   const cohabitantFirstName = document.querySelector("#cohabitantFirstName");
//   const cohabitantLastName = document.querySelector("#cohabitantLastName");
//   const cohabitantSuffix = document.querySelector("#cohabitantSuffix");
//   const cohabitantSsn = document.querySelector("#cohabitantSsn");
//   const cohabitantDob = document.querySelector("#cohabitantDob");
//   const cohabitantGender = document.querySelector("#cohabitantGender");

//   const validationFields = [
//     alphabeticOnly(cohabitantFirstName),
//     alphabeticOnly(cohabitantLastName),
//     isValueEmpty(cohabitantFirstName),
//     isValueEmpty(cohabitantLastName),
//     minValue(cohabitantDob, 10, "Please enter a valid Date"),
//     isValueEmpty(cohabitantDob),
//     isValueEmpty(cohabitantGender),
//   ];

//   const isValidate = validationFields.every((result) => result === true);

//   if (isValidate) {
//     const cohabitant = (formData.cohabitantInfo = {});

//     cohabitant.firstName = cohabitantFirstName?.value;
//     cohabitant.lastName = cohabitantLastName?.value;
//     cohabitant.suffix = cohabitantSuffix?.value;
//     cohabitant.ssn = cohabitantSsn?.value.replace(/\D/g, "");
//     cohabitant.dob = cohabitantDob?.value;
//     cohabitant.gender = cohabitantGender?.value;
//   }

//   return isValidate;
// }

// *********************************************
//              STEP-2 FUNCTIONALITY
// *********************************************
let editVehicleIndex = -1;

// ********** "+ Add Vehicle" BUTTON FUNCTIONALITY  ***********
const addVehicle = document.getElementById("addVehicle");

addVehicle?.addEventListener("click", () => {
  const fields = document.querySelectorAll(
    ".add_more_vehicle_form .field__input"
  );
  fields.forEach((field) => (field.value = ""));

  if (!formList.includes("add_more_vehicle_form")) {
    const summaryIndex = formList.indexOf("summary__form");
    formList.splice(summaryIndex, 0, "add_more_vehicle_form");
  }
  showActiveForm(vehicleStep, vehicleBackBtn);
});

// ********** FUNCTIONALITY OF VEHICLE FORM : Edit ***********
const mainVehicleEditBtn = document.getElementById("mainVehicleEditBtn");
mainVehicleEditBtn?.addEventListener("click", () => {
  const summaryIndex = formList.indexOf("summary__form");

  if (!formList.includes("add_vehicle__form")) {
    formList.splice(summaryIndex, 0, "add_vehicle__form");
  }

  showActiveForm(vehicleStep, vehicleBackBtn);
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

        showActiveForm(vehicleStep, vehicleBackBtn);

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
// function summaryFunctionality() {
//   // Check Main Vehicle data OKK or Not
//   const mainVehicleFields = document.querySelectorAll(
//     ".add_vehicle__form .field__input"
//   );

//   const mainVehicleValues = [];
//   mainVehicleFields.forEach((field) => mainVehicleValues.push(field.value));

//   const haveAllMainVehicleValues = mainVehicleValues.every(
//     (v) => Boolean(v) === true
//   );

//   // If Main Vehicle Data OKK then direct show SUMMARY neither show add_vehicle__form
//   if (!haveAllMainVehicleValues) {
//     if (!formList.includes("add_vehicle__form")) {
//       const summaryIndex = formList.indexOf("summary__form");

//       formList.splice(summaryIndex, 0, "add_vehicle__form");
//     }

//     showActiveForm(vehicleStep, vehicleBackBtn);
//   } else {
//     formList = formList.filter((form) => form != "add_vehicle__form");
//     // show data in Summary
//     if (formData.vehicleInfo.vehicles.length > 0) {
//       const { year, make, model } = formData.vehicleInfo.vehicles[0];
//       document.querySelector(
//         ".quote_request__summary_main_item_info"
//       ).innerText = `${year} ${make} ${model}`;
//     }
//   }

//   // Add all data to moreVehicles sections
//   formData.vehicleInfo.vehicles = formData.vehicleInfo.vehicles.filter(
//     (item) => item !== "deleted"
//   );

//   const moreVehicles = formData.vehicleInfo.vehicles.filter(
//     (item, index) => index > 0
//   );

//   const addedSummary = document.querySelector("#moreVehicles");
//   const totalAdded = addedSummary.children?.length;

//   // if all data not appended then Append Data to #moreVehicles
//   if (moreVehicles.length > 0) {
//     addedSummary.innerHTML = "";
//     const demoItem = document.querySelector(
//       ".quote_request__summary_item.demoItem"
//     );
//     // Clone the demo, create and append
//     moreVehicles.forEach((info) => {
//       const clonedItem = demoItem.cloneNode(true);
//       clonedItem.classList.remove("__hide", "demoItem");
//       clonedItem.querySelector(
//         ".quote_request__summary_item_info"
//       ).innerHTML = `${info?.year} ${info?.make} ${info?.model}`;

//       // append clone element in Summary
//       addedSummary.appendChild(clonedItem);
//     });
//   }
// }

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

    // REDUCE vehicleStep cz add_vehicle__form will remove from the formList
    const summaryIndex = formList.indexOf("summary__form");
    vehicleStep = summaryIndex - 2;
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

    // REDUCE vehicleStep and REMOVE add_more_vehicle_form from the formList
    const summaryIndex = formList.indexOf("summary__form");
    vehicleStep = summaryIndex - 2;
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
