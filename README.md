## 🚨 THIS IS STILL A WORK IN PROGEESS
By all means feel free to use, but it it needs some work before I can publish to npm.


### How To Generate the copy object

Have a copy folder where you can have a `.yaml` file for each page you want to generate copy for
Run the function inside  `src/cli` - you will need to manually specify output / input folders.
Each file will be a `key` on the top level copy object. For example the following directory structure
```
copy
│   about.yaml
│   index.yaml    
```
Will return an object like the below
```
{
about: {...}
index: {...}
}

```

### Using The Hooks / Context

- In your main app entry point import the copy provider and pass your copy object down into it
```js
import React from 'react'
import { CopyProvider } from '../src/copy2context'
import copy from '../src/copy/copy'


const App = () => {
		return (
					<CopyProvider copy={copy}>
					  ...
					</CopyProvider>
		)
	}

```

In the page where you want to access the copy from the context use the `useCopy` hook. 


```jsx
import React from 'react'
import useCopy from '../src/copy2context/useCopy'

const Home = () => {
	const { getCopy } = useCopy('index')
	return (
			<div className="hero">
				<h1 className="title">{getCopy('title')}</h1>
			</div>
	)
}

export default Home


```

There is also a `getCopyArray` function for getting an array of text, for example rendering a list of text

```jsx
import React from 'react'
import useCopyArray from 'copy2context'

const Home = () => {
	const { getCopy, getCopyArray } = useCopy('index')
  const listItems = getCopyArray('listItems')
	return (
			<div className="hero">
				<h1 className="title">{getCopy('title')}</h1>
        listItems.map(item => item.text)
			</div>
	)
}

export default Home


```
