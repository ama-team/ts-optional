# @ama-team/optional

[![npm](https://img.shields.io/npm/v/@ama-team/ts-optional.svg?style=flat-square)](https://www.npmjs.com/package/@ama-team/ts-optional)
[![CircleCI/master](https://img.shields.io/circleci/project/github/ama-team/ts-optional/master.svg?style=flat-square)](https://circleci.com/gh/ama-team/ts-optional/master)
[![Coveralls/master](https://img.shields.io/coveralls/github/ama-team/ts-optional/master.svg?style=flat-square)](https://coveralls.io/github/ama-team/ts-optional?branch=master)
[![Code Climate](https://img.shields.io/codeclimate/github/ama-team/ts-optional.svg?style=flat-square)](https://codeclimate.com/github/ama-team/ts-optional)

This module contains small class which is inspired by Java Optional and
was created to provide earier ways to work with possibly 
nulled/undefined values.

This library is heavily inspired by Optional from standard java library,
but doesn't follow it precisely. If you need exact port, there is
[typescript-optional](https://www.npmjs.com/package/typescript-optional) 
implementation.

**Please note that this project follows semantic versioning approach and
may change API in between pre-1.0 minor releases.**

## Installation

```bash
npm i -S @ama-team/optional
```

or

```bash
yarn add @ama-team/optional
```

## Usage

### 30-second start

`Optional` is just a class that wraps possibly-null/undefined value and
apply operations to it if it is present. For example, you have a 
response from API that *optionally* has a metadata field with a flag 
deeply buried inside the response:

```
user:
  id: 1
  ...
  metadata:
    processors:
      fraud:
        fraudulent: true
```

Instead of checking presence of the fields, you can take a shortcut:

```typescript
import {Optional} from '@ama-team/optional'

const fraudulent = Optional
  .of(user)
  .map(user => user.processors)
  .map(processors => processors.fraud)
  .map(metadata => metadata.fraudulent)
  .orElse(false);
```

Bingo, now you either have `true` or `false` without too much hassle.
I'll show how to work with pipelines like the one above later.

### API

You have three ways to create an optional:

```typescript
Optional.empty();
Optional.of(value); // throws error if value is null / undefined
Optional.ofNullable(value);
```

Optional has two properties and several methods to interact with current
state:

```typescript
optional.present; // boolean
optional.empty; // also boolean

// following methods returns Optional itself, allowing to chain methods
optional.ifPresent(identity => {});
optional.ifEmpty(() => {});
optional.peek(identity => {}); // will substitute missing identity with null
optional.on(identity => {}, () => {}); // will trigger one of those depending on identity presence 
```

You can also suggest a value for optional, which will be used as 
identity if optional is empty:

```typescript
optional.rescue(value);
optional.rescueWith(() => value);
```

There are also several ways to retrieve identity or substitute it with 
value:

```typescript
optional.get(); // will throw TypeError on missing entity
optional.orElse(value); // return identity or value
optional.orElseGet(() => value); // return identity or producer result
optional.orElseThrow(() => new Error()); // throw error using producer
```

And, finally, there are transformation methods:

```typescript
// all those methods aren't mutating optional itself - transformations 
// will be applied eagerly to construct new optional
optional.map(identity => transform(identity));
optional.flatMap(identity => Optional.of(identity)); // unwraps returned optional
optional.filter(identity => true); // substitutes identity with null if filter doesn't return true
```

### Pipelines

Optionals help with checking for null/undefined, but generally the 
example above bloats code as well, and usually should be placed 
otherwise. To do so, pipelines were introduced: encapsulated set of lazy
operations over optional:

```typescript
import {Pipeline} from '@ama-team/optional';

const extractor = Pipeline.create()
  .map(user => user.processors)
  .map(processors => processors.fraud)
  .map(metadata => metadata.fraudulent);

// ...

const fraudulent = extractor.apply(user).orElse(false);
```

Pipelines are very simple, and currently they provide two methods to
process value:

- `.apply(value)`, which will return an Optional and will let you to use 
`.orElse()` or similar methods
- `.transform(value)`, which will in fact just a shortcut for 
`.apply(value).orElse(null)`.

Also pipelines can be concatenated - you can use `.append(pipeline)`
method for that, which will return you a new pipeline. 

## Contributing

Feel free to send PR to `dev` branch.

### `dev` (next release) branch state

[![CircleCI/dev](https://img.shields.io/circleci/project/github/ama-team/ts-optional/dev.svg?style=flat-square)](https://circleci.com/gh/ama-team/ts-optional/dev)
[![Coveralls/dev](https://img.shields.io/coveralls/github/ama-team/ts-optional/dev.svg?style=flat-square)](https://coveralls.io/github/ama-team/ts-optional?branch=dev)

## Licensing

MIT License / AMA Team / 2018
