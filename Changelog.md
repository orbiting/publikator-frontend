# Changelog WIP

General:

All dependecies updated as of 2018-09-17, with the exception of downshift.
Slate and MDAST conversion is handled separately. All things serializer can be found in folders `lib/transform` and `lib/rules`. whereas all things editor are located in folders `components/Editor` and `components/Plugins` respectively. They are tied together by a template config (in `components/Templates/article`.

## Serialization

##### Entities:

1. `transform`

`transform = (transformer: Function, data: Object | Array) => Object | Array`

Actually nothing more than a recursion helper. It passes the `data` variable to the transformer, together with a decorated version of "self". The decoration 1. validates the return type, 2. filters nil values and 3. flatMaps the result if an Array.

3. `transformer`

`transformer = (node: Object | Array, next: Function) => Array | Object

2. Rules
   `rule = (resume: Function) => (node: Object | Array, next: Function) => Array | Object

A simple convention to make composition and extension of parsing flow easier. Formally a rule with an applied resume function is a transformer. The usual use case is:

```
const paragraphRule = resume => (node, next) => {
   if (node.type === 'paragraph') {
       return { type: 'pagagraph', object: 'block', nodes: next(node.children)
   }
   return resume(node, next)
}

const linkRule = resume => (node, next) => {
   if (node.type === 'link') {
       return { type: 'link', object: 'inline', nodes: next(node.children)
   }
   return resume(node, next)
}
```

Calling `resume` with a value will continue the current recursion, while `next` will spawn a new recursion with the given data.

Combining multiple rules is done with the `compose` pattern:

```
const rootRule = compose(
  paragraphRule,
  linkRule
)
```

Conversion into a transformer

```
const transformer = rootRule(n => {
  console.log('Was not handled', n)
  return null
})
```

There is also a normalization API in `lib/transform/normalize`, which I will explain in a upcoming update.

## Editor UI

- We render UI elements within the Slate render cycle, in the `renderNode`-methods of a given plugin.
  They will not necessarily get displayed as DOM children of the slate content, and we do that by using React Portals.
- We don't have plugin factories, only static, specific implementations, therefore interdependencies are handled by simple imports rather than injected behaviour.
- As long as we don't have an agreement on how and where the single source of truth for parsing and, more importantly, normalizing a Markdown document, the styleguide schema is not parsed for serializing rules, but for mere components. Schema rules will get persisted to a simple map, with their unique type as key.
- I used redux to write injectable state behaviour (`components/Editor/apps`) because reading from a controlled global state is something we desperately need (think of locking a document and all its implications). With redux, we can write UI's that are not bound by the state model and how props should get passed around. I don't fancy redux in particular, but went for it because it's a well-established library with quite good tooling around it.

## Roadmap

https://trello.com/b/ABTSZMVw/publikator-sidebar
