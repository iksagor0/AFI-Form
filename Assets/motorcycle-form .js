// const successRedirection = "https://afi.org/";
// const successRedirection = "../--Model/thank-you.html";

// Forms
const motorForms = [
  "policyholder_form",
  "driver_summary_form",
  // "additional_driver",
  "summary__form",
  "violations_form",
  "coverage_limits_form",
  "physical_damage_form",
  "coverage_history_form",
];

// *********************************************
//       FORM SUBMISSION AND STEP HANDLING
// *********************************************
const motorNextBtn = document.querySelector("#motorNextBtn");
const motorBackBtn = document.querySelector("#motorBackBtn");

let motorStep = 0;
let motorMaxStep = formList.length - 1;

// ***** NEXT FUNCTIONALITY *****
pressEnterToSubmit(motorNextBtn);
motorNextBtn.addEventListener("click", async () => {
  if (motorStep === 0) {
    const isSelectEligibility = eligibilityValidation(motorForms);
    if (!Boolean(isSelectEligibility)) return false;

    militaryFormFunc();
  }
  //  HANDLE ALL FORM SUBMISSIONS AND STEP VALIDATION
  const submitResult = await handleMotorStepForm(motorStep);
  if (!submitResult) return false;

  // Step Increment
  motorMaxStep = formList.length - 1;
  motorStep >= motorMaxStep ? motorStep : motorStep++;

  // Show Form
  showActiveForm(motorStep, motorBackBtn);
});

// Back
motorBackBtn.addEventListener("click", () => {
  // Step Decrement
  motorStep <= 0 ? motorStep : motorStep--;

  // 2 side back for add_more_vehicle_form
  if (motorStep + 1 === formList.indexOf("add_more_vehicle_form")) {
    formList = formList.filter((item) => item != "add_more_vehicle_form");
    motorStep = formList.indexOf("summary__form");
  }
  showActiveForm(motorStep, motorBackBtn);
});

// =*********************************************
//       HANDLING MULTI-STEP FORMS
// =*********************************************
function handleMotorStepForm(step) {
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
  }
  if (step === formList.indexOf("spouse_information")) {
    if (!validateForm("spouse_information")) return false;
  }

  //
  if (step === formList.indexOf("add_vehicle_form")) {
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

  // ****
  if (step === formList.indexOf("violations_form")) {
    // if (!violationsValidation()) return false;
  }

  if (step === formList.indexOf("coverage_limits_form")) {
    // if (!validateForm("coverage_limits_form")) return false;
    functionalityForEachDamageForm();
  }
  if (step === formList.indexOf("physical_damage_form")) {
    // if (!physicalDamageValidation()) return false;
    coverageHistoryFunc();
  }
  if (step === formList.indexOf("coverage_history_form")) {
    if (!validateForm("coverage_history_form")) return false;

    alert("Done");

    // Go to Thank You Page
    // window.location.href = successRedirection;
  }

  // Run after every submission

  return true;
}

// *********************************************
//              STEP-2 FUNCTIONALITY
// *********************************************
let collectorVehicles = [];
let vehicleId = 0;
let editVehicleIndex = -9999;
const maxVehicleItem = 4;

// ********** "+ Add Vehicle" BUTTON FUNCTIONALITY  ***********
const addVehicle = document.getElementById("addVehicle");

addVehicle?.addEventListener("click", function () {
  const fields = document.querySelectorAll(
    ".add_more_vehicle_form .field__input"
  );
  fields.forEach((field) => (field.value = ""));

  if (!formList.includes("add_more_vehicle_form")) {
    const summaryIndex = formList.indexOf("summary__form");
    formList.splice(summaryIndex, 0, "add_more_vehicle_form");
  }
  showActiveForm(motorStep, motorBackBtn);

  // Set VehicleId dynamically
  vehicleId = collectorVehicles.length;
  for (let i = 0; i < maxVehicleItem; i++) {
    const vId = collectorVehicles[i]?.vehicleId;

    if (i != vId) {
      vehicleId = i;
      break;
    }

    vehicleId;
  }

  if (collectorVehicles.length >= maxVehicleItem) this.disabled = true;

  //set field name and id
  const allFields = document.querySelectorAll(
    `.add_more_vehicle_form .field__input`
  );

  allFields.forEach((field) => {
    const fieldName = field.getAttribute("data-field");
    const property = `vehicle${vehicleId}${fieldName}`;

    field.id = property;
    field.name = property;
  });
});

// ********** FUNCTIONALITY OF VEHICLE FORM : Edit ***********
const mainVehicleEditBtn = document.getElementById("mainVehicleEditBtn");
mainVehicleEditBtn?.addEventListener("click", () => {
  const summaryIndex = formList.indexOf("summary__form");

  if (!formList.includes("add_vehicle_form")) {
    formList.splice(summaryIndex, 0, "add_vehicle_form");
  }

  showActiveForm(motorStep, motorBackBtn);
});

// ********** FUNCTIONALITY OF MORE VEHICLE FORMS : Edit, Delete ***********
function runVehicleItemsFunctionality() {
  const moreVehicles = document.getElementById("moreVehicles");
  const moreVehicleItems = moreVehicles.querySelectorAll(
    ".quote_request__summary_item"
  );

  moreVehicleItems.forEach((item, itemIndex) => {
    const vehicleId = item.getAttribute("data-id");

    const editBtn = item.querySelector(".editBtn");
    const deleteBtn = item.querySelector(".deleteBtn");
    const deleteYes = item.querySelector(".deleteYes");
    const deleteNo = item.querySelector(".deleteNo");

    editBtn?.addEventListener("click", () => {
      editVehicleIndex = vehicleId;

      if (!formList.includes("add_more_vehicle_form")) {
        const summaryIndex = formList.indexOf("summary__form");
        formList.splice(summaryIndex, 0, "add_more_vehicle_form");

        showActiveForm(motorStep, motorBackBtn);

        // Assign the values
        function editFormWithValue(id, type) {
          document.getElementById(id).value =
            formData[`vehicle${vehicleId}${type}`];
        }

        editFormWithValue("vehicle-Year", "Year");
        editFormWithValue("vehicle-Make", "Make");
        editFormWithValue("vehicle-Model", "Model");
        editFormWithValue("vehicle-Type", "Type");
        editFormWithValue("vehicle-EstimatedValue", "EstimatedValue");
        editFormWithValue("vehicle-Storage", "Storage");
        editFormWithValue("vehicle-DriveDescription", "DriveDescription");
      }
    });

    deleteBtn?.addEventListener("click", () => {
      item.querySelector(".yes_no")?.classList.remove("__hide");
      item.querySelector(".delete_edit")?.classList.add("__hide");
    });

    deleteNo.addEventListener("click", () => {
      item.querySelector(".yes_no")?.classList.add("__hide");
      item.querySelector(".delete_edit")?.classList.remove("__hide");
    });

    deleteYes.addEventListener("click", () => {
      for (const k in collectorVehicles[itemIndex + 1]) {
        delete formData[k];
      }

      // collectorVehicles[itemIndex + 1] = "deleted";
      collectorVehicles = collectorVehicles.filter(
        (item, i) => i !== itemIndex + 1
      );

      item.classList.add("__hide");
      item.remove(); // delete elements

      addVehicle.disabled = false;
    });
  });
}

// *********************************************
//              STEP-2 VALIDATION
// *********************************************

function summaryFunctionality() {
  //
  // Check Main Vehicle data OKK or Not
  const mainVehicleFields = document.querySelectorAll(
    ".add_vehicle_form .field__input"
  );

  const mainVehicleValues = [];
  mainVehicleFields.forEach((field) => mainVehicleValues.push(field.value));

  const haveAllMainVehicleValues = mainVehicleValues.every(
    (v) => Boolean(v) === true
  );

  // If Main Vehicle Data OKK then direct show SUMMARY neither show add_vehicle_form
  if (!haveAllMainVehicleValues) {
    if (!formList.includes("add_vehicle_form")) {
      const summaryIndex = formList.indexOf("summary__form");

      formList.splice(summaryIndex, 0, "add_vehicle_form");
    }

    showActiveForm(motorStep, motorBackBtn);
  } else {
    formList = formList.filter((form) => form != "add_vehicle_form");
    // show data in Summary
    if (collectorVehicles.length > 0) {
      const { vehicle0Year, vehicle0Make, vehicle0Model } = formData;
      document.querySelector(
        ".quote_request__summary_main_item_info"
      ).innerText = `${vehicle0Year} ${vehicle0Make} ${vehicle0Model}`;
    }
  }

  // Add all data to moreVehicles sections
  collectorVehicles = collectorVehicles.filter((item) => item !== "deleted");

  const moreVehicles = collectorVehicles.filter((item, index) => index > 0);

  const addedSummary = document.querySelector("#moreVehicles");
  // const totalAdded = addedSummary.children?.length;

  // if all data not appended then Append Data to #moreVehicles
  if (moreVehicles.length > 0) {
    addedSummary.innerHTML = "";
    const demoItem = document.querySelector(
      ".quote_request__summary_item.demoItem"
    );
    // Clone the demo, create and append
    moreVehicles.forEach((info, i) => {
      const clonedItem = demoItem.cloneNode(true);
      clonedItem.classList.remove("__hide", "demoItem");
      clonedItem.setAttribute("data-id", info.vehicleId);

      let vYear = "";
      let vMake = "";
      let vModel = "";

      for (const k in info) {
        if (String(k).includes("Year")) vYear = info[k];
        if (String(k).includes("Make")) vMake = info[k];
        if (String(k).includes("Model")) vModel = info[k];
      }

      clonedItem.querySelector(
        ".quote_request__summary_item_info"
      ).innerHTML = `${vYear} ${vMake} ${vModel}`;

      // append clone element in Summary
      addedSummary.appendChild(clonedItem);
    });
  }

  // ****************************************************
  // const filterCVehicles = collectorVehicles.map((data) => {
  //   delete data.vehicleId;
  //   return data;
  // });

  collectorVehicles.forEach((info) => (formData = { ...formData, ...info }));
  delete formData.vehicleId;

  runVehicleItemsFunctionality();
}

function addVehicleValidation() {
  const isValidate = validateForm("add_vehicle_form", false);

  if (isValidate) {
    collectorVehicles[0] = {};

    const allFields = document.querySelectorAll(
      `.add_vehicle_form .field__input`
    );

    allFields.forEach((field) => {
      collectorVehicles[0][field.name] = field.value;
      collectorVehicles[0].vehicleId = 0;
    });

    // REDUCE motorStep cz add_vehicle_form will remove from the formList
    const summaryIndex = formList.indexOf("summary__form");
    motorStep = summaryIndex - 2;
  }

  return isValidate;
}

function addMoreVehicleValidation() {
  const isValidate = validateForm("add_more_vehicle_form", false);

  if (isValidate) {
    const vehicleData = {};

    const allFields = document.querySelectorAll(
      `.add_more_vehicle_form .field__input`
    );

    allFields.forEach((field) => {
      vehicleData[field.name] = field.value;
    });

    // UPDATE or CREATE Vehicle Data
    if (editVehicleIndex > 0) {
      const matchId = collectorVehicles.filter(
        (v) => v.vehicleId == editVehicleIndex
      );
      const updatedData = { ...matchId[0], ...vehicleData };

      collectorVehicles = collectorVehicles.map((vData) =>
        vData.vehicleId == editVehicleIndex ? updatedData : vData
      );

      // collectorVehicles[Number(vehicleId)] = vehicleData;
      editVehicleIndex = -1;
    } else {
      vehicleData.vehicleId = vehicleId;

      collectorVehicles.push(vehicleData);
    }

    // REDUCE motorStep and REMOVE add_more_vehicle_form from the formList
    const summaryIndex = formList.indexOf("summary__form");
    motorStep = summaryIndex - 2;
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

let vioSerial = 0;

// ******************* Violation Form Functionality *******************
// ADD MORE VIOLATIONS FIELDS
addViolationBtn?.addEventListener("click", function () {
  vioSerial++;

  const newFields = violationsFields.cloneNode(true);
  newFields.querySelectorAll(".field__input").forEach((field) => {
    field.value = "";

    const newId = field.id.replace("0", vioSerial);
    field.id = field.name = newId;
  });

  // for new fields : clearFieldErrorMsg
  newFields.querySelectorAll(".error").forEach((errField) => errField.remove());

  violationWrapper.appendChild(newFields);

  // Data Validator added
  document
    .querySelectorAll(".householdViolationsDate")
    .forEach((vDate) => dateValidation(vDate, thisYear));

  if (violationWrapper.children.length >= 5) {
    this.disabled = true;
  }

  removeErrorOnChange();
});

// IF householdViolationsPreviousClaims value not== Yes, then disable all
function disableViolationInputs(disable = true) {
  const violationInputs = violationWrapper.querySelectorAll(".field__input");
  violationInputs.forEach((input) => (input.disabled = disable));
  addViolationBtn.disabled = disable;
}
disableViolationInputs(true);

const hasViolationsFields = document.getElementsByName(
  "householdViolationsPreviousClaims"
);
const getViolationsValue = () => {
  let value = "";
  hasViolationsFields?.forEach((field) => {
    if (field?.checked) value = field.value;
  });

  return value;
};

// Get every violation Radio field's value
hasViolationsFields.forEach((fields) => {
  fields?.addEventListener("change", () => {
    let getValue = getViolationsValue();

    if (getValue === "Yes") {
      disableViolationInputs(false);
    } else {
      disableViolationInputs(true);
    }

    const fieldContainer = document.querySelector(".violations_form");
    const errors = fieldContainer.querySelectorAll(".field_message.error");
    errors.forEach((error) => error.remove());
  });
});

// **** coverageLimitsValidation 'qrf-accordion' Functionality ****
const accordionButtons = document.querySelectorAll(".qrf-accordion__trigger");

accordionButtons?.forEach((button) => {
  button.addEventListener("click", () => {
    const accordion = button.closest(".qrf-accordion");
    accordion.classList.toggle("qrf-accordion--active");

    const symbol = button.querySelector(".qrf_accordion");
    if (accordion.classList.contains("qrf-accordion--active"))
      symbol.innerHTML = "-";
    else symbol.innerHTML = "+";
  });
});

// ********* FUNCTIONALITY physical_damage_form *********
function functionalityForEachDamageForm() {
  const damageForm = document.querySelector(".damage__form.__hide");
  const DamageFormWrapper = document.getElementById(
    "physical_damage_form_wrapper"
  );

  // Clear DamageFormWrapper Children
  DamageFormWrapper.innerHTML = "";

  // const vehicleList = collectorVehicles;
  // Add Vehicle data to DamageFormWrapper with other fields
  collectorVehicles.forEach((vData, index) => {
    const vId = vData.vehicleId;
    const year = vData[`vehicle${vId}Year`];
    const make = vData[`vehicle${vId}Make`];
    const model = vData[`vehicle${vId}Model`];

    const clonedItem = damageForm.cloneNode(true);

    clonedItem.classList.remove("__hide");
    clonedItem.querySelector(
      ".vehicle_name"
    ).innerHTML = `${year} ${make} ${model}`;

    // liability radio fields functionality
    const liabilityYes = clonedItem.querySelector("#liability--Yes");
    const liabilityNo = clonedItem.querySelector("#liability--No");
    const liabilityYesLabel = clonedItem.querySelector(".liability_Yes_label");
    const liabilityNoLabel = clonedItem.querySelector(".liability_No_label");

    const nameOfLiability = `vehicle${vId}LiabilityOnlyCoverage`;
    const noIdOfLiability = nameOfLiability + "--No";
    const yesIdOfLiability = nameOfLiability + "--Yes";

    liabilityYes.name = nameOfLiability;
    liabilityNo.name = nameOfLiability;

    liabilityYes.id = yesIdOfLiability;
    liabilityNo.id = noIdOfLiability;

    liabilityYesLabel.setAttribute("for", noIdOfLiability);
    liabilityNoLabel.setAttribute("for", yesIdOfLiability);

    liabilityNo?.addEventListener("change", toggleDisability);
    liabilityYes?.addEventListener("change", toggleDisability);

    function toggleDisability() {
      const disabledFields = clonedItem.querySelectorAll(
        ".field__input.damage"
      );

      if (liabilityNo.checked) {
        disabledFields.forEach((field) => {
          field.disabled = false;
          field.classList.add("required");
        });
      } else {
        disabledFields.forEach((field) => {
          inputErrorMessage(field, "", true);
          field.disabled = true;
          field.classList.remove("required");
        });
      }
    }

    DamageFormWrapper.appendChild(clonedItem);
  });

  //
  removeErrorOnChange();
}

// *********************************************
//              STEP-3 VALIDATION
// *********************************************
function violationsValidation() {
  if (getViolationsValue() === "No") {
    formData.householdViolationsPreviousClaims =
      "No violations in last 5 years";
    return true;
  } else if (getViolationsValue() === "Yes") {
    const fieldsWrapper = document.querySelectorAll(".violation_info_fields");

    let result = false;

    fieldsWrapper.forEach((field, i) => {
      const driverField = field.querySelector(".householdViolationsDriver");
      const typeField = field.querySelector(".householdViolationsType");
      const dateField = field.querySelector(".householdViolationsDate");

      const validationFields = [
        alphabeticOnly(driverField),
        isValueEmpty(driverField),
        isValueEmpty(typeField),
        minValue(dateField, 10, "Please enter a valid Date"),
        isValueEmpty(dateField),
      ];

      const isValidate = validationFields.every((result) => result === true);

      if (isValidate) {
        formData[driverField.name] = driverField.value;
        formData[typeField.name] = typeField.value;
        formData[dateField.name] = dateField.value;
        result = true;
      } else {
        result = false;
      }
    });

    return result;
  } else {
    const fieldContainer = document.querySelector(
      ".has_violation_inputs_container"
    );
    isValueEmpty(fieldContainer);

    return false;
  }
}

function physicalDamageValidation() {
  const fieldError = collectorVehicles.map((vData) => {
    const vId = vData.vehicleId;

    const radioFields = document.querySelectorAll(
      `input[name=vehicle${vId}LiabilityOnlyCoverage]`
    );

    const fieldChecked = document.querySelector(
      `input[name=vehicle${vId}LiabilityOnlyCoverage]:checked`
    );

    const fieldParent = radioFields[0].closest(".fields-row");
    const fieldError = fieldParent.querySelector(".field__error-message");

    radioFields.forEach((field) => {
      field.addEventListener("change", () => {
        fieldError.style.display = "none";
      });
    });

    if (!fieldChecked) {
      fieldError.style.display = "block";
      return false;
    } else {
      return true;
    }
  });

  const isRadioChecked = fieldError.every((b) => b === true);
  if (!isRadioChecked) return false;

  //
  const isValidate = validateForm("physical_damage_form", false);

  if (isValidate) {
    const damageForms = document.querySelectorAll(
      "#physical_damage_form_wrapper .damage__form"
    );

    damageForms.forEach((damageForm, i) => {
      const vId = collectorVehicles[i].vehicleId;

      const liaCoVal = damageForm.querySelector(
        `input[name=vehicle${vId}LiabilityOnlyCoverage]:checked`
      )?.value;

      collectorVehicles[i][`vehicle${vId}LiabilityOnlyCoverage`] = liaCoVal;

      if (liaCoVal === "No") {
        const comVal = damageForm.querySelector(
          ".field__input.vehicleComprehensiveDeductible"
        )?.value;
        const colVal = damageForm.querySelector(
          ".field__input.vehicleCollisionDeductible"
        )?.value;

        collectorVehicles[i][`vehicle${vId}ComprehensiveDeductible`] = comVal;
        collectorVehicles[i][`vehicle${vId}CollisionDeductible`] = colVal;
      }
    });
  }

  summaryFunctionality();

  return isValidate;
}

// *********************************************
//              STEP-4 VALIDATION
// *********************************************

// Note: Step 1, 4 is in formCommon.js file
