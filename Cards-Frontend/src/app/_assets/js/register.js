alert('hi');
document.addEventListener('DOMContentLoaded', function () {
    const addMoreButton = document.getElementById('add-more-members');
    let formContainer = document.getElementById('formset-container');
    let totalForms = document.querySelector('#id_form-TOTAL_FORMS');
    let firstForm = document.getElementById('first_form');
    const proceedButton = document.getElementById('checkout_button');
    const editButton = document.getElementById('edit_button');
    const normalCountSpan = document.getElementById('normal-count');
    const earlyCountSpan = document.getElementById('early-count');
    const totalAmountSpan = document.getElementById('total-amount');
    const totalAmountInput = document.getElementById('total-amount-input');
    const NORMAL_PRICE = 200;
    const EARLY_PRICE = 100;


    const updateSummary = () => {
        let normalCount = 0;
        let earlyCount = 0;
        document.querySelectorAll('.attendee_form').forEach(form => {
            const passType = form.querySelector('[name="pass_type"]').value;
            if (passType === 'Normal') {
                normalCount++;
            } else if (passType === 'Early') {
                earlyCount++;
            }
        });
        normalCountSpan.textContent = normalCount;
        earlyCountSpan.textContent = earlyCount;
        const totalAmount = normalCount * NORMAL_PRICE + earlyCount * EARLY_PRICE;
        totalAmountSpan.textContent = totalAmount;
        totalAmountInput.value = totalAmount;
    }

    addMoreButton.addEventListener('click', function (e) {
        e.preventDefault();
        let firstForm = document.getElementById("first_form");
        let newForm = firstForm.cloneNode(true);
        let inputs = newForm.getElementsByTagName("input");
       for (let input of inputs) {
        input.value = '';
    }
         firstForm.appendChild(newForm);  
    });

    proceedButton.addEventListener('click', function () {


        proceedButton.style.display = 'none';
        editButton.style.display = 'inline-block';


        document.querySelectorAll('.attendee_form').forEach(form => {
            form.querySelectorAll('input, select').forEach(input => {
                input.readOnly = true;
            });
        });
        updateSummary();

    });
    

     document.addEventListener('click', function (e) {
        if (e.target.classList.contains('removeattendee')) {
            e.target.closest('.attendee_form').remove();

            let formCount = parseInt(totalForms.value);
            totalForms.value = formCount - 1;

            document.querySelectorAll('.attendee_form').forEach((form, index) => {
                let oldIndex = form.querySelector('input, select').name.match(/form-(\d)-/)[1];
                let newFormHTML = form.innerHTML.replace(new RegExp(`form-${oldIndex}-`, 'g'), `form-${index}-`);
                form.innerHTML = newFormHTML;
            });
        }
        updateSummary();
    });

    
});