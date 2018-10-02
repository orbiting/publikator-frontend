# Publikator «Sidebar»

## Code structure

The `Editor` module consists of four submodules:
`base`, `serializer`, `plugins` and `settings`

### [`Editor/serializer`](./components/Editor/serializer/)

Formerly known as `editor/modules`. Our former modules stripped of their UI logic and patched to support Slate > 0.32.

The serializer package exports a single method `getSerializer` with the following signature

```
getSerializer(styleguideSchema: Object) => { serializer: MDASTSerializer, newDocument: Function, editorSchema: Immutable.Map }
```

The function returns a result object containing the following:

- `serializer`- An instance of MDASTSerializer
- `newDocument`- A function that takes arbitrary arguments (based on template type) and returns an empty mdast version of the document
- `editorSchema` - An ImmutableJS map that contains all rules with their respective keys.

Example:

```
// Styleguide schema

{
  matchMdast: matchParagraph,
  editorModule: 'A',
  // ...
  rules: [{
    matchMdast: matchLink
    editorModule: 'B',
    // ...
  }]
}

// Results in editorSchema

Map({
  A: // Rule for module A
  B: // Rule for module B
  })
```

### [`Editor/base`](./components/Editor/base/)

- Implements the basic stuff to render and control the Slate value and the UI state.
- Contains optional helper funtions.

The idea is to maintain the `base` package very conservatively and to keep it free from anything specific to the content's characteristics. It should also avoid to import stuff from other Editor packages. There are places where it is appropriate to check in a quick abstraction, however, the `base` package is not it. It's called base for a reason after all. And IMHO it could still be a lot slicker. A lot of the micro-abstractions like `isBlock` are necessary only because Slate is moving super-fast and breaks stuff a lot. Therefore it seemed sensible to have a few bottlenecks where we could migrate breaking changes at the cost of some obfuscation.

#### [`Editor/base/lib`](./components/Editor/base/lib)

Functional helpers, like matchers, Slate changes

#### [`Editor/base/apps`](./components/Editor/base/apps)

A set of small redux apps to facilitate UI operations on a global state. Apps export higher order components that let you inject small pieces of business logic.

Example:

`withEditMode` is a hoc that lets you toggle a globally persisted boolean.

```
import { withEditMode } from 'base/apps/editMode'

const withMyEditMode = withEditMode({namespace: 'myNamespace'})

const MyComponent = withEditMode(({ isInEditMode, startEditing, finishEditing }) => {
   // Do your thing
})
```

[Code example](./components/Editor/plugins/link/ui.js#L134)

#### [`Editor/base/components`](./components/Editor/base/components)

A mixture of helpers and singleton UI components such as the selection path menu.

### [`Editor/plugins`](./components/Editor/plugins/)

There are two types of plugins. Content plugins and behavioral plugins.

When passed to the editor, both types of plugins have to conform to the following interface:

```
{
  // Standard Slate
  renderNode(props) => ReactNode | void
  renderPlaceholder(props) => ReactNode | void
  onKeyDown(event, change) => Change
  schema: SlateSchema
  // Custom
  getNew() => SlateNode
  renderUI({ editor: SlateEditor, value: SlateValue }) => ReactNode | void
}
```

- `getNew` - A constructor function that returns a new Slate node
- `renderUI` - A function to render UI elements specific to this plugin. All `renderUI` methods get collected in a behavioral plugin `UI` and rendered right after the Slate editor instance.

For more information about the Slate methods here, check their docs.

The technical difference between content and behavioral plugins is that the latter can export a factory function while content plugins should never be customisable. This is because injecting stuff like types, child types and so on makes even the basic interdependencies between content plugins really complex and hard to do «right».

A consequence of this approach is, that you'll have slightly more boilerplate and repetition in code. But the ultimate goal here is to let the feature catalogue and code base grow and then find abstractions and generalizations based on experience with our use case instead of some vague anticipation of «what might be».

And on top of that, you'll be always explicitly handling things with minimal dependencies, which makes maintenance work or specific adjustments a lot more contained.

Currently there's two behavioral plugins:

- [`AutoMeta`](./components/Editor/plugins/autoMeta/index.js)
- [`Toolbar`](./components/Editor/plugins/toolbar/index.js)

### [`Editor/settings`](./components/Editor/settings/)

Entry points for the different document templates. This is where the Editor plugins for the respective templates are assembled and more.

Every settings module should export a function that returns an object with an array of all the plugins you want to have activated for this setting. It should get passed the `editorSchema` created by the serializer. Code example.

```
settings(editorSchema: Immutable.Map) => { plugins: Array }
```

### [The main `Editor` module](./components/Editor/index.js)

The Editor package exports 3 items:

#### `getEditorSettings(mdastSchema) => Object`

Pass it an mdast schema and you'll get an object containing:

- `plugins` - Array of plugins
- `serializer` - An MDASTSerializer
- `newDocument` - A constructor function
- `editorSchema` - An Immutable.Map

#### `<EditorUI />`

A stateless component that simply renders all portal containers required for a successful UI.

#### `<EditorStateProvider />`

The redux context for the editor UI. Has to wrap anything that wants to access the global UI state.

#### `<Editor />`

A decorated Slate editor accepting the following props:

Props:

- `value` - A Slate value,
- `plugins` - An array of plugins,
- `readOnly` - Boolean. Speaks for itself
- `schema` - Immutable.Map.
- `onChange` - A callback receiving the current Slate Change
- `onDocumentChange` - A callback receiving the current Slate Change, which is only called, when the actual content changed

## Data flow

What happens if you open a commit (or create a new repo):

1.  We get the styleguide schema for the respective template (status quo)
2.  We get a serializer, a new document constructor and all required editor settings for the styleguide schema.
3.  We pass either the commits mdast content or a newly constructed document to the serializer and get a Slate document. If a locally persisted version of either cases is found, its content has priority over API contents.
4.  We pass the Slate document to the editor, which was configured using the retrieved values from above.
5.  When the document changes, we deserialize the Slate document to mdast, check for changes and persist it.
6.  A commit action sends the deserialized mdast to the API and, upon success, clears the local version and points the route to the newly created commit.

A few things not to forget:

- The serializer is template agnostic and relies only on the styleguide schema (which is template-sensitive)
- The serializer still operates on `TYPE` variables but matches them to explicit Slate types [using a compat map](./components/Editor/serializer/compatKeys.js). As soon as we agree on a useful nomen clatura, this is going to change. This hack also prevents this PR from implying huge and premature styleguide refactorings.

## Writing plugins

### Rendering elements

Usually your plugin takes responsibility for one ore more content types. We pull the actual React components from the mdast schema and render it using [`<SchemaComponent name="myComponent" />`](./components/Editor/base/components/Schema.js). This is a simple React Context consumer that resolves the name property against the Immutable.Map aka `editorSchema`.

Examples: [Single node](./components/Editor/plugins/paragraph.js), [Multiple nodes](./components/Editor/plugins/caption/renderNode.js).

If you have a UI element, that needs to be rendered per node and is not to heavy, you can use the `renderNode` cycle for this. [Example: Outline for selected images](./components/Editor/plugins/figureImage.js)

Try to always render all elements that a plugin manages within one cycle.

### Normalizing contents

There are currently two ways in Slate to achieve controlled content behavior (think mandatory vs optional fields, insertion of specific stuff on key down etc.).

1.  `onKeyDown`. The Slate event handler. Most of the plugins are currently controlled using key handlers. This is all about capturing (unwanted) default behavior and handle it to your liking. Usually you want to watch for enter, backspace and delete actions. [Example](./components/Editor/plugins/infoBox/onKeyDown.js)

2.  `schema`. With Slate schemas you can define structural rules and means to normalize incompatibilities. The main difference to key handlers is, that you react on issues after the modification happened instead of before. It also covers a lot more cases out of the box, that would be very tedious to handle manually in a key handler. [Example](./components/Editor/plugins/titleBlock/schema.js)

Personally I think schemas are vastly superior to key handlers in almost any respect. The current extensive use of key handlers is due to some pretty drastic changes that the Slate schema API underwent in recent months. As of now, things have pretty much settled, so you can do whatever feels right to you.

### UI

#### Selection

In almost all cases you want to show a UI element based on the current selection. If you are fine with evaluating the current `value.selection` to determine selection status, that's cool.
Our `renderUI` method always gets `({ value, editor })` after all.
But you can also use the selection path method.

The selection path is a list of all descendants of a selected node. If you selected a pararaph, the selection path would be:
`document -> center -> paragraph`

Additonally there's a `selectedNode` value. It can point at any node in the current path.
[Source](./components/Editor/base/apps/selectionPath.js)

We interact with those values through the [`<Select />`](./components/Editor/base/components/Select.js) component. Properties:

- `isNode` - Either a string representing the node type or a matcher function.
- `offset` - Number. Determines how far above the selected node in the path a node is still considered selected.
- `children` - A children function that only gets called when the node is considered selected. Gets passed the selected node as property.

```
import Select from 'Editor/base/components/Select'
import { isBlock } from 'Editor/base/lib'

export const renderUI = ({ editor }) => {
  <Select isNode="center" offset={1}>
    {({ node }) => <p>{node.type} is selected</p>}
  </Select>
}
```

In this example the `<p>` would show even if the pararaph and not the center was selected, because type center was found within offset range `1`. [Example](./components/Editor/plugins/infoBox/ui.js)

#### Rendering

If you just returned the component like in the example above, it would get rendered after the whole document. In some cases that's desireable, but most of the time you want to hook into the sidebar.

[Here's what slots you can use](./components/Editor/base/components/UI.js). If we wanted to render our element at the top of the sidebar, we'd do this:

```
import { SidebarTop } from 'Editor/base/components/UI'

export const renderUI = ({ editor }) => {
  <Select isNode="center" offset={1}>
    {({ node }) => (
        <SidebarTop>
          <p>{node.type} is selected</p>
        </SidebarTop>
    )}
  </Select>
}
```

#### Inserting new elements

You can build a manual display trigger ([Example](./components/Editor/plugins/infoBox/ui.js#L26)) or you could use a [`<Toolbar />`](./components/Editor/plugins/toolbar/index.js).

A toolbar

1.  Manages a parent that matches `isNode` with direct children that match `isChildNode`
2.  Displays UI to move and delete elements that match `isChildNode`
3.  Displays UI to insert any of `insertItems`
4.  Selects `isChildNode` at `offset`

You should only really use tool bars in plugins, where you handle specific cases. The main toolbar, the one that manages `center` and its children, should be located in the settings of every template.
[Example in plugin](./components/Editor/plugins/infoBox/ui.js), [Example in settings](./components/Editor/settings/format.js)

#### Styling

While it is absolutely ok to just use glamor, the preferred way to style at least sidebar stuff is using the [`theme` app](./components/Editor/base/apps/theme/index.js).

It's a small redux app, that stores a couple of config variables and injects a calculated `styles` prop into your components via the `withTheme` hoc.

```
import { withTheme } from 'Editor/base/apps/theme'

const MyComp = ({ styles }) => (
  <button {...styles.buttons.textButton}>Click!</button>
)

export default withTheme()(MyComp)
```

Currently available styles (how they should be stacked):

- `layout.outline` - Just a green outline
- `layout.backdrop` - A simple fixed fullscreen square. Can be used as cancel area.

- `layout.container`

  - `layout.section`
  - `layout.hSection`
  - `layout.vSection`
  - `layout.iconGroup`
  - `layout.sectionHeader`
    - `layout.hairline`

- `buttons.textButton`
- `buttons.iconButton`

Button attributes `disabled` and `data-active` will trigger style changes.

##### Style with config variables

You can pass a function to `withTheme` to create styles based on config values. Currently available config values:

```
{
  align: 'left', // 'right'
  style: 'fluid', // 'block'
  maxWidth: 245
}
```

```
import { merge, css } from 'glamor'
import { withTheme } from 'Editor/base/apps/theme'

const withStyles = withTheme(({ theme, config }) => {
  myContainer: merge(theme.layout.hSection, css({
      justifyContent: config.align === 'right' ? 'flex-end' : 'flex-start'
    }))
})

const MyComp = ({ styles }) => (
  <div {...styles.myContainer}>
    <button {...styles.buttons.textButton}>Click!</button>
  </div>
)

export default withStyles(MyComp)
```

##### Change theme config

```
import { withThemeConfig } from 'Editor/base/apps/theme'

const MyComp = ({ themeConfig, setThemeConfig }) => {
  return (
    <button
      onClick={
        () => setThemeConfig({ align: 'left'})
      }>Click!</button>
  )
}
```
