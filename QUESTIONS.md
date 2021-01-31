# 1. What would you add to your solution if you had more time?

- I would have liked to implement a product selector, which is why I structured the context in a way that would easily allow for that.
- For performance improvement and a less jarring UX, I would have liked to throttle the order book updates to the UI to something like once a second. This would be pretty trivial to do within the context and have it "just work" for the rest of the app.
- I may have restructured the data to have prices as a map instead of a list, it would have been convenient for deduplication and grouping, e.g. doing `orderBook[price] = quantity` is easier than doing a find / replace in a list of orders. However I had initially built it out as a list to mirror the API data, and didn't have time to refactor it after coming to this conclusion.
- A graph or other visual element would have been fun to build, but felt out of scope for the assignment.
- I would have liked to smooth out the jumpiness of the initial loading experience, before the first orders are sent

# 2. What would you have done differently if you knew this page was going to get thousands of views per second vs per week?

Given that this page is a fairly svelte static page with asset caching, I don't
think there'd need to be much improvement on the initial page load. Perhaps
using `preact` instead of `react` for some bundle size savings.

For backend load reduction, something to disable or reduce socket updates when
the user isn't looking at the page might reduce some load. I'd also be
interested in using BroadcastChannels and / or Service Workers to allow for a
single connection to work for any number of tabs, if the browser supports it.

# 3. What was the most useful feature that was added to the latest version of your chosen language? Please include a snippet of code that shows how you've used it.

TypeScript 4.0 added the ability to type catch clauses as `unknown` for better
type-safety. In JS, you can throw _anything_:

```ts
throw new Error(27);
throw 27;
throw "27";
// WHY DO THEY ALLOW THESE?!?!?
```

This makes it difficult to actually try to recover gracefully in a catch clause,
e.g. to show a message to the user. Attempts to do so could allow for unsafe
code if you try to access properties that don't exist. But by typing it as
unknown, this forces developers to account for this and implement safeguards.

```ts
interface StandardError {
  message: string;
}

function isStandardError(e: any): e is StandardError {
  return e && typeof e.message === "string";
}

try {
  await apiCall();
} catch (e: unknown) {
  // Bad, compiler will warn you
  alert(e.message);

  // Good, type safe!
  alert(isStandardError(e) ? e.message : "Unknown error!");
}
```

# 4. How would you track down a performance issue in production? Have you ever had to do this?

For a frontend project, I typically try to build them to be backend-agnostic so
that I can point my locally run development version of the frontend against
production data, so that I can easily reproduce issues with real data. With a
development build, I get a lot more hints about what's happening where in code.

The Performance tab on the browser devtools is invaluable. It tells you where
your computer is spending time in rendering, whether it's scripting (something
slow in JS), rendering (typically too many DOM updates or CSS layout changes)
or painting (too many graphics-intensive tasks.) The one downside is that
production builds often removes or optimizes code that's slower in development,
so making sure we re-measure with a production build is important.

If it's a scripting issue, I'll look at the bottom-up call tree and flame graph
to see which areas of code I'm spending the most time in. I can then either
adjust my data structure to be more efficient, throttle how much I need to call
something, or move a particularly intensive operation to a web worker. If I'm
spending a lot of time in component renders, I'll also use React dev tools to
see which components are updating frequently, and figure out if I can memoize
more data to prevent re-renders, or untangle the component trees to cause
fewer cascading renders.

If it's a rendering issue, I'll make sure I'm not rapidly adjusting any layout
altering CSS values. Using transforms instead of position properties (top, left
etc) or size properties (width, heigh, padding, margin.) I'll also try to
reduce any visual operations happening outside of the users field of view, using
scroll listeners.

If it's a paint issue, there may be many ways to solving this that are highly
dependent on the problem at hand. Maybe some work I'm doing in CSS could be
done in a canvas or using SVG elements (intense animations or illustrations.)
Animating groups of elements is much more efficient than animating individual
elements.

# 5. Can you describe common security concerns to consider for a frontend developer?

- Rendering user input as HTML that results in arbitrary code execution
  - React handles most of these cases for us, but occasionally we might need to render something that _should_ be sanitized by the server. In those cases, it often helps to double up on sanitization locally to be sure.
- Adding assets to your site that are hosted on a third party, allowing them to swap out the asset
  - Content security policies and integrity hashes can protect from a lot of this
- Leaking your git credentials to allow an attacker to add malicious code
  - Require reviewers for PRs or other actions that trigger CI deploys, have 2FA on all accounts, require GPG signing commits
- Adding malicious dependencies to your project that either attack your system locally, or add malicious code to your site
  - package-lock.json or yarn.lock are TOFU but prevent old versions from changing their code
  - CSP prevents many types of attacks that might make it to users in production (they can't exfiltrate credentials programatically)

# 6. How would you improve the Kraken API that you just used?

The documentation was completely incorrect, so I would definitely try to address
that first. Outside of that, providing more common use cases server side would
offload the work from clients. Being able to specify price groupings server side,
or indicate how frequently you want updates. Otherwise everything else was really
straight-forward. It might be nice to have a TypeScript npm package with all of
the responses pre-typed for you.
