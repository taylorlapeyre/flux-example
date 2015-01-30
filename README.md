# Flux Example

This application allows you to create and delete "posts" (really just text).

### The Structure of a Flux Application

Every [Flux](https://facebook.github.io/flux/) application has at least four components:

1. React **Components**
2. Data **Stores**
3. **Actions**
3. An event **Dispatcher**

These roughly correspond to the View, Model, and Controller components from the Model-View-Controller pattern, but with some important differences.

In a MVC system, there are rules about who can "talk" to who. For instance, the Model doesn't talk to the View and vice versa. In Flux, _nobody talks to anyone else directly_. Flux is a _reactive_ pattern, which means that components are defined by what they react to, not who they rely on. Events are the name of the game here, and every part of a Flux application relies heavily on them.

In fact, the "Flux" that you might download from Facebook is really just one thing: [an event dispatcher](https://github.com/facebook/flux/tree/master/src). This makes the actual code extremely minimalistic, because what really makes flux _Flux_ is the **mental model** that comes with it. Everything is defined by the events that the Dispatcher publishes.


## A Scenario

As stated before, this application allows you to create "posts."

Let's step through what happens when you enter input for a new post and press enter.


### The View Layer: React Components

This interaction starts at the presentation layer. The input that you type in is a **[React component](http://facebook.github.io/react/)**. Components are the "view layer" of the application: they focus solely on presentation and update themselves by listening to events. **React components never mutate the DOM**. They re-render themselves entirely every time their state changes. For example:

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
    return {clicked: false}
  },

  render: function() {
    if (this.state.clicked) {
      return <a href="#" onClick={this.toggleClicked}>Click Me!</a>
    } else {
      return <p>Got it!</p>
    }
  },

  toggleClicked: function(e) {
    this.setState({
      clicked: !this.state.clicked
    });
  }
})
```

Some differences between these two examples:

- React components expose all of their implementation details, including the HTML needed to display it correctly. The Backbone view relies on a template in another file.
- The Backbone view's state is tightly coupled to the DOM. The React component's state is explicitly declared. **The DOM presentation is an implementation detail.**

Okay, so React components have a lot of advantages. But how do they fit in with the whole Flux thing? What about those events?

### The Data Layer: Flux Stores

When a React component wants to change some kind of global application state, it publishes an event with the data that it wants to change. These events are picked up by a **Store**. The sole responsibility of a Store is to (you guessed it) store and modify data that is essential to the application. Stores (and user input) are the only place React components get their data from.

Stores always expose three methods:

1. `emitChange` - This publishes an event that simply means "there's new stuff!"
2. `addChangeListener` - This is how Components "listen" for changes to the Store's data. It takes a callback that gets executed on `emitChange`.
3. `removeChangeListener` - This simply unregisters a given callback from executing on `emitChange`.

In this application, there is only one Store: [PostStore][poststore]. It keeps track of what the current posts on the page are. When we want to create a new Post, a React component will publish an event that says "To whoever is paying attention: I'd like to create a new post with this data please!" The PostStore hears this event and dutifully adds the new post to its local state.

So, to reiterate (and I will link to the actual code that implements these sentences):

1. The user enters [text input](/lib/components/PostInput.jsx#L8) and presses the enter key to create a new Post.
2. The View sees this interaction and [publishes an event](/lib/components/PostInput.jsx#L15) that says, "To whoever is paying attention: this guy wants create a new post with this data!"
3. The Store [hears this event](/lib/stores/PostStore.js#L38) and creates the new post using the data from the event.
4. The Store [publishes a new event](/lib/stores/PostStore.js#L49) that says, "Hey, whoever wanted me to add that new post: all done!"
5. The View [hears this event](/lib/components/PostList.jsx#L12) and [asks for the latest data](/lib/components/PostList.jsx#L26) from the Store.
6. The View automatically re-renders because its state has changed.

### Actions: A better way to organize your events

When I mention that Stores and Components publish events, what does that actually look like? Flux has a specific terminology that it uses when we talk about events that mutate data: **Actions**.

An Action is just a function that, when called, sends some data over the Dispatcher. Conceptually, Actions are a bit like "magic" to the View layer: when it wants something done, it calls an Action and the thing happens. For instance:

```javascript
var Post = React.createClass({

  render() {
    return (
      <h3 onClick={this.onClick}>{this.props.text}</h3>
    )
  },

  onClick() {
    PostActions.destroy(this.props.id);
  }

})
```

In this bit of code, a Post Component is saying, "When someone clicks on me, remove this post from the page."

The pertinent line of code here, `PostActions.destroy(...)`, is where the Action is called. Let's look at the source code for this function:

```javascript
destroy(id) {
  Dispatcher.dispatch({
    actionType: Constants.POST_DESTROY,
    id: id
  });
}
```

You can see that all an "Action" is is a way of organizing events. In this case the Store is actually [doing all of the work](/lib/stores/PostStore.js#L64): it will see this event and take the appropriate actions. Afterwards, it will call `emitChange` and a Component somewhere will reload itself.

The result: The post is removed, and the View does not need to know any implementation details about how it was done. It's just unknowingly removed from the page.


### Wrapping it Up

Flux is created on the principles of _reactivity_, _uni-directional data flow_, and _seperation of concerns_.

Flux is **reactive** because every part of the application changes by responding to events. Events are the backbone of this approach, and an event dispatcher is the only necessary requirement for a Flux system.

Flux has **uni-directional data flow** because data is always passed from the Store to Components, and never the other way around. Stores get data from Actions, Components get data from Stores.

```
  ====================================
  V                                 ||
-----------     ----------    --------------
|         |     |        |    |            |
| Actions |  => | Stores | => | Components |
|         |     |        |    |            |
-----------     ----------    --------------
```

Lastly, Flux has strong **seperation of concerns** because of the way that Flux applications are structured. The View layer is completely separate from the way that data is stored. The way that data is stored is an implementation detail of Stores. Actions mediate between the two.

## About This Application Itself

This project was made with jspm, a new package manager for front-end javascript development that allows you to use ES6 javascript and npm packages. To run it:

```shell
$ npm i -g jspm
$ cd flux-example
$ jspm install
$ open index.html
```

WIP

[poststore]: /lib/stores/PostStore.js
