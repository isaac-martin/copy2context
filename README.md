## 🚨 THIS IS STILL A WORK IN PROGEESS

By all means feel free to use, but it it needs some work before I can release v1.

### Getting Started

`npm install @copy2context/cli -save`
or
`yarn add @copy2context/cli -save`

Create a `config.yaml` file mimiccing the below

```yaml
copyDirectories:
  en: src/copy/en
  fr: src/copy/fr
ouptutDirectory: src/copy
```

Each child of `copyDirectories` will generate a `.json` file for each. Eg the above will create `en.json` and `fr.json`

Run the command `transformCopy -c {PATH_TO_CONFIG_FILE}` this currently only takes one argument which is the path of your config file.

### The copy object / .yaml files

Have a folder where you can have a `.yaml` file for each page you want to generate copy for. This can also be broken down smaller, to a component level or similar. Up to you.
Each file in the directory will be a `key` on the top level copy object. For example the following directory structure

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

- Install the main react package

```
npm install @copy2context/react -save
yarn add @copy2context/react -save
```

- In your main app entry point import the copy provider and pass your copy object down into it. You could pass a different copy object based on a translation setting / localisation

```jsx
import React from 'react';
import {CopyProvider} from '@copy2context/react';
import copy from '../src/copy/en';

const App = () => {
  return <CopyProvider copy={copy}>...</CopyProvider>;
};
```

The examples below are using this yaml file as a reference

```yaml
title: Welcome to my site
listItems:
  one: list item one
  two: list item two
  three: list item three
welcomeText: Welcome {userName}, your last login was {lastLoginDate}
```

In the page where you want to access the copy from the context use the `useCopy` hook.

```jsx
import React from 'react';
import {useCopy} from '@copy2context/react';

const Home = () => {
  const {getCopy} = useCopy('index');
  return (
    <div>
      <h1 className="title">{getCopy('title')}</h1>
    </div>
  );
};

export default Home;
```

There is also a `getCopyArray` function for getting an array of text, for example rendering a list of text

```jsx
import React from 'react';
import {useCopy} from '@copy2context/react';

const Home = () => {
  const {getCopy, getCopyArray} = useCopy('index');
  const listItems = getCopyArray('listItems');
  return (
    <div>
      <h1 className="title">{getCopy('title')}</h1>
      <ul>
        listItems.map(item => <li>{item}</li>)
      </ul>
    </div>
  );
};

export default Home;
```

You can also define variables in the yaml file which we can pass an object in as the second function argument.

```jsx
import React from 'react'
import { useCopy } from '@copy2context/react';

const Home = () => {
	const { getCopy } = useCopy('index')
	const user = {
	userName: 'Isaac Martin'
	lastLoginDate: 'October 23rd 2019'
	}
	return (
			<div>
				<h1 className="welcomeText">
				{getCopy('welcomeText',
				{userName: user.userName, lastLoginDate: user.lastLoginDate}
				)}
				</h1>
			</div>
	)
}

export default Home

```
