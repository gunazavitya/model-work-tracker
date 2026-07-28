// DAY 1
// [ ] workType change
// [ ] outside checkbox
// [ ] show/hide containers
console.log("VERSION 1.0.1");
const workTypeInput = document.getElementById("workType");
const shootingForm = document.getElementById("shootingContainer");
const showForm = document.getElementById("showContainer");
const outsideForm = document.getElementById("outsideContainer");
const outsideChecker = document.getElementById("outsideChecker");
const newWorkForm = document.getElementById("newWorkForm");

workTypeInput.addEventListener("change", (event)=>{
    const selectedType = event.target.value;

    switch(selectedType){
        case "shooting":
            showShootingForm();
            break;
        case "show":
            showShowForm();
            break;
    }
});

outsideChecker.addEventListener("change", (event)=>{
    if(outsideChecker.checked){
    outsideForm.style.display = "flex";

    newWorkForm.classList.add("outside-layout");

    shootingForm.style.gridColumn = "1 / span 2";
        }else{
    outsideForm.style.display = "none";

    newWorkForm.classList.remove("outside-layout");
    }
});


function showShootingForm(){
    shootingForm.style.display="flex";

    showForm.style.display="none";

    outsideForm.style.display="none";
    outsideChecker.checked = false;

    newWorkForm.classList.remove("outside-layout");
    resetShowFields();
}

function showShowForm(){
    showForm.style.display="flex";
    shootingForm.style.display="none";

    outsideForm.style.display="none";
    outsideChecker.checked = false;

    newWorkForm.classList.remove("outside-layout");
    resetShootingFields();
}

function resetShootingFields(){
    shootingHoursInput.value = "";
    hourlyRateInput.value = "";
    outsideHoursInput.value = "";
    outsideRateInput.value = "";
    outsideChecker.checked = false;
}

function resetShowFields(){
    fixedPaymentInput.value = "";
}

// DAY 2
// [ ] form submit
// [ ] create work object
// [ ] calculate total

const workForm = document.getElementById("workForm");
const workDateInput = document.getElementById("workDate");
const brandNameInput = document.getElementById("brandName");

const outsideRateInput = document.getElementById("outsideRate");
const outsideHoursInput = document.getElementById("outsideHours");

const shootingHoursInput = document.getElementById("shootingHours");
const hourlyRateInput = document.getElementById("hourlyRate");

const fixedPaymentInput = document.getElementById("fixedPayment");

workForm.addEventListener("submit", (event)=>{
    event.preventDefault();

    let work;

    const commonData = getCommonData();

    if(!commonData) return;

    if(commonData.type === "shooting"){
        work = createShooting(commonData);
        
        
        }else{
        work = createShow(commonData);
        }

        if (!work) return;
        works.push(work);
        renderWork(work);
        clearForm();
        updateStats();
        saveWorks();
});

function getCommonData(){
    const type = workTypeInput.value;
    const date = workDateInput.value;
    const brand = brandNameInput.value.trim();

    if(!date || !brand){
        alert("Please fill date and brand name!");
        return null;
    }

    return{type, date, brand};
}

function createShooting(commonData){
        const outsideEnabled = outsideChecker.checked;

        const hours = Number(shootingHoursInput.value);
        const rate = Number(hourlyRateInput.value);

        let outsideHours = 0;
        let outsideRate = 0;
        let total = 0;
            if(outsideEnabled){
                outsideHours = Number(outsideHoursInput.value);
                outsideRate = Number(outsideRateInput.value);
                if(outsideHours <= 0 || outsideRate <= 0){
                    alert("Enter outside hours and price!");
                    return;
                } else if(outsideHours > hours){
                    alert("Outside houts cannot be greater than work hours!");
                    return;
                }
                else{
                total = (((hours - outsideHours) * rate) + (outsideHours * (rate + outsideRate))) / 2;
                }
            } else if(hours <= 0 || rate <= 0){
                alert("Enter work hours and rate!");
                return;
            }
                else{
                total = hours * rate / 2;
                }
        return {
                id: Date.now(),
                type: commonData.type,
                date: commonData.date,
                brand: commonData.brand,
                hours,
                rate,
                total,
                outside:{
                    enabled: outsideEnabled,
                    hours: outsideHours,
                    price: outsideRate
                }
            };
}

function createShow(commonData){

    const fixedPayment = Number(fixedPaymentInput.value);

            if(fixedPayment <= 0){
                alert("Enter a price!");
                return;
            }
        return {
                id: Date.now(),
                type: commonData.type,
                date: commonData.date,
                brand: commonData.brand,
                total: fixedPayment / 2,
                fixedPayment
            };
}


// DAY 3
// [ ] works array
// [ ] render history row
// [ ] clear form after submit

const works = [];

const historyContainer = document.getElementById("workHistory");

function renderWork(work){
    const newDiv = document.createElement("div");
    newDiv.classList.add("historyBody");

    newDiv.innerHTML = `
        <p> ${work.date} </p>
        <p> ${capitalize(work.brand)} </p>
        <p> ${capitalize(work.type)} </p>
        <p> ${work.total}¥ </p>
        <button class="deleteBtn">🗑</button>
    `;
    
    const deleteBtn = newDiv.querySelector(".deleteBtn");

    deleteBtn.addEventListener("click", () => {
        deleteWork(work.id);
        saveWorks();
        updateStats();
        console.log(works);
        historyContainer.removeChild(newDiv);
    });

    historyContainer.appendChild(newDiv);
}

function clearForm(){
    workDateInput.value = "";
    brandNameInput.value = "";
    workTypeInput.value = "shooting";

    resetShootingFields();
    resetShowFields();
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
// DAY 4
// [ ] update balance
// [ ] update guarantee
// [ ] update averages

const currentGuarantee = document.getElementById("currentGuarantee");
const exceedGuarantee = document.getElementById("exceedGuarantee");

const currentBalance = document.getElementById("currentBalance");
const monthBalance = document.getElementById("monthBalance");
const averageBalance = document.getElementById("averageBalance");

const currentDay = document.getElementById("currentDay");
const remainingDays = document.getElementById("remainingDays");


function updateBalance(){
    let total = 0;

    for (const work of works){
        total += work.total;
    }

    currentBalance.textContent = `${(total / 8).toFixed(0)}€`;

    return total;
}

function updateAverageBalance(total){

    if(works.length === 0){
        averageBalance.textContent = `0€`;
        return;
    }

    const average = total / works.length;

    averageBalance.textContent = `${(average / 8).toFixed(0)}€`;
}

function updateMonthBalance(){
    let monthTotal = 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    for (const work of works){
        const workDate = new Date(work.date);

        if (
            workDate.getMonth() === currentMonth &&
            workDate.getFullYear() === currentYear
        ){
            monthTotal += work.total;
        }
    }

    monthBalance.textContent = `${(monthTotal / 8).toFixed(0)}€`;
}

function updateGuarantee(total){
    const excGuarantee = total - updateCurrentGuarantee();

    if(excGuarantee < 0){
        exceedGuarantee.classList.add("negative");
        exceedGuarantee.classList.remove("positive");
        
    } else {
        exceedGuarantee.classList.remove("negative");
        exceedGuarantee.classList.add("positive");
    }
    exceedGuarantee.textContent = `${(excGuarantee / 8).toFixed(0)}€`;
}

function updateStats(){
        const total = updateBalance();
        updateAverageBalance(total);
        updateMonthBalance();
        updateGuarantee(total);
}
// DAY 5
// [ ] save to localStorage
// [ ] load on startup
// [ ] render saved works

function saveWorks(){
    const worksData = JSON.stringify(works);
    localStorage.setItem("worksData", worksData);
}

function loadWorks(){
    const workData = localStorage.getItem("worksData");
    if (!workData) return;
    const obj = JSON.parse(workData);
    works.push(...obj);
        for(const work of obj){
            renderWork(work);
        }
    updateStats();
}

function daysCounter(){
    const today = new Date();
    const guaranteeStart = new Date();

    guaranteeStart.setFullYear(2026, 4, 8);

    const diffTime = today-guaranteeStart;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}

function updateCurrentGuarantee(){
    const guarantee = (daysCounter() * 117.21) * 8;
    currentGuarantee.textContent = `${(guarantee / 8).toFixed(0)}€`;

    return guarantee;
}

function updateDaysCounter(){
    const daysPassed = daysCounter();

    const today = new Date();
    const lastDay = new Date();
    lastDay.setFullYear(2026, 10, 4);

    const diffTime = Math.abs(lastDay-today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    

    currentDay.textContent = `${daysPassed}`;
    remainingDays.textContent = `${diffDays}`;
}

function deleteWork(id){

    const index = works.findIndex(work => work.id === id);

    if(index !== -1){
        works.splice(index, 1);
    }
}

updateDaysCounter();
updateCurrentGuarantee();
loadWorks();
