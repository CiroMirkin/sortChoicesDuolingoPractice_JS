"use strict"

import getChoices from './choices.js'

const choicesContainer = document.getElementById('choices')
const userResponseContainer = document.getElementById('userResponse')
const descriptionContainer = document.getElementById('description')
const userResponseValidationContainer = document.getElementById('userResponseValidationContainer')

class Question {
    constructor() {
        this.actualQuestionIndex = -1
        this.allQuestions = getChoices()

        this.userResponse = []
        this.actualQuestion = this.getActualQuestion()
    }

    getActualQuestion() {
        this.actualQuestionIndex++
        let question = { ...this.allQuestions.at(this.actualQuestionIndex) }

        question.choices = question.choices.split(' ')
        question.choices = question.choices.sort(function () { return Math.random() - 0.5 })
        question.choices = question.choices.map((choice, choiceIndex) => ({
            id: choiceIndex,
            choice
        }))
        
        return question
    }

    getActualQuestionAndUserResponse() {
        return {
            userResponse: this.userResponse,
            actualQuestion: this.actualQuestion,

        }
    }
    
    getAnswer(){
        return this.allQuestions.at(this.actualQuestionIndex).answer
    }

    pushChoice(choiceToPush) {
        this.userResponse.push(choiceToPush)
        
        this.actualQuestion.choices = this.actualQuestion.choices.map(choice => {
            if(choice.id == choiceToPush.id) {
                return {
                    choice: choice.choice,
                    id: choice.id,
                    style: 'shadow'
                }
            }

            return choice
        })
    }

    takeChoice(choice) {
        this.userResponse = this.userResponse.filter(response => response.id !== choice.id)
        this.actualQuestion.choices[Number(choice.id)] = choice
    }

    nextQuestion() {
        this.actualQuestion = this.getActualQuestion()
        this.userResponse = [] 
    }

    isUserResponseRight({ userResponse }) {
        const answer = `${this.allQuestions.at(this.actualQuestionIndex).answer.split(' ')}`
        userResponse = `${userResponse.map(response => response.choice)}`
    
        return userResponse === answer ? true : false
    }
}

function formatChoices(choices) {
    return choices.map(({ id, choice, style }) => {
        if (typeof style == 'string') {
            return `<li class="item item--shadow" id="${id}-shadow">${choice}</li>`
        }
        
        return `<li class="item" id="${id}">${choice}</li>`
    }).join('')
}

function showChoice({ choices, description }) {
    choicesContainer.innerHTML = formatChoices(choices)
    descriptionContainer.innerHTML = `<p>${description}</p>`
}

const question = new Question()

{
    const { actualQuestion, userResponse } = question.getActualQuestionAndUserResponse()
    showChoice({ 
        choices: actualQuestion.choices, 
        description: actualQuestion.description 
    })
}

choicesContainer.addEventListener('click', (e) => {
    if(e.target.classList[0] === 'item' && e.target.classList[1] !== 'item--shadow') {
        const userChoiceSelected = {
            choice: e.target.innerText,
            id: e.target.id,
        }
        
        question.pushChoice(userChoiceSelected)
        const { actualQuestion, userResponse } = question.getActualQuestionAndUserResponse()

        validateUserResponseBtn.classList.add('btn--now') 
        choicesContainer.innerHTML = formatChoices(actualQuestion.choices)
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
        const { actualQuestion, userResponse } = question.getActualQuestionAndUserResponse()

        if(!userResponse.length) validateUserResponseBtn.classList.remove('btn--now')
        choicesContainer.innerHTML = formatChoices(actualQuestion.choices)
        userResponseContainer.innerHTML =  formatChoices(userResponse)
    }
})

const validateUserResponseBtn = document.getElementById('validateUserResponseBtn')
const progressBar = document.getElementById('progressBar')
let practiceProgress = 0


let isTheUserResponseWrong = true
let isTheUserResponseRight = false

validateUserResponseBtn.addEventListener('click', () => {
    userResponseValidationContainer.innerHTML = ''
    const { actualChoice, userResponse } = question.getActualQuestionAndUserResponse()
    isTheUserResponseRight = isTheUserResponseWrong ? question.isUserResponseRight({ userResponse }) : true

    if(isTheUserResponseRight) {
        question.nextQuestion()
        isTheUserResponseWrong = true

        const { actualQuestion, userResponse } = question.getActualQuestionAndUserResponse()
        showChoice({ 
            choices: actualQuestion.choices, 
            description: actualQuestion.description 
        })
        
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

    practiceProgress++
    progressBar.style.width = `${practiceProgress}0%`
    if(!practiceProgress) {
        progressBar.style.padding = '3px 6px 0'
    }
})

