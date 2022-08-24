"use strict"

import getChoices from './choices.js'
const choices = getChoices()

let actualChoiceIndex = -1
const getActualChoice = () => {
    actualChoiceIndex++
    
    let choice = {...choices.at(actualChoiceIndex)}
    choice.choices = choice.choices.split(' ')
    choice.choices = choice.choices.sort(function() {return Math.random() - 0.5})
    
    return choice
}

let userResponse = []
let actualChoice = getActualChoice()

const choicesContainer = document.getElementById('choices')
const userResponseContainer = document.getElementById('userResponse')
const descriptionContainer = document.getElementById('description')
const userResponseValidationContainer = document.getElementById('userResponseValidationContainer')

const formatChoice = (choice) => {
    return choice.map(choiceInChoice => `
        <li class="item">${choiceInChoice}</li>
    `).join('')
}

const showChoice = ({ choices, description }) => {
	choicesContainer.innerHTML = formatChoice(choices)
	descriptionContainer.innerHTML = `<p>${description}</p>`
}

showChoice({ choices: actualChoice.choices, description: actualChoice.description })

choicesContainer.addEventListener('click', (e) => {
    if(e.target.classList[0] === 'item') {
        const userChoiceResponse = e.target.innerText
        userResponse.push(userChoiceResponse)

        actualChoice.choices = actualChoice.choices.filter(choiceInChoice => 
            choiceInChoice !== userChoiceResponse
        )

        choicesContainer.innerHTML = formatChoice(actualChoice.choices)
        userResponseContainer.innerHTML =  formatChoice(userResponse)
    }
})

const validateUserResponseBtn = document.getElementById('validateUserResponseBtn')

let x = true
let isTheUserResponseRight = false

validateUserResponseBtn.addEventListener('click', () => {
    userResponseValidationContainer.innerHTML = ''
    isTheUserResponseRight = x ? validateUserResponse({ userResponse }) : true

    if(isTheUserResponseRight) {
        actualChoice = getActualChoice()
        userResponse = [] 
        x = true

        showChoice({ choices: actualChoice.choices, description: actualChoice.description })
        
        userResponseContainer.innerHTML = ''
        validateUserResponseBtn.innerText = 'Comprobar'
    }

    if(!isTheUserResponseRight) {
        userResponseValidationContainer.innerHTML = `
            <p>Respuesta: ${choices.at(actualChoiceIndex).answer}</p>
        `
        validateUserResponseBtn.innerText = 'Siguiente'
        x = false
    }
})

const validateUserResponse = ({ userResponse }) => {
    const response = `${choices.at(actualChoiceIndex).answer.split(' ')}`
    return `${userResponse}` ===  response ? true : false
}

