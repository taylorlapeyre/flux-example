### Flux Example

A small but exemplary Flux/React application made with ES6 and jspm.

This application allows you to create and delete "posts" (really just text).

Flux is kind of like a dystopian society: nobody talks to each other and everyone just listens for events.

Events are the sole way that different parts of the application communicate with each other. Want to create a new post? Don't create the post in the view layer, send out an event with the post data and let someone else take care of it.

Let's go through what happens when you enter input for a new post and press enter.

### The View Layer: React Components

The input that you are typing in is a **React component**. Components are the "view layer" of the application: they focus solely on presentation and update themselves by listening to events. **React components never mutate the DOM.**. They re-render themselves entirely every time their state changes. For example:

Mutating the DOM:

```javascript
var view = Backbone.View.extend({
  template: "some_template.hbs",

  events: {
    "click a": "mutateDOM"
  }

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
- The Backbone view's state is tightly coupled to the DOM. The React component's state is explicitly declared and the DOM presentation is an implementation detail.

Okay, so React components have a lot of advantages. But how do they fit in with the whole Flux thing? What about those events?

### The Data Layer: Flux Stores

When a React component wants to change some kind of global application state, it publishes an event with the data that it wants to change. These events are picked up by an Object that we call a **Store**. The sole responsibility of a Store is to (you guessed it) store and modify data that is essential to the application. Stores are where the React components get their data from.

In this application, there is only one Store: "PostStore." It keeps track of what the current posts on the page are. When we want to create a new Post, a React component will publish an event that says "To whoever is paying attention: I'd like to create a new post with this data please!" The PostStore hears this event and dutifully adds the new post to its local state. In a more robust application, the Store might communicate with a REST API to persist this data. Once it's saved, the PostStore itself publishes an event that says, "Hey, whoever wanted me to add that new post: all done!" The React component that originally published the event hears this new event and updates its state by getting the posts from PostStore again. The component automatically re-renders and the action is complete.

WIP
