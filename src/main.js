"use strict"

import getChoices from './choices.js'
const allChoices = getChoices()

let actualChoiceIndex = -1
const getActualChoice = () => {
    actualChoiceIndex++
    
    let choices = {...allChoices.at(actualChoiceIndex)}
    choices.choices = choices.choices.split(' ')
    choices.choices = choices.choices.map((choice, choiceIndex) => ({
            id: choiceIndex,
            choice
    }))
    choices.choices = choices.choices.sort(function() {return Math.random() - 0.5})
    
    return choices
}

let userResponse = []
let actualChoice = getActualChoice()

const choicesContainer = document.getElementById('choices')
const userResponseContainer = document.getElementById('userResponse')
const descriptionContainer = document.getElementById('description')
const userResponseValidationContainer = document.getElementById('userResponseValidationContainer')

const formatChoice = (choice) => {
    return choice.map(({ id, choice }) => `
        <li class="item" id="${id}">${choice}</li>
    `).join('')
}

const showChoice = ({ choices, description }) => {
	choicesContainer.innerHTML = formatChoice(choices)
	descriptionContainer.innerHTML = `<p>${description}</p>`
}

showChoice({ choices: actualChoice.choices, description: actualChoice.description })

choicesContainer.addEventListener('click', (e) => {
    if(e.target.classList[0] === 'item') {
        const userChoiceSelected = {
            choice: e.target.innerText,
            id: e.target.id
        }

        userResponse.push(userChoiceSelected)
        
        actualChoice.choices = actualChoice.choices.filter(choice => choice.id != userChoiceSelected.id)

        choicesContainer.innerHTML = formatChoice(actualChoice.choices)
        userResponseContainer.innerHTML =  formatChoice(userResponse)
    }
})

userResponseContainer.addEventListener('click', (e) => {
    if(e.target.classList[0] == 'item') {
        const selectItem = {
            choice: e.target.innerText,
            id: e.target.id
        }
        
        userResponse = userResponse.filter(response => response.id !== selectItem.id)
        actualChoice.choices.push(selectItem)

        userResponseContainer.innerHTML =  formatChoice(userResponse)
        choicesContainer.innerHTML = formatChoice(actualChoice.choices)
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
            <p>Respuesta: ${allChoices.at(actualChoiceIndex).answer}</p>
        `
        validateUserResponseBtn.innerText = 'Siguiente'
        x = false
    }
})

const validateUserResponse = ({ userResponse }) => {
    const rightResponse = `${allChoices.at(actualChoiceIndex).answer.split(' ')}`;
	userResponse = `${userResponse.map(response => response.choice)}`;
    
    return userResponse ===  rightResponse ? true : false
}

