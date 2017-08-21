# DoWhop.com Contributor's Guide
Updated Aug. 2017

## DoWhop Tech Team

Current members of the Tech Team are:

* [@tinkerdo](https://github.com/tinkerdo)
* [@johannbillar](https://github.com/johannbillar)
* [@omarcodex](https://github.com/omarcodex)
* [@mikeavida](https://github.com/mikeavida)
* [@shar-ajmal](https://github.com/shar-ajmal)
* [@tarekgouda](https://github.com/tarekgouda)

## Best Practices

### Overview

We strive to follow an Agile approach to software development. This means we commit often, communicate clearly, and focus on building features with the knowledge that customers may drive changes. We also embrace DoWhop's core values of being **kind, bold, and daring**.

### GitHub

Branching
* Our approach is to name a branch using your name followed by a dash followed by the feature and/or page you're working on. For example, `keaton-add-profile-icons` or `erik-update-dowhop-create-form` will help us know what each of us is working on.

Committing
* Write clear messages in the active voice (e.g., "Add profile nickname edit form"). Commit often so that other members of the team can easily follow what you did when you open a pull request.

Pull Requests
* Even if a feature isn't done, it's good to push up your branch to origin at the end of a working day. That helps our team avoid issues because we aren't always working on the same schedule.  

* Always submit a pull request before merging into master. Before submitting a pull request, please tag another member of the team for a code review. That member should test the code (locally and on mobile; see below) before approving and merging the request.

Testing
* It's good to test all your features before opening a pull request. Test them out on Chrome, Safari at minimum as a first line of defense. The best line of defense is checking on **mobile on iOS Safari**, and on **IE11 Desktop**.

> TIP: throttle your browser speed to Fast 3G in Chrome's dev tools.

* In our case, we may have to deploy live to firebase simply in order to check functionality on mobile devices. This is totally fine--just make sure that if the feature doesn't work, we redeploy the working master ASAP.

* Please make sure there are no `console` errors or `console.log` messages before merging into master.

### Coding  
Style
* We've been trying to build a unified style for our front-end development. This helps us have a uniform looking code when team members are changing. To achieve this, try to follow a Code Guide (see below) and include the team's prettifier package on your text editor.

Front-End
* Develop overall with a mobile-first approach. This means being conscious of grids systems, button sizes, etc.

* When doing styling, please check if the feature can be built using Material UI first. If not, then check if that class or style already exists in our code base. As a last case, write your own style for an element with the idea that someone can reuse it later.

* In HTML, please use *semantic* markup and make sure elements have all required attributes.

* In CSS, please use classes to add styles rather than element IDs. Also use hex colors and write them in lower-case (if you see deprecated color naming,  feel free to change them).

Back-End

* Remember to use camelCase when naming your variables. Be sure that their purpose is clear to other team members.

* Generally, it's a better idea to not use in-line functions except as an escape-hatch. Try to keep functions on the back end by creating DOM event listeners instead (e.g., `.addEventListener`).

* We've found some libraries to be useful for dates and for object manipulation. For dates, use *Moment.js* and for objects, use *Lodash* and checkout their available functionalities..

* We're using Firebase and have exported it to a global variable in the codebase. This means you can use functions for firebase auth, storage, database, and messaging.

### Files and Assets
* Check out our Firebase storage bucket when dealing with media. We're trying to use remotely-hosted images rather than locally stored ones since this saves space and keeps things organized.

### Research
* We tend to use resources such as Mozilla Developer Network, CSS-Tricks, blogs, and StackOverflow. (Do NOT use w3schools. We find they have too many deprecations). If you can't find the answer to your questions online, we can figure it out as a team.

***
## Questions?

Feel free to reach out! Ping us on GitHub or email: [tech@dowhop.com](tech@dowhop.com)

***
## Resources

[Code Guide](http://codeguide.co/) (From the author of Bootstrap!)

[The Agile Manifesto](http://agilemanifesto.org/principles.html)

[Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web)
[](http://codeguide.co/)

#### Documentation

[Firebase](https://firebase.google.com/docs/web/setup)

[Lodash](https://lodash.com/docs)

[Moment](https://momentjs.com/)

***
