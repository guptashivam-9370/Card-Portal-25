

document.addEventListener('DOMContentLoaded', function () {
    fetch('https://cardsapi.alcheringa.in/cards/get-session-data/')
    .then(response => response.json())
    .then(data => {

        // console.log('hi');
        // console.log("Function hit",data)
    })
    .catch(error => console.error('Error fetching session data:', error));
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
    editButton.style.display = 'none';


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

    
    
    document.querySelectorAll('.attendee_form').forEach(form => {
        form.querySelectorAll('input, select').forEach(input => {
            input.readOnly = true;
        });
    });
    updateSummary();
    
});