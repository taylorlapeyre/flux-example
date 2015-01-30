## Flux Example

This application allows you to create and delete "posts" (really just text).

### The Structure of a Flux Application

Every Flux application has at least four components:

1. React **Components**
2. Data **Stores**
3. **Actions**
3. An event **Dispatcher**

These roughly correspond to the View, Model, and Controller components from the Model-View-Controller pattern, but with some important differences.

In a MVC system, there are rules about who can "talk" to who. For instance, the Model doesn't talk to the View and vice versa. In Flux, _nobody talks to anyone else directly_. Flux is a _reactive_ pattern, which means that components are defined by what they react to, not who they rely on. Events are the name of the game here, and every part of a Flux application relies heavily on them.

In fact, the "Flux" that you might download from Facebook is really just one thing: an event dispatcher. This makes the actual code extremely minimalistic. What really makes flux _Flux_ is the **mental model** that comes with it. Everything is defined by the events that the Dispatcher publishes.


### A Scenario

As stated before, this application allows you to create "posts."

Let's step through what happens when you enter input for a new post and press enter.


### The View Layer: React Components

This interaction starts at the presentation layer. The input that you type in is a **React component**. Components are the "view layer" of the application: they focus solely on presentation and update themselves by listening to events. **React components never mutate the DOM.**. They re-render themselves entirely every time their state changes. For example:

Mutating the DOM:

```javascript
var view = Backbone.View.extend({
  template: "some_template.hbs",

  events: {
    "click a": "mutateDOM"
  },

  mutateDOM: function(e) {
    if (this.$('a').length >= 1) {
      this.$('a').remove();
      this.$el.append("<p>Got it!</p>");
    } else {
      this.$('p').remove();
      this.$el.append("<a href='#'>Click Me!</a>");
    }
  }
})
```

Not mutating the DOM:

```javascript
var View = React.createClass({

  getInitialState: function() {
    return {clicked: false},
  },

  render: function() {
    if (this.state.clicked) {
      return <a href="#" onClick={this.toggleClicked}>Click Me!</a>
    } else {
      return <p>Got it!</p>
    }
  },

  toggleClicked: function(e) {
    this.setState({clicked: !this.state.clicked});
  }
})
```

Some differences between these two examples:

- React components expose all of their implementation details, including the HTML needed to display it correctly. The Backbone view relies on a template in another file.
- The Backbone view's state is tightly coupled to the DOM. The React component's state is explicitly declared. **The DOM presentation is an implementation detail.**

Okay, so React components have a lot of advantages. But how do they fit in with the whole Flux thing? What about those events?

### The Data Layer: Flux Stores

When a React component wants to change some kind of global application state, it publishes an event with the data that it wants to change. These events are picked up by an Object that we call a **Store**. The sole responsibility of a Store is to (you guessed it) store and modify data that is essential to the application. Stores (and user input) are the only place React components get their data from.

In this application, there is only one Store: "PostStore." It keeps track of what the current posts on the page are. When we want to create a new Post, a React component will publish an event that says "To whoever is paying attention: I'd like to create a new post with this data please!" The PostStore hears this event and dutifully adds the new post to its local state.

In a more robust application, the Store might communicate with a REST API to persist this data. Once it's saved, the PostStore itself publishes an event that says, "Hey, whoever wanted me to add that new post: all done!" The React component that originally published the event hears this new event and updates its state by getting the posts from PostStore again. The component automatically re-renders and the action is complete.

So, to reiterate:

1. The user enters text input and presses the enter key to create a new Post.
2. The View sees this interaction and publishes an event that says, "To whoever is paying attention: this guy wants create a new post with this data!"
3. The Store hears this event and creates the new post using the data from the event.
4. The Store publishes a new event that says, "Hey, whoever wanted me to add that new post: all done!"
5. The View hears this event and asks for the latest data from the Store.
6. The View automatically re-renders.

### Actions: A better way to organize your events

WIP
