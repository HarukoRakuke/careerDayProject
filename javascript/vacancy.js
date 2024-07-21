let excludedIndexes = []; // сюда вписываем номера анкет, которые не должны высвечиваться
let state = 0;

document.addEventListener('DOMContentLoaded', function () {
  function openScrollPopup() {
    let buttons = document.querySelectorAll('.vac-cv-card-orientation');
    buttons.forEach((button) => {
      let buttonP = button.querySelector('p').innerHTML;
      let buttonH1 = button.querySelector('h1').innerHTML;
      buttonP = buttonP.toUpperCase();
      let specification = buttonH1 + ' ' + buttonP;
      button.addEventListener('click', () => {
        buttons.forEach((b) => {
          b.remove();
        });
        let container = document.createElement('div');
        container.classList.add('div-container');
        document.body.appendChild(container);

        state = 1;
        let foundMatch = false;

        fetch('vacancy.json')
          .then((response) => response.json())
          .then((data) => {
            let cardNumber = 1;
            data.forEach((item, index) => {
              if (excludedIndexes.includes(index)) {
                return;
              }

              if ((state = 1)) {
                let specificationLabel = item[4][1]; // Assuming the third label is at index 2
                if (specificationLabel === specification) {
                  foundMatch = true;
                  let card = document.createElement('div');
                  card.classList.add('vacancy-card');
                  container.appendChild(card);

                  let companyName = document.createElement('div');
                  companyName.classList.add('companyName');
                  companyName.innerHTML = item[3][1];
                  card.appendChild(companyName);

                  let workPlace = document.createElement('div');
                  workPlace.classList.add('workPlace');
                  let workPlaceText = item[2][1].toLowerCase();
                  workPlace.innerHTML =
                    workPlaceText.charAt(0).toUpperCase() +
                    workPlaceText.slice(1);
                  card.appendChild(workPlace);

                  let number = document.createElement('div');
                  number.classList.add('number');
                  number.innerHTML = cardNumber;
                  card.appendChild(number);

                  card.addEventListener('click', () => {
                    let cardIndex = card.querySelector('.number').innerHTML;

                    document.body
                      .querySelectorAll(':scope > *:not(.title-box)')
                      .forEach((el) => {
                        el.remove();
                      });

                    document.body.querySelector('.title-box > p').remove();
                    document.body.querySelector(
                      '.title-box > .header'
                    ).innerHTML = 'вакансия';
                    if (window.innerWidth < 412) {
                      document.body.querySelector(
                        '.title-box > .header'
                      ).style.marginTop = '10vw';
                    }

                    let popup = document.createElement('div');
                    popup.classList.add('cards-container');
                    document.body.appendChild(popup);

                    let fullInfo = document.createElement('div');
                    fullInfo.classList.add('card');

                    let companyName = document.createElement('div');
                    companyName.classList.add('companyName');
                    companyName.style.display = 'block';
                    companyName.innerHTML = item[3][1];
                    fullInfo.appendChild(companyName);

                    let number = document.createElement('div');
                    number.classList.add('number');
                    number.innerHTML = cardIndex;
                    fullInfo.appendChild(number);

                    for (let i = 2; i < item.length; i++) {
                      if (i === 3) {
                        continue;
                      }
                      const [label, value] = item[i];

                      let labelElement = document.createElement('span');
                      labelElement.classList.add('label');
                      labelElement.setAttribute('lang', 'ru');
                      labelElement.textContent = label;

                      let valueElement;
                      if (i === 10) {
                        valueElement = document.createElement('a');
                        valueElement.classList.add('urlIcon');
                        valueElement.href = value;
                        valueElement.target = '_blank'; // Open link in a new tab
                      } else if (i === 12) {
                        valueElement = document.createElement('a');
                        valueElement.classList.add('phoneIcon');
                        valueElement.href = `tel:${value}`;
                        valueElement.target = '_blank'; // Open link in a new tab
                      } else if (i === 13) {
                        valueElement = document.createElement('a');
                        valueElement.classList.add('emailIcon');
                        valueElement.href = `mailto:${value}`;
                        valueElement.target = '_blank'; // Open link in a new tab
                      } else {
                        valueElement = document.createElement('div');
                        valueElement.classList.add('value');
                        valueElement.textContent = value;
                      }

                      let br = document.createElement('br');

                      fullInfo.appendChild(labelElement);
                      fullInfo.appendChild(valueElement);
                      fullInfo.appendChild(br);
                      popup.appendChild(fullInfo);
                    }
                  });
                  cardNumber++;
                }
              }
            });
            if (!foundMatch) {
              let card = document.createElement('div');
              card.classList.add('vacancy-card');
              container.appendChild(card);
              card.innerHTML = 'В этой категории пока нет вакансий';
            }
          })
          .catch((error) => console.error('Error loading data:', error));
      });
    });
  }

  openScrollPopup();
});
