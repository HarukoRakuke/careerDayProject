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

        fetch('./json/vacancy.json')
          .then((response) => response.json())
          .then((data) => {
            let cardNumber = 1;
            data.forEach((item, index) => {
              if (excludedIndexes.includes(index)) {
                return;
              }

              if ((state = 1)) {
                let specificationLabel = item[4][1];
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
                    if (window.innerWidth < 769) {
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

                      let label, value;

                      if (i === 12) {
                        label = `${item[12][0]} & ${item[13][0]}`;
                        value = `${item[12][1]} ${item[13][1]}`;

                        let labelElement = document.createElement('span');
                        labelElement.classList.add('label');
                        labelElement.setAttribute('lang', 'ru');
                        labelElement.textContent = 'ОТКЛИКНУТЬСЯ';

                        let valueElement = document.createElement('div');
                        valueElement.classList.add('value');

                        let phoneLink = document.createElement('a');
                        phoneLink.classList.add('phoneIcon');
                        phoneLink.href = `tel:${item[12][1]}`;
                        phoneLink.target = '_blank';

                        let emailLink = document.createElement('a');
                        emailLink.classList.add('emailIcon');
                        emailLink.href = `mailto:${item[13][1]}`;
                        emailLink.target = '_blank';

                        valueElement.appendChild(phoneLink);
                        valueElement.appendChild(document.createTextNode(' ')); // Add a separator
                        valueElement.appendChild(emailLink);

                        let br = document.createElement('br');

                        fullInfo.appendChild(labelElement);
                        fullInfo.appendChild(valueElement);
                        fullInfo.appendChild(br);
                        popup.appendChild(fullInfo);

                        // Skip index 13 since it's already handled
                        i++;
                      } else {
                        [label, value] = item[i];

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
                    }
                    let showMoreButton = document.createElement('div');
                    showMoreButton.classList.add('showMoreButton');
                    showMoreButton.addEventListener('click', () => {
                      let labels = fullInfo.querySelectorAll('.label');
                      let values = fullInfo.querySelectorAll('.value');
                      let brs = fullInfo.querySelectorAll('br');
                      labels.forEach((label) => {
                        label.style.display = 'inline-block';
                        label.style.transition = 'all 1s';
                      });
                      brs.forEach((br) => {
                        br.style.display = 'block';
                        br.style.transition = 'all 1s';
                      });
                      values.forEach((value) => {
                        value.style.display = 'inline-block';
                        value.style.transition = 'all 1s';
                      });
                      showMoreButton.style.display = 'none';
                    });
                    fullInfo.appendChild(showMoreButton);
                    popup.appendChild(fullInfo);
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
