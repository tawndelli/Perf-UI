// script.js
const formulas = {};

const sendBtn = document.getElementById('send-btn');
const sendBtnText = sendBtn.querySelector('.sendBtn-text');
const sendBtnSpinner = sendBtn.querySelector('.spinner');
const generalInput = document.getElementById('user-input');
sendBtn.addEventListener('click', sendMessage);

const smellInput = document.getElementById('smell-input');
const smellBtn = document.getElementById('smell-search-btn');
const smellBtnText = smellBtn.querySelector('.smellBtn-text');
const smellBtnSpinner = smellBtn.querySelector('.spinner');
smellBtn.addEventListener('click', smellSearch);

const materialBtn = document.getElementById('material-search-btn');
const materialInput = document.getElementById('material-input');
const materialBtnText = materialBtn.querySelector('.materialBtn-text');
const materialBtnSpinner = materialBtn.querySelector('.spinner');
materialBtn.addEventListener('click', materialSearch);

generalInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') { // Check if the key pressed is Enter
      event.preventDefault(); // Prevent the default Enter key behavior (usually line break in text area)
      sendBtn.click(); // Trigger the click event of the send button
    }
  });

smellInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') { // Check if the key pressed is Enter
    event.preventDefault(); // Prevent the default Enter key behavior (usually line break in text area)
    smellBtn.click(); // Trigger the click event of the send button
    }
}); 

materialInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') { // Check if the key pressed is Enter
    event.preventDefault(); // Prevent the default Enter key behavior (usually line break in text area)
    materialBtn.click(); // Trigger the click event of the send button
    }
});

appendMessage('Hello! I am a perfumery lab assistant. You may ask me questions about perfumery, smells, and chemicals used in the art of perfumery.', 'bot');

function sendMessage() {
    message = generalInput.value;

    if (message.trim() !== '') {
        sendBtnText.style.display = 'none'; // Hide button text
        sendBtnSpinner.style.display = 'inline-block'; // Display spinner
        sendBtn.disabled = true; 

        appendMessage(message, 'user');
        
        sendGeneralRequest(message);
    
        generalInput.value = '';
    }
}

function smellSearch(){
    message = smellInput.value;

    if (message.trim() !== '') {
        smellBtnText.style.display = 'none'; // Hide button text
        smellBtnSpinner.style.display = 'inline-block'; // Display spinner
        smellBtn.disabled = true; 
        
        sendSmellRequest('smell:' + message);
    
        smellInput.value = '';
    }
}

function materialSearch(){
    message = materialInput.value;

    if (message.trim() !== '') {
        materialBtnText.style.display = 'none'; // Hide button text
        materialBtnSpinner.style.display = 'inline-block'; // Display spinner
        materialBtn.disabled = true; 
        
        sendMaterialRequest('material:' + message);
    
        materialInput.value = '';
    }
}

function materialNameClick(event){
    var materialName = event.target.textContent;

    const listItems = document.querySelectorAll('.list-item');
    listItems.forEach(item => {
        item.classList.remove('selected');
    });

    event.target.classList.add('selected');

    // run material formula search
    materialInput.value = materialName;
    materialBtn.click();
}

function formulaNameClick(event){
    var formulaName = event.target.textContent;

    const listItems = document.querySelectorAll('#formulas-list div');
    listItems.forEach(item => {
        item.classList.remove('selected');
    });

    event.target.classList.add('selected');

    // Populate the formula grid
    const formulaGridBody = document.getElementById('formula-grid-body');
    formulaGridBody.innerHTML = '';
    formulas[formulaName].FormulaItems.forEach(f => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${f.Material}</td><td>${f.Amount}</td>`;
        formulaGridBody.appendChild(row);
    });

    const formulaGrid = document.querySelector('.formula-grid');
    formulaGrid.scrollTop = 0;
}

function appendMessage(message, sender='user') {
  var chatbotMessages = document.getElementById('chatbot-messages');
  var messageElement = document.createElement('div');
  messageElement.classList.add('message', sender);
  if(sender == 'bot')
    messageElement.innerHTML = `<img src="assets/bot.png" alt="${sender}"><span>${message}</span>`;
  else
    messageElement.innerHTML = `<span>${message}</span><img src="assets/user.png" alt="${sender}">`;

  chatbotMessages.appendChild(messageElement);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function sendGeneralRequest(query) {
    const url = new URL('https://perf-ro2n5vkzvq-uc.a.run.app/answer_query/');
    url.searchParams.append('query', query);

    fetch(url.toString(), {
      method: 'GET', // Change the method as needed (GET, POST, etc.)
      // You can add headers or body payload if required
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // Assuming response is JSON
    })
    .then(data => {
      // Handle the response data here
      appendMessage(data, 'bot');

      sendBtnText.style.display = 'inline-block'; // Display button text
      sendBtnSpinner.style.display = 'none'; // Hide spinner
      sendBtn.disabled = false;

      console.log('Response:', data);
    })
    .catch(error => {
      // Handle errors here
      console.error('Error:', error);
    });
}

function sendSmellRequest(query){
    const url = new URL('https://perf-ro2n5vkzvq-uc.a.run.app/answer_query/');
    url.searchParams.append('query', query);

    fetch(url.toString(), {
      method: 'GET', // Change the method as needed (GET, POST, etc.)
      // You can add headers or body payload if required
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // Assuming response is JSON
    })
    .then(data => {
        // Handle the response data here
        materials = data['smells'];

        var currentSmellSpan = document.querySelector('.current-smell');
        currentSmellSpan.innerHTML = query.split(":")[1];

        const perfumeryMaterialsList = document.getElementById('perfumery-materials-list');
        perfumeryMaterialsList.innerHTML = ''; 

        materials.forEach(material => {
            const listItem = document.createElement('div');
            listItem.classList.add('list-item');
            listItem.textContent = material;
            perfumeryMaterialsList.appendChild(listItem);
            listItem.addEventListener('click', materialNameClick);
        });

        smellBtnText.style.display = 'inline-block'; // Display button text
        smellBtnSpinner.style.display = 'none'; // Hide spinner
        smellBtn.disabled = false;

        console.log('Response:', materials);
    })
    .catch(error => {
      // Handle errors here
      console.error('Error:', error);
    });
}

function sendMaterialRequest(query){
    const url = new URL('https://perf-ro2n5vkzvq-uc.a.run.app/answer_query/');
    url.searchParams.append('query', query);

    fetch(url.toString(), {
      method: 'GET', // Change the method as needed (GET, POST, etc.)
      // You can add headers or body payload if required
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // Assuming response is JSON
    })
    .then(data => {
        const formulaNames = [];

        data.forEach(item => {
            item = JSON.parse(item);
            // if(item['score'] >= 1){
              var formulaName = item['name'];
         
              formulaNames.push(formulaName);

              var formula = new Formula(formulaName);

              var formulaItems = item['formulaitems'];
              formulaItems.forEach(f=>{
                  formula.FormulaItems.push(new FormulaItem(f['material'], f['amount']));
              })

              formulas[formulaName] = formula;
            // }
        })

        const formulasList= document.getElementById('formulas-list');
        formulasList.innerHTML = ''; 
        formulasList.scrollTop = formulasList.scrollHeight;
        
        const formulaGridBody = document.getElementById('formula-grid-body');
        formulaGridBody.innerHTML = '';

        formulaNames.forEach(name => {
            const listItem = document.createElement('div');
            listItem.classList.add('list-item');
            listItem.textContent = name;
            formulasList.appendChild(listItem);
        });

        const listItems = document.querySelectorAll('#formulas-list div');
        listItems.forEach(item => {
            item.addEventListener('click', formulaNameClick);
        });
        
        materialBtnText.style.display = 'inline-block'; // Display button text
        materialBtnSpinner.style.display = 'none'; // Hide spinner
        materialBtn.disabled = false;
    })
    .catch(error => {
      // Handle errors here
      console.error('Error:', error);
    });
}

class Formula{
    constructor(name){
        this.Name = name;
        this.FormulaItems = [];
    }
}

class FormulaItem{
    constructor(material, amount){
        this.Material = material;
        this.Amount = amount;
    }
}

  
