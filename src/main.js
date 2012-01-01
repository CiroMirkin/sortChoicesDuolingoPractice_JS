"use strict"

import getChoices from './choices.js'

const choicesContainer = document.getElementById('choices')
const userResponseContainer = document.getElementById('userResponse')
const descriptionContainer = document.getElementById('description')
const userResponseValidationContainer = document.getElementById('userResponseValidationContainer')

function showChoice({ choices, description }) {
    choicesContainer.innerHTML = formatChoices(choices)
    descriptionContainer.innerHTML = `<p>${description}</p>`
}

class Question {
    constructor() {
        this.actualChoiceIndex = -1
        this.allQuestions = getChoices()

        this.userResponse = []
        this.actualChoice = getActualChoice()

        showChoice({ choices: actualChoice.choices, description: actualChoice.description })
    }

    getActualChoiceAndUserResponse() {
        return {
            userResponse: this.userResponse,
            actualChoice: this.actualChoice
        }
    }
    
    getActualChoice() {
        this.actualChoiceIndex++
        let question = { ...this.allQuestions.at(this.actualChoiceIndex) }

        question.choices = question.choices.split(' ')
        question.choices = question.choices.sort(function () { return Math.random() - 0.5 })
        question.choices = question.choices.map((choice, choiceIndex) => ({
            id: choiceIndex,
            choice
        }))
        
        return question
    }
    
    getAnswer(){
        return this.allChoices.at(this.actualChoiceIndex).answer
    }
    
    formatChoices(choices) {
        return choices.map(({ id, choice, style }) => {
            if (typeof style == 'string') {
                return `<li class="item item--shadow" id="${id}s">${choice}</li>`
            }
            
            return `<li class="item" id="${id}">${choice}</li>`
        }).join('')
    }

    pushChoice(choice) {
        this.userResponse.push(choice)
        
        this.actualChoice.choices = this.actualChoice.choices.map(choice => {
            if(choice.id == choice.id) {
                return {
                    choice: choice.choice,
                    id: choice.id,
                    style: 'shadow'
                }
            }
            return  choice
        })
    }

    takeChoice(choice) {
        this.userResponse = this.userResponse.filter(response => response.id !== selectItem.id)
        this.actualChoice.choices[Number(selectItem.id)] = selectItem
    }

    nextQuestion() {
        this.actualChoice = this.getActualChoice()
        this.userResponse = [] 
    }

    validateUserResponse({ userResponse }) {
        const rightResponse = `${this.allChoices.at(this.actualChoiceIndex).answer.split(' ')}`
        userResponse = `${userResponse.map(response => response.choice)}`
    
        return userResponse === rightResponse ? true : false
    }
}

const question = new Question()

choicesContainer.addEventListener('click', (e) => {
    if(e.target.classList[0] === 'item' && e.target.classList[1] !== 'item--shadow') {
        const userChoiceSelected = {
            choice: e.target.innerText,
            id: e.target.id,
        }
        
        question.pushChoice(userChoiceSelected)
        const { actualChoice, userResponse } = question.getActualChoiceAndUserResponse()

        validateUserResponseBtn.classList.add('btn--now') 
        choicesContainer.innerHTML = formatChoices(actualChoice.choices)
        userResponseContainer.innerHTML =  formatChoices(userResponse)
    }
})

userResponseContainer.addEventListener('click', (e) => {
    if(e.target.classList[0] == 'item') {
        const selectItem = {
            choice: e.target.innerText,
            id: e.target.id,
        }
        
        question.takeChoice(selectItem)
        const { actualChoice, userResponse } = question.getActualChoiceAndUserResponse()

        if(!userResponse.length) validateUserResponseBtn.classList.remove('btn--now')
        choicesContainer.innerHTML = formatChoices(actualChoice.choices)
        userResponseContainer.innerHTML =  formatChoices(userResponse)
    }
})


const validateUserResponseBtn = document.getElementById('validateUserResponseBtn')

let isTheUserResponseWrong = true
let isTheUserResponseRight = false

validateUserResponseBtn.addEventListener('click', () => {
    userResponseValidationContainer.innerHTML = ''
    const { actualChoice, userResponse } = question.getActualChoiceAndUserResponse()
    isTheUserResponseRight = isTheUserResponseWrong ? question.validateUserResponse({ userResponse }) : true

    if(isTheUserResponseRight) {
        question.nextQuestion()
        isTheUserResponseWrong = true

        const { actualChoice, userResponse } = question.getActualChoiceAndUserResponse()
        showChoice({ choices: actualChoice.choices, description: actualChoice.description })
        
        userResponseContainer.innerHTML = ''
        validateUserResponseBtn.innerText = 'Comprobar'
        validateUserResponseBtn.classList.remove('btn--now')
    }

    if(!isTheUserResponseRight) {
        userResponseValidationContainer.innerHTML = `
            <p>Respuesta: ${question.getAnswer()}</p>
        `
        validateUserResponseBtn.innerText = 'Siguiente'
        isTheUserResponseWrong = false
    }
})

