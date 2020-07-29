# Digital Bullet Journal

A Progressive Web Application made for my university Final Year Project. My project aimed to conduct an investigation into capturing a similar Bullet Journaling user experience within a digital Bullet Journal as its traditional, paper-based counterpart.

## [Demo](https://lw-bullet-journal.netlify.app/) 💻

## What is Bullet Journaling?

The "Bullet Journal" system is a planning methodology designed by [Ryder Carroll](https://bulletjournal.com/), based around the rapid logging of tasks, events and more to create simple, digestible lists. Due to its simple structure and customisability, the system has become popular on social media, with users adding their own personal spin into their Bullet Journals. For some, the journal is both a productivity tool and a creative outlet.

## Project Development

The motivation behind the project stemmed from when I tried out Bullet Journaling myself. I liked the system and - as a hobbyist artist - I enjoyed decorating the pages; they gave me more motivation to be productive and made planning fun, but ultimately I found it hard to keep up with a physical journal when almost everything I do is on a digital device. Therefore, the project aimed to emulate the user experience of an analogue Bullet Journal in a digital form.

I first began research into the system itself, followed by an analysis of current competitors, then looked in to web technologies that would be suited as well as web usability and user experince. After setting this foundation, I issued a questionnaire to an anonymous online Bullet Journal group on social media, which accumulated 60 responses and shaped the project's requirements to be successful and in turn, the design and implementation feature sets.

After development, the application was then tested by a small focus group to identify any bugs or usability issues. This gave insight into a few minor bugs (now fixed) as well as some tweaks and new features that the participants believed would enhance their experience using the application. These features have been noted and will likely be introduced in future updates to the application.

### **Technologies**

The application is built using Vue to utilise its component-based architecture and reactivity. As a PWA, it provides offline support to users through IndexedDB and localStorage, as well as native app features such as the ability to add it to the home screen on mobile devices.

The Canvas API is used to create each page of the journal, allowing users to draw freehand, draw shapes, import images and utilise Bullet Journal-esque components (bullet lists and habit trackers) - all of which can be moved around the canvas at will.

### **Design**

The questionnaire conducted in the project's research phase indicated that the majority of users would prefer to use a digital Bullet Journal on their mobile device, which guided the application's design. Mock-ups were designed mobile first and utilised the Material Design guidelines to create an app-like layout and user experience.

## Application Features

- Create bullet lists directly inspired by the Bullet Journal system
- Create habit trackers
- Freehand drawing
- Import your own images (with the ability to resize)
- Freely move and transform drawings and widgets
- Multiple journal pages
- Pages saved locally to the browser
- Offline support

## Running Locally

**Project setup** <br />
`npm install`

**Compiles and hot-reloads for development** <br />
`npm run serve`

**Compiles and minifies for production** <br />
`npm run build`
